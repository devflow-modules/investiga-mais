require('dotenv').config();
process.env.WHATSAPP_MODO_DEV = 'true';

jest.mock('axios');
jest.mock('../src/lib/prisma', () => require('../tests/__mocks__/prisma'));

jest.mock('../src/middleware/auth.js', () =>
  jest.fn((req, res, next) => {
    req.user = {
      id: 'mock-user-id',
      role: 'admin'
    };
    next();
  })
);

const request = require('supertest');
const app = require('../src/app');
const axios = require('axios');
const prisma = require('../src/lib/prisma');

describe('WhatsApp Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/whatsapp/enviar', () => {
    it('deve simular envio de mensagem em modo dev', async () => {
      const res = await request(app)
        .post('/api/whatsapp/enviar')
        .send({
          numero: '5599999999999',
          mensagem: 'Olá!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.dev).toBe(true);
      expect(res.body.data.numero).toBe('5599999999999');
      expect(res.body.data.mensagem).toBe('Olá!');
    });

    it('deve tentar envio real com sucesso', async () => {
      process.env.WHATSAPP_MODO_DEV = 'false';

      axios.post.mockResolvedValueOnce({
        data: {
          messages: [
            { id: 'fake-id' }
          ]
        }
      });


      const res = await request(app)
        .post('/api/whatsapp/enviar')
        .send({
          numero: '5599999999999',
          mensagem: 'Mensagem real'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message_id).toBe('fake-id');

      process.env.WHATSAPP_MODO_DEV = 'true';
    });

    it('deve retornar erro se envio falhar', async () => {
      process.env.WHATSAPP_MODO_DEV = 'false';

      axios.post.mockRejectedValueOnce({
        response: {
          data: { error: 'Erro simulado da API' }
        }
      });

      const res = await request(app)
        .post('/api/whatsapp/enviar')
        .send({
          numero: '5599999999999',
          mensagem: 'Falha'
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Erro ao enviar mensagem');

      process.env.WHATSAPP_MODO_DEV = 'true';
    });
  });

  describe('POST /api/whatsapp/webhook', () => {
    it('deve processar mensagem recebida e salvar conversa', async () => {
      prisma.conversa.findUnique.mockResolvedValue(null);
      prisma.conversa.create.mockResolvedValue({ id: 1 });
      prisma.mensagem.create.mockResolvedValue({});
      prisma.conversa.update.mockResolvedValue({});

      const webhookPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '5599999999999',
                      text: { body: 'Mensagem de teste' }
                    }
                  ]
                }
              }
            ]
          }
        ]
      };

      const res = await request(app)
        .post('/api/whatsapp/webhook')
        .send(webhookPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('deve retornar erro 400 para payload inválido', async () => {
      const res = await request(app)
        .post('/api/whatsapp/webhook')
        .send({ invalido: true });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Webhook inválido');
    });
  });
});
