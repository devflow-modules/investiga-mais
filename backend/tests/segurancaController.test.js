jest.resetModules();

let axios;
try {
  axios = require('axios').default || require('axios');
} catch (e) {
  axios = require('axios');
}

if (!axios || typeof axios !== 'function' || !axios.request) {
  throw new Error('axios inválido. Verifique se há mocks globais em outros testes.');
}

const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

const segurancaController = require('../src/controllers/segurancaController');
const httpMocks = require('node-mocks-http');



describe('SegurancaController', () => {

  const prisma = require('../src/lib/prisma');

  beforeAll(async () => {
    await prisma.usuario.create({
      data: {
        id: 1,
        email: 'test@example.com',
        senhaHash: 'senhateste',
        nome: 'Usuário Teste',
        cpf: '12345678900', // <== OBRIGATÓRIO no seu schema
        telefone: null,
        nascimento: null,
        cidade: null,
        uf: null,
        genero: null,
        bonusConcedidoAt: null,
        role: 'cliente',
      },
    });
  });

  afterAll(async () => {
    await prisma.consultaRisco.deleteMany();
    await prisma.usuario.deleteMany({ where: { id: 1 } }); // remove o usuário dummy
    await prisma.$disconnect(); // fecha conexão com o banco
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('ipCheck', () => {
    it('should return IP reputation data', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/ip-check',
        query: { ip: '8.8.8.8' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onGet(/ipqualityscore/).reply(200, {
        ip_address: '8.8.8.8',
        fraud_score: 10,
        proxy: false,
        vpn: false,
        tor: false,
        hosting: false,
        ISP: 'Google',
        country_code: 'US',
        recent_abuse: false,
        bot_status: false,
        is_crawler: false,
      });

      await segurancaController.ipCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data).toMatchObject({
        success: true,
        data: {
          ip: '8.8.8.8',
          fraud_score: 10,
          fonte: 'IPQualityScore'
        }
      });
    });

    it('should return 400 if no IP is provided', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/ip-check',
        query: {}
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      await segurancaController.ipCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(400);
      expect(data).toMatchObject({
        success: false,
        message: 'IP não fornecido.'
      });
    });

    it('should return 500 if IPQS API fails', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/ip-check',
        query: { ip: '8.8.8.8' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onGet(/ipqualityscore/).networkError();

      await segurancaController.ipCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(500);
      expect(data).toMatchObject({
        success: false,
        message: 'Erro ao verificar reputação do IP.'
      });
    });
  });

  describe('emailVerify', () => {
    it('should return email verification data', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/email-verify/test@example.com',
        params: { email: 'test@example.com' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onGet(/abstractapi/).reply(200, {
        email: 'test@example.com',
        quality_score: '0.95',
        deliverability: 'DELIVERABLE',
        is_disposable_email: { value: false },
      });

      await segurancaController.emailVerify(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data).toMatchObject({
        success: true,
        data: {
          email: 'test@example.com',
          fonte: 'AbstractAPI'
        }
      });
    });

    it('should return 400 if no email is provided', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/email-verify/',
        params: {}
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      await segurancaController.emailVerify(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(400);
      expect(data).toMatchObject({
        success: false,
        message: 'Email não fornecido.'
      });
    });

    it('should return 500 if AbstractAPI fails', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/email-verify/test@example.com',
        params: { email: 'test@example.com' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onGet(/abstractapi/).networkError();

      await segurancaController.emailVerify(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(500);
      expect(data).toMatchObject({
        success: false,
        message: 'Erro ao validar o email.'
      });
    });
  });

  describe('safeBrowsingCheck', () => {
    it('should return safe browsing check result', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/safe-browsing-check',
        query: { url: 'http://example.com' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onPost(/safebrowsing/).reply(200, {
        matches: []
      });

      await segurancaController.safeBrowsingCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data).toMatchObject({
        success: true,
        data: {
          url: 'http://example.com',
          threat_found: false,
          fonte: 'Google Safe Browsing'
        }
      });
    });

    it('should return 400 if no URL is provided', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/safe-browsing-check',
        query: {}
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      await segurancaController.safeBrowsingCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(400);
      expect(data).toMatchObject({
        success: false,
        message: 'URL não fornecida.'
      });
    });

    it('should return 500 if SafeBrowsing API fails', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/safe-browsing-check',
        query: { url: 'http://example.com' }
      });
      req.user = { usuarioId: 1 };

      const res = httpMocks.createResponse();
      res.req = { originalUrl: req.url };

      mockAxios.onPost(/safebrowsing/).networkError();

      await segurancaController.safeBrowsingCheck(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(500);
      expect(data).toMatchObject({
        success: false,
        message: 'Erro ao verificar segurança da URL.'
      });
    });
  });
});
