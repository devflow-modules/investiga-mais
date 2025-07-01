'use client'

import type { MensagemComPossivelTempId, UseMensagensConversaProps } from '@types'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useMensagensConversa({ conversaId, take = 20 }: UseMensagensConversaProps) {
  const [mensagens, setMensagens] = useState<MensagemComPossivelTempId[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const skipRef = useRef(0)

  const carregarMais = useCallback(async () => {
    if (loading || !hasMore || conversaId <= 0) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/conversas/${conversaId}/mensagens?skip=${skipRef.current}&take=${take}`, {
        credentials: 'include'
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Erro desconhecido')

      const novas = json.data.mensagens || []
      setMensagens(prev => [...novas, ...prev])
      skipRef.current += novas.length

      setTotal(json.data.total || 0)
      setHasMore(skipRef.current < (json.data.total || 0))
    } catch (err: any) {
      console.error('[useMensagensConversa] Erro ao carregar:', err)
      setError(err.message || 'Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }, [conversaId, take, loading, hasMore])

  useEffect(() => {
    if (conversaId <= 0) return
    skipRef.current = 0
    setMensagens([])
    setHasMore(true)
    carregarMais()
  }, [conversaId])

  return {
    mensagens,
    carregarMais,
    total,
    hasMore,
    loading,
    error,
    setMensagens
  }
}
