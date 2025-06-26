const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const adminController = require('../src/controllers/adminController');
const prisma = require('../tests/__mocks__/prisma');
const { verifyToken } = require('../tests/__mocks__');
const app = express();

app.use(bodyParser.json());

// Mock route setup
app.get('/api/admin/conversas', verifyToken, adminController.listarConversas);
app.get('/api/admin/conversas/:id/mensagens', verifyToken, adminController.listarMensagensDaConversa);
app.post('/api/admin/conversas/:id/responder', verifyToken, adminController.responderConversa);

jest.mock('../src/lib/prisma', () => require('../tests/__mocks__/prisma'));
jest.mock('../src/services/whatsappService', () => ({
  enviarMensagemWhatsApp: jest.fn().mockResolvedValue({ success: true }),
}));

describe('AdminController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarConversas', () => {
    it('deve listar conversas com última mensagem', async () => {
      prisma.conversa.findMany.mockResolvedValue([
        {
          id: 1,
          numero: '5599999999999',
          nome: 'Usuário Teste',
          ultimaMensagemEm: new Date(),
          mensagens: [{ conteudo: 'Olá' }],
        },
      ]);

      const res = await request(app).get('/api/admin/conversas');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversas).toHaveLength(1);
    });

    it('deve lidar com erro interno', async () => {
      prisma.conversa.findMany.mockRejectedValue(new Error('Erro'));

      const res = await request(app).get('/api/admin/conversas');

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('listarMensagensDaConversa', () => {
    it('deve retornar mensagens da conversa', async () => {
      prisma.conversa.findUnique.mockResolvedValue({
        id: 1,
        numero: '5599999999999',
        nome: 'Usuário Teste',
        mensagens: [
          {
            id: 1,
            conteudo: 'Oi',
            direcao: 'entrada',
            timestamp: new Date(),
            status: 'enviado',
            Atendente: { nome: 'Atendente 1', email: 'a@a.com' },
          },
        ],
      });

      const res = await request(app).get('/api/admin/conversas/1/mensagens');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.mensagens).toHaveLength(1);
    });

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app).get('/api/admin/conversas/abc/mensagens');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('deve retornar erro se conversa não existir', async () => {
      prisma.conversa.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/admin/conversas/123/mensagens');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('responderConversa', () => {
    it('deve enviar resposta com sucesso', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, numero: '5599999999999' });
      prisma.mensagem.create.mockResolvedValue({ id: 1 });
      prisma.mensagem.update.mockResolvedValue({});
      prisma.conversa.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Tudo certo!' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve retornar erro se mensagem estiver vazia', async () => {
      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: '' });

      expect(res.statusCode).toBe(400);
    });

    it('deve retornar erro se conversa não existir', async () => {
      prisma.conversa.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(404);
    });

    it('deve retornar erro interno no try/catch', async () => {
      prisma.conversa.findUnique.mockRejectedValue(new Error('Erro'));

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(500);
    });
  });
});
