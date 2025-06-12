export function mascararTelefone(telefone: string): string {
  telefone = telefone.replace(/\D/g, '').slice(0, 11)

  if (telefone.length === 0) return ''

  if (telefone.length <= 2) {
    return `(${telefone}`
  }

  if (telefone.length <= 6) {
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`
  }

  if (telefone.length <= 10) {
    const parte1 = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}`
    const parte2 = telefone.slice(6)
    return parte2 ? `${parte1}-${parte2}` : parte1
  }

  const parte1 = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}`
  const parte2 = telefone.slice(7)
  return parte2 ? `${parte1}-${parte2}` : parte1
}
