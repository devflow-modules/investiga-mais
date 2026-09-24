'use strict';

const { enviarEmail } = require('../src/services/emailService');

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockImplementation(() => {
          throw new Error('Falha no envio');
        }),
      },
    })),
  };
});

describe('Serviço de Email', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    process.env.RESEND_API_KEY = ['local', 'test', 'resend', '001'].join('-');
    process.env.RESEND_FROM = 'noreply@fake.example';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.clearAllMocks();
  });

  it('retorna erro ao falhar no envio', async () => {
    const resultado = await enviarEmail('a@a.com', 'Assunto', '<p>HTML</p>');

    expect(resultado.success).toBe(false);
    expect(resultado.error).toMatch(/falha|erro/i);
    expect(resultado.message).toMatch(/erro/i);
  });

  it('production sem RESEND_API_KEY não envia', async () => {
    delete process.env.RESEND_API_KEY;
    const resultado = await enviarEmail('a@a.com', 'Assunto', '<p>HTML</p>');
    expect(resultado.success).toBe(false);
    expect(resultado.error).toMatch(/not configured/i);
  });
});
