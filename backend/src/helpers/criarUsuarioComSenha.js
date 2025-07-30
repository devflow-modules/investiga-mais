const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const { gerarSenha } = require('../../src/utils/gerarSenha')

async function criarUsuarioComSenha({ email, cpf, nome, telefone, genero }) {
  const senha = gerarSenha(8)
  const senhaHash = await bcrypt.hash(senha, 8)

  const usuario = await prisma.usuario.create({
    data: {
      email,
      cpf,
      nome,
      telefone,
      genero,
      senhaHash,
      criadoViaAdmin: true
    }
  })

  return { usuario, senha }
}

module.exports = { criarUsuarioComSenha }
