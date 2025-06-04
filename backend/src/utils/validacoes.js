function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarSenha(senha) {
  return senha.length >= 6 && /[A-Za-z]/.test(senha) && /\d/.test(senha);
}

function validarCPF(cpf) {
  if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  return /^\d{11}$/.test(cpf);
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (cnpj.length !== 14) return false

  // CNPJs com todos os dígitos iguais são inválidos
  if (/^(\d)\1+$/.test(cnpj)) return false

  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  let digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(0))) return false

  tamanho += 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  return resultado === parseInt(digitos.charAt(1))
}

module.exports = {
  validarEmail,
  validarSenha,
  validarCPF,
  validarCNPJ
};