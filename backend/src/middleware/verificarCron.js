module.exports = function verificarCron(req, res, next) {
  const secret = req.headers['x-cron-secret'];

  if (secret !== process.env.CRON_SECRET) {
    console.warn('[verificarCron] Tentativa de acesso negada. Header inválido:', secret);
    return res.status(403).json({ success: false, message: 'Acesso negado ao CRON' });
  }

  console.log('[verificarCron] Acesso autorizado ao CRON');
  next();
};
