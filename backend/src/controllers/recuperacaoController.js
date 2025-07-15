const { hash } = require('bcryptjs');
const { validarEmail, validarSenha } = require('../../../shared/validators/backend.js');
const { gerarTokenRecuperacao, redefinirSenha } = require('../services/recuperacaoService.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');

async function recuperarSenha(req, res) {
  try {
    const { email } = req.body;

    if (!validarEmail(email)) {
      return sendError(res, 400, 'Email inválido.');
    }

    const resultado = await gerarTokenRecuperacao(email);

    if (resultado.erro) {
      return sendError(res, resultado.status || 500, resultado.erro);
    }

    return sendSuccess(res, null, 'Link de recuperação enviado com sucesso.');
  } catch (err) {
    console.error('[recuperarSenha] erro:', err);
    return sendError(res, err.status || 500, err.message || 'Erro interno ao iniciar recuperação de senha.', {
      error: err.message,
      stack: err.stack
    });
  }
}

async function resetarSenha(req, res) {
  try {
    const { token, novaSenha } = req.body;

    if (!validarSenha(novaSenha)) {
      return sendError(res, 400, 'A senha deve ter no mínimo 6 caracteres e conter letras e números.');
    }

    const novaSenhaHash = await hash(novaSenha, 10);
    const resultado = await redefinirSenha(token, novaSenhaHash);

    if (resultado.erro) {
      return sendError(res, resultado.status || 500, resultado.erro);
    }

    return sendSuccess(res, null, 'Senha redefinida com sucesso.');
  } catch (err) {
    console.error('[resetarSenha] erro:', err);
    return sendError(res, err.status || 500, err.message || 'Erro interno ao redefinir senha.', {
      error: err.message,
      stack: err.stack
    });
  }
}


module.exports = {
  recuperarSenha,
  resetarSenha
};
