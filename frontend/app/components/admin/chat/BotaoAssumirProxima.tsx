'use client'

import { useState } from 'react'
import { MdAssignment } from 'react-icons/md'
import { toaster } from '@/components/ui/toaster'
import { CTAButton } from '@/components/ui/BaseButton'
import type { ConversaComExtras } from '@types'

interface BotaoAssumirProximaProps {
  onConversaAssumida?: (conversa: ConversaComExtras) => void
}

export function BotaoAssumirProxima({ onConversaAssumida }: BotaoAssumirProximaProps) {
  const [carregando, setCarregando] = useState(false)

  const assumir = async () => {
    try {
      setCarregando(true)

      const res = await fetch('/api/admin/conversas/assumir-disponivel', {
        method: 'POST',
        credentials: 'include',
      })

      const json = await res.json()

      if (!res.ok || !json.success || !json.data?.conversa) {
        toaster.create({
          title: 'Nenhuma conversa disponível',
          description: json.message || 'Tente novamente mais tarde.',
          type: 'error',
          closable: true,
        })
        return
      }

      const conversa: ConversaComExtras = json.data.conversa

      onConversaAssumida?.(conversa)

      toaster.create({
        title: 'Conversa atribuída',
        description: `Você assumiu a conversa com ${conversa.nome || conversa.numero}`,
        type: 'success',
        closable: true,
      })
    } catch (err) {
      console.error('Erro ao assumir conversa disponível:', err)
      toaster.create({
        title: 'Erro ao assumir conversa',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        type: 'error',
        closable: true,
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <CTAButton
      onClick={assumir}
      variant="solid"
      size="md"
      withArrow={false}
      disabled={carregando}
    >
      <MdAssignment style={{ marginRight: '8px' }} />
      {carregando ? 'Assumindo...' : 'Assumir próxima disponível'}
    </CTAButton>
  )
}
