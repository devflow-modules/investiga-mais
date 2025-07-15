const prisma = require('../lib/prisma.js');
const erroComStatus = require('../utils/erroComStatus');
const { responderConversaService } = require('./responderConversaService.js');

async function registrarManualService({ email, cpf, nome, telefone }) {
  if (!email || !cpf || !nome || !telefone) {
    throw erroComStatus(400, 'Todos os campos são obrigatórios.');
  }

  try {
    const usuario = await prisma.usuario.create({
      data: { email, cpf, nome, telefone, criadoViaAdmin: true }
    });
    return { usuario };
  } catch (err) {
    if (err.code === 'P2002') {
      const campo = err.meta?.target?.[0] || 'campo único';
      throw erroComStatus(409, `O ${campo} informado já está em uso.`);
    }
    throw erroComStatus(500, 'Erro ao registrar usuário.');
  }
}

async function listarConversasService() {
  try {
    const conversas = await prisma.conversa.findMany({
      include: {
        mensagens: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { ultimaMensagemEm: 'desc' }
    });
    return { conversas };
  } catch (err) {
    throw erroComStatus(500, 'Erro ao listar conversas.');
  }
}

async function listarMensagensDaConversaService(id, skip = 0, take = 20) {
  const conversaId = Number(id);
  if (isNaN(conversaId)) throw erroComStatus(400, 'ID da conversa inválido.');

  try {
    const conversa = await prisma.conversa.findUnique({
      where: { id: conversaId },
      include: {
        mensagens: {
          skip,
          take,
          orderBy: { timestamp: 'asc' },
          include: {
            Atendente: { select: { nome: true, email: true } }
          }
        }
      }
    });

    if (!conversa) throw erroComStatus(404, 'Conversa não encontrada.');
    return { mensagens: conversa.mensagens };
  } catch (err) {
    throw erroComStatus(err.status || 500, err.message || 'Erro ao buscar mensagens da conversa.');
  }
}

async function criarConversaManualService({ numero, nome, atendenteId }) {
  if (!numero || !nome || !atendenteId) {
    throw erroComStatus(400, 'Número, nome e atendente são obrigatórios.');
  }

  try {
    const conversa = await prisma.conversa.create({
      data: {
        numero,
        nome,
        atendenteId,
        atendidaPorAutomacao: false,
        ultimaMensagemEm: new Date()
      }
    });
    return { conversa };
  } catch (err) {
    throw erroComStatus(500, 'Erro ao criar conversa manual.');
  }
}

async function atribuirConversa(conversaId, atendenteId) {
  const id = Number(conversaId);
  if (isNaN(id)) throw erroComStatus(400, 'ID inválido para atribuição.');

  try {
    const conversa = await prisma.conversa.findUnique({
      where: { id },
      select: { id: true, atendenteId: true }
    });

    if (!conversa) throw erroComStatus(404, 'Conversa não encontrada.');

    if (conversa.atendenteId && conversa.atendenteId !== atendenteId) {
      throw erroComStatus(409, 'Conversa já atribuída a outro atendente.');
    }

    await prisma.conversa.update({
      where: { id },
      data: {
        atendenteId,
        atendidaPorAutomacao: false,
        atualizadoEm: new Date()
      }
    });

    return { sucesso: true, mensagem: 'Conversa atribuída com sucesso.' };
  } catch (err) {
    throw erroComStatus(err.status || 500, err.message || 'Erro ao atribuir conversa.');
  }
}

async function liberarConversa(conversaId, atendenteId) {
  const id = Number(conversaId);
  if (isNaN(id)) throw erroComStatus(400, 'ID inválido para liberação.');

  try {
    const conversa = await prisma.conversa.findUnique({
      where: { id },
      select: { id: true, atendenteId: true }
    });

    if (!conversa) throw erroComStatus(404, 'Conversa não encontrada.');

    if (String(conversa.atendenteId) !== String(atendenteId)) {
      throw erroComStatus(403, 'Você não pode liberar uma conversa que não está atendendo.');
    }

    await prisma.conversa.update({
      where: { id },
      data: {
        atendenteId: null,
        naoLido: true,
        atendidaPorAutomacao: true,
        atualizadoEm: new Date()
      }
    });

    return { sucesso: true, mensagem: 'Conversa liberada com sucesso.' };
  } catch (err) {
    throw erroComStatus(err.status || 500, err.message || 'Erro ao liberar conversa.');
  }
}

async function liberarConversasInativas() {
  const limite = new Date(Date.now() - 1000 * 60 * 15);

  try {
    const atualizadas = await prisma.conversa.updateMany({
      where: {
        atualizadoEm: { lt: limite },
        atendenteId: { not: null }
      },
      data: {
        atendenteId: null,
        naoLido: true,
        atendidaPorAutomacao: true,
        atualizadoEm: new Date()
      }
    });

    return { totalLiberadas: atualizadas.count };
  } catch (err) {
    throw erroComStatus(500, 'Erro ao liberar conversas inativas.');
  }
}

async function atribuirConversaDisponivel(atendenteId) {
  try {
    const conversa = await prisma.conversa.findFirst({
      where: { atendenteId: null, status: { in: ['pendente', 'aberta'] } },
      orderBy: { ultimaMensagemEm: 'desc' }
    });

    if (!conversa) return null;

    await prisma.conversa.update({
      where: { id: conversa.id },
      data: {
        atendenteId,
        atualizadoEm: new Date(),
        atendidaPorAutomacao: false
      }
    });

    return { conversa };
  } catch (err) {
    throw erroComStatus(500, 'Erro ao atribuir conversa disponível.');
  }
}

module.exports = {
  registrarManualService,
  listarConversasService,
  listarMensagensDaConversaService,
  criarConversaManualService,
  atribuirConversa,
  liberarConversa,
  liberarConversasInativas,
  atribuirConversaDisponivel,
  responderConversaService
}