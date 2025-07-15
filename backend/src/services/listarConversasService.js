import prisma from '../lib/prisma.js';
import { erroComStatus } from '../utils/erroComStatus.js';

export async function listarConversasService() {
  try {
    const conversas = await prisma.conversa.findMany({
      include: {
        mensagens: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: {
        ultimaMensagemEm: 'desc'
      }
    });

    return { conversas };
  } catch (err) {
    throw erroComStatus(500, 'Erro ao listar conversas.');
  }
}
