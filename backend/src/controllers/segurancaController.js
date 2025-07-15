const { sendSuccess, sendError } = require('../utils/sendResponse.js');
const { verificarIP, verificarEmail, verificarURL } = require('../services/segurancaService.js');
const prisma = require('../lib/prisma.js');

async function ipCheck(req, res) {
  const { ip } = req.query;
  const { id: usuarioId } = req.user;

  if (!ip) return sendError(res, 400, 'IP não fornecido.');

  try {
    const { data, risk_level, risk_recommendation } = await verificarIP(ip, usuarioId);

    return sendSuccess(
      res,
      {
        ...data,
        ip: ip,
        fonte: 'IPQualityScore',
        risk_level,
        risk_recommendation
      },
      'Reputação do IP verificada.'
    );
  } catch (err) {
    console.error(`[Seguranca] Erro ipCheck para IP ${ip}:`, err.response?.data || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId,
        tipo: 'ip_check',
        parametro: ip,
        status: 'error',
        resultado: err.response?.data || { message: err.message }
      }
    });

    return sendError(res, 500, 'Erro ao verificar reputação do IP.');
  }
}

async function emailVerify(req, res) {
  const { email } = req.params;
  const { id: usuarioId } = req.user;

  if (!email) return sendError(res, 400, 'Email não fornecido.');

  try {
    const data = await verificarEmail(email, usuarioId);

    return sendSuccess(
      res,
      {
        ...data,
        suggested_correction: data.autocorrect,
        fonte: 'AbstractAPI'
      },
      'Validação de email concluída.'
    );
  } catch (err) {
    console.error(`[Seguranca] Erro emailVerify para ${email}:`, err.response?.data || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId,
        tipo: 'email_verify',
        parametro: email,
        status: 'error',
        resultado: err.response?.data || { message: err.message }
      }
    });

    return sendError(res, 500, 'Erro ao validar o email.');
  }
}

async function safeBrowsingCheck(req, res) {
  const { url } = req.query;
  const { id: usuarioId } = req.user;

  if (!url) return sendError(res, 400, 'URL não fornecida.');

  try {
    const data = await verificarURL(url, usuarioId);

    return sendSuccess(
      res,
      {
        url,
        threat_found: data.matches && data.matches.length > 0,
        matches: data.matches || [],
        fonte: 'Google Safe Browsing'
      },
      'Verificação de segurança da URL concluída.'
    );
  } catch (err) {
    console.error(`[Seguranca] Erro safeBrowsingCheck para URL ${url}:`, err.response?.data || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId,
        tipo: 'safe_browsing',
        parametro: url,
        status: 'error',
        resultado: err.response?.data || { message: err.message }
      }
    });

    return sendError(res, 500, 'Erro ao verificar segurança da URL.');
  }
}

module.exports = {
  ipCheck,
  emailVerify,
  safeBrowsingCheck
};
