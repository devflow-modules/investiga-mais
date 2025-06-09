export function validarTelefone(telefone: string): boolean {
  return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone)
}

export function validarNascimento(data: string): boolean {
  return !isNaN(Date.parse(data))
}

export function validarUF(uf: string): boolean {
  const ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
  return ufs.includes(uf)
}

export function validarGenero(genero: string): boolean {
  const opcoes = ['Masculino', 'Feminino', 'Prefiro não informar']
  return opcoes.includes(genero)
}
