const { validarEmail, validarCPF } = require('../../shared/validators')

describe('Validação de Email', () => {
  it('valida emails válidos', () => {
    expect(validarEmail('teste@email.com')).toBe(true);
  });

  it('rejeita emails inválidos', () => {
    expect(validarEmail('emailinvalido')).toBe(false);
  });
});

describe('Validação de CPF', () => {
  it('valida CPFs válidos', () => {
    expect(validarCPF('12345678909')).toBe(true); // Exemplo válido (ajustar para regra real)
  });

  it('rejeita CPFs inválidos', () => {
    expect(validarCPF('00000000000')).toBe(false);
    expect(validarCPF('123')).toBe(false);
  });
});
