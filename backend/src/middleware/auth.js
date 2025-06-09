const jwt = require('jsonwebtoken')
const { sendError } = require('../../../shared/utils/sendResponse')
const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev'

function verifyToken(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return sendError(res, 401, 'Token não fornecido')
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    return sendError(res, 403, 'Token inválido')
  }
}

module.exports = verifyToken
