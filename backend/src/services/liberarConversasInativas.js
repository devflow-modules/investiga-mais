const prisma = require('../lib/prisma');

async function liberarConversasInativas(timeoutMinutos = 5) {
  const agora = new Date()
  const limite = new Date(agora.getTime() - timeoutMinutos * 60 * 1000)

  const conversas = await prisma.conversa.findMany({
    where: {
      ultimaMensagemFoiDoCliente: true,
      ultimaMensagemEm: { lt: limite },
      atendenteId: { not: null },
      status: { in: ['pendente', 'aberta'] }
    },
    select: { id: true }
  })

  const ids = conversas.map((c) => c.id)

  if (ids.length > 0) {
    await prisma.conversa.updateMany({
      where: { id: { in: ids } },
      data: { atendenteId: null }
    })
    console.log(`[Timeout] Liberadas ${ids.length} conversas inativas.`)
  }
}

module.exports = { liberarConversasInativas }
