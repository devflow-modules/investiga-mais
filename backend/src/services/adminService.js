const prisma = require('../lib/prisma.js')
const erroComStatus = require('../utils/erroComStatus')
const { responderConversaService } = require('./responderConversaService.js')
const { criarUsuarioComSenha } = require('../helpers/criarUsuarioComSenha.js')
const { enviarEmail } = require('../services/emailService')

async function registrarManualService({ email, cpf, nome, telefone, genero }) {
  if (!email || !cpf || !nome) {
    throw erroComStatus(400, 'Campos obrigatórios faltando.')
  }

  try {
    const { usuario, senha } = await criarUsuarioComSenha({ email, cpf, nome, telefone, genero })

    const html = `
    <div style="max-width: 600px; margin: auto; font-family: 'Inter', sans-serif; background-color: #F9FAFB; padding: 30px; border-radius: 16px; color: #111827;">
      <h2 style="color: #1E40AF; text-align: center; margin-bottom: 24px;">🎉 Bem-vindo ao Investiga+</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">
        Sua conta foi ativada com sucesso! Utilize os dados abaixo para acessar a plataforma:
      </p>
      <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; padding: 16px 20px; border-radius: 12px; font-size: 15px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px 0;">
          <strong style="color: #1E40AF;">Email:</strong>
          <span style="background-color: #F3F4F6; padding: 6px 12px; border-radius: 6px; font-family: monospace; display: inline-block; margin-left: 8px;">
            ${email}
          </span>
        </p>
        <p style="margin: 0;">
          <strong style="color: #1E40AF;">Senha:</strong>
          <span style="background-color: #F3F4F6; padding: 6px 12px; border-radius: 6px; font-family: monospace; display: inline-block; margin-left: 8px;">
            ${senha}
          </span>
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://investigamais.com/login" style="display: inline-block; padding: 12px 24px; background-color: #1E40AF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Acessar Plataforma
        </a>
      </div>
      <p style="font-size: 14px; color: #6B7280; margin-top: 30px; text-align: center;">
        Por segurança, recomendamos alterar sua senha após o primeiro acesso.
      </p>
      <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 20px;">
        © ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.
      </p>
    </div>
    `

    const emailResponse = await enviarEmail(email, '🎉 Sua conta no Investiga+ foi criada com sucesso', html)

    if (!emailResponse.success) {
      console.error('[registrarManualService] Falha ao enviar e-mail:', emailResponse.error)
      throw erroComStatus(500, 'Erro ao enviar e-mail. Verifique as configurações.')
    }

    return {
      sucesso: true,
      mensagem: `Usuário registrado com sucesso. Senha enviada por e-mail.`,
      senha,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    }

  } catch (err) {
    if (err.code === 'P2002') {
      const campo = err.meta?.target?.[0] || 'campo único'
      throw erroComStatus(409, `O ${campo} informado já está em uso.`)
    }

    console.error('[Erro registrarManualService]', err.message, err.stack)
    throw erroComStatus(500, 'Erro ao registrar usuário.')
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