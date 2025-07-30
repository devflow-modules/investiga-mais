'use client'

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'

interface Props {
  email: string
  senha: string
  onClose?: () => void
}

export function CardDadosCriados({ email, senha, onClose }: Props) {
  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      alert('Erro ao copiar')
    }
  }

  return (
    <Box mt={8} bg="gray.100" border="1px solid" borderColor="gray.300" rounded="xl" p={6} shadow="sm">
      <Heading size="md" mb={4} color="primary">
        🎉 Acesso Gerado com Sucesso
      </Heading>

      <VStack gap={4} align="stretch">
        {/* Email */}
        <Box>
          <Text fontWeight="semibold">Email:</Text>
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            px={4}
            py={2}
            rounded="md"
            fontFamily="monospace"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{email}</Text>
            <Button size="sm" variant="outline" onClick={() => copiar(email)}>
              Copiar
            </Button>
          </Box>
        </Box>

        {/* Senha */}
        <Box>
          <Text fontWeight="semibold">Senha:</Text>
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            px={4}
            py={2}
            rounded="md"
            fontFamily="monospace"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{senha}</Text>
            <Button size="sm" variant="outline" onClick={() => copiar(senha)}>
              Copiar
            </Button>
          </Box>
        </Box>

        {onClose && (
          <Box textAlign="right" pt={2}>
            <Button colorScheme="gray" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
