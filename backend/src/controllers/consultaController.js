const { validarCNPJ } = require('../../../shared/validators/backend.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');
const consultaService = require('../services/consultaService.js');

/**
 * Consulta CNPJ com validação e fallback via ReceitaWS.
 * Rota: GET /api/consulta/:cnpj
 */
async function consultarCNPJ(req, res) {
  const { cnpj } = req.params;
  const { cpf } = req.user;

  if (!validarCNPJ(cnpj)) {
    return sendError(res, 400, 'CNPJ inválido. Verifique o número digitado.');
  }

  try {
    const resultado = await consultaService.consultarCNPJService(cnpj, cpf);
    return sendSuccess(res, resultado, 'Consulta realizada com sucesso.');
  } catch (err) {
    console.error(`[consultaController] Erro ao consultar CNPJ ${cnpj}:`, err);
    return sendError(res, err.status || 500, err.message || 'Erro interno ao consultar CNPJ.', {
      consulta: null,
      empresa: null,
      error: err.message,
      stack: err.stack
    });
  }
}

/**
 * Lista as consultas realizadas por um usuário, com filtros e paginação.
 * Rota: GET /api/consulta
 */
async function listarConsultas(req, res) {
  const { cpf, email, nome } = req.user;
  const filtros = req.query;

  try {
    const resultado = await consultaService.listarConsultasService(cpf, email, nome, filtros);
    return sendSuccess(res, resultado, 'Consultas listadas com sucesso.');
  } catch (err) {
    console.error(`[consultaController] Erro ao listar consultas para CPF ${cpf}:`, err);
    return sendError(res, 500, 'Erro ao listar consultas.', {
      usuario: { cpf, email, nome },
      total: 0,
      resultados: [],
      error: err.message,
      stack: err.stack
    });
  }
}

module.exports = {
  consultarCNPJ,
  listarConsultas
};
