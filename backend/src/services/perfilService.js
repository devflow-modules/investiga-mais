const prisma = require('../lib/prisma.js');

async function atualizarPerfilService(usuarioId, dados) {
  const { nome, telefone, nascimento, cidade, uf, genero } = dados;

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

  if (
    !usuario.bonusConcedidoAt &&
    nome &&
    telefone &&
    nascimento &&
    cidade &&
    uf &&
    genero
  ) {
    atualizacao.bonusConcedidoAt = new Date();
  }

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: atualizacao
  });

  return {
    mensagem: 'Perfil atualizado com sucesso',
    bonusConcedido: !!atualizacao.bonusConcedidoAt
  };
}

async function obterPerfilService(usuarioId) {
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

  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const nomeFormatado = usuario.nome
    ? usuario.nome
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  return {
    ...usuario,
    nome: nomeFormatado
  };
}

module.exports = {
  atualizarPerfilService,
  obterPerfilService
};
