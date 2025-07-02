import { formatarDataBrasil } from './formatarDataBrasil'
import type { Mensagem } from '@types'

export function agruparPorData(mensagens: Mensagem[]) {
  const agrupadas: { data: string; mensagens: Mensagem[] }[] = []

  mensagens.forEach((msg) => {
    const data = formatarDataBrasil(msg.timestamp, 'yyyy-MM-dd') // já considera o fuso
    const grupo = agrupadas.find((g) => g.data === data)
    if (grupo) grupo.mensagens.push(msg)
    else agrupadas.push({ data, mensagens: [msg] })
  })

  return agrupadas
}
