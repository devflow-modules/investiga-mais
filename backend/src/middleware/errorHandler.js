const { sendError } = require('../../../shared/utils/sendResponse')

module.exports = (err, req, res, next) => {
  console.error(process.env.NODE_ENV === 'production' ? 'Erro interno' : err)

  const message = err.message || 'Erro interno no servidor'

  return sendError(res, 500, message)
}
