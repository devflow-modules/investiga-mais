const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-dev';

exports.registrar = async (req, res) => {
  const { email, senha, cpf } = req.body;

  if (!email || !senha || !cpf) {
    return res.status(400).json({ erro: 'Email, senha e CPF obrigatórios.' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { email, senha: hash }
    });

    return res.status(201).json({ sucesso: true, usuario: novoUsuario.email });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ erro: 'Email já registrado.' });
    }
    return res.status(500).json({ erro: 'Erro ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ usuarioId: usuario.id, email: usuario.email }, SECRET_KEY, {
      expiresIn: '1d'
    });

    return res.json({ sucesso: true, token });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
};
