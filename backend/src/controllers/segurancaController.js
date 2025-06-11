const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { sendSuccess, sendError } = require('../../../shared/utils/sendResponse')
const { calcularRiscoIPQS } = require('../../../shared/riskCalculators/ipqsRisk')

const IPQS_API_KEY = process.env.IPQS_API_KEY
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY
const SAFE_BROWSING_API_KEY = process.env.SAFE_BROWSING_API_KEY

/**
 * Verifica IP Reputation com IPQualityScore
 */
exports.ipCheck = async (req, res) => {
    const { ip } = req.query
    const { usuarioId } = req.user

    if (!ip) {
        return sendError(res, 400, 'IP não fornecido.')
    }

    try {
        const resp = await axios.get(`https://ipqualityscore.com/api/json/ip/${IPQS_API_KEY}/${ip}`, {
            timeout: 5000,
            params: {
                strictness: 1,
                allow_public_access_points: true,
                fast: true,
                lighter_penalties: true,
            },
        })

        const data = resp.data

        const { risk_level, risk_recommendation } = calcularRiscoIPQS(data)

        // Grava log de sucesso
        await prisma.consultaRisco.create({
            data: {
                usuarioId,
                tipo: 'ip_check',
                parametro: ip,
                status: 'success',
                resultado: data,
            },
        })

        return sendSuccess(
            res,
            {
                ip: data.ip_address,
                fraud_score: data.fraud_score,
                proxy: data.proxy,
                vpn: data.vpn,
                tor: data.tor,
                hosting: data.hosting,
                connection_type: data.connection_type,
                abuse_velocity: data.abuse_velocity,
                bot_status: data.bot_status,
                isp: data.ISP,
                organization: data.organization,
                country_code: data.country_code,
                country_name: data.country_name,
                region: data.region,
                city: data.city,
                timezone: data.timezone,
                latitude: data.latitude,
                longitude: data.longitude,
                asn: data.ASN,
                active_vpn: data.active_vpn,
                active_tor: data.active_tor,
                recent_abuse: data.recent_abuse,
                is_crawler: data.is_crawler,
                is_bot: data.is_bot,
                is_relay: data.is_relay,
                is_mobile: data.is_mobile,
                is_hosting_provider: data.is_hosting_provider,
                operating_system: data.operating_system || null,
                browser: data.browser || null,
                fonte: 'IPQualityScore',
                risk_level,
                risk_recommendation,
            },
            'Reputação do IP verificada.'
        )
    } catch (err) {
        console.error(`[Seguranca] Erro ipCheck para IP ${ip}:`, err.response?.data || err)

        // Grava log de erro
        await prisma.consultaRisco.create({
            data: {
                usuarioId,
                tipo: 'ip_check',
                parametro: ip,
                status: 'error',
                resultado: err.response?.data || { message: err.message },
            },
        })

        return sendError(res, 500, 'Erro ao verificar reputação do IP.')
    }
}



/**
 * Verifica Email com AbstractAPI
 */
exports.emailVerify = async (req, res) => {
    const { email } = req.params
    const { usuarioId } = req.user

    if (!email) {
        return sendError(res, 400, 'Email não fornecido.')
    }

    try {
        const resp = await axios.get(`https://emailvalidation.abstractapi.com/v1/`, {
            timeout: 5000,
            params: {
                api_key: ABSTRACT_API_KEY,
                email,
            },
        })

        const data = resp.data

        // Grava log de sucesso
        await prisma.consultaRisco.create({
            data: {
                usuarioId,
                tipo: 'email_verify',
                parametro: email,
                status: 'success',
                resultado: data,
            },
        })

        return sendSuccess(
            res,
            {
                email: data.email,
                autocorrect: data.autocorrect,
                deliverability: data.deliverability,
                quality_score: data.quality_score,
                is_valid_format: data.is_valid_format?.value,
                is_free_email: data.is_free_email?.value,
                is_disposable_email: data.is_disposable_email?.value,
                is_role_email: data.is_role_email?.value,
                is_catchall_email: data.is_catchall_email?.value,
                is_mx_found: data.is_mx_found?.value,
                is_smtp_valid: data.is_smtp_valid?.value,
                smtp_response: data.smtp_response,
                mx_record: data.mx_record,
                domain: data.domain,
                source: data.source,
                suggested_correction: data.autocorrect,
                fonte: 'AbstractAPI',
            },
            'Validação de email concluída.'
        )
    } catch (err) {
        console.error(`[Seguranca] Erro emailVerify para ${email}:`, err.response?.data || err)

        // Grava log de erro
        await prisma.consultaRisco.create({
            data: {
                usuarioId,
                tipo: 'email_verify',
                parametro: email,
                status: 'error',
                resultado: err.response?.data || { message: err.message },
            },
        })

        return sendError(res, 500, 'Erro ao validar o email.')
    }
}


/**
 * Verifica URL com Google Safe Browsing API
 */
exports.safeBrowsingCheck = async (req, res) => {
    const { url } = req.query
    const { usuarioId } = req.user  // ✅ pega o usuarioId certinho

    if (!url) {
        return sendError(res, 400, 'URL não fornecida.')
    }

    if (!usuarioId) {
        console.warn('[Seguranca] usuarioId não definido no token → não será gravado log.')
    }

    try {
        const resp = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`,
            {
                client: {
                    clientId: 'investiga-mais',
                    clientVersion: '1.0'
                },
                threatInfo: {
                    threatTypes: [
                        'MALWARE',
                        'SOCIAL_ENGINEERING',
                        'UNWANTED_SOFTWARE',
                        'POTENTIALLY_HARMFUL_APPLICATION'
                    ],
                    platformTypes: ['ANY_PLATFORM'],
                    threatEntryTypes: ['URL'],
                    threatEntries: [{ url }]
                }
            },
            {
                timeout: 5000
            }
        )

        const data = resp.data

        // Grava log de sucesso ✅
        await prisma.consultaRisco.create({
            data: {
                usuarioId: usuarioId ?? 1,
                tipo: 'safe_browsing',
                parametro: url,
                status: 'success',
                resultado: data,
            },
        })

        return sendSuccess(
            res,
            {
                url,
                threat_found: data.matches && data.matches.length > 0,
                matches: data.matches || [],
                fonte: 'Google Safe Browsing'
            },
            'Verificação de segurança da URL concluída.'
        )
    } catch (err) {
        console.error(`[Seguranca] Erro safeBrowsingCheck para URL ${url}:`, err.response?.data || err)

        // Grava log de erro ✅
        await prisma.consultaRisco.create({
            data: {
                usuarioId,
                tipo: 'safe_browsing',
                parametro: url,
                status: 'error',
                resultado: err.response?.data || { message: err.message },
            },
        })

        return sendError(res, 500, 'Erro ao verificar segurança da URL.')
    }
}
