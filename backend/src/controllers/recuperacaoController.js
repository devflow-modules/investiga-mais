const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

exports.recuperarSenha = async (req, res) => {
  const { email } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    return res.status(404).json({ erro: 'Email não encontrado' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiracao = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await prisma.tokenRecuperacao.create({
    data: {
      token,
      usuarioId: usuario.id,
      expiracao
    }
  });

  // 🔁 Aqui você envia o link via email
  const link = `http://localhost:3000/redefinir-senha?token=${token}`

  console.log(`🔐 Link de recuperação: ${link}`);

  return res.json({ sucesso: true, mensagem: 'Link enviado com sucesso' });
};

exports.resetarSenha = async (req, res) => {
  const { token, novaSenha } = req.body;

  const registro = await prisma.tokenRecuperacao.findUnique({ where: { token } });

  if (!registro || new Date() > registro.expiracao) {
    return res.status(400).json({ erro: 'Token inválido ou expirado' });
  }

  const bcrypt = require('bcryptjs');
  const senhaHash = await bcrypt.hash(novaSenha, 10);

  await prisma.usuario.update({
    where: { id: registro.usuarioId },
    data: { senha: senhaHash }
  });

  await prisma.tokenRecuperacao.delete({ where: { token } });

  return res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso' });
};
