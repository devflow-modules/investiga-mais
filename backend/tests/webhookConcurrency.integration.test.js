'use strict';

/**
 * Integration-style concurrency tests against disposable SQLite.
 * Skips if DATABASE_URL is missing or not file:.
 */

const dbUrl = process.env.DATABASE_URL || '';
const canRun = dbUrl.startsWith('file:');

(canRun ? describe : describe.skip)('Webhook concurrent idempotency (integration)', () => {
  const WEBHOOK_SECRET = 'phase3-concurrency-webhook-secret';
  let request;
  let app;
  let prisma;

  const endpoint = '/api/webhook/compra-confirmada';

  beforeAll(() => {
    process.env.KIRVANO_WEBHOOK_SECRET = WEBHOOK_SECRET;
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'phase3-test-jwt';
    process.env.NODE_ENV = 'test';

    jest.resetModules();
    request = require('supertest');
    app = require('../src/app');
    prisma = require('../src/lib/prisma');
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  async function wipeUsers() {
    await prisma.tokenRecuperacao.deleteMany().catch(() => {});
    await prisma.logRecuperacao.deleteMany().catch(() => {});
    await prisma.consultaRisco.deleteMany().catch(() => {});
    await prisma.mensagem.deleteMany().catch(() => {});
    await prisma.conversa.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany();
  }

  function payloadFor(label) {
    return {
      event: 'SALE_APPROVED',
      customer: {
        email: `concurrent.${label}@example.com`,
        document: '12345678909',
        name: 'Concurrent Buyer'
      }
    };
  }

  test.each([1, 2, 5, 10, 20])(
    'same purchase payload concurrency C%i → ≤1 user, 0 unexpected 5xx',
    async (concurrency) => {
      await wipeUsers();
      const payload = payloadFor(`c${concurrency}`);

      const responses = await Promise.all(
        Array.from({ length: concurrency }, () =>
          request(app)
            .post(endpoint)
            .set('X-Webhook-Secret', WEBHOOK_SECRET)
            .send(payload)
        )
      );

      const statuses = responses.map((r) => r.statusCode);
      const http2xx = statuses.filter((s) => s >= 200 && s < 300).length;
      const http4xx = statuses.filter((s) => s >= 400 && s < 500).length;
      const http5xx = statuses.filter((s) => s >= 500).length;
      const created = responses.filter((r) => r.statusCode === 201).length;
      const existing = responses.filter((r) => r.statusCode === 200).length;
      const users = await prisma.usuario.count({
        where: {
          OR: [{ email: payload.customer.email }, { cpf: payload.customer.document }]
        }
      });

      expect(http5xx).toBe(0);
      expect(http4xx).toBe(0);
      expect(http2xx).toBe(concurrency);
      expect(created + existing).toBe(concurrency);
      expect(users).toBe(1);
    },
    30000
  );

  test('unauthenticated request cannot create Usuario', async () => {
    await wipeUsers();
    const before = await prisma.usuario.count();
    const res = await request(app)
      .post(endpoint)
      .send(payloadFor('unauth'));
    const after = await prisma.usuario.count();

    expect(res.statusCode).toBe(401);
    expect(after).toBe(before);
  });

  test('sequential replay n10 remains duplicate-safe', async () => {
    await wipeUsers();
    const payload = payloadFor('replay');
    const statuses = [];
    for (let i = 0; i < 10; i++) {
      const res = await request(app)
        .post(endpoint)
        .set('X-Webhook-Secret', WEBHOOK_SECRET)
        .send(payload);
      statuses.push(res.statusCode);
    }
    const users = await prisma.usuario.count({
      where: { email: payload.customer.email }
    });
    expect(users).toBe(1);
    expect(statuses.filter((s) => s >= 500)).toHaveLength(0);
    expect(statuses[0]).toBe(201);
    expect(statuses.slice(1).every((s) => s === 200)).toBe(true);
  });
});
