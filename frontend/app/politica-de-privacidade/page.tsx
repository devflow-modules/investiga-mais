'use client'

import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function PoliticaDePrivacidade() {
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
          Política de Privacidade
        </Heading>

        <Text fontSize="md" color="textPrimary">
          Esta política descreve como coletamos, usamos e protegemos os dados dos usuários da plataforma <strong>Investiga+</strong>.
        </Text>

        <Text fontSize="md" color="textPrimary">
          Coletamos dados como nome, e-mail, CPF e telefone para fins de autenticação, personalização da experiência e funcionalidades do sistema. Os dados são armazenados com segurança e não são compartilhados com terceiros sem autorização expressa.
        </Text>

        <Text fontSize="md" color="textPrimary">
          O usuário pode solicitar a exclusão de seus dados a qualquer momento através da página de{' '}
          <Link as={NextLink} href="/excluir-dados" color="accent" fontWeight="semibold">
            Exclusão de Dados
          </Link>.
        </Text>

        <Text fontSize="sm" color="textSecondary">
          Última atualização: Junho de 2025.
        </Text>
      </VStack>
    </Box>
  )
}
