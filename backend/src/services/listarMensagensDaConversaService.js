import prisma from '../lib/prisma.js';
import { erroComStatus } from '../utils/erroComStatus.js';

export async function listarMensagensDaConversaService(id) {
  const conversaId = Number(id);

  if (isNaN(conversaId)) {
    throw erroComStatus(400, 'ID da conversa inválido.');
  }

  const conversa = await prisma.conversa.findUnique({
    where: { id: conversaId },
    include: {
      mensagens: {
        orderBy: { timestamp: 'asc' },
        include: {
          Atendente: {
            select: {
              nome: true,
              email: true
            }
          }
        }
      },
      _count: { select: { mensagens: true } }
    }
  });

  if (!conversa) {
    throw erroComStatus(404, 'Conversa não encontrada.');
  }

  return { mensagens: conversa.mensagens };
}
