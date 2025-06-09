const { validarEmail, validarSenha, validarCPF, validarCNPJ } = require('./backend')
const { validarTelefone, validarNascimento, validarUF, validarGenero } = require('./perfilBackend')

module.exports = {
  validarEmail,
  validarSenha,
  validarCPF,
  validarCNPJ,
  validarTelefone,
  validarNascimento,
  validarUF,
  validarGenero
}
