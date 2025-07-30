const { hash } = require('bcryptjs');
const prisma = require('../lib/prisma.js');
const { randomBytes } = require('crypto');
const { validarEmail, validarCPF } = require('../../../shared/validators/backend.js');
const { enviarEmail } = require('./emailService');

async function registrarUsuarioViaCompra(payload) {
  const { event, customer } = payload;
  const email = customer?.email?.toLowerCase();
  const cpf = customer?.document;

  const emailMascarado = email ? `${email.substring(0, 3)}***@***` : '[email indefinido]';
  console.log(`✅ Webhook recebido para email: ${emailMascarado}`);

  if (event !== 'SALE_APPROVED' || !email || !cpf) {
    return {
      status: 400,
      data: { erro: 'Evento inválido ou dados ausentes' }
    };
  }

  if (!validarEmail(email) || !validarCPF(cpf)) {
    return {
      status: 400,
      data: { erro: 'Email ou CPF em formato inválido.' }
    };
  }

  const existente = await prisma.usuario.findFirst({
    where: {
      OR: [{ email }, { cpf }]
    }
  });

  if (existente) {
    return {
      status: 200,
      data: {
        sucesso: true,
        mensagem: 'Usuário já cadastrado'
      }
    };
  }

  const senhaGerada = randomBytes(4).toString('hex');
  const senhaCriptografada = await hash(senhaGerada, 10);

  await prisma.usuario.create({
    data: {
      email,
      senhaHash: senhaCriptografada,
      cpf,
      nome: customer?.name || undefined,
      telefone: customer?.phone_number || undefined
    }
  });

  const html = `
  <div style="max-width: 600px; margin: auto; font-family: 'Inter', sans-serif; background-color: #F9FAFB; padding: 30px; border-radius: 16px; color: #111827;">
    <h2 style="color: #1E40AF; text-align: center; margin-bottom: 24px;">🎉 Bem-vindo ao Investiga+</h2>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Sua conta foi ativada com sucesso! Utilize os dados abaixo para acessar a plataforma:
    </p>

    <div style="background-color: #FFFFFF; padding: 16px 20px; border: 1px solid #E5E7EB; border-radius: 12px; margin: 20px 0; font-size: 15px;">
      <p style="margin-bottom: 12px;">
        <strong style="color: #1E40AF;">Email:</strong>
        <span style="background-color: #F3F4F6; padding: 6px 12px; border-radius: 6px; font-family: monospace; display: inline-block; margin-left: 8px;">
          ${email}
        </span>
      </p>
      <p>
        <strong style="color: #1E40AF;">Senha:</strong>
        <span style="background-color: #F3F4F6; padding: 6px 12px; border-radius: 6px; font-family: monospace; display: inline-block; margin-left: 8px;">
          ${senhaGerada}
        </span>
      </p>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="https://investigamais.com/login" style="display: inline-block; padding: 12px 24px; background-color: #1E40AF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Acessar Plataforma
      </a>
    </div>

    <p style="font-size: 14px; color: #6B7280; margin-top: 30px; text-align: center;">
      Por segurança, recomendamos alterar sua senha após o primeiro acesso.
    </p>

    <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Investiga+. Todos os direitos reservados.
    </p>
  </div>
`


  if (process.env.NODE_ENV === 'production') {
    await enviarEmail(email, 'Acesso à Plataforma Investiga+', html);
  } else {
    console.log(`📧 [DEV] Simulando envio de e-mail para ${email} com senha: ${senhaGerada}`);
  }

  return {
    status: 201,
    data: {
      sucesso: true,
      mensagem: 'Usuário registrado e e-mail enviado'
    }
  };
}

module.exports = { registrarUsuarioViaCompra };
