function validarTelefone(telefone) {
  return typeof telefone === 'string' && /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone)
}

function validarNascimento(data) {
  return !isNaN(Date.parse(data))
}

function validarUF(uf) {
  const ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
  return ufs.includes(uf)
}

function validarGenero(genero) {
  const opcoes = ['Masculino', 'Feminino', 'Prefiro não informar']
  return opcoes.includes(genero)
}

module.exports = {
  validarTelefone,
  validarNascimento,
  validarUF,
  validarGenero
}
