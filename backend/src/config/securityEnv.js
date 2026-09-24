'use strict';

/**
 * Runtime secret / API-key access for Investiga+.
 * Never logs secret values. Never returns hardcoded crypto fallbacks.
 */

const JWT_MIN_LENGTH = 16;

/** Known insecure defaults that must never be accepted. */
const REJECTED_JWT_VALUES = new Set([
  ['chave', 'secreta', 'dev'].join('-'),
  'secret',
  'changeme',
  'password',
]);

class ConfigError extends Error {
  /**
   * @param {string} message Safe, non-secret message
   * @param {{ code?: string, status?: number }} [opts]
   */
  constructor(message, opts = {}) {
    super(message);
    this.name = 'ConfigError';
    this.code = opts.code || 'CONFIG_ERROR';
    this.status = opts.status || 503;
  }
}

/**
 * CORE_REQUIRED — JWT signing/verification must never use a default secret.
 * @returns {string}
 */
function getJwtSecret() {
  const raw = process.env.JWT_SECRET;
  if (raw === undefined || raw === null) {
    throw new ConfigError('JWT_SECRET is not configured', {
      code: 'JWT_SECRET_MISSING',
      status: 500,
    });
  }

  const secret = String(raw).trim();
  if (!secret) {
    throw new ConfigError('JWT_SECRET is not configured', {
      code: 'JWT_SECRET_MISSING',
      status: 500,
    });
  }

  if (secret.length < JWT_MIN_LENGTH) {
    throw new ConfigError('JWT_SECRET is invalid', {
      code: 'JWT_SECRET_INVALID',
      status: 500,
    });
  }

  if (REJECTED_JWT_VALUES.has(secret)) {
    throw new ConfigError('JWT_SECRET is invalid', {
      code: 'JWT_SECRET_INSECURE',
      status: 500,
    });
  }

  return secret;
}

/**
 * FEATURE_REQUIRED — provider / email keys.
 * @param {string} name
 * @returns {string}
 */
function getRequiredEnv(name) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || !String(raw).trim()) {
    throw new ConfigError(`${name} is not configured`, {
      code: 'FEATURE_CONFIG_MISSING',
      status: 503,
    });
  }
  return String(raw).trim();
}

function getIpqsApiKey() {
  return getRequiredEnv('IPQS_API_KEY');
}

function getAbstractApiKey() {
  return getRequiredEnv('ABSTRACT_API_KEY');
}

function getSafeBrowsingApiKey() {
  return getRequiredEnv('SAFE_BROWSING_API_KEY');
}

/**
 * Resend is FEATURE_REQUIRED in production.
 * @returns {{ apiKey: string, from: string }}
 */
function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !String(apiKey).trim() || !from || !String(from).trim()) {
    throw new ConfigError('Email service is not configured', {
      code: 'RESEND_CONFIG_MISSING',
      status: 503,
    });
  }
  return {
    apiKey: String(apiKey).trim(),
    from: String(from).trim(),
  };
}

/**
 * Fail-fast for process boot in production (CORE only).
 */
function assertCoreSecretsForProduction() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  getJwtSecret();
}

module.exports = {
  ConfigError,
  JWT_MIN_LENGTH,
  getJwtSecret,
  getRequiredEnv,
  getIpqsApiKey,
  getAbstractApiKey,
  getSafeBrowsingApiKey,
  getResendConfig,
  assertCoreSecretsForProduction,
};
