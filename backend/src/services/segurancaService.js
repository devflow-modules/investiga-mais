const axios = require('axios');
const prisma = require('../lib/prisma.js');
const { calcularRiscoIPQS } = require('../utils/ipqsRisk.js');

const IPQS_API_KEY = process.env.IPQS_API_KEY;
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;
const SAFE_BROWSING_API_KEY = process.env.SAFE_BROWSING_API_KEY;

async function verificarIP(ip, usuarioId) {
  try {
    const resp = await axios.get(`https://ipqualityscore.com/api/json/ip/${IPQS_API_KEY}/${ip}`, {
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
        usuarioId: usuarioId ?? 1, // fallback se quiser forçar testes
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
  try {
    const resp = await axios.get(`https://emailvalidation.abstractapi.com/v1/`, {
      timeout: 5000,
      params: {
        api_key: ABSTRACT_API_KEY,
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
  try {
    const resp = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`,
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
