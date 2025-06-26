'use client'

import { HStack, Input, Button, useToken } from '@chakra-ui/react'
import type { FormEvent } from 'react'

interface ChatInputProps {
  mensagem: string
  setMensagem: (valor: string) => void
  onEnviar: () => void
}

export function ChatInput({ mensagem, setMensagem, onEnviar }: ChatInputProps) {
  const [accent, ctaBlue] = useToken('colors', ['accent', 'ctaBlue'])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mensagem.trim()) onEnviar()
  }

  const isEmpty = !mensagem.trim()

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }} aria-label="Formulário de envio de mensagem">
      <HStack mt={4} as="fieldset" gap={3}>
        <Input
          placeholder="Digite uma mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          aria-label="Campo de digitação da mensagem"
          data-invalid={isEmpty}
          flex="1"
        />
        <Button
          type="submit"
          bg={accent}
          color="white"
          minW="80px"
          _hover={{ bg: ctaBlue }}
          disabled={isEmpty}
          aria-label="Botão de envio de mensagem"
        >
          Enviar
        </Button>
      </HStack>
    </form>
  )
}
