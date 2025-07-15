const { sendSuccess, sendError } = require('../utils/sendResponse.js');
const {
  atualizarPerfilService,
  obterPerfilService
} = require('../services/perfilService.js');

async function atualizarPerfil(req, res) {
  const usuarioId = req.user.id;
  const dados = req.body;

  try {
    const resultado = await atualizarPerfilService(usuarioId, dados);
    return sendSuccess(res, resultado, 'Perfil atualizado com sucesso.');
  } catch (err) {
    console.error('[Perfil] Erro ao atualizar perfil:', err);
    return sendError(res, err.status || 500, err.message || 'Erro ao atualizar perfil.', {
      error: err.message,
      stack: err.stack
    });
  }
}

async function obterPerfil(req, res) {
  const usuarioId = req.user.id;

  try {
    const usuario = await obterPerfilService(usuarioId);
    return sendSuccess(res, usuario, 'Perfil obtido com sucesso.');
  } catch (err) {
    console.error('[Perfil] Erro ao obter perfil:', err);
    return sendError(res, err.status || 500, err.message || 'Erro ao obter perfil.', {
      error: err.message,
      stack: err.stack
    });
  }
}

module.exports = {
  atualizarPerfil,
  obterPerfil
};
