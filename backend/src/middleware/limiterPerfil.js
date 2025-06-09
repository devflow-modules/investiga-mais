const rateLimit = {}

module.exports = (req, res, next) => {
  const usuarioId = req.user?.usuarioId
  if (!usuarioId) return next()

  const now = Date.now()
  const lastCall = rateLimit[usuarioId] || 0

  const delayMs = 2000 // 2 segundos entre chamadas

  if (now - lastCall < delayMs) {
    return res.status(429).json({ erro: 'Aguarde antes de tentar novamente' })
  }

  rateLimit[usuarioId] = now
  next()
}
