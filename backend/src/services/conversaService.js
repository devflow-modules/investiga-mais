const defaultPrisma = require('../lib/prisma.js');

// Cria uma nova conversa manualmente
async function criarConversaManual({ numero, nome, atendenteId }, prisma = defaultPrisma) {
  if (!numero || !/^\d{8,15}$/.test(numero)) {
    throw new Error('Número inválido. Deve conter apenas dígitos.');
  }

  const conversa = await prisma.conversa.create({
    data: {
      numero,
      nome: nome || null,
      atendenteId,
      ultimaMensagem: 'Conversa iniciada manualmente.',
      ultimaMensagemEm: new Date(),
      atualizadaEm: new Date(),
      status: 'aberta',
      atendidaPorAutomacao: false
    },
  });

  return conversa;
}

module.exports = {
  criarConversaManual
};
