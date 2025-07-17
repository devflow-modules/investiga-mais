const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma.js');

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev'

async function autenticarUsuario(email, senha) {
  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (!usuario) {
    console.warn('[authService] Usuário não encontrado:', email)
    throw new Error('CREDENCIAIS_INVALIDAS')
  }

  const senhaCorreta = await compare(senha, usuario.senhaHash)

  if (!senhaCorreta) {
    console.warn('[authService] Senha inválida para o email:', email)
    console.log('[authService] Senha recebida:', senha)
    console.log('[authService] Hash salvo:', usuario.senhaHash)
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
    SECRET_KEY,
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
