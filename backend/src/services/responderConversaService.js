const prisma = require('../lib/prisma.js');
const enviarMensagemWhatsApp = require('./whatsappService');
const erroComStatus = require('../utils/erroComStatus')

async function responderConversaService(conversaId, mensagemTexto, atendenteId) {
  if (!mensagemTexto || mensagemTexto.trim() === '') {
    throw erroComStatus(400, 'Mensagem não pode estar vazia.');
  }

  const id = Number(conversaId);
  if (isNaN(id)) {
    throw erroComStatus(400, 'ID da conversa inválido.');
  }

  try {
    const conversa = await prisma.conversa.findUnique({
      where: { id }
    });

    if (!conversa) {
      throw erroComStatus(404, 'Conversa não encontrada.');
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        conversaId: id,
        conteudo: mensagemTexto,
        direcao: 'saida',
        status: 'pendente',
        atendenteId
      }
    });

    try {
      await enviarMensagemWhatsApp(conversa.numero, mensagemTexto);

      await prisma.mensagem.update({
        where: { id: novaMensagem.id },
        data: { status: 'enviada' }
      });
    } catch {
      await prisma.mensagem.update({
        where: { id: novaMensagem.id },
        data: { status: 'falhou' }
      });

      throw erroComStatus(502, 'Falha ao enviar mensagem via WhatsApp.');
    }

    await prisma.conversa.update({
      where: { id },
      data: { ultimaMensagemEm: new Date() }
    });

    return {
      sucesso: true,
      mensagem: 'Mensagem enviada com sucesso.'
    };
  } catch (err) {
    throw erroComStatus(err.status || 500, err.message || 'Erro ao responder conversa.');
  }
}

module.exports = {
  responderConversaService,
}