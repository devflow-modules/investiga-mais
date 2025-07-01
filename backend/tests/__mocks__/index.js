module.exports = {
  verifyToken: (req, res, next) => {
    const role = req.headers['x-mock-role'] || 'cliente'
    const id = req.headers['x-mock-id'] || 'usuario-mockado-id'

    req.user = {
      cpf: '12345678900',
      email: 'teste@teste.com',
      nome: 'Usuário Teste',
      role,
      id
    }

    next()
  },

  errorHandler: (err, req, res, next) => next(err),
  limiterPerfil: (req, res, next) => next(),
  loginLimiter: (req, res, next) => next(),
  logger: (req, res, next) => next(),
}
