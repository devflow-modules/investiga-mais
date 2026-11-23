const express = require('express');
const request = require('supertest');

describe('lockdownMiddleware', () => {
  const original = process.env.LOCKDOWN_MODE;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.LOCKDOWN_MODE;
    } else {
      process.env.LOCKDOWN_MODE = original;
    }
    jest.resetModules();
  });

  function buildApp() {
    jest.resetModules();
    const { lockdownMiddleware } = require('../src/middleware/lockdown.js');
    const healthRoutes = require('../src/routes/healthRoutes.js');
    const app = express();
    app.use(express.json());
    app.use(healthRoutes);
    app.use(lockdownMiddleware);
    app.get('/api/ping', (req, res) => res.json({ ok: true }));
    return app;
  }

  it('allows traffic when LOCKDOWN_MODE is off', async () => {
    process.env.LOCKDOWN_MODE = 'false';
    process.env.NODE_ENV = 'test';
    const app = buildApp();
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('blocks API traffic with 503 when LOCKDOWN_MODE is on', async () => {
    process.env.LOCKDOWN_MODE = 'true';
    const app = buildApp();
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(503);
  });

  it('defaults to lockdown in production when env is unset', async () => {
    delete process.env.LOCKDOWN_MODE;
    process.env.NODE_ENV = 'production';
    const app = buildApp();
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(503);
  });

  it('keeps /health available during lockdown', async () => {
    process.env.LOCKDOWN_MODE = 'true';
    const app = buildApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('lockdown');
  });
});
