function verifyToken(req, res, next) {
  const jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev';

  const token = req.cookies?.token;

  if (!token) {
    console.warn('[verifyToken] Token não fornecido');
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido',
      statusCode: 401
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded.id) {
      console.warn('[verifyToken] Token inválido: usuarioId ausente', decoded);
      return res.status(403).json({
        success: false,
        message: 'Token inválido (usuário não identificado)',
        statusCode: 403
      });
    }

    req.user = {
      id: decoded.id,
      cpf: decoded.cpf || null,
      email: decoded.email || null,
      nome: decoded.nome || null,
      role: decoded.role || 'cliente'
    };

    console.log('[verifyToken] Token OK → usuarioId:', req.user.id, '| role:', req.user.role);
    next();
  } catch (err) {
    console.error('[verifyToken] Token inválido:', err.message);
    return res.status(403).json({
      success: false,
      message: 'Token inválido',
      statusCode: 403
    });
  }
}


module.exports = verifyToken;