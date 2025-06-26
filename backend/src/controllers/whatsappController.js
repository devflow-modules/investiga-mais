const { enviarMensagemWhatsApp, processarMensagemRecebida } = require('../services/whatsappService');

exports.enviarMensagem = async (req, res) => {
  const { numero, mensagem } = req.body;

  try {
    const resultado = await enviarMensagemWhatsApp({ numero, mensagem });

    if (!resultado.success) {
      return res.status(500).json({
        success: false,
        message: resultado.message || 'Erro ao enviar mensagem.',
        data: resultado.data || null,
      });
    }

    return res.json({
      success: true,
      dev: resultado.dev || false,
      message: resultado.message,
      data: resultado.data,
    });
  } catch (error) {
    console.error('[whatsappController] erro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro inesperado ao enviar mensagem.',
    });
  }
};

exports.receberMensagemWebhook = async (req, res) => {
  try {
    const resultado = await processarMensagemRecebida(req.body);

    if (!resultado.success) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (err) {
    console.error('[whatsappController] webhook erro:', err);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar webhook.',
    });
  }
};
