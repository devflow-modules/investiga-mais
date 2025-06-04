const { Resend } = require('resend');

async function enviarEmail(to, assunto, conteudoHtml) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject: assunto,
      html: conteudoHtml,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, id: data?.id };
  } catch (e) {
    console.error('Erro inesperado ao enviar email:', e);
    return { sucesso: false, erro: 'Erro inesperado' };
  }
}

module.exports = { enviarEmail };
