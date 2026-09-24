const { Resend } = require('resend');
const { getResendConfig, ConfigError } = require('../config/securityEnv.js');

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

  let resendConfig;
  try {
    resendConfig = getResendConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[emailService] RESEND_API_KEY or RESEND_FROM missing — refusing production send');
      return {
        success: false,
        message: 'Configuração de e-mail incompleta',
        error: 'Email service is not configured'
      };
    }
    throw err;
  }

  const resend = new Resend(resendConfig.apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: resendConfig.from,
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
    console.error('[emailService] Erro inesperado:', err.message || 'unknown');
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
