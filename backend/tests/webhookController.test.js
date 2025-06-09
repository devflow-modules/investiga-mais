



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

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

jest.mock('../src/services/email', () => ({
  enviarEmail: jest.fn((...args) => mockEnviarEmail(...args))
}));

describe('Webhook de Registro - registrarViaCompra', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoint = '/api/compra-confirmada';

  it('retorna 400 se evento for inválido', async () => {
    const res = await request(app).post(endpoint).send({ event: 'INVALIDO' });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Evento inválido/i);
  });

  it('retorna 400 se email ou cpf estiverem ausentes', async () => {
    const res = await request(app).post(endpoint).send({ event: 'SALE_APPROVED', customer: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/dados ausentes/i);
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
    expect(res.body.erro).toMatch(/formato inválido/i);
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
    expect(res.body.sucesso).toBe(true);
    expect(res.body.mensagem).toMatch(/já cadastrado/i);
  });

  it('cria o usuário e envia e-mail em ambiente de desenvolvimento', async () => {
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
    expect(res.statusCode).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.mensagem).toMatch(/registrado/i);
  });

  it('retorna 500 se ocorrer erro interno', async () => {
    prisma.usuario.findFirst.mockRejectedValue(new Error('Erro interno'));
    const res = await request(app).post('/auth/recuperar').send({ email: 'teste@email.com' });
    expect(res.statusCode).toBe(500);
    expect(res.body.erro).toMatch(/erro interno/i);
  });
});
