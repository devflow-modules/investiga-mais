// ⬇️ Mock do bcrypt para simular verificação da senha
jest.mock('bcryptjs')

// ✅ MOVER ESSA DECLARAÇÃO PARA O TOPO
const mockFindUnique = jest.fn()

// ⬇️ Mock do Prisma Client com a função definida acima
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      usuario: {
        findUnique: mockFindUnique
      }
    }))
  }
})

const request = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../src/app')

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Login sem email ou senha retorna erro 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: '', senha: '' })

    expect(res.statusCode).toBe(400)
    expect(res.body.erro).toBe('Email e senha obrigatórios.')
  })

  test('Login com email ou senha inválido retorna erro 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'invalido', senha: '123' })

    expect(res.statusCode).toBe(400)
    expect(res.body.erro).toBe('Formato de e-mail ou senha inválido.')
  })

  test('Login com credenciais inválidas retorna 401', async () => {
    mockFindUnique.mockResolvedValue(null)

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'teste@teste.com', senha: 'senha123' })

    expect(res.statusCode).toBe(401)
    expect(res.body.erro).toBe('CREDENCIAIS_INVALIDAS')
  })

  test('Login bem-sucedido retorna token e usuário', async () => {
    mockFindUnique.mockResolvedValue({
      id: '123',
      email: 'teste@teste.com',
      senha: 'hash-bcrypt'
    })

    bcrypt.compare.mockResolvedValue(true)

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'teste@teste.com', senha: 'senha123' })

    expect(res.statusCode).toBe(200)
    expect(res.body.sucesso).toBe(true)
    expect(res.body.usuario.email).toBe('teste@teste.com')
    expect(res.headers['set-cookie'][0]).toMatch(/token=/)
  })

  test('Logout limpa o cookie e redireciona para login', async () => {
    const res = await request(app).get('/auth/logout')

    expect(res.statusCode).toBe(302)
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/)
    expect(res.headers.location).toBe('/login')
  })
})
