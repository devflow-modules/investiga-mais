const jwt = require('jsonwebtoken')
const { sendError } = require('../../../shared/utils/sendResponse')

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev'

function verifyToken(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    console.warn('[verifyToken] Token não fornecido')
    return sendError(res, 401, 'Token não fornecido')
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)

    // Validação extra
    if (!decoded.id) {
      console.warn('[verifyToken] Token inválido: usuarioId ausente', decoded)
      return sendError(res, 403, 'Token inválido (usuário não identificado)')
    }

    // Padroniza req.user
    req.user = {
      usuarioId: decoded.id,
      cpf: decoded.cpf || null,
      email: decoded.email || null,
      nome: decoded.nome || null,
      role: decoded.role || 'cliente'  // garante fallback
    }

    console.log('[verifyToken] Token OK → usuarioId:', req.user.usuarioId, '| role:', req.user.role)
    next()
  } catch (err) {
    console.error('[verifyToken] Token inválido:', err.message)
    return sendError(res, 403, 'Token inválido')
  }
}

module.exports = verifyToken
