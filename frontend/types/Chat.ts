import type { Dispatch, SetStateAction } from 'react'

export type Direcao = 'entrada' | 'saida'

export type Status = 'pendente' | 'enviada' | 'simulada' | 'lida' | 'entregue' | 'falhou'

export interface Atendente {
  nome: string
  email: string
}

export interface Mensagem {
  id: number | string
  conteudo: string
  direcao: Direcao
  timestamp: string
  status?: Status
  atendente?: Atendente | null
}

export interface Conversa {
  atendenteId: any
  id: number
  nome?: string
  numero: string
  ultimaMensagem: string
  ultimaMensagemEm: string
  naoLidas: number
}

export interface ChatInputProps {
  mensagem: string
  setMensagem: Dispatch<SetStateAction<string>>
  onEnviar: () => void
  carregando?: boolean
}

export interface ChatMessageProps {
  conteudo: string
  direcao: Direcao
  timestamp?: string
  status?: Status
  atendente?: Pick<Atendente, 'nome'>
  onRetry?: () => void
}

export interface UseMensagensConversaProps {
  conversaId: number
  take?: number
}

export type TempMensagem = Omit<Mensagem, 'id'> & { id: string }

export type MensagemComPossivelTempId = Mensagem | TempMensagem

export interface Options {
  hasMore?: boolean
  loading?: boolean
}