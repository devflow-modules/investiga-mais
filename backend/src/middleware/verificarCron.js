module.exports = function verificarCron(req, res, next) {
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(403).json({ success: false, message: 'Acesso negado ao CRON' });
  }
  next();
};
