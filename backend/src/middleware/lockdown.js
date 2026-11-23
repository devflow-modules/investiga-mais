const { sendError } = require('../utils/sendResponse.js');

function parseFlag(raw) {
  const value = String(raw || '').trim().toLowerCase();
  if (!value) return null;
  if (['1', 'true', 'yes', 'on'].includes(value)) return true;
  if (['0', 'false', 'no', 'off'].includes(value)) return false;
  return null;
}

/**
 * Hard kill-switch for production incidents (LGPD / unauthorized data exposure).
 *
 * Priority:
 * 1. Explicit LOCKDOWN_MODE env (true/false)
 * 2. Default ON when NODE_ENV=production
 * 3. Otherwise OFF (local/test)
 */
function isLockdownEnabled() {
  const explicit = parseFlag(process.env.LOCKDOWN_MODE);
  if (explicit !== null) return explicit;
  return process.env.NODE_ENV === 'production';
}

/**
 * When lockdown is enabled, all API traffic is rejected with 503
 * except an explicit health probe registered before this middleware.
 */
function lockdownMiddleware(req, res, next) {
  if (!isLockdownEnabled()) {
    return next();
  }

  if (req.method === 'GET' && (req.path === '/health' || req.path === '/api/health')) {
    return res.status(200).json({
      status: 'lockdown',
      message: 'Service temporarily unavailable.',
    });
  }

  return sendError(
    res,
    503,
    'Serviço temporariamente indisponível. Consultas e autenticação estão suspensas.'
  );
}

module.exports = {
  isLockdownEnabled,
  lockdownMiddleware,
};
