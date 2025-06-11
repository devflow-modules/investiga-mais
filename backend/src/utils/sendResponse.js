exports.sendSuccess = (res, data = {}, message = 'Operação realizada com sucesso.') => {
  const responsePayload = {
    success: true,
    statusCode: res.statusCode || 200,
    message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    data
  }

  return res.status(responsePayload.statusCode).json(responsePayload)
}

exports.sendError = (res, statusCode = 500, message = 'Erro interno', extra = {}) => {
  const responsePayload = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    error: message,
    ...extra
  }

  return res.status(statusCode).json(responsePayload)
}
