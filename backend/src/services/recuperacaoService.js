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
            <div style="max-width: 600px; margin: auto; font-family: 'Inter', sans-serif; background-color: #F9FAFB; padding: 30px; border-radius: 16px; color: #111827;">
              <h2 style="color: #1E40AF; margin-bottom: 20px;">🔐 Recuperação de Senha - Investiga+</h2>

              <p style="font-size: 16px; margin-bottom: 16px;">
                Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #1E40AF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Redefinir Senha
                </a>
              </div>

              <p style="font-size: 14px; color: #6B7280; margin-bottom: 24px;">
                Se você não solicitou essa alteração, apenas ignore este e-mail.
              </p>

              <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
                © ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.
              </p>
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
