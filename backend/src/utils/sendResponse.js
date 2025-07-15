const isDev = process.env.NODE_ENV !== 'production';

function sendSuccess(res, data = {}, message = 'Operação realizada com sucesso.', statusCode = 200) {
  const responsePayload = {
    success: true,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    data
  };

  return res.status(statusCode).json(responsePayload);
}

function sendError(res, statusCode = 500, message = 'Erro interno', extra = {}) {
  const responsePayload = {
    success: false,
    statusCode,
    message,
    error: extra.error || message,
    timestamp: new Date().toISOString(),
    path: res?.req?.originalUrl || 'unknown',
    ...(isDev && extra.stack ? { stack: extra.stack } : {}),
    ...extra
  };

  return res.status(statusCode).json(responsePayload);
}

module.exports = {
  sendSuccess,
  sendError
};
