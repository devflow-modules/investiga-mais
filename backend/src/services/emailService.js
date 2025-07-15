const { Resend } = require('resend');

/**
 * Envia um e-mail utilizando o serviço Resend.
 *
 * @param {string|string[]} to - Endereço(s) de e-mail do destinatário.
 * @param {string} subject - Assunto do e-mail.
 * @param {string} html - Conteúdo HTML do e-mail.
 * @returns {Promise<{ success: boolean, message: string, data?: any, error?: string, dev?: boolean }>}
 */
async function enviarEmail(to, subject, html) {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    console.log(`📧 [DEV] Simulando envio de e-mail para ${to} com assunto: ${subject}`);
    return {
      success: true,
      dev: true,
      message: 'E-mail simulado (modo desenvolvimento)',
      data: { to, subject }
    };
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error('[emailService] Variáveis de ambiente ausentes: RESEND_API_KEY ou RESEND_FROM');
    return {
      success: false,
      message: 'Configuração de e-mail incompleta',
      error: 'Variáveis de ambiente ausentes'
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject,
      html
    });

    if (error) {
      console.error('[emailService] Erro da API Resend:', error);
      return {
        success: false,
        message: 'Erro ao enviar e-mail',
        error: error.message || 'Erro desconhecido da API'
      };
    }

    return {
      success: true,
      message: 'E-mail enviado com sucesso',
      data: { id: data.id }
    };
  } catch (err) {
    console.error('[emailService] Erro inesperado:', err);
    return {
      success: false,
      message: 'Erro inesperado ao enviar e-mail',
      error: err.message || 'Erro desconhecido'
    };
  }
}

module.exports = {
  enviarEmail
};
