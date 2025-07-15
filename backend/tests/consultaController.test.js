jest.mock('axios');

// Mock do Prisma personalizado
jest.mock('../src/lib/prisma', () => require('../tests/__mocks__/prisma'));

// Mock direto do verifyToken (porque é importado diretamente em consultaRoutes.js)
jest.mock('../src/middleware/auth', () =>
  jest.fn((req, res, next) => {
    req.user = {
      id: 'usuario-mockado-id', // <- este é o correto, não `usuarioId`
      cpf: '12345678900',
      email: 'teste@teste.com',
      nome: 'Usuário Teste',
      role: 'cliente'
    };
    next();
  })
);

// Mock opcional dos outros middlewares se forem usados via `require('../middleware')`
jest.mock('../src/middleware', () => ({
  errorHandler: (err, req, res, next) => next(err),
  limiterPerfil: (req, res, next) => next(),
  loginLimiter: (req, res, next) => next(),
  logger: (req, res, next) => next()
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');
const axios = require('axios');


describe('Consulta CNPJ API', () => {
  const cnpj = '19131243000197'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Retorna erro para CNPJ inválido', async () => {
    const res = await request(app).get('/api/consulta/123')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('CNPJ inválido. Verifique o número digitado.')
  })

  test('Consulta CNPJ válido e salva no cache', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        status: 'OK',
        nome: 'Empresa Teste',
        cnpj
      }
    })

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null)
    prisma.dadosCNPJ.create.mockResolvedValue({
      cnpj,
      dados: {
        status: 'OK',
        nome: 'Empresa Teste',
        cnpj
      }
    })

    prisma.consulta.findFirst.mockResolvedValue(null)
    prisma.consulta.create.mockResolvedValue({
      id: 1,
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    })

    prisma.consulta.update.mockResolvedValue({
      id: 1,
      status: 'Consultado'
    })

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.empresa.cnpj.replace(/\D/g, '')).toBe(cnpj)
  })

  test('Consulta CNPJ com erro da ReceitaWS', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'not in cache' }
      }
    });

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null);
    prisma.consulta.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain('Ainda não temos informações sobre este CNPJ.');
  });

  test('Consulta CNPJ com resposta inválida da ReceitaWS (sem data ou status)', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        cnpj
        // faltando status e nome
      }
    });

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null);
    prisma.consulta.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500); // pois não caiu como INVALID_API_RESPONSE no throw
    expect(res.body.error).toBe('Erro ao consultar dados da ReceitaWS.');
  });

  test('Consulta CNPJ retornando dados do cache', async () => {
    prisma.dadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        status: 'OK',
        nome: 'Empresa do Cache',
        cnpj
      }
    })

    prisma.consulta.findFirst.mockResolvedValue(null)
    prisma.consulta.create.mockResolvedValue({
      id: 999,
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    })

    prisma.consulta.update.mockResolvedValue({
      id: 999,
      status: 'Consultado'
    })

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.empresa.nome).toBe('Empresa do Cache')
  })

  test('Erro interno ao consultar CNPJ', async () => {
    prisma.dadosCNPJ.findUnique.mockImplementation(() => {
      throw new Error('Erro simulado');
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro simulado');
  });

  test('Consulta CNPJ com consulta pendente existente', async () => {
    prisma.dadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        status: 'OK',
        nome: 'Empresa Pendente',
        cnpj
      }
    })

    prisma.consulta.findFirst.mockResolvedValue({
      id: 123,
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    })

    prisma.consulta.update.mockResolvedValue({
      id: 123,
      status: 'Consultado'
    })

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.consulta.id).toBe(123)
    expect(res.body.data.consulta.status).toBe('Consultado')
  })

  test('Consulta CNPJ com consulta concluída existente', async () => {
    prisma.dadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: {
        status: 'OK',
        nome: 'Empresa Finalizada',
        cnpj
      }
    })

    prisma.consulta.findFirst.mockResolvedValue({
      id: 321,
      cpf: '12345678900',
      cnpj,
      status: 'Consultado',
      criadoEm: new Date()
    })

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.consulta.id).toBe(321)
    expect(res.body.data.consulta.status).toBe('Consultado')
  })

  test('Consulta CNPJ com dados da ReceitaWS incompletos', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        status: 'OK',
        nome: '', // inválido
        cnpj
      }
    });

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null);
    prisma.consulta.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro ao consultar dados da ReceitaWS.');
  });

  test('Consulta CNPJ retornando cache inválido (dados null)', async () => {
    prisma.dadosCNPJ.findUnique.mockResolvedValue({
      cnpj,
      dados: null
    });

    prisma.consulta.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro ao consultar dados da ReceitaWS.');
  });

  test('Consulta CNPJ retorna erro 429 quando atinge limite de retries da ReceitaWS', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 429,
        data: {}
      }
    })

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null)
    prisma.consulta.findFirst.mockResolvedValue(null)

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(429)
    expect(res.body.error).toBe('Limite de consultas atingido. Tente novamente em breve!')
  })


  test('Consulta CNPJ com NOT_IN_CACHE', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'not in cache' }
      }
    });

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null);
    prisma.consulta.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Ainda não temos informações sobre este CNPJ.');
  });

  // ----- Listagem de consultas -----

  test('Listagem de consultas do usuário', async () => {
    prisma.consulta.findMany.mockResolvedValue([
      {
        id: '1',
        nome: 'Empresa Teste LTDA',
        cpf: '12345678900',
        cnpj: '19131243000197',
        status: 'Pendente',
        criadoEm: new Date()
      }
    ])

    const res = await request(app).get('/api/consulta')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.resultados)).toBe(true)
    expect(res.body.data.resultados[0]).toHaveProperty('criadoFormatado')
  })

  test('Erro ao listar consultas', async () => {
    prisma.consulta.findMany.mockImplementation(() => {
      throw new Error('Falha simulada');
    });

    const res = await request(app).get('/api/consulta');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Falha simulada');
  });

  test('Listagem de consultas com filtro por nome e CNPJ', async () => {
    prisma.consulta.findMany.mockResolvedValue([])

    const res = await request(app).get('/api/consulta?nome=Teste&cnpj=19131243000197')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.resultados)).toBe(true)
  })

  test('Listagem de consultas com filtro de data', async () => {
    prisma.consulta.findMany.mockResolvedValue([])

    const res = await request(app).get('/api/consulta?dataInicio=2024-01-01&dataFim=2024-12-31')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.resultados)).toBe(true)
  })

  test('Listagem de consultas com filtro de status', async () => {
    prisma.consulta.findMany.mockResolvedValue([])

    const res = await request(app).get('/api/consulta?status=Consultado')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.resultados)).toBe(true)
  })

  test('Erro ao criar nova consulta', async () => {
    prisma.dadosCNPJ.findUnique.mockResolvedValue(null);
    prisma.consulta.findFirst.mockResolvedValue(null);

    axios.get.mockResolvedValue({
      status: 200,
      data: {
        status: 'OK',
        nome: 'Empresa Teste',
        cnpj
      }
    });

    prisma.consulta.create.mockImplementation(() => {
      throw new Error('Falha ao criar');
    });

    const res = await request(app).get(`/api/consulta/${cnpj}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Falha ao criar');
  });

  test('Erro desconhecido da ReceitaWS (sem response)', async () => {
    axios.get.mockRejectedValue(new Error('Erro inesperado'))

    prisma.dadosCNPJ.findUnique.mockResolvedValue(null)
    prisma.consulta.findFirst.mockResolvedValue(null)

    const res = await request(app).get(`/api/consulta/${cnpj}`)
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('Erro ao consultar dados da ReceitaWS.')
  })


})
