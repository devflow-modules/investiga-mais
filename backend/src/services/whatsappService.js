const axios = require('axios');
const prisma = require('../lib/prisma.js');

const WABA_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function enviarMensagemWhatsApp({ numero, mensagem }) {
  if (process.env.WHATSAPP_MODO_DEV === 'true') {
    console.log(`[SIMULADO] Enviando para ${numero}: ${mensagem}`);
    return {
      success: true,
      dev: true,
      message: 'Mensagem simulada com sucesso (modo desenvolvedor)',
      data: {
        message_id: 'simulado-dev-id',
        numero,
        mensagem,
        timestamp: new Date()
      }
    };
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: numero,
        type: 'text',
        text: { body: mensagem }
      },
      {
        headers: {
          Authorization: `Bearer ${WABA_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const messageId = response.data?.messages?.[0]?.id;

    return {
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: {
        message_id: messageId,
        numero,
        mensagem,
        timestamp: new Date()
      }
    };
  } catch (error) {
    console.error('[WhatsApp API Error]', error.response?.data || error.message);
    return {
      success: false,
      message: 'Erro ao enviar mensagem',
      data: error.response?.data || null
    };
  }
}

async function processarMensagemRecebida(body) {
  try {
    const mensagemData = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!mensagemData) {
      return { success: false, message: 'Webhook inválido' };
    }

    const numero = mensagemData.from;
    const conteudo = mensagemData.text?.body || '[mensagem não textual]';

    let conversa = await prisma.conversa.findUnique({ where: { numero } });

    if (!conversa) {
      conversa = await prisma.conversa.create({
        data: { numero, ultimaMensagemEm: new Date() }
      });
    }

    await prisma.mensagem.create({
      data: {
        conversaId: conversa.id,
        direcao: 'entrada',
        conteudo
      }
    });

    await prisma.conversa.update({
      where: { id: conversa.id },
      data: { ultimaMensagemEm: new Date() }
    });

    console.log(`[Webhook WhatsApp] Mensagem recebida de ${numero}: ${conteudo}`);
    return { success: true };
  } catch (err) {
    console.error('[processarMensagemRecebida] Erro:', err);
    return { success: false, message: 'Erro interno' };
  }
}

module.exports = {
  enviarMensagemWhatsApp,
  processarMensagemRecebida
};
