'use client'

import { useState } from 'react'
import { MdOutlineBlock } from 'react-icons/md'
import { toaster } from '@/components/ui/toaster'
import { CTAButton } from '@/components/ui/BaseButton'

interface BotaoLiberarConversaProps {
  conversaId: number
  onConversaLiberada?: () => void
}

export function BotaoLiberarConversa({
  conversaId,
  onConversaLiberada,
}: BotaoLiberarConversaProps) {
  const [carregando, setCarregando] = useState(false)

  const liberar = async () => {
    setCarregando(true)
    try {
      const res = await fetch(`/api/admin/conversas/${conversaId}/liberar`, {
        method: 'POST',
        credentials: 'include',
      })

      const json = await res.json()

      if (json.success) {
        toaster.success({
          title: 'Conversa liberada com sucesso!',
        })
        onConversaLiberada?.()
      } else {
        toaster.error(json.message || 'Não foi possível liberar a conversa.')
      }
    } catch (err) {
      toaster.error({
        title: 'Erro ao liberar conversa.',
        description: 'Tente novamente mais tarde.',
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <CTAButton
      onClick={liberar}
      variant="ghostLink"
      size="sm"
      withArrow={false}
      isDisabled={carregando}
    >
      <MdOutlineBlock style={{ marginRight: '6px' }} />
      {carregando ? 'Liberando...' : 'Liberar conversa'}
    </CTAButton>
  )
}
