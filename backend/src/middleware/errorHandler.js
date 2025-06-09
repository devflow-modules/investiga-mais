module.exports = (err, req, res, next) => {
  console.error(process.env.NODE_ENV === 'production' ? 'Erro interno' : err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
};