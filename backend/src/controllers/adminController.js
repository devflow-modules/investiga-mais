const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma')
const { validarEmail, validarCPF } = require('../../../shared/validators/backend');
const { enviarEmail } = require('../services/email');
const { sendSuccess, sendError } = require('../utils/sendResponse');

exports.registrarManual = async (req, res, next) => {
  try {
    const { email, cpf, nome, telefone } = req.body;

    if (!email || !cpf) {
      return sendError(res, 400, 'Email e CPF obrigatórios.');
    }

    const emailLower = email.toLowerCase();

    if (!validarEmail(emailLower) || !validarCPF(cpf)) {
      return sendError(res, 400, 'Email ou CPF em formato inválido.');
    }

    const existente = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: emailLower }, { cpf }]
      }
    });

    if (existente) {
      return sendError(res, 409, 'Usuário já cadastrado.');
    }

    const senhaGerada = crypto.randomBytes(4).toString('hex');
    const senhaCriptografada = await bcrypt.hash(senhaGerada, 10);

    await prisma.usuario.create({
      data: {
        email: emailLower,
        senhaHash: senhaCriptografada,
        cpf,
        nome: nome || undefined,
        telefone: telefone || undefined,
      }
    });

    const html = `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 8px; color: #111827;">
        <h2 style="color: #1e3a8a; text-align: center;">🎉 Bem-vindo ao Investiga+</h2>
        <p style="font-size: 16px; margin-top: 24px;">
          Sua conta foi ativada com sucesso! Utilize os dados abaixo para acessar a plataforma:
        </p>
        <div style="background-color: #ffffff; padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
          <p><strong>Email:</strong> ${emailLower}</p>
          <p><strong>Senha:</strong> ${senhaGerada}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://investigamais.com/login" style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Acessar Plataforma
          </a>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
          Por segurança, recomendamos alterar sua senha após o primeiro acesso.
        </p>
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
          © ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.
        </p>
      </div>
    `;

    if (process.env.NODE_ENV === 'production') {
      await enviarEmail(emailLower, 'Acesso à Plataforma Investiga+', html);
    } else {
      console.log(`📧 [DEV] Simulando envio de e-mail para ${emailLower} com senha: ${senhaGerada}`);
    }

    return sendSuccess(res, {
      sucesso: true,
      mensagem: 'Usuário registrado manualmente e e-mail enviado.'
    });
  } catch (err) {
    console.error('Erro registrarManual:', err);
    return sendError(res, 500, 'Erro interno ao registrar usuário manualmente.');
  }
};
