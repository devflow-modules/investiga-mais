const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { validarEmail, validarSenha } = require('../../../shared/validators/backend')
const { sendSuccess, sendError } = require('../utils/sendResponse')

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev'

exports.login = async (req, res, next) => {
  let { email, senha } = req.body

  if (!email || !senha) {
    return sendError(res, 400, 'Email e senha obrigatórios.')
  }

  if (!validarEmail(email) || !validarSenha(senha)) {
    return sendError(res, 400, 'Formato de e-mail ou senha inválido.')
  }

  email = email.toLowerCase()

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      return sendError(res, 401, 'CREDENCIAIS_INVALIDAS')
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

    // 🔐 Define o token como cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 👈 deve estar false em desenvolvimento
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    })

    return sendSuccess(res, {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
      }
    }, 'Login realizado com sucesso.')
  } catch (err) {
    console.error('Erro no login:', err)
    return sendError(res, 500, 'Erro interno no login.')
  }
}

exports.logout = (req, res) => {
  // Invalida o cookie do token
  res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax;')

  // Retorna sucesso com mensagem
  return sendSuccess(res, {}, 'Logout realizado com sucesso.')
}
