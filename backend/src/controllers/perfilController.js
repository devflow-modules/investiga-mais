const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.atualizarPerfil = async (req, res) => {
  const { nome, telefone, nascimento, cidade, uf, genero } = req.body;
  const usuarioId = req.user.usuarioId;

  try {
    // Primeiro busca o usuário para ver se já tem bônus concedido
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { bonusConcedidoAt: true }
    });

    const atualizacao = {
      nome,
      telefone,
      nascimento: nascimento ? new Date(nascimento) : null,
      cidade,
      uf,
      genero
    };

    // Se o bônus ainda não foi concedido e o usuário completou o perfil
    if (!usuario.bonusConcedidoAt && nome && telefone && nascimento && cidade && uf && genero) {
      atualizacao.bonusConcedidoAt = new Date();
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: atualizacao
    });

    return res.json({
      sucesso: true,
      mensagem: 'Perfil atualizado com sucesso',
      bonusConcedido: !!atualizacao.bonusConcedidoAt
    });
  } catch (err) {
    console.error('[Perfil] Erro ao atualizar perfil:', err);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
};

exports.obterPerfil = async (req, res) => {
  const usuarioId = req.user.usuarioId;

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
    });

    const nomeFormatado = usuario.nome
      ? usuario.nome
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';

    return res.json({
      sucesso: true,
      usuario: {
        ...usuario,
        nome: nomeFormatado
      }
    });
  } catch (err) {
    console.error('[Perfil] Erro ao obter perfil:', err);
    res.status(500).json({ erro: 'Erro ao obter perfil' });
  }
};