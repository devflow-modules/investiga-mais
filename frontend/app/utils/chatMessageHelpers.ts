import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { BiTimeFive, BiCheck, BiCheckDouble } from 'react-icons/bi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { MdErrorOutline } from 'react-icons/md'
import type { Direcao, Status } from '@types'
import type { IconType } from 'react-icons'

export function getAlign(direcao: Direcao): 'flex-start' | 'flex-end' {
  return direcao === 'saida' ? 'flex-end' : 'flex-start'
}

export function getBgColor(direcao: Direcao, highlight: boolean, bgEntrada: string, bgSaida: string): string {
  if (highlight) return 'yellow.100'
  return direcao === 'saida' ? bgSaida : bgEntrada
}

export function getTextColor(direcao: Direcao): string {
  return direcao === 'saida' ? 'white' : 'textPrimary'
}

export function getTimeFormatted(timestamp?: string): string {
  return timestamp ? format(new Date(timestamp), 'HH:mm', { locale: ptBR }) : ''
}

export function getStatusIcon(status: Status): { Icon: IconType; color?: string; title: string } | null {
  const iconMap: Record<Status, { Icon: IconType; color?: string; title: string }> = {
    pendente: { Icon: AiOutlineClockCircle, title: 'Pendente' },
    simulada: { Icon: BiTimeFive, title: 'Simulada' },
    enviada: { Icon: BiTimeFive, title: 'Enviada' },
    entregue: { Icon: BiCheck, title: 'Entregue' },
    lida: { Icon: BiCheckDouble, title: 'Lida' },
    falhou: { Icon: MdErrorOutline, color: 'red', title: 'Falhou' },
  }

  return iconMap[status] ?? null
}
