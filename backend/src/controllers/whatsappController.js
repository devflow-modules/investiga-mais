const { enviarMensagemWhatsApp, processarMensagemRecebida } = require('../services/whatsappService.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');

async function enviarMensagem(req, res) {
  const { numero, mensagem } = req.body;

  try {
    const resultado = await enviarMensagemWhatsApp({ numero, mensagem });

    if (!resultado.success) {
      return sendError(res, 500, resultado.message || 'Erro ao enviar mensagem.', {
        data: resultado.data || null
      });
    }

    return sendSuccess(
      res,
      {
        dev: resultado.dev || false,
        message_id: resultado.data?.message_id,
        numero: resultado.data?.numero || numero,
        mensagem: resultado.data?.mensagem || mensagem
      },
      resultado.message || 'Mensagem enviada com sucesso'
    );
  } catch (error) {
    console.error('[whatsappController] erro:', error);
    return sendError(res, 500, 'Erro inesperado ao enviar mensagem.', {
      error: error.message,
      stack: error.stack
    });
  }
}

async function receberMensagemWebhook(req, res) {
  try {
    const resultado = await processarMensagemRecebida(req.body);

    if (!resultado.success) {
      return sendError(res, 400, resultado.message || 'Webhook inválido');
    }

    return sendSuccess(res, {}, 'Mensagem recebida com sucesso.');
  } catch (err) {
    console.error('[whatsappController] webhook erro:', err);
    return sendError(res, 500, 'Erro interno ao processar webhook.', {
      error: err.message,
      stack: err.stack
    });
  }
}

module.exports = {
  enviarMensagem,
  receberMensagemWebhook
};
