const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validarEmail, validarSenha } = require('../utils/validacoes');

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev';

exports.login = async (req, res, next) => {
  let { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  }

  if (!validarEmail(email) || !validarSenha(senha)) {
    return res.status(400).json({ erro: 'Formato de e-mail ou senha inválido.' });
  }

  email = email.toLowerCase();

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: 'CREDENCIAIS_INVALIDAS' });
    }

    const token = jwt.sign(
      { usuarioId: usuario.id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    // 🔐 Define o token como cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 👈 deve estar false em desenvolvimento
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    })


    return res.json({
      sucesso: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax;')
  return res.redirect('/login')
};
