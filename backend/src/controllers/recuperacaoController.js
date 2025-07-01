const prisma = require('../lib/prisma')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validarEmail, validarSenha } = require('../../../shared/validators/backend')
const { enviarEmail } = require('../services/email');

exports.recuperarSenha = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'Email inválido.' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Email não encontrado' });
    }

    // ❗ Remove tokens antigos
    await prisma.tokenRecuperacao.deleteMany({
      where: { usuarioId: usuario.id }
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiracao = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.tokenRecuperacao.create({
      data: {
        token,
        usuarioId: usuario.id,
        expiracao
      }
    });

    const link = `http://localhost:3000/redefinir-senha?token=${token}`;

    const html = `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 8px; color: #111827;">
        <h2 style="color: #1e3a8a;">🔐 Recuperação de Senha - Investiga+</h2>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
        <div style="margin: 20px 0;">
          <a href="${link}" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Redefinir Senha</a>
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

    return res.json({ sucesso: true, mensagem: 'Link de recuperação enviado com sucesso' });
  } catch (err) {
    next(err);
  }
};

exports.resetarSenha = async (req, res, next) => {
  try {
    const { token, novaSenha } = req.body;

    if (!validarSenha(novaSenha)) {
      return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres e conter letras e números.' });
    }

    const registro = await prisma.tokenRecuperacao.findUnique({ where: { token } });

    if (!registro || new Date() > registro.expiracao) {
      return res.status(400).json({ erro: 'Token inválido ou expirado' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: registro.usuarioId },
      data: { senhaHash: senhaHash }
    });

    await prisma.tokenRecuperacao.delete({ where: { token } });

    return res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso' });
  } catch (err) {
    next(err);
  }
};
