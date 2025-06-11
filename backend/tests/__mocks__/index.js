module.exports = {
  verifyToken: (req, res, next) => {
    req.user = {
      cpf: '12345678900', 
      email: 'teste@teste.com', 
      nome: 'Usuário Teste', 
      role: 'cliente',
      id: 'usuario-mockado-id'
    };
    next();
  },
  errorHandler: (err, req, res, next) => next(err),
  limiterPerfil: (req, res, next) => next(),
  loginLimiter: (req, res, next) => next(),
  logger: (req, res, next) => next(),
};
