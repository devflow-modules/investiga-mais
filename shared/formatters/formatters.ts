export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/[^\d]+/g, '')
  if (cnpjLimpo.length !== 14) return cnpj
  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function formatarCPF(cpf: string): string {
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

export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]+/g, '')
}
