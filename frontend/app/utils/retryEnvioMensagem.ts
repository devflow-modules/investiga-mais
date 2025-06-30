import type { Mensagem, Conversa } from '@types'

export async function retryEnvioMensagem(
  mensagem: Mensagem,
  conversa: Conversa | null,
  setMensagens: React.Dispatch<React.SetStateAction<Mensagem[]>>,
  setEnviando: (v: boolean) => void
) {
  if (!conversa) return

  const tempId = `retry-${Date.now()}`
  const nova = {
    id: tempId,
    conteudo: mensagem.conteudo,
    direcao: 'saida' as const,
    timestamp: new Date().toISOString(),
    status: 'pendente' as const,
  }

  setMensagens((prev) => [...prev, nova])
  setEnviando(true)

  try {
    const res = await fetch(`/api/admin/conversas/${conversa.id}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ mensagem: mensagem.conteudo }),
    })
    const json = await res.json()
    if (json.success && json.data) {
      setMensagens((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, id: json.data.id, status: json.data.status } : m
        )
      )
    } else {
      throw new Error()
    }
  } catch {
    setMensagens((prev) =>
      prev.map((m) =>
        m.id === tempId ? { ...m, status: 'falhou' } : m
      )
    )
  } finally {
    setEnviando(false)
  }
}
