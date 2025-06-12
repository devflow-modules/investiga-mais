exports.sendSuccess = (res, data = {}, message = 'Operação realizada com sucesso.') => {
  const statusCode = 200

  const responsePayload = {
    success: true,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    data
  }

  return res.status(statusCode).json(responsePayload)
}

exports.sendError = (res, statusCode = 500, message = 'Erro interno', extra = {}) => {
  const responsePayload = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    error: message, // ou simplesmente: error: true
    ...extra
  }

  return res.status(statusCode).json(responsePayload)
}
