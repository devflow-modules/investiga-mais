const { sendError } = require('../utils/sendResponse.js');

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('[Erro] Erro interno no servidor');
  } else {
    console.error('[Erro]', err);
  }

  const message = err.message || 'Erro interno no servidor';

  return sendError(res, 500, message);
};
