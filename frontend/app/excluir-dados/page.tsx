'use client'

import { Box, Heading, Text, VStack, Code } from '@chakra-ui/react'

export default function ExcluirDados() {
  return (
    <Box
      p={8}
      maxW="4xl"
      mx="auto"
      bg="background"
      border="1px solid"
      borderColor="primary"
      borderRadius="2xl"
      boxShadow="md"
    >
      <VStack gap={6} align="start">
        <Heading size="lg" color="primary">
          Solicitação de Exclusão de Dados
        </Heading>

        <Text fontSize="md" color="textPrimary">
          Estamos comprometidos com a privacidade e segurança dos seus dados.
          Para solicitar a exclusão completa das suas informações da plataforma <strong>Investiga+</strong>, siga as instruções abaixo:
        </Text>

        <Box
          p={4}
          bg="white"
          border="1px dashed"
          borderColor="secondary"
          borderRadius="md"
          w="100%"
        >
          <Text fontWeight="semibold" mb={2} color="textPrimary">
            Envie um e-mail para:
          </Text>
          <Code p={2} colorScheme="blue" fontSize="md">
            sistemanexusadm@gmail.com
          </Code>
        </Box>

        <Box>
          <Text mb={1} color="textPrimary">No corpo da mensagem, informe:</Text>
          <Box as="ul" pl={4} style={{ listStyleType: 'disc' }}>
            <li><Text color="textSecondary">Seu nome completo</Text></li>
            <li><Text color="textSecondary">E-mail cadastrado</Text></li>
            <li><Text color="textSecondary">CPF (se aplicável)</Text></li>
          </Box>
        </Box>

        <Text fontSize="sm" color="textSecondary">
          Sua solicitação será processada em até <strong>7 dias úteis</strong>, conforme a LGPD.
        </Text>
      </VStack>
    </Box>
  )
}
