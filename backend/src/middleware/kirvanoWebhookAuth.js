'use strict';

const crypto = require('crypto');
const { sendError } = require('../utils/sendResponse.js');

const HEADER_NAME = 'x-webhook-secret';

function timingSafeEqualString(a, b) {
  const bufA = Buffer.from(String(a ?? ''), 'utf8');
  const bufB = Buffer.from(String(b ?? ''), 'utf8');

  if (bufA.length !== bufB.length) {
    // Constant-time-ish length mismatch: compare bufA to itself then fail.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Shared-secret authentication for Kirvano purchase webhook.
 *
 * No provider HMAC contract exists in this repository. Authentication is a
 * dedicated shared secret via header `X-Webhook-Secret`, configured with
 * env `KIRVANO_WEBHOOK_SECRET`.
 *
 * Fail-closed: if the secret is unset, requests are rejected unless
 * ALLOW_UNAUTHENTICATED_WEBHOOK=true (explicit local/test escape hatch only).
 */
function verificarKirvanoWebhookSecret(req, res, next) {
  const configuredSecret = process.env.KIRVANO_WEBHOOK_SECRET;
  const allowUnauthenticated = process.env.ALLOW_UNAUTHENTICATED_WEBHOOK === 'true';

  if (!configuredSecret) {
    if (allowUnauthenticated) {
      console.warn('[webhookAuth] ALLOW_UNAUTHENTICATED_WEBHOOK=true — auth bypass enabled');
      return next();
    }

    console.error('[webhookAuth] KIRVANO_WEBHOOK_SECRET is not configured — rejecting request');
    return sendError(res, 503, 'Webhook authentication is not configured.');
  }

  const provided = req.get(HEADER_NAME);

  if (!provided) {
    return sendError(res, 401, 'Webhook authentication required.');
  }

  if (!timingSafeEqualString(provided, configuredSecret)) {
    return sendError(res, 401, 'Invalid webhook credentials.');
  }

  return next();
}

module.exports = {
  verificarKirvanoWebhookSecret,
  timingSafeEqualString,
  HEADER_NAME
};
