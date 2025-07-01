const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { validarEmail, validarCPF } = require('../../../shared/validators/backend');
const { enviarEmail } = require('../services/email');
const { enviarMensagemWhatsApp } = require('../services/whatsappService');
const { sendSuccess, sendError } = require('../utils/sendResponse');
const { subMinutes } = require('date-fns');

exports.registrarManual = async (req, res) => {
  try {
    const { email, cpf, nome, telefone } = req.body;

    if (!email || !cpf) return sendError(res, 400, 'Email e CPF obrigatórios.');

    const emailLower = email.toLowerCase();

    if (!validarEmail(emailLower) || !validarCPF(cpf)) {
      return sendError(res, 400, 'Email ou CPF em formato inválido.');
    }

    const existente = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: emailLower }, { cpf }]
      }
    });

    if (existente) return sendError(res, 409, 'Usuário já cadastrado.');

    const senhaGerada = crypto.randomBytes(4).toString('hex');
    const senhaCriptografada = await bcrypt.hash(senhaGerada, 10);

    await prisma.usuario.create({
      data: {
        email: emailLower,
        senhaHash: senhaCriptografada,
        cpf,
        nome: nome || undefined,
        telefone: telefone || undefined,
      }
    });

    const html = `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 8px; color: #111827;">
        <h2 style="color: #1e3a8a; text-align: center;">🎉 Bem-vindo ao Investiga+</h2>
        <p style="font-size: 16px; margin-top: 24px;">
          Sua conta foi ativada com sucesso! Utilize os dados abaixo para acessar a plataforma:
        </p>
        <div style="background-color: #ffffff; padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
          <p><strong>Email:</strong> ${emailLower}</p>
          <p><strong>Senha:</strong> ${senhaGerada}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://investigamais.com/login" style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Acessar Plataforma
          </a>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
          Por segurança, recomendamos alterar sua senha após o primeiro acesso.
        </p>
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
          © ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.
        </p>
      </div>
    `;

    if (process.env.NODE_ENV === 'production') {
      await enviarEmail(emailLower, 'Acesso à Plataforma Investiga+', html);
    } else {
      console.log(`📧 [DEV] Simulando envio de e-mail para ${emailLower} com senha: ${senhaGerada}`);
    }

    // WhatsApp
    if (telefone) {
      await enviarMensagemWhatsApp({
        numero: telefone,
        mensagem: `🔐 Olá ${nome || 'usuário'}, seu acesso ao Investiga+ foi liberado!\n\n📧 Email: ${emailLower}\n🔑 Senha: ${senhaGerada}\n\nAcesse: https://investigamais.com/login`,
        token: req.token || req.headers.authorization?.split(' ')[1] || ''
      });
    }

    return sendSuccess(res, {
      sucesso: true,
      mensagem: 'Usuário registrado manualmente e e-mail enviado.'
    });
  } catch (err) {
    console.error('Erro registrarManual:', err);
    return sendError(res, 500, 'Erro interno ao registrar usuário manualmente.');
  }
};

