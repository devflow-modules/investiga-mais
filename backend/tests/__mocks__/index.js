/**
 * Mock de middlewares e handlers reutilizáveis para testes
 * Importe este arquivo nos testes como:
 * const mocks = require('../__mocks__');
 */

const verifyToken = (req, res, next) => {
  const role = req.headers['x-mock-role'] || 'cliente';
  const idHeader = req.headers['x-mock-id'];
  const id = idHeader !== undefined ? Number(idHeader) : 0;

  req.user = {
    cpf: '12345678900',
    email: 'teste@teste.com',
    nome: 'Usuário Teste',
    role,
    id,
  };

  req.usuarioId = id; // 👈 compatível com código real
  req.role = role;

  next();
};

const errorHandler = (err, req, res, next) => next(err);
const limiterPerfil = (req, res, next) => next();
const loginLimiter = (req, res, next) => next();
const logger = (req, res, next) => next();

// Exporta todos os mocks organizadamente
module.exports = {
  verifyToken,
  errorHandler,
  limiterPerfil,
  loginLimiter,
  logger,
};
