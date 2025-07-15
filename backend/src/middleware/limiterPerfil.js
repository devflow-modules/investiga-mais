const { sendError } = require('../utils/sendResponse.js');

// Armazena o timestamp da última requisição por usuário
const rateLimit = {}

module.exports = (req, res, next) => {
  const usuarioId = req.user?.usuarioId || req.user?.id; // Compatível com estrutura `verifyToken`
  if (!usuarioId) return next();

  const agora = Date.now();
  const ultimaChamada = rateLimit[usuarioId] || 0;
  const intervaloMinimo = 2000; // 2 segundos

  if (agora - ultimaChamada < intervaloMinimo) {
    return sendError(res, 429, 'Aguarde alguns segundos antes de tentar novamente.');
  }

  rateLimit[usuarioId] = agora;
  next();
};
