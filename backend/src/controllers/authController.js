const { validarEmail, validarSenha } = require('../../../shared/validators/backend.js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');
const authService = require('../services/authService.js');

async function login(req, res) {
  let { email, senha } = req.body;

  if (!email || !senha) {
    return sendError(res, 400, 'Email e senha obrigatórios.');
  }

  if (!validarEmail(email) || !validarSenha(senha)) {
    return sendError(res, 400, 'Formato de e-mail ou senha inválido.');
  }

  email = email.toLowerCase();

  try {
    const { usuario, token } = await authService.autenticarUsuario(email, senha);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 24h
    });

    return sendSuccess(
      res,
      {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role
        }
      },
      'Login realizado com sucesso.'
    );
  } catch (err) {
    const status = err.message === 'CREDENCIAIS_INVALIDAS' ? 401 : 500;
    const mensagem = status === 401
      ? 'Credenciais inválidas.'
      : 'Erro interno no login.';

    console.error('[authController] Erro no login:', err);

    return sendError(res, status, mensagem, {
      error: err.message,
      stack: err.stack
    });
  }
}

function logout(req, res) {
  authService.invalidarTokenCookie(res);
  return sendSuccess(res, null, 'Logout realizado com sucesso.');
}

module.exports = {
  login,
  logout
};
