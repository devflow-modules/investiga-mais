const adminService = require('../services/adminService.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');

// REGISTRAR USUÁRIO MANUAL
async function registrarManual(req, res) {
  try {
    const { email, cpf, nome, telefone, genero } = req.body
    const resultado = await adminService.registrarManualService({ email, cpf, nome, telefone, genero })
    return sendSuccess(res, resultado, resultado.mensagem)
  } catch (err) {
    console.error('[adminController] registrarManual:', err)
    return sendError(res, err.status || 500, err.message, { stack: err.stack })
  }
}


// LISTAR CONVERSAS
async function listarConversas(req, res) {
  try {
    const result = await adminService.listarConversasService();
    const conversas = result?.conversas || [];
    return sendSuccess(res, { conversas }, 'Conversas listadas com sucesso.');
  } catch (err) {
    console.error('[adminController] listarConversas:', err);
    return sendError(res, err.status || 500, err.message, { stack: err.stack });
  }
}

// LISTAR MENSAGENS DA CONVERSA
async function listarMensagensDaConversa(req, res) {
  try {
    const { id } = req.params;
    const { skip, take } = req.query;

    const conversaId = Number(id);
    if (isNaN(conversaId)) {
      return sendError(res, 400, 'ID inválido');
    }

    const result = await adminService.listarMensagensDaConversaService(conversaId, parseInt(skip) || 0, parseInt(take) || 20);

    if (!result || !Array.isArray(result.mensagens)) {
      return sendError(res, 404, 'Conversa não encontrada');
    }

    return sendSuccess(res, { mensagens: result.mensagens }, 'Mensagens carregadas com sucesso.');
  } catch (err) {
    console.error('[adminController] listarMensagensDaConversa:', err);
    return sendError(res, err.status || 500, err.message, { stack: err.stack });
  }
}

// RESPONDER CONVERSA
async function responderConversa(req, res) {
  try {
    const conversaId = Number(req.params.id);
    const { mensagem } = req.body;
    const atendenteId = req.user?.id;

    if (!mensagem || mensagem.trim() === '') {
      return sendError(res, 400, 'Mensagem obrigatória');
    }

    const result = await adminService.responderConversaService({ conversaId, mensagem, atendenteId });

    if (!result) {
      return sendError(res, 404, 'Conversa não encontrada');
    }

    const { sucesso = false, mensagem: retorno = '' } = result;

    return sendSuccess(res, { sucesso }, retorno);
  } catch (err) {
    console.error('[adminController] responderConversa:', err);
    return sendError(res, err.status || 500, err.message, { stack: err.stack });
  }
}

// ATRIBUIR CONVERSA
async function atribuirConversaHandler(req, res) {
  try {
    const conversaId = Number(req.params.id);
    const atendenteId = req.user?.id;

    const result = await adminService.atribuirConversa(conversaId, atendenteId);

    const { sucesso = false, mensagem = '' } = result || {};

    return sendSuccess(res, { sucesso }, mensagem);
  } catch (err) {
    console.error('[adminController] atribuirConversa:', err);
    return sendError(res, err.status || 400, err.message, { stack: err.stack });
  }
}

// LIBERAR CONVERSA
async function liberarConversaHandler(req, res) {
  try {
    const conversaId = Number(req.params.id);
    const atendenteId = req.user?.id;

    const result = await adminService.liberarConversa(conversaId, atendenteId);

    const { sucesso = false, mensagem = 'Conversa liberada.' } = result || {};

    return sendSuccess(res, { sucesso }, mensagem);
  } catch (err) {
    console.error('[adminController] liberarConversa:', err);
    return sendError(res, err.status || 400, err.message, { stack: err.stack });
  }
}

// LIBERAR CONVERSAS INATIVAS
async function liberarConversasInativasHandler(req, res) {
  try {
    const { totalLiberadas } = await adminService.liberarConversasInativas()
    return sendSuccess(res, { totalLiberadas }, 'Conversas inativas liberadas com sucesso.')
  } catch (err) {
    console.error('[adminController] liberarConversasInativas:', err)
    return sendError(res, err.status || 500, err.message, { stack: err.stack })
  }
}

// ATRIBUIR CONVERSA DISPONÍVEL
async function atribuirDisponivel(req, res) {
  try {
    const atendenteId = req.user?.id
    const result = await adminService.atribuirConversaDisponivel(atendenteId)

    if (!result) {
      return sendSuccess(res, { mensagem: 'Nenhuma conversa disponível no momento.' })
    }

    return sendSuccess(res, result, 'Conversa atribuída com sucesso.')
  } catch (err) {
    console.error('[adminController] atribuirDisponivel:', err)
    return sendError(res, err.status || 500, err.message, { stack: err.stack })
  }
}

// CRIAR CONVERSA MANUAL
async function criarConversaManualHandler(req, res) {
  try {
    const { numero, nome } = req.body
    const atendenteId = req.user?.id
    const { conversa } = await adminService.criarConversaManualService({ numero, nome, atendenteId })
    return sendSuccess(res, { conversa }, 'Conversa criada manualmente.')
  } catch (err) {
    console.error('[adminController] criarConversaManualHandler:', err)
    return sendError(res, err.status || 500, err.message, { stack: err.stack })
  }
}

// ASSUMIR CONVERSA (alias)
async function assumirConversaDisponivel(req, res) {
  return atribuirDisponivel(req, res)
}

module.exports = {
  registrarManual,
  listarConversas,
  listarMensagensDaConversa,
  responderConversa,
  atribuirConversaHandler,
  liberarConversaHandler,
  liberarConversasInativasHandler,
  atribuirDisponivel,
  criarConversaManualHandler,
  assumirConversaDisponivel
};
