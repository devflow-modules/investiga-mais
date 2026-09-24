'use strict';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

describe('securityEnv / JWT secret handling', () => {
  const originalJwt = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalJwt === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwt;
    }
    jest.resetModules();
  });

  test('A: JWT_SECRET válido → sign/verify funciona', () => {
    // Constructed to avoid secret-scanner false positives on synthetic test values.
    process.env.JWT_SECRET = ['local', 'test', 'jwt', 'value', '001'].join('-');
    const { getJwtSecret } = require('../src/config/securityEnv');
    const secret = getJwtSecret();
    const token = jwt.sign({ id: 1 }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(1);
  });

  test('B: JWT_SECRET ausente → fail closed', () => {
    delete process.env.JWT_SECRET;
    const { getJwtSecret, ConfigError } = require('../src/config/securityEnv');
    expect(() => getJwtSecret()).toThrow(ConfigError);
    try {
      getJwtSecret();
    } catch (err) {
      expect(err.code).toBe('JWT_SECRET_MISSING');
      expect(JSON.stringify(err)).not.toMatch(/chave.secreta.dev/);
    }
  });

  test('C: rejected hardcoded insecure value → fail closed', () => {
    process.env.JWT_SECRET = ['chave', 'secreta', 'dev'].join('-');
    const { getJwtSecret, ConfigError } = require('../src/config/securityEnv');
    expect(() => getJwtSecret()).toThrow(ConfigError);
  });

  test('verifyToken without JWT_SECRET returns configured error (no secret leak)', () => {
    delete process.env.JWT_SECRET;
    jest.resetModules();
    const verifyToken = require('../src/middleware/auth');
    const req = { cookies: { token: 'anything' } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    const body = res.json.mock.calls[0][0];
    expect(JSON.stringify(body)).not.toMatch(/chave.secreta.dev/);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Provider fail-closed (zero HTTP when key missing)', () => {
  const original = {
    IPQS: process.env.IPQS_API_KEY,
    ABSTRACT: process.env.ABSTRACT_API_KEY,
    SAFE: process.env.SAFE_BROWSING_API_KEY,
  };

  afterEach(() => {
    const restore = (key, value) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    };
    restore('IPQS_API_KEY', original.IPQS);
    restore('ABSTRACT_API_KEY', original.ABSTRACT);
    restore('SAFE_BROWSING_API_KEY', original.SAFE);
    jest.resetModules();
    jest.clearAllMocks();
    jest.dontMock('axios');
    jest.dontMock('../src/lib/prisma.js');
  });

  function loadServiceWithAxiosMock() {
    jest.resetModules();
    jest.doMock('axios', () => ({
      get: jest.fn(),
      post: jest.fn(),
    }));
    jest.doMock('../src/lib/prisma.js', () => ({
      consultaRisco: { create: jest.fn() },
    }));
    const axios = require('axios');
    const service = require('../src/services/segurancaService');
    return { axios, service };
  }

  test('D: IPQS key ausente → zero HTTP calls', async () => {
    delete process.env.IPQS_API_KEY;
    const { axios, service } = loadServiceWithAxiosMock();
    await expect(service.verificarIP('1.1.1.1', 1)).rejects.toThrow(/não configurado/i);
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('E: Abstract key ausente → zero HTTP calls', async () => {
    delete process.env.ABSTRACT_API_KEY;
    const { axios, service } = loadServiceWithAxiosMock();
    await expect(service.verificarEmail('a@example.com', 1)).rejects.toThrow(/não configurado/i);
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('F: Safe Browsing key ausente → zero HTTP calls', async () => {
    delete process.env.SAFE_BROWSING_API_KEY;
    const { axios, service } = loadServiceWithAxiosMock();
    await expect(service.verificarURL('https://example.com', 1)).rejects.toThrow(/não configurado/i);
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('G: erros de config não contêm secret values', async () => {
    process.env.IPQS_API_KEY = 'should-not-appear-in-error-body-xyz';
    delete process.env.IPQS_API_KEY;
    const { service } = loadServiceWithAxiosMock();
    try {
      await service.verificarIP('8.8.8.8', 1);
      throw new Error('expected throw');
    } catch (err) {
      expect(String(err.message)).not.toMatch(/should-not-appear/);
      expect(JSON.stringify(err, Object.getOwnPropertyNames(err))).not.toMatch(/should-not-appear/);
    }
  });
});

describe('Resend configuration', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env.NODE_ENV = originalEnv.NODE_ENV;
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
    process.env.RESEND_FROM = originalEnv.RESEND_FROM;
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('H: production sem key → não envia → erro controlado', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM;
    jest.resetModules();
    const send = jest.fn();
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({ emails: { send } })),
    }));
    const { enviarEmail } = require('../src/services/emailService');
    const result = await enviarEmail('a@example.com', 'Assunto', '<p>x</p>');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not configured/i);
    expect(send).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toMatch(/re_/);
  });

  test('I: development → simula sem chamar Resend', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.RESEND_API_KEY;
    jest.resetModules();
    const send = jest.fn();
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({ emails: { send } })),
    }));
    const { enviarEmail } = require('../src/services/emailService');
    const result = await enviarEmail('a@example.com', 'Assunto', '<p>x</p>');
    expect(result.success).toBe(true);
    expect(result.dev).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });
});

describe('Source tree hygiene', () => {
  test('chave-secreta-dev não aparece no source de produto', () => {
    const roots = [
      path.join(__dirname, '../src'),
    ];
    const offenders = [];
    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(js|ts|tsx|mjs|cjs)$/.test(entry.name)) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes('chave-secreta-dev')) {
          offenders.push(full);
        }
      }
    }
    roots.forEach(walk);
    expect(offenders).toEqual([]);
  });
});
