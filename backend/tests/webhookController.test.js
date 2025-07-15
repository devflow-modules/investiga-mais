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


describe('Webhook de Registro - registrarViaCompra', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoint = '/api/webhook/compra-confirmada';

  it('retorna 400 se evento for inválido', async () => {
    const res = await request(app).post(endpoint).send({ event: 'INVALIDO' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Evento inválido/i);
  });

  it('retorna 400 se email ou cpf estiverem ausentes', async () => {
    const res = await request(app).post(endpoint).send({ event: 'SALE_APPROVED', customer: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/dados ausentes/i);
  });

  it('retorna 400 se email ou cpf forem inválidos', async () => {
    const res = await request(app).post(endpoint).send({
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
    const res = await request(app).post(endpoint).send({
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

  it('cria o usuário e simula envio de e-mail em ambiente de desenvolvimento', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 2 });

    const res = await request(app).post(endpoint).send({
      event: 'SALE_APPROVED',
      customer: {
        email: 'novo@email.com',
        document: '12345678909'
      }
    });

    expect(mockCreate).toHaveBeenCalled();
    expect(mockEnviarEmail).not.toHaveBeenCalled(); // Em development não chama
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/registrado/i);

    process.env.NODE_ENV = originalEnv;
  });

  it('cria o usuário e envia e-mail em ambiente de produção', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 3 });

    const res = await request(app).post(endpoint).send({
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

    const res = await request(app).post(endpoint).send({
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
