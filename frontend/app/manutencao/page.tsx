'use client'

import { Box, Heading, Text, VStack, Code, Link } from '@chakra-ui/react'

const LGPD_CONTACT_EMAIL = 'gustavomarquesmm@gmail.com'

export default function ManutencaoPage() {
  return (
    <Box
      minH="100vh"
      px={6}
      py={16}
      bg="gray.50"
      color="gray.800"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} maxW="xl" align="start">
        <Heading size="lg">Investiga+ temporariamente indisponível</Heading>
        <Text>
          As consultas e o acesso à plataforma estão suspensos enquanto revisamos
          a operação e o tratamento de dados pessoais.
        </Text>
        <Text>
          Se você precisa solicitar correção ou exclusão de dados (LGPD), envie um
          e-mail para:
        </Text>
        <Code p={2} fontSize="md">
          {LGPD_CONTACT_EMAIL}
        </Code>
        <Text fontSize="sm" color="gray.600">
          Inclua nome completo, CPF (se aplicável) e uma descrição objetiva do
          problema. Não envie senhas ou capturas com dados de terceiros além do
          necessário.
        </Text>
        <Link href={`mailto:${LGPD_CONTACT_EMAIL}`} color="blue.600" fontWeight="semibold">
          Abrir e-mail de contato
        </Link>
      </VStack>
    </Box>
  )
}
