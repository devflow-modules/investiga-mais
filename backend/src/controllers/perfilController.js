const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { sendSuccess, sendError } = require('../../../shared/utils/sendResponse')

/**
 * Atualiza o perfil do usuário autenticado.
 */
exports.atualizarPerfil = async (req, res) => {
  const { nome, telefone, nascimento, cidade, uf, genero } = req.body
  const usuarioId = req.user.usuarioId

  try {
    // Busca o usuário atual para verificar se já possui bônus
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { bonusConcedidoAt: true }
    })

    const atualizacao = {
      nome,
      telefone,
      nascimento: nascimento ? new Date(nascimento) : null,
      cidade,
      uf,
      genero
    }

    // Se o bônus ainda não foi concedido e o perfil estiver completo
    if (
      !usuario.bonusConcedidoAt &&
      nome &&
      telefone &&
      nascimento &&
      cidade &&
      uf &&
      genero
    ) {
      atualizacao.bonusConcedidoAt = new Date()
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: atualizacao
    })

    // ✅ Retornar direto o objeto, não aninhado em `data`
    return sendSuccess(res, {
      mensagem: 'Perfil atualizado com sucesso',
      bonusConcedido: !!atualizacao.bonusConcedidoAt
    })
  } catch (err) {
    console.error('[Perfil] Erro ao atualizar perfil:', err)
    return sendError(res, 500, 'Erro ao atualizar perfil')
  }
}

/**
 * Retorna o perfil do usuário autenticado.
 */
exports.obterPerfil = async (req, res) => {
  const usuarioId = req.user.usuarioId

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        email: true,
        cpf: true,
        nome: true,
        telefone: true,
        nascimento: true,
        cidade: true,
        uf: true,
        genero: true,
        bonusConcedidoAt: true
      }
    })

    if (!usuario) {
      return sendError(res, 404, 'Usuário não encontrado')
    }

    const nomeFormatado = usuario.nome
      ? usuario.nome
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : ''

    // ✅ Retornar direto o objeto do usuário, não aninhado em `data`
    return sendSuccess(res, {
      ...usuario,
      nome: nomeFormatado
    })
  } catch (err) {
    console.error('[Perfil] Erro ao obter perfil:', err)
    return sendError(res, 500, 'Erro ao obter perfil')
  }
}
