'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useBreakpointValue,
  Spinner,
} from '@chakra-ui/react'
import { apiFetchJSON } from '../../src/utils/apiFetchJSON'

export default function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')
    setErro('')

    try {
      const json = await apiFetchJSON('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (json.success) {
        setMensagem(json.message || 'Link enviado com sucesso.')
      } else {
        setErro(json.error || json.message || 'Erro ao processar solicitação.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
      bg="background"
    >
      <Box
        as="form"
        onSubmit={enviar}
        bg="white"
        p={8}
        rounded="md"
        boxShadow="md"
        maxW="sm"
        w="full"
      >
        <VStack gap={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" color="textPrimary" textAlign="center">
            Recuperar Senha
          </Text>

          <Input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: 'blue.500', bg: 'white' }}
          />

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            fontWeight="bold"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Enviar link de recuperação'}
          </Button>

          {mensagem && (
            <Text fontSize="sm" textAlign="center" color="green.600">
              {mensagem}
            </Text>
          )}

          {erro && (
            <Text fontSize="sm" textAlign="center" color="red.600">
              {erro}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  )
}
