const { randomBytes } = require('crypto');
const { hash } = require('bcryptjs');
const prisma = require('../lib/prisma.js');
const enviarEmail = require('./emailService.js');
const erroComStatus = require('../utils/erroComStatus.js');

async function gerarTokenRecuperacao(email) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    throw erroComStatus(404, 'Email não encontrado.');
  }

  // Remove tokens antigos
  await prisma.tokenRecuperacao.deleteMany({
    where: { usuarioId: usuario.id }
  });

  const token = randomBytes(32).toString('hex');
  const expiracao = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await prisma.tokenRecuperacao.create({
    data: {
      token,
      usuarioId: usuario.id,
      expiracao
    }
  });

  const link = `http://localhost:3001/redefinir-senha?token=${token}`;

  const html = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 8px; color: #111827;">
      <h2 style="color: #1e3a8a;">🔐 Recuperação de Senha - Investiga+</h2>
      <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
      <div style="margin: 20px 0;">
        <a href="${link}" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Redefinir Senha</a>
      </div>
      <p>Se você não solicitou essa alteração, apenas ignore este e-mail.</p>
      <p style="font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.</p>
    </div>
  `;

  if (process.env.NODE_ENV === 'production') {
    await enviarEmail(email, 'Redefinição de Senha - Investiga+', html);
  } else {
    console.log(`🔐 [DEV] Link de recuperação: ${link}`);
  }

  return { sucesso: true };
}

async function redefinirSenha(token, novaSenhaHash) {
  const registro = await prisma.tokenRecuperacao.findUnique({ where: { token } });

  if (!registro || new Date() > registro.expiracao) {
    throw erroComStatus(400, 'Token inválido ou expirado.');
  }

  await prisma.usuario.update({
    where: { id: registro.usuarioId },
    data: { senhaHash: novaSenhaHash }
  });

  await prisma.tokenRecuperacao.delete({ where: { token } });

  return { sucesso: true };
}

module.exports = {
  gerarTokenRecuperacao,
  redefinirSenha
};