exports.listarConversas = async (req, res) => {
  try {
    const conversas = await prisma.conversa.findMany({
      orderBy: { ultimaMensagemEm: 'desc' },
      include: {
        mensagens: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const formatadas = conversas.map((c) => ({
      id: c.id,
      numero: c.numero,
      nome: c.nome,
      ultimaMensagem: c.mensagens[0]?.conteudo || '',
      ultimaMensagemEm: c.ultimaMensagemEm,
    }));

    return sendSuccess(res, { conversas: formatadas });
  } catch (err) {
    console.error('Erro ao listar conversas:', err);
    return sendError(res, 500, 'Erro ao buscar conversas');
  }
};

exports.listarMensagensDaConversa = async (req, res) => {
  try {
    const conversaId = parseInt(req.params.id)
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 20

    if (isNaN(conversaId)) return sendError(res, 400, 'ID da conversa inválido')

    const conversa = await prisma.conversa.findUnique({
      where: { id: conversaId },
      select: {
        id: true,
        numero: true,
        nome: true,
        mensagens: {
          skip,
          take,
          orderBy: { timestamp: 'asc' },
          include: {
            Atendente: { select: { nome: true, email: true } }
          }
        },
        _count: {
          select: { mensagens: true }
        }
      }
    })

    if (!conversa) return sendError(res, 404, 'Conversa não encontrada')

    const mensagensFormatadas = conversa.mensagens.map((m) => ({
      id: m.id,
      direcao: m.direcao,
      conteudo: m.conteudo,
      timestamp: m.timestamp,
      status: m.status,
      atendente: m.Atendente ? { nome: m.Atendente.nome, email: m.Atendente.email } : null
    }))

    return sendSuccess(res, {
      conversaId: conversa.id,
      numero: conversa.numero,
      nome: conversa.nome,
      mensagens: mensagensFormatadas,
      total: conversa._count.mensagens,
      hasMore: skip + take < conversa._count.mensagens
    })
  } catch (err) {
    console.error('Erro listarMensagensDaConversa:', err)
    return sendError(res, 500, 'Erro ao buscar mensagens da conversa')
  }
}

exports.responderConversa = async (req, res) => {
  try {
    const conversaId = parseInt(req.params.id);
    const { mensagem } = req.body;
    const atendenteId = req.user?.id;

    if (!mensagem || mensagem.trim().length < 1) {
      return sendError(res, 400, 'Mensagem é obrigatória');
    }

    const conversa = await prisma.conversa.findUnique({ where: { id: conversaId } });
    if (!conversa) return sendError(res, 404, 'Conversa não encontrada');

    const novaMensagem = await prisma.mensagem.create({
      data: {
        conversaId,
        direcao: 'saida',
        conteudo: mensagem,
        atendenteId,
        status: 'pendente',
      },
    });

    const token = req.token || req.headers.authorization?.split(' ')[1] || '';

    const statusEnvio = await enviarMensagemWhatsApp({
      numero: conversa.numero,
      mensagem,
      token
    });

    const statusTexto =
      statusEnvio?.success === true
        ? (statusEnvio.dev ? 'simulada' : 'enviada')
        : 'falhou';

    await prisma.mensagem.update({
      where: { id: novaMensagem.id },
      data: { status: statusTexto },
    });

    await prisma.conversa.update({
      where: { id: conversaId },
      data: { ultimaMensagemEm: new Date() },
    });

    return sendSuccess(res, {
      sucesso: true,
      mensagem: 'Mensagem enviada',
      statusEnvio,
    });
  } catch (err) {
    console.error('Erro responderConversa:', err);
    return sendError(res, 500, 'Erro interno ao enviar resposta');
  }
};

exports.atribuirConversa = async (req, res) => {
  try {
    const conversaId = parseInt(req.params.id);
    const atendenteId = req.user?.id;

    if (isNaN(conversaId)) return sendError(res, 400, 'ID da conversa inválido.');

    const conversa = await prisma.conversa.findUnique({
      where: { id: conversaId },
      select: {
        id: true,
        atendenteId: true,
      },
    });

    if (!conversa) return sendError(res, 404, 'Conversa não encontrada.');

    // Se já atribuída a outro atendente
    if (conversa.atendenteId && conversa.atendenteId !== atendenteId) {
      return sendError(res, 409, 'Conversa já está sendo atendida por outro usuário.');
    }

    await prisma.conversa.update({
      where: { id: conversaId },
      data: {
        atendenteId,
        atendidaPorAutomacao: false,
        atualizadoEm: new Date(),
      },
    });

    // (Opcional) salvar log de atribuição

    return sendSuccess(res, { mensagem: 'Conversa atribuída com sucesso.' });
  } catch (err) {
    console.error('Erro atribuirConversa:', err);
    return sendError(res, 500, 'Erro interno ao atribuir conversa.');
  }
};

exports.liberarConversa = async (req, res) => {
  try {
    const conversaId = parseInt(req.params.id);
    const atendenteId = req.user?.id;

    if (isNaN(conversaId)) return sendError(res, 400, 'ID da conversa inválido.');

    const conversa = await prisma.conversa.findUnique({
      where: { id: conversaId },
      select: {
        id: true,
        atendenteId: true,
      },
    });

    if (!conversa) return sendError(res, 404, 'Conversa não encontrada.');

    if (conversa.atendenteId !== atendenteId) {
      return sendError(res, 403, 'Você não pode liberar uma conversa que não está atendendo.');
    }

    await prisma.conversa.update({
      where: { id: conversaId },
      data: {
        atendenteId: null,
        atendidaPorAutomacao: true,
        naoLido: true,
        atualizadoEm: new Date(),
      },
    });

    // (Opcional) salvar log de liberação

    return sendSuccess(res, { mensagem: 'Conversa liberada com sucesso.' });
  } catch (err) {
    console.error('Erro liberarConversa:', err);
    return sendError(res, 500, 'Erro interno ao liberar conversa.');
  }
};

exports.liberarConversasInativas = async (req, res) => {
  try {
    const limite = subMinutes(new Date(), 5);

    const conversas = await prisma.conversa.findMany({
      where: {
        atendenteId: { not: null },
        ultimaMensagemCliente: { lt: limite }
      }
    });

    const ids = conversas.map(c => c.id);

    await prisma.conversa.updateMany({
      where: { id: { in: ids } },
      data: {
        atendenteId: null
      }
    });

    return res.json({ success: true, liberadas: ids.length });
  } catch (err) {
    console.error('Erro ao liberar conversas inativas:', err);
    return res.status(500).json({ success: false, message: 'Erro interno ao liberar' });
  }
};
