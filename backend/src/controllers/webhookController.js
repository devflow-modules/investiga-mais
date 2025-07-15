const { registrarUsuarioViaCompra } = require('../services/webhookService.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');

async function registrarViaCompra(req, res) {
  try {
    const resultado = await registrarUsuarioViaCompra(req.body);

    // Se status for 400 ou maior que 499, trata como erro
    if (resultado.status >= 400) {
      return sendError(res, resultado.status, resultado.data?.erro || 'Erro ao registrar via compra.', {
        data: resultado?.data || null
      });
    }

    return sendSuccess(res, resultado.data, resultado.data?.mensagem || 'Usuário registrado com sucesso', resultado.status || 200);
  } catch (err) {
    console.error('[webhookController] erro:', err);
    return sendError(res, 500, 'Erro interno ao registrar via compra.', {
      error: err.message,
      stack: err.stack
    });
  }
}

module.exports = {
  registrarViaCompra
};
