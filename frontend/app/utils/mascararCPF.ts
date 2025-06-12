export function mascararCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, '').slice(0, 11)

  if (cpf.length === 0) return ''

  if (cpf.length <= 3) return cpf
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`
  
  const parte1 = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}`
  const parte2 = cpf.slice(9)
  return parte2 ? `${parte1}-${parte2}` : parte1
}
