const prismaDefault = require('../lib/prisma.js');

// Lança erro com status customizado
function erroComStatus(mensagem, status = 400) {
  const err = new Error(mensagem);
  err.status = status;
  throw err;
}

// Atribui uma conversa a um atendente (manual ou automático)
async function atribuirConversa(conversaId, atendenteId, prisma = prismaDefault) {
  const conversa = await prisma.conversa.findUnique({
    where: { id: conversaId },
    select: { id: true, atendenteId: true },
  });

  if (!conversa) erroComStatus('Conversa não encontrada.', 404);

  if (conversa.atendenteId && conversa.atendenteId !== atendenteId) {
    erroComStatus('Conversa já atribuída a outro atendente.', 409);
  }

  await prisma.conversa.update({
    where: { id: conversaId },
    data: {
      atendenteId,
      atendidaPorAutomacao: false,
      atualizadoEm: new Date(),
    },
  });

  return { sucesso: true, mensagem: 'Conversa atribuída com sucesso.' };
}

// Libera conversa manualmente (botão liberar)
async function liberarConversa(conversaId, atendenteId, prisma = prismaDefault) {
  const conversa = await prisma.conversa.findUnique({
    where: { id: conversaId },
    select: { id: true, atendenteId: true },
  });

  if (!conversa) erroComStatus('Conversa não encontrada.', 404);

  if (String(conversa.atendenteId) !== String(atendenteId)) {
    erroComStatus('Você não pode liberar uma conversa que não está atendendo.', 403);
  }

  await prisma.conversa.update({
    where: { id: conversaId },
    data: {
      atendenteId: null,
      naoLido: true,
      atendidaPorAutomacao: true,
      atualizadoEm: new Date(),
    },
  });

  return { sucesso: true, mensagem: 'Conversa liberada com sucesso.' };
}

// Libera conversas automaticamente após timeout
async function liberarConversasInativas(timeoutMinutos = 5, prisma = prismaDefault) {
  const agora = new Date();
  const limite = new Date(agora.getTime() - timeoutMinutos * 60 * 1000);

  const conversas = await prisma.conversa.findMany({
    where: {
      ultimaMensagemFoiDoCliente: true,
      ultimaMensagemEm: { lt: limite },
      atendenteId: { not: null },
      status: { in: ['pendente', 'aberta'] },
    },
    select: { id: true },
  });

  const ids = conversas.map((c) => c.id);

  if (ids.length > 0) {
    await prisma.conversa.updateMany({
      where: { id: { in: ids } },
      data: {
        atendenteId: null,
        naoLido: true,
        atendidaPorAutomacao: true,
        atualizadoEm: agora,
      },
    });
    console.log(`[Timeout] Liberadas ${ids.length} conversas inativas.`);
  }

  return { sucesso: true, liberadas: ids.length };
}

// Atribui uma conversa disponível a um atendente
async function atribuirConversaDisponivel(atendenteId, prisma = prismaDefault) {
  const conversa = await prisma.conversa.findFirst({
    where: {
      atendenteId: null,
      status: { in: ['pendente', 'aberta'] },
    },
    orderBy: {
      ultimaMensagemEm: 'asc',
    },
  });

  if (!conversa) return null;

  await prisma.conversa.update({
    where: { id: conversa.id },
    data: {
      atendenteId,
      atendidaPorAutomacao: false,
      atualizadoEm: new Date(),
    },
  });

  return { id: conversa.id };
}

module.exports = {
  atribuirConversa,
  liberarConversa,
  liberarConversasInativas,
  atribuirConversaDisponivel,
};
