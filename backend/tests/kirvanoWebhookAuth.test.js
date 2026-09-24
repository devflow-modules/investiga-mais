'use strict';

const { timingSafeEqualString, verificarKirvanoWebhookSecret } = require('../src/middleware/kirvanoWebhookAuth');

describe('kirvanoWebhookAuth', () => {
  const originalSecret = process.env.KIRVANO_WEBHOOK_SECRET;
  const originalAllow = process.env.ALLOW_UNAUTHENTICATED_WEBHOOK;

  afterEach(() => {
    process.env.KIRVANO_WEBHOOK_SECRET = originalSecret;
    process.env.ALLOW_UNAUTHENTICATED_WEBHOOK = originalAllow;
  });

  test('timingSafeEqualString matches equal secrets', () => {
    expect(timingSafeEqualString('abc', 'abc')).toBe(true);
    expect(timingSafeEqualString('abc', 'abd')).toBe(false);
    expect(timingSafeEqualString('abc', 'ab')).toBe(false);
  });

  test('fail-closed when secret is not configured', () => {
    delete process.env.KIRVANO_WEBHOOK_SECRET;
    delete process.env.ALLOW_UNAUTHENTICATED_WEBHOOK;

    const req = { get: () => 'anything' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      req: { originalUrl: '/api/webhook/compra-confirmada' }
    };
    const next = jest.fn();

    verificarKirvanoWebhookSecret(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
  });
});
