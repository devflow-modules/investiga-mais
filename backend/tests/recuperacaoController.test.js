const mockFindUnique = jest.fn();
const mockDeleteMany = jest.fn();
const mockCreateToken = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteToken = jest.fn();
const mockFindToken = jest.fn();
const mockEnviarEmail = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      usuario: {
        findUnique: mockFindUnique,
        update: mockUpdateUser
      },
      tokenRecuperacao: {
        deleteMany: mockDeleteMany,
        create: mockCreateToken,
        findUnique: mockFindToken,
        delete: mockDeleteToken
      }
    }))
  };
});

const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/emailService', () => ({
  enviarEmail: jest.fn(() => mockEnviarEmail())
}));

describe('Recuperacao de Senha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/recuperar', () => {
    it('retorna erro se email for inválido', async () => {
      const res = await request(app)
        .post('/api/auth/recuperar')
        .send({ email: 'invalido' });

      expect(res.statusCode).toBe(400);
      expect(typeof res.body.error).toBe('string');
      expect(res.body.error).toMatch(/email inv/i);
    });

    it('retorna erro se email não existir', async () => {
      mockFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/recuperar')
        .send({ email: 'naoexiste@email.com' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/Email não encontrado/i);
    });

    it('gera token e retorna sucesso', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockCreateToken.mockResolvedValue({});
      mockDeleteMany.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/recuperar')
        .send({ email: 'teste@email.com' });

      expect(mockDeleteMany).toHaveBeenCalled();
      expect(mockCreateToken).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/resetar-senha', () => {
    it('retorna erro se senha for inválida', async () => {
      const res = await request(app)
        .post('/api/auth/resetar-senha')
        .send({ token: 'abc', novaSenha: '123' });

      expect(res.statusCode).toBe(400);
      expect(typeof res.body.error).toBe('string');
      expect(res.body.error).toMatch(/senha.*6 caracteres/i);
    });

    it('retorna erro se token for inválido ou expirado', async () => {
      const tokenMock = require('@prisma/client')
        .PrismaClient()
        .tokenRecuperacao.findUnique;

      tokenMock.mockResolvedValue({ expiracao: new Date(Date.now() - 10000) });

      const res = await request(app)
        .post('/api/auth/resetar-senha')
        .send({ token: 'abc', novaSenha: 'Senha123' });

      expect(res.statusCode).toBe(400);
      expect(typeof res.body.error).toBe('string');
      expect(res.body.error).toMatch(/token inv/i);
    });

    it('atualiza senha e deleta token', async () => {
      mockFindToken.mockResolvedValue({
        usuarioId: 1,
        expiracao: new Date(Date.now() + 10000)
      });

      const res = await request(app)
        .post('/api/auth/resetar-senha')
        .send({
          token: 'validotoken',
          novaSenha: 'Senha123'
        });

      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockDeleteToken).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
