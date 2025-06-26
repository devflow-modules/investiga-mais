jest.mock('../src/lib/prisma', () => require('./__mocks__/prisma'));
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const whatsappController = require('../src/controllers/whatsappController');
const prisma = require('./__mocks__/prisma');
const axios = require('axios');
jest.mock('axios');

const app = express();
app.use(bodyParser.json());

// Middleware simulado de token
app.use((req, res, next) => {
  req.token = 'mock-token';
  next();
});

app.post('/api/whatsapp/enviar', whatsappController.enviarMensagem);
app.post('/api/whatsapp/webhook', whatsappController.receberMensagemWebhook);


describe('WhatsApp Controller', () => {
  describe('POST /api/whatsapp/enviar', () => {
    it('deve simular envio de mensagem em modo dev', async () => {
      process.env.WHATSAPP_MODO_DEV = 'true';
      const res = await request(app).post('/api/whatsapp/enviar').send({
        numero: '5599999999999',
        mensagem: 'Olá!'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.dev).toBe(true);
    });

    it('deve tentar envio real com sucesso', async () => {
      process.env.WHATSAPP_MODO_DEV = 'false';
      axios.post.mockResolvedValue({ data: { message: 'ok' } });

      const res = await request(app).post('/api/whatsapp/enviar').send({
        numero: '5599999999999',
        mensagem: 'Olá mundo'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve retornar erro se envio falhar', async () => {
      axios.post.mockRejectedValue(new Error('Falha simulada'));

      const res = await request(app).post('/api/whatsapp/enviar').send({
        numero: '5599999999999',
        mensagem: 'Erro intencional'
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/whatsapp/webhook', () => {
    it('deve processar mensagem recebida e salvar conversa', async () => {
      const mockConversa = { id: 1 };
      prisma.conversa = {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockConversa),
        update: jest.fn().mockResolvedValue({})
      };

      prisma.mensagem = {
        create: jest.fn().mockResolvedValue({})
      };

      const res = await request(app).post('/api/whatsapp/webhook').send({
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: '5599999999999',
                text: { body: 'Mensagem de teste' }
              }]
            }
          }]
        }]
      });

      expect(res.statusCode).toBe(200);
      expect(prisma.conversa.create).toHaveBeenCalled();
      expect(prisma.mensagem.create).toHaveBeenCalled();
    });

    it('deve retornar erro 400 para payload inválido', async () => {
      const res = await request(app).post('/api/whatsapp/webhook').send({ foo: 'bar' });
      expect(res.statusCode).toBe(400);
    });
  });
});
