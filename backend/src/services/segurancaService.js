const axios = require('axios');
const prisma = require('../lib/prisma.js');
const { calcularRiscoIPQS } = require('../utils/ipqsRisk.js');
const {
  getIpqsApiKey,
  getAbstractApiKey,
  getSafeBrowsingApiKey,
  ConfigError,
} = require('../config/securityEnv.js');

async function verificarIP(ip, usuarioId) {
  let apiKey;
  try {
    apiKey = getIpqsApiKey();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[Seguranca] IPQS_API_KEY is not configured — skipping provider call');
      throw new Error('Serviço de verificação de IP não configurado.');
    }
    throw err;
  }

  try {
    const resp = await axios.get(`https://ipqualityscore.com/api/json/ip/${apiKey}/${ip}`, {
      timeout: 5000,
      params: {
        strictness: 1,
        allow_public_access_points: true,
        fast: true,
        lighter_penalties: true
      }
    });

    const data = resp.data;
    const { risk_level, risk_recommendation } = calcularRiscoIPQS(data);

    await prisma.consultaRisco.create({
      data: {
        usuarioId,
        tipo: 'ip_check',
        parametro: ip,
        status: 'success',
        resultado: data
      }
    });

    return { data, risk_level, risk_recommendation };
  } catch (err) {
    console.error(`[Seguranca] Erro ipCheck para IP ${ip}:`, err.response?.data || err.message || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId: usuarioId ?? 1,
        tipo: 'ip_check',
        parametro: ip,
        status: 'error',
        resultado: { message: err.message || 'Erro desconhecido' }
      }
    });

    throw new Error('Erro ao verificar reputação do IP.');
  }
}


async function verificarEmail(email, usuarioId) {
  let apiKey;
  try {
    apiKey = getAbstractApiKey();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[Seguranca] ABSTRACT_API_KEY is not configured — skipping provider call');
      throw new Error('Serviço de verificação de email não configurado.');
    }
    throw err;
  }

  try {
    const resp = await axios.get(`https://emailvalidation.abstractapi.com/v1/`, {
      timeout: 5000,
      params: {
        api_key: apiKey,
        email
      }
    });

    const data = resp.data;

    await prisma.consultaRisco.create({
      data: {
        usuarioId,
        tipo: 'email_verify',
        parametro: email,
        status: 'success',
        resultado: data
      }
    });

    return data;
  } catch (err) {
    console.error(`[Seguranca] Erro emailVerify para ${email}:`, err.response?.data || err.message || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId: usuarioId ?? 1,
        tipo: 'email_verify',
        parametro: email,
        status: 'error',
        resultado: { message: err.message || 'Erro desconhecido' }
      }
    });

    throw new Error('Erro ao validar o email.');
  }
}


async function verificarURL(url, usuarioId = null) {
  let apiKey;
  try {
    apiKey = getSafeBrowsingApiKey();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[Seguranca] SAFE_BROWSING_API_KEY is not configured — skipping provider call');
      throw new Error('Serviço de verificação de URL não configurado.');
    }
    throw err;
  }

  try {
    const resp = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: { clientId: 'investiga-mais', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }]
        }
      },
      { timeout: 5000 }
    );

    const data = resp.data;

    await prisma.consultaRisco.create({
      data: {
        usuarioId: usuarioId ?? 1,
        tipo: 'safe_browsing',
        parametro: url,
        status: 'success',
        resultado: data
      }
    });

    return data;
  } catch (err) {
    console.error(`[Seguranca] Erro safeBrowsingCheck para URL ${url}:`, err.response?.data || err.message || err);

    await prisma.consultaRisco.create({
      data: {
        usuarioId: usuarioId ?? 1,
        tipo: 'safe_browsing',
        parametro: url,
        status: 'error',
        resultado: { message: err.message || 'Erro desconhecido' }
      }
    });

    throw new Error('Erro ao verificar segurança da URL.');
  }
}


module.exports = {
  verificarIP,
  verificarEmail,
  verificarURL
};
