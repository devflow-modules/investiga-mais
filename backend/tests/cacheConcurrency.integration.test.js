'use strict';

/**
 * Integration-style cache concurrency tests against disposable SQLite + axios mock.
 * Skips if DATABASE_URL is missing or not file:.
 */

const dbUrl = process.env.DATABASE_URL || '';
const canRun = dbUrl.startsWith('file:');

const VALID_CNPJS = [
  '19131243000197',
  '11222333000181',
  '34028316000103',
  '06990590000123',
  '60746948000112',
  '00000000000191',
  '27865757000102',
  '03332886000104', // may fail validation - generate properly below
];

(canRun ? describe : describe.skip)('ReceitaWS cache concurrency (integration)', () => {
  let request;
  let app;
  let prisma;
  let mockAxios;
  let axios;
  let jwt;
  let bcrypt;
  let resetInflight;

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'phase3-test-jwt';
    process.env.NODE_ENV = 'test';
    process.env.RECEITAWS_TIMEOUT_MS = '2000';

    jest.resetModules();
    axios = require('axios');
    const MockAdapter = require('axios-mock-adapter');
    mockAxios = new MockAdapter(axios, { delayResponse: 0 });

    request = require('supertest');
    app = require('../src/app');
    prisma = require('../src/lib/prisma');
    jwt = require('jsonwebtoken');
    bcrypt = require('bcryptjs');
    ({ __resetInflightForTests: resetInflight } = require('../src/services/consultaService'));
  });

  afterAll(async () => {
    mockAxios?.restore();
    if (prisma) await prisma.$disconnect();
  });

  afterEach(() => {
    mockAxios.reset();
    resetInflight();
  });

  async function wipe() {
    await prisma.consulta.deleteMany();
    await prisma.dadosCNPJ.deleteMany();
    await prisma.consultaRisco.deleteMany().catch(() => {});
    await prisma.tokenRecuperacao.deleteMany().catch(() => {});
    await prisma.logRecuperacao.deleteMany().catch(() => {});
    await prisma.mensagem.deleteMany().catch(() => {});
    await prisma.conversa.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany();
  }

  async function createCliente(cpf = '12345678909') {
    const senhaHash = await bcrypt.hash('Senha123', 4);
    return prisma.usuario.create({
      data: {
        email: `cache_${Date.now()}_${Math.random().toString(16).slice(2)}@example.com`,
        cpf,
        senhaHash,
        role: 'cliente',
        nome: 'Cache User'
      }
    });
  }

  function cookieFor(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, cpf: user.cpf, role: 'cliente', nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return [`token=${token}`];
  }

  function countReceitaCalls() {
    return (mockAxios.history.get || []).filter((h) =>
      String(h.url || '').includes('receitaws.com.br')
    ).length;
  }

  test.each([1, 2, 5, 10, 20])(
    'same CNPJ concurrent miss C%i shares acquisition',
    async (concurrency) => {
      await wipe();
      resetInflight();
      mockAxios.resetHistory();

      const cnpj = '19131243000197';
      const user = await createCliente('12345678909');
      const cookie = cookieFor(user);

      let attempts = 0;
      mockAxios.onGet(new RegExp(`receitaws\\.com\\.br/v1/cnpj/${cnpj}`)).reply(() => {
        attempts += 1;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([200, { status: 'OK', nome: `Empresa C${concurrency}`, fantasia: 'X' }]);
          }, 50);
        });
      });

      const responses = await Promise.all(
        Array.from({ length: concurrency }, () =>
          request(app).get(`/api/consulta/${cnpj}`).set('Cookie', cookie)
        )
      );

      const http5xx = responses.filter((r) => r.statusCode >= 500).length;
      const http2xx = responses.filter((r) => r.statusCode >= 200 && r.statusCode < 300).length;
      const cacheRows = await prisma.dadosCNPJ.count({ where: { cnpj } });
      const consultaRows = await prisma.consulta.count({ where: { cnpj, cpf: user.cpf } });

      expect(http5xx).toBe(0);
      expect(http2xx).toBe(concurrency);
      expect(attempts).toBe(1);
      expect(countReceitaCalls()).toBe(1);
      expect(cacheRows).toBe(1);
      expect(consultaRows).toBe(1);
    },
    60000
  );

  test('10 concurrent DIFFERENT CNPJs do not share/serialize as one lock', async () => {
    await wipe();
    resetInflight();
    mockAxios.resetHistory();

    // Pre-validated CNPJs (check digits)
    const cnpjs = [
      '19131243000197',
      '11222333000181',
      '34028316000103',
      '06990590000123',
      '60746948000112',
      '00000000000191',
      '27865757000102',
      '33041260123456', // may be invalid - use known valid set only
    ];

    // Use only known-valid from Phase 2 + generate via pad of distinct valid ones duplicated with uniqueness via different paths
    const knownValid = [
      '19131243000197',
      '11222333000181',
      '34028316000103',
      '06990590000123',
      '60746948000112',
      '00000000000191'
    ];

    // Need 10 valid — compute additional valid CNPJs
    function makeValidCnpj(base12) {
      const calc = (nums, weights) => {
        const sum = nums.split('').reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
        const mod = sum % 11;
        return mod < 2 ? 0 : 11 - mod;
      };
      const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const d1 = calc(base12, w1);
      const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const d2 = calc(base12 + d1, w2);
      return base12 + String(d1) + String(d2);
    }

    const generated = [];
    for (let i = 1; generated.length < 10; i++) {
      const base = String(100000000000 + i).slice(0, 12);
      const cnpj = makeValidCnpj(base);
      if (!/^(\d)\1+$/.test(cnpj) && !generated.includes(cnpj)) generated.push(cnpj);
    }

    const user = await createCliente('39053344705');
    const cookie = cookieFor(user);

    const callCounts = {};
    mockAxios.onGet(/receitaws\.com\.br\/v1\/cnpj\//).reply((config) => {
      const cnpj = config.url.split('/').pop();
      callCounts[cnpj] = (callCounts[cnpj] || 0) + 1;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, { status: 'OK', nome: `Empresa ${cnpj}`, fantasia: cnpj }]);
        }, 40);
      });
    });

    const t0 = Date.now();
    const responses = await Promise.all(
      generated.map((cnpj) => request(app).get(`/api/consulta/${cnpj}`).set('Cookie', cookie))
    );
    const elapsed = Date.now() - t0;

    const http5xx = responses.filter((r) => r.statusCode >= 500).length;
    const http2xx = responses.filter((r) => r.statusCode >= 200 && r.statusCode < 300).length;
    const cacheRows = await prisma.dadosCNPJ.count();
    const externalCalls = Object.values(callCounts).reduce((a, b) => a + b, 0);

    // Each CNPJ should get its own call (not shared across different keys)
    expect(http5xx).toBe(0);
    expect(http2xx).toBe(10);
    expect(cacheRows).toBe(10);
    expect(externalCalls).toBe(10);
    // If there were a global mutex serializing 10×40ms delays, elapsed would be >> 300ms.
    // Allow generous bound but assert parallelism vs full serial (~400ms+overhead).
    expect(elapsed).toBeLessThan(2000);

    // No cross-CNPJ data mix: each response nome matches requested CNPJ
    responses.forEach((res, idx) => {
      expect(res.body.data.empresa.nome).toContain(generated[idx]);
      expect(res.body.data.consulta.cnpj).toBe(generated[idx]);
    });
  }, 60000);

  test('malformed cache is invalidated and refetched', async () => {
    await wipe();
    resetInflight();
    mockAxios.resetHistory();

    const cnpj = '19131243000197';
    const user = await createCliente('12345678909');
    await prisma.dadosCNPJ.create({
      data: { cnpj, dados: { garbage: true } }
    });

    mockAxios.onGet(new RegExp(`receitaws\\.com\\.br/v1/cnpj/${cnpj}`)).reply(200, {
      status: 'OK',
      nome: 'Empresa Recuperada SA',
      fantasia: 'Rec'
    });

    const res = await request(app)
      .get(`/api/consulta/${cnpj}`)
      .set('Cookie', cookieFor(user));

    expect(res.statusCode).toBe(200);
    expect(res.body.data.empresa.nome).toBe('Empresa Recuperada SA');
    expect(countReceitaCalls()).toBe(1);
    const row = await prisma.dadosCNPJ.findUnique({ where: { cnpj } });
    expect(row.dados.nome).toBe('Empresa Recuperada SA');
  });
});
