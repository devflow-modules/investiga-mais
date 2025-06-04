const request = require('supertest')
const axios = require('axios')

// ✅ Mocks do Prisma precisam vir antes da importação do app
const mockConsulta = {
  findFirst: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn()
}
const mockDadosCNPJ = {
  findUnique: jest.fn(),
  create: jest.fn()
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    consulta: mockConsulta,
    dadosCNPJ: mockDadosCNPJ
  }))
}))

// ✅ Mock do middleware de autenticação
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  req.user = { cpf: '12345678900', email: 'teste@teste.com' }
  next()
})

// ✅ Mock do axios (requisições externas)
jest.mock('axios')

// ✅ Importar o app somente depois dos mocks
const app = require('../src/app')

describe('Consulta CNPJ API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Retorna erro para CNPJ inválido', async () => {
    const res = await request(app).get('/consulta/abc123')
    expect(res.statusCode).toBe(400)
    expect(res.body.erro).toBe('CNPJ inválido. Verifique o número digitado.')
  })

  test('Consulta CNPJ válido e salva no cache', async () => {
    const cnpj = '19131243000197'

    mockConsulta.findFirst.mockResolvedValue(null)
    mockDadosCNPJ.findUnique.mockResolvedValue(null)
    axios.get.mockResolvedValue({
      data: {
        status: 'OK',
        nome: 'Empresa Teste LTDA',
        cnpj,
        fantasia: 'Empresa Teste'
      }
    })
    mockDadosCNPJ.create.mockResolvedValue({
      cnpj,
      dados: {
        nome: 'Empresa Teste LTDA',
        cnpj,
        fantasia: 'Empresa Teste'
      }
    })
    mockConsulta.create.mockResolvedValue({
      id: '1',
      cpf: '12345678900',
      cnpj,
      status: 'Pendente',
      criadoEm: new Date()
    })

    const res = await request(app).get(`/consulta/${cnpj}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.sucesso).toBe(true)
    expect(res.body.empresa.cnpj.replace(/\D/g, '')).toBe(cnpj)
  })

  test('Consulta CNPJ com erro da ReceitaWS', async () => {
    const cnpj = '19131243000197'

    mockConsulta.findFirst.mockResolvedValue(null)
    mockDadosCNPJ.findUnique.mockResolvedValue(null)
    axios.get.mockResolvedValue({ data: { status: 'ERROR' } })

    const res = await request(app).get(`/consulta/${cnpj}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.erro).toBe('CNPJ não encontrado na base da ReceitaWS.')
  })

  test('Erro interno ao consultar CNPJ', async () => {
    const cnpj = '19131243000197'
    mockConsulta.findFirst.mockRejectedValue(new Error('Erro simulado'))

    const res = await request(app).get(`/consulta/${cnpj}`)
    expect(res.statusCode).toBe(500)
    expect(res.body.erro).toBe('Erro interno ao consultar CNPJ.')
  })

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
    ])

    const res = await request(app).get('/consulta')
    expect(res.statusCode).toBe(200)
    expect(res.body.sucesso).toBe(true)
    expect(Array.isArray(res.body.resultados)).toBe(true)
    expect(res.body.resultados[0]).toHaveProperty('criadoFormatado')
  })

  test('Erro ao listar consultas', async () => {
    mockConsulta.findMany.mockRejectedValue(new Error('Falha simulada'))

    const res = await request(app).get('/consulta')
    expect(res.statusCode).toBe(500)
    expect(res.body.erro).toBe('Erro ao listar consultas')
  })
})
