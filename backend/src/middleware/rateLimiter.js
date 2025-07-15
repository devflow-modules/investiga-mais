const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/sendResponse.js');

// Limita a 100 requisições por IP a cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de tentativas
  handler: (req, res) => {
    sendError(res, 429, 'Muitas tentativas. Tente novamente mais tarde.');
  },
});

module.exports = loginLimiter;
