'use client'

import {
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Input,
  VStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { z } from 'zod'
import { CTAButton } from '@/components/ui/BaseButton'
import { toaster } from '@/components/ui/toaster'
import type { BotaoNovaConversaProps, ConversaComExtras, NovaConversaPayload } from '../../../../types/Chat'

const schema = z.object({
  numero: z.string().regex(/^\d{10,13}$/, 'Número inválido. Use apenas dígitos.'),
  nome: z.string().optional(),
}) satisfies z.ZodType<NovaConversaPayload>

export function BotaoNovaConversa({ onConversaCriada }: BotaoNovaConversaProps) {
  const [open, setOpen] = useState(false)
  const [numero, setNumero] = useState('')
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleCriar = async () => {
    const validado = schema.safeParse({ numero, nome })

    if (!validado.success) {
      toaster.error({ title: validado.error.issues[0].message })
      return
    }

    setCarregando(true)

    try {
      const res = await fetch('/api/admin/conversas/nova', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validado.data),
      })

      const json: {
        success: boolean
        message?: string
        data: { conversa: ConversaComExtras }
      } = await res.json()

      if (json.success) {
        toaster.success({ title: 'Conversa criada com sucesso!' })
        onConversaCriada?.(json.data.conversa)
        setNumero('')
        setNome('')
        setOpen(false)
      } else {
        toaster.error({ title: json.message || 'Erro ao criar conversa.' })
      }
    } catch {
      toaster.error({ title: 'Erro ao criar conversa.' })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>
        <CTAButton size="sm" variant="solid">
          Nova conversa
        </CTAButton>
      </DialogTrigger>

      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>Nova conversa manual</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack gap={3}>
              <Input
                placeholder="Número (somente dígitos)"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <Input
                placeholder="Nome (opcional)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <CTAButton variant="cta" onClick={handleCriar} disabled={carregando}>
              Criar
            </CTAButton>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
