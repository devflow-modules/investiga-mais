const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// ✅ Mocks globais
jest.mock('../src/lib/prisma.js', () => require('../tests/__mocks__/prisma.js'));
jest.mock('../src/services/whatsappService.js', () => ({
  enviarMensagemWhatsApp: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../src/services/adminService.js', () => {
  return {
    listarConversasService: jest.fn(),
    listarMensagensDaConversaService: jest.fn(),
    responderConversaService: jest.fn(),
    atribuirConversa: jest.fn(),
    liberarConversa: jest.fn(),
    atribuirConversaDisponivel: jest.fn(),
    liberarConversasInativas: jest.fn(),
    criarConversaManualService: jest.fn(),
    registrarManualService: jest.fn(),
  };
});

// ✅ Mocka o middleware verifyToken diretamente com versão de testes
jest.mock('../src/middleware/auth.js', () => require('../tests/__mocks__/index.js'));

// Controllers e middleware
const adminController = require('../src/controllers/adminController.js');
const middleware = require('../src/middleware/auth.js'); // mock já aplicado
const service = require('../src/services/adminService.js');

let app;

beforeAll(() => {
  app = express();
  app.use(bodyParser.json());

  app.get('/api/admin/conversas', middleware.verifyToken, adminController.listarConversas);
  app.get('/api/admin/conversas/:id/mensagens', middleware.verifyToken, adminController.listarMensagensDaConversa);
  app.post('/api/admin/conversas/:id/responder', middleware.verifyToken, adminController.responderConversa);
  app.post('/api/admin/conversas/:id/atribuir', middleware.verifyToken, adminController.atribuirConversaHandler);
  app.post('/api/admin/conversas/:id/liberar', middleware.verifyToken, adminController.liberarConversaHandler);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AdminController', () => {
  describe('listarConversas', () => {
    it('✅ Caso A: deve listar conversas com última mensagem', async () => {
      service.listarConversasService.mockResolvedValue({
        conversas: [
          {
            id: 1,
            numero: '5599999999999',
            nome: 'Usuário Teste',
            ultimaMensagemEm: new Date(),
            mensagens: [{ conteudo: 'Olá' }],
          },
        ],
      });

      const res = await request(app).get('/api/admin/conversas');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversas).toHaveLength(1);
    });

    it('❌ Caso B: deve lidar com erro interno', async () => {
      service.listarConversasService.mockRejectedValue(new Error('Erro interno'));

      const res = await request(app).get('/api/admin/conversas');

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('listarMensagensDaConversa', () => {
    it('✅ Caso A: deve retornar mensagens da conversa', async () => {
      service.listarMensagensDaConversaService.mockResolvedValue({
        mensagens: [{ id: 1, conteudo: 'Oi', Atendente: { nome: 'Teste', email: 'a@a.com' } }],
      });

      const res = await request(app).get('/api/admin/conversas/1/mensagens');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.mensagens).toHaveLength(1);
    });

    it('❌ Caso B: deve retornar erro se id for inválido', async () => {
      const res = await request(app).get('/api/admin/conversas/abc/mensagens');
      expect(res.statusCode).toBe(400);
    });

    it('❌ Caso C: deve retornar erro se conversa não existir', async () => {
      service.listarMensagensDaConversaService.mockRejectedValue({ status: 404, message: 'Conversa não encontrada.' });

      const res = await request(app).get('/api/admin/conversas/123/mensagens');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('responderConversa', () => {
    it('✅ Caso A: deve enviar resposta com sucesso', async () => {
      service.responderConversaService.mockResolvedValue({ sucesso: true });

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
      service.responderConversaService.mockRejectedValue({ status: 404, message: 'Conversa não encontrada.' });

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(404);
    });

    it('❌ Caso D: deve retornar erro interno no try/catch', async () => {
      service.responderConversaService.mockRejectedValue(new Error('Erro inesperado'));

      const res = await request(app)
        .post('/api/admin/conversas/1/responder')
        .send({ mensagem: 'Oi' });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('atribuirConversa', () => {
    it('✅ Caso A: deve atribuir conversa com sucesso', async () => {
      service.atribuirConversa.mockResolvedValue({ sucesso: true });

      const res = await request(app).post('/api/admin/conversas/1/atribuir');
      expect(res.statusCode).toBe(200);
    });

    it('❌ Caso B: deve impedir atribuição se já estiver com outro atendente', async () => {
      service.atribuirConversa.mockRejectedValue({ status: 409, message: 'Já atribuída' });

      const res = await request(app).post('/api/admin/conversas/1/atribuir');
      expect(res.statusCode).toBe(409);
    });
  });

  describe('liberarConversa', () => {
    it('✅ Caso A: deve liberar conversa se atendente for o mesmo', async () => {
      service.liberarConversa.mockResolvedValue({ sucesso: true });

      const res = await request(app).post('/api/admin/conversas/1/liberar');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('❌ Caso B: deve impedir liberação se atendenteId não bater', async () => {
      service.liberarConversa.mockRejectedValue({ status: 403, message: 'Não pode liberar' });

      const res = await request(app).post('/api/admin/conversas/1/liberar');
      expect(res.statusCode).toBe(403);
    });
  });
});
