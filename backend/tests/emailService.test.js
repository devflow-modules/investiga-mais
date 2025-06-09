const { enviarEmail } = require('../src/services/email');

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
  it('retorna erro ao falhar no envio', async () => {
    const resultado = await enviarEmail('a@a.com', 'Assunto', '<p>HTML</p>');
    expect(resultado.sucesso).toBe(false);
    expect(resultado.erro).toMatch(/erro/i);
  });
});