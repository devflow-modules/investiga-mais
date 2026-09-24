const jwt = require('jsonwebtoken');

describe('Middleware verifyToken', () => {
  const SECRET_KEY = process.env.JWT_SECRET;

  let verifyToken;
  let req, res, next;

  beforeAll(() => {
    if (!SECRET_KEY || SECRET_KEY.length < 16) {
      throw new Error('JWT_SECRET must be set by tests/setupEnv.js');
    }
    jest.resetModules();
    verifyToken = require('../src/middleware/auth');
  });

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('retorna 401 se o token não for fornecido', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Token não fornecido',
      statusCode: 401,
      success: false,
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 403 se o token for inválido', () => {
    req.cookies.token = 'token_falso';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Token inválido',
      statusCode: 403,
      success: false,
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next() se o token for válido', () => {
    const payload = { id: 123, email: 'teste@email.com' };
    const tokenValido = jwt.sign(payload, SECRET_KEY);
    req.cookies.token = tokenValido;

    verifyToken(req, res, next);

    expect(req.user).toMatchObject({
      id: payload.id,
      email: payload.email,
      cpf: null,
      nome: null,
      role: 'cliente'
    });

    expect(next).toHaveBeenCalled();
  });
});
