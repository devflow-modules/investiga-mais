process.env.KIRVANO_WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET || 'phase3-test-webhook-secret';

const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockEnviarEmail = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      usuario: {
        findFirst: mockFindFirst,
        create: mockCreate
      }
    }))
  };
});

const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/emailService.js', () => ({
  enviarEmail: jest.fn((...args) => mockEnviarEmail(...args))
}));

const WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET;
const endpoint = '/api/webhook/compra-confirmada';

function authedPost(payload) {
  return request(app)
    .post(endpoint)
    .set('X-Webhook-Secret', WEBHOOK_SECRET)
    .send(payload);
}

describe('Webhook de Registro - registrarViaCompra', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 401 se credencial estiver ausente', async () => {
    const beforeCreate = mockCreate.mock.calls.length;
    const res = await request(app).post(endpoint).send({
      event: 'SALE_APPROVED',
      customer: { email: 'a@b.com', document: '12345678909' }
    });
    expect(res.statusCode).toBe(401);
    expect(mockCreate.mock.calls.length).toBe(beforeCreate);
  });

  it('retorna 401 se credencial for inválida', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('X-Webhook-Secret', 'wrong-secret')
      .send({
        event: 'SALE_APPROVED',
        customer: { email: 'a@b.com', document: '12345678909' }
      });
    expect(res.statusCode).toBe(401);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('retorna 400 se evento for inválido', async () => {
    const res = await authedPost({ event: 'INVALIDO' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Evento inválido/i);
  });

  it('retorna 400 se email ou cpf estiverem ausentes', async () => {
    const res = await authedPost({ event: 'SALE_APPROVED', customer: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/dados ausentes/i);
  });

  it('retorna 400 se email ou cpf forem inválidos', async () => {
    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'invalido',
        document: '123'
      }
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/formato inválido/i);
  });

  it('retorna 200 se o usuário já existir', async () => {
    mockFindFirst.mockResolvedValue({ id: 1 });
    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'teste@email.com',
        document: '12345678909'
      }
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/já cadastrado/i);
  });

  it('cria o usuário com credencial válida e SALE_APPROVED', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 2 });

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'novo@email.com',
        document: '12345678909'
      }
    });

    expect(mockCreate).toHaveBeenCalled();
    expect(mockCreate.mock.calls[0][0].data.role).toBeUndefined();
    expect(mockEnviarEmail).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/registrado/i);

    process.env.NODE_ENV = originalEnv;
  });

  it('ignora role:admin no payload e não passa role no create', async () => {
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 99, role: 'cliente' });

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'norole@email.com',
        document: '12345678909',
        name: 'X'
      },
      role: 'admin'
    });

    expect(res.statusCode).toBe(201);
    expect(mockCreate.mock.calls[0][0].data).not.toHaveProperty('role');
  });

  it('em P2002 de email/cpf re-lê e retorna usuário já cadastrado', async () => {
    mockFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 7, email: 'dup@email.com', cpf: '12345678909' });

    const conflict = new Error('Unique constraint failed on the fields: (`cpf`)');
    conflict.code = 'P2002';
    conflict.meta = { target: ['cpf'] };
    mockCreate.mockRejectedValue(conflict);

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'dup@email.com',
        document: '12345678909'
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/já cadastrado/i);
  });

  it('não trata P2002 de outro campo como sucesso', async () => {
    mockFindFirst.mockResolvedValue(null);
    const conflict = new Error('Unique constraint failed');
    conflict.code = 'P2002';
    conflict.meta = { target: ['algumOutroCampo'] };
    mockCreate.mockRejectedValue(conflict);

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'other@email.com',
        document: '12345678909'
      }
    });

    expect(res.statusCode).toBe(500);
  });

  it('cria o usuário e envia e-mail em ambiente de produção', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 3 });

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'prod@email.com',
        document: '98765432100'
      }
    });

    expect(mockCreate).toHaveBeenCalled();
    expect(mockEnviarEmail).toHaveBeenCalledWith(
      'prod@email.com',
      expect.stringMatching(/Acesso à Plataforma Investiga\+/),
      expect.stringContaining('Senha:')
    );
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/registrado/i);

    process.env.NODE_ENV = originalEnv;
  });

  it('retorna 500 se ocorrer erro interno', async () => {
    mockFindFirst.mockRejectedValue(new Error('Erro interno'));

    const res = await authedPost({
      event: 'SALE_APPROVED',
      customer: {
        email: 'teste@email.com',
        document: '12345678909'
      }
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.error === 'string' || res.body.error === undefined).toBe(true);
  });
});
