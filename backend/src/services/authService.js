const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma.js');
const { getJwtSecret } = require('../config/securityEnv.js');

async function autenticarUsuario(email, senha) {
  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (!usuario) {
    console.warn('[authService] Usuário não encontrado para o email informado')
    throw new Error('CREDENCIAIS_INVALIDAS')
  }

  const senhaCorreta = await compare(senha, usuario.senhaHash)

  if (!senhaCorreta) {
    console.warn('[authService] Senha inválida para o email informado')
    throw new Error('CREDENCIAIS_INVALIDAS')
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      cpf: usuario.cpf,
      nome: usuario.nome,
      role: usuario.role
    },
    getJwtSecret(),
    { expiresIn: '1d' }
  )

  return { usuario, token }
}


function invalidarTokenCookie(res) {
  res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax;')
}

module.exports = {
  autenticarUsuario,
  invalidarTokenCookie
}
