// ⬇️ Mock do bcrypt para simular verificação da senha
jest.mock('bcryptjs')

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
      .post('/api/auth/login')
      .send({ email: '', senha: '' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Email e senha obrigatórios.')
  })

  test('Login com email ou senha inválido retorna erro 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalido', senha: '123' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Formato de e-mail ou senha inválido.')
  })

  test('Login com credenciais inválidas retorna 401', async () => {
    mockFindUnique.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@teste.com', senha: 'senha123' })

    expect(res.statusCode).toBe(401)
    expect(res.body.error).toBe('CREDENCIAIS_INVALIDAS')
  })

  test('Login bem-sucedido retorna token e usuário', async () => {
    mockFindUnique.mockResolvedValue({
      id: '123',
      email: 'teste@teste.com',
      senha: 'hash-bcrypt'
    })

    bcrypt.compare.mockResolvedValue(true)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@teste.com', senha: 'senha123' })

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.usuario.email).toBe('teste@teste.com')   
    expect(res.body.data.usuario.id).toBe('123')                  
    expect(res.headers['set-cookie'][0]).toMatch(/token=/)
  })

  test('Logout POST limpa o cookie com sucesso', async () => {
    const res = await request(app).post('/api/auth/logout')

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/)
  })

  test('Logout GET permanece disponível por compatibilidade e limpa o cookie', async () => {
    const res = await request(app).get('/api/auth/logout')

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/)
  })

  test('Login com senha inválida não registra senha ou hash em logs', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockFindUnique.mockResolvedValue({
      id: '123',
      email: 'teste@teste.com',
      senhaHash: 'hash-bcrypt-secreto'
    })
    bcrypt.compare.mockResolvedValue(false)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@teste.com', senha: 'senha123' })

    expect(res.statusCode).toBe(401)

    const allLogs = [...warnSpy.mock.calls, ...logSpy.mock.calls, ...errorSpy.mock.calls]
      .flat()
      .map(String)
      .join('\n')

    expect(allLogs).not.toMatch(/senha123/)
    expect(allLogs).not.toMatch(/hash-bcrypt-secreto/)
    expect(allLogs).not.toMatch(/Senha recebida/)
    expect(allLogs).not.toMatch(/Hash salvo/)

    warnSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })
})
