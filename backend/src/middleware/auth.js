const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou malformado' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido' });
  }
}

module.exports = verifyToken;
