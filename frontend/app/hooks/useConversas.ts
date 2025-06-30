import { useEffect, useState } from 'react'
import type { Conversa } from '@types'

export function useConversas() {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null)

  useEffect(() => {
    const carregarConversas = async () => {
      try {
        const res = await fetch('/api/admin/conversas', { credentials: 'include' })
        const json = await res.json()
        if (json.success) setConversas(json.data.conversas)
      } catch {
        setConversas([])
      }
    }

    carregarConversas()
  }, [])

  return { conversas, conversaSelecionada, setConversaSelecionada }
}
