const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const adminController = require('../src/controllers/adminController');
const prisma = require('../tests/__mocks__/prisma');
const { verifyToken } = require('../tests/__mocks__');
const { enviarMensagemWhatsApp } = require('../src/services/whatsappService');

const app = express();
app.use(bodyParser.json());

// Mock route setup
app.get('/api/admin/conversas', verifyToken, adminController.listarConversas);
app.get('/api/admin/conversas/:id/mensagens', verifyToken, adminController.listarMensagensDaConversa);
app.post('/api/admin/conversas/:id/responder', verifyToken, adminController.responderConversa);
app.post('/api/admin/conversas/:id/atribuir', verifyToken, adminController.atribuirConversa);
app.post('/api/admin/conversas/:id/liberar', verifyToken, adminController.liberarConversa);

jest.mock('../src/lib/prisma', () => require('../tests/__mocks__/prisma'));
jest.mock('../src/services/whatsappService', () => ({
  enviarMensagemWhatsApp: jest.fn().mockResolvedValue({ success: true }),
}));

describe('AdminController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarConversas', () => {
    it('✅ Caso A: deve listar conversas com última mensagem', async () => {
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

    it('❌ Caso B: deve lidar com erro interno', async () => {
      prisma.conversa.findMany.mockRejectedValue(new Error('Erro'));

      const res = await request(app).get('/api/admin/conversas');

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('listarMensagensDaConversa', () => {
    it('✅ Caso A: deve retornar mensagens da conversa', async () => {
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
        _count: {
          mensagens: 1
        }
      });

      const res = await request(app).get('/api/admin/conversas/1/mensagens');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.mensagens).toHaveLength(1);
    });

    it('❌ Caso B: deve retornar erro se id for inválido', async () => {
      const res = await request(app).get('/api/admin/conversas/abc/mensagens');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('❌ Caso C: deve retornar erro se conversa não existir', async () => {
      prisma.conversa.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/admin/conversas/123/mensagens');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('responderConversa', () => {
    it('✅ Caso A: deve enviar resposta com sucesso', async () => {
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

    it('❌ Caso B: deve retornar erro se mensagem estiver vazia', async () => {
      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: '' });

      expect(res.statusCode).toBe(400);
    });

    it('❌ Caso C: deve retornar erro se conversa não existir', async () => {
      prisma.conversa.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(404);
    });

    it('❌ Caso D: deve retornar erro interno no try/catch', async () => {
      prisma.conversa.findUnique.mockRejectedValue(new Error('Erro'));

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('atribuirConversa', () => {
    it('✅ Caso A: deve atribuir conversa com sucesso', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: null });
      prisma.conversa.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/admin/conversas/1/atribuir')
        .send();

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('❌ Caso B: deve impedir atribuição se já estiver com outro atendente', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 999 });

      const res = await request(app)
        .post('/api/admin/conversas/1/atribuir')
        .send();

      expect(res.statusCode).toBe(409);
    });

    it('✅ Caso C: atribuição com headers simulados (Authorization)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: null });
      prisma.conversa.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/admin/conversas/1/atribuir')
        .set('Authorization', 'Bearer fake-token')
        .send();

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('❌ Caso D: não deve permitir atribuição com outro atendente (Authorization)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 99 });

      const res = await request(app)
        .post('/api/admin/conversas/1/atribuir')
        .set('Authorization', 'Bearer fake-token')
        .send();

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('❌ Caso E: não deve atribuir com atendente diferente (x-mock-id)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 999 });

      const res = await request(app)
        .post('/api/admin/conversas/1/atribuir')
        .set('x-mock-role', 'admin')
        .set('x-mock-id', '123');

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('liberarConversa', () => {
    it('✅ Caso A: deve liberar conversa se atendente for o mesmo (padrão)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 'usuario-mockado-id' });
      prisma.conversa.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/admin/conversas/1/liberar')
        .send();

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('❌ Caso B: deve impedir liberação se atendenteId não bater (padrão)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 999 });

      const res = await request(app)
        .post('/api/admin/conversas/1/liberar')
        .send();

      expect(res.statusCode).toBe(403);
    });

    it('✅ Caso C: deve liberar conversa se atendente for o mesmo (x-mock)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: '123' });
      prisma.conversa.update.mockResolvedValue({ id: 1, atendenteId: null });

      const res = await request(app)
        .post('/api/admin/conversas/1/liberar')
        .set('x-mock-role', 'admin')
        .set('x-mock-id', '123');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('❌ Caso D: não deve liberar se atendente for diferente (x-mock)', async () => {
      prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 999 });

      const res = await request(app)
        .post('/api/admin/conversas/1/liberar')
        .set('x-mock-role', 'admin')
        .set('x-mock-id', '123');

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
