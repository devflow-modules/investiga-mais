const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma')
const crypto = require('crypto');
const { validarEmail, validarCPF } = require('../../../shared/validators/backend')
const { enviarEmail } = require('../services/email');

exports.registrarViaCompra = async (req, res, next) => {
  try {
    const { event, customer } = req.body;
    const email = customer?.email?.toLowerCase();
    const cpf = customer?.document;

    console.log(`✅ Webhook recebido para email: ${email?.substring(0, 3)}***@***`);

    if (event !== 'SALE_APPROVED' || !email || !cpf) {
      return res.status(400).json({ erro: 'Evento inválido ou dados ausentes' });
    }

    if (!validarEmail(email) || !validarCPF(cpf)) {
      return res.status(400).json({ erro: 'Email ou CPF em formato inválido.' });
    }

    const existente = await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { cpf }]
      }
    });

    if (existente) {
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário já cadastrado'
      });
    }

    const senhaGerada = crypto.randomBytes(4).toString('hex');
    const senhaCriptografada = await bcrypt.hash(senhaGerada, 10);

    await prisma.usuario.create({
      data: {
        email,
        senha: senhaCriptografada,
        cpf,
        nome: customer?.name || undefined,
        telefone: customer?.phone_number || undefined,
      }
    })

    const html = `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 8px; color: #111827;">
        <h2 style="color: #1e3a8a; text-align: center;">🎉 Bem-vindo ao Investiga+</h2>
        <p style="font-size: 16px; margin-top: 24px;">
          Sua conta foi ativada com sucesso! Utilize os dados abaixo para acessar a plataforma:
        </p>
        <div style="background-color: #ffffff; padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Senha:</strong> ${senhaGerada}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:3001/login" style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
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
      await enviarEmail(email, 'Acesso à Plataforma Investiga+', html);
    } else {
      console.log(`📧 [DEV] Simulando envio de e-mail para ${email} com senha: ${senhaGerada}`);
    }

    return res.status(201).json({ sucesso: true, mensagem: 'Usuário registrado e e-mail enviado' });
  } catch (err) {
    next(err);
  }
};