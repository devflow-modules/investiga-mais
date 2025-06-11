export function mascararCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/\D/g, '').slice(0, 14)

  if (cnpj.length === 0) return ''

  if (cnpj.length <= 2) return cnpj
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`
  if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`

  const parte1 = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}`
  const parte2 = cnpj.slice(12)
  return parte2 ? `${parte1}-${parte2}` : parte1
}
