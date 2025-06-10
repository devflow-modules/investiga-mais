const request = require('supertest');
const axios = require('axios');

// ✅ Mocks do Prisma precisam vir antes da importação do app
const mockConsulta = {
  findFirst: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn()
};
const mockDadosCNPJ = {
  findUnique: jest.fn(),
  create: jest.fn()
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    consulta: mockConsulta,
    dadosCNPJ: mockDadosCNPJ
  }))
}));

// ✅ Mock do middleware de autenticação
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  req.user = { cpf: '12345678900', email: 'teste@teste.com', nome: 'Usuário Teste' };
  next();
});

// ✅ Mock do axios (requisições externas)
jest.mock('axios');

// ✅ Importar o app somente depois dos mocks
const app = require('../src/app');

describe('Consulta CNPJ API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro para CNPJ inválido', async () => {
    const res = await request(app).get('/api/consulta/abc123');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('CNPJ inválido. Verifique o número digitado.');
  });

  test('Consulta CNPJ válido e salva no cache', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);
    axios.get.mockResolvedValue({
      data: {
        status: 'OK',
        nome: 'Empresa Teste LTDA',
        cnpj,
        fantasia: 'Empresa Teste'
      }
    });
    mockDadosCNPJ.create.mockResolvedValue({
      cnpj,
      dados: {
        nome: 'Empresa Teste LTDA',
        cnpj,
        fantasia: 'Empresa Teste'
      }
    });
    mockConsulta.create.mockResolvedValue({
      id: '1',
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.empresa.cnpj.replace(/\D/g, '')).toBe(cnpj);
  });

  test('Consulta CNPJ com erro da ReceitaWS', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);

    axios.get.mockResolvedValue({
      data: {
        status: 'ERROR',
        nome: 'Empresa ERRO', // garantir que não caia no 502
        cnpj,
        fantasia: 'Fantasia'
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(404); // agora vai passar
    expect(res.body.error).toBe('CNPJ não encontrado na base da ReceitaWS.');
  });

  test('Consulta CNPJ com resposta inválida da ReceitaWS (sem data ou status)', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);
    axios.get.mockResolvedValue({}); // resposta sem .data

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(502); // ajusta conforme seu controller (geralmente 502)
    expect(res.body.error).toBe('Resposta inválida da ReceitaWS.');
  });

  test('Consulta CNPJ retornando dados do cache', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        nome: 'Empresa Cache LTDA',
        cnpj,
        fantasia: 'Empresa Cache'
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(mockDadosCNPJ.findUnique).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.empresa.nome).toBe('Empresa Cache LTDA');
  });

  test('Erro interno ao consultar CNPJ', async () => {
    const cnpj = '19131243000197';
    mockConsulta.findFirst.mockRejectedValue(new Error('Erro simulado'));

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro interno ao consultar CNPJ.');
  });

  test('Listagem de consultas do usuário', async () => {
    mockConsulta.findMany.mockResolvedValue([
      {
        id: '1',
        nome: 'Empresa Teste LTDA',
        cpf: '12345678900',
        cnpj: '19131243000197',
        status: 'Pendente',
        criadoEm: new Date()
      }
    ]);
    mockConsulta.count.mockResolvedValue(1);

    const res = await request(app).get('/api/consulta');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.resultados)).toBe(true);
    expect(res.body.data.resultados[0]).toHaveProperty('criadoFormatado');
  });

  test('Erro ao listar consultas', async () => {
    mockConsulta.findMany.mockRejectedValue(new Error('Falha simulada'));

    const res = await request(app).get('/api/consulta');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro ao listar consultas');
  });

  test('Consulta CNPJ com consulta pendente existente', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue({
      id: '999',
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    });

    mockDadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        nome: 'Empresa Pendente',
        cnpj,
        fantasia: 'Fantasia'
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consulta.id).toBe('999');
    expect(res.body.data.empresa.nome).toBe('Empresa Pendente');
  });

  test('Consulta CNPJ com consulta concluída existente', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue({
      id: '888',
      cpf: '12345678900',
      cnpj,
      status: 'Concluída',
      criadoEm: new Date()
    });

    mockDadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        nome: 'Empresa Concluída',
        cnpj,
        fantasia: 'Fantasia'
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consulta.id).toBe('888');
    expect(res.body.data.empresa.nome).toBe('Empresa Concluída');
  });

  test('Consulta CNPJ com dados da ReceitaWS incompletos', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);
    axios.get.mockResolvedValue({
      data: {
        status: 'OK',
        // nome ausente → vai forçar o controller a retornar 502
        cnpj,
        fantasia: 'Empresa Teste'
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(502);
    expect(res.body.error).toBe('Resposta inválida da ReceitaWS.');
  });

  test('Consulta CNPJ retornando cache inválido (dados null)', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: null // força erro no controller
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(502);
    expect(res.body.error).toBe('Resposta inválida da ReceitaWS.');
  });

  test('Consulta CNPJ retorna erro 429 quando atinge limite de retries da ReceitaWS', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);

    // Mock com retries → simula 2x 429 + depois MAX_RETRIES_EXCEEDED
    const retries = [
      { response: { status: 429, statusText: 'Too Many Requests', data: {} } },
      { response: { status: 429, statusText: 'Too Many Requests', data: {} } },
      { response: { status: 429, statusText: 'Too Many Requests', data: {} } } // última tentativa também 429
    ];


    axios.get.mockImplementation(() => {
      const next = retries.shift();
      if (next instanceof Error) {
        throw next;
      } else {
        return Promise.reject(next);
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Limite de consultas da ReceitaWS atingido. Tente novamente mais tarde.');
  });

  test('Listagem de consultas com filtro por nome e CNPJ', async () => {
    mockConsulta.findMany.mockResolvedValue([
      {
        id: '1',
        nome: 'Empresa Teste LTDA',
        cpf: '12345678900',
        cnpj: '19131243000197',
        status: 'Pendente',
        criadoEm: new Date()
      }
    ]);
    mockConsulta.count.mockResolvedValue(1);

    const res = await request(app).get('/api/consulta?nome=Teste&cnpj=19131243000197');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.resultados)).toBe(true);
    expect(res.body.data.total).toBe(1);
  });

  test('Listagem de consultas com filtro de data', async () => {
    mockConsulta.findMany.mockResolvedValue([]);
    mockConsulta.count.mockResolvedValue(0);

    const res = await request(app).get('/api/consulta?data=2025-06-10');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.resultados)).toBe(true);
    expect(res.body.data.total).toBe(0);
  });

  test('Consulta CNPJ com NOT_IN_CACHE', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);

    axios.get.mockRejectedValue({
      response: {
        status: 404,
        statusText: 'Not Found',
        data: {
          message: 'not in cache'
        }
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('CNPJ não encontrado na base da ReceitaWS.');
  });

  test('Consulta CNPJ com erro genérico da ReceitaWS (API_ERROR)', async () => {
    const cnpj = '19131243000197';

    mockConsulta.findFirst.mockResolvedValue(null);
    mockDadosCNPJ.findUnique.mockResolvedValue(null);

    axios.get.mockRejectedValue({
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        data: {}
      }
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro ao consultar dados da ReceitaWS.');
  });
});
