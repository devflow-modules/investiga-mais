import { format } from 'date-fns'
import type { Mensagem } from '@types'

export function agruparPorData(mensagens: Mensagem[]) {
  const agrupadas: { data: string; mensagens: Mensagem[] }[] = []

  mensagens.forEach((msg) => {
    const data = format(new Date(msg.timestamp), 'yyyy-MM-dd')
    const grupo = agrupadas.find((g) => g.data === data)
    if (grupo) grupo.mensagens.push(msg)
    else agrupadas.push({ data, mensagens: [msg] })
  })

  return agrupadas
}
