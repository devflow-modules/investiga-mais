export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/[^\d]+/g, '')
  if (cnpjLimpo.length !== 14) return cnpj
  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function formatarCPF(cpf?: string): string {
  if (!cpf) return '-'

  const cpfLimpo = cpf.replace(/[^\d]+/g, '')
  if (cpfLimpo.length !== 11) return cpf
  return cpfLimpo.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  )
}
export function formatarMoeda(valor: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(valor))
}

export function formatarDataHora(dataIso: string): string {
  return new Date(dataIso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

export function formatarTelefone(telefone: string): string {
  const telLimpo = telefone.replace(/[^\d]+/g, '')

  if (telLimpo.length === 11) {
    // com DDD e celular (11 dígitos)
    return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (telLimpo.length === 10) {
    // com DDD e telefone fixo (10 dígitos)
    return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (telLimpo.length === 9) {
    // celular sem DDD (9 dígitos)
    return telLimpo.replace(/(\d{5})(\d{4})/, '$1-$2')
  } else if (telLimpo.length === 8) {
    // fixo sem DDD (8 dígitos)
    return telLimpo.replace(/(\d{4})(\d{4})/, '$1-$2')
  } else {
    return telefone // fallback — retorna como veio
  }
}


export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]+/g, '')
}

