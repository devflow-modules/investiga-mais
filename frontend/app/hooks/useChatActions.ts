import { useState } from 'react'
import type { Conversa, MensagemComPossivelTempId } from '@types'

export function useChatActions(
  conversa: Conversa | null,
  mensagens: MensagemComPossivelTempId[],
  setMensagens: React.Dispatch<React.SetStateAction<MensagemComPossivelTempId[]>>,
  mensagem: string,
  setMensagem: (s: string) => void
) {
  const [enviando, setEnviando] = useState(false)

  const enviar = async () => {
    if (!mensagem.trim() || !conversa || enviando) return
    setEnviando(true)

    const tempId = `temp-${Date.now()}`
    const nova = {
      id: tempId,
      conteudo: mensagem,
      direcao: 'saida' as const,
      timestamp: new Date().toISOString(),
      status: 'pendente' as const,
    }

    setMensagens([...mensagens, nova])
    setMensagem('')

    try {
      const res = await fetch(`/api/admin/conversas/${conversa.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mensagem }),
      })

      const json = await res.json()
      if (json.success) {
        setMensagens((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: json.data.id, status: json.data.status } : m))
        )
      } else {
        throw new Error()
      }
    } catch {
      setMensagens((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'falhou' } : m))
      )
    } finally {
      setEnviando(false)
    }
  }

  return { mensagem, setMensagem, enviando, enviar, setEnviando }
}
