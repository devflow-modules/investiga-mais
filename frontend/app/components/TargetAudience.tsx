import { Box, Heading, Text } from '@chakra-ui/react'

export default function TargetAudience() {
  return (
    <Box py={12} px={6} bg="white" textAlign="center">
      <Heading fontSize="2xl" mb={4}>Para quem é o Investiga Mais?</Heading>
      <Text maxW="2xl" mx="auto" color="textSecondary">
        Afiliados, mentores, freelancers, agências, prestadores de serviço e quem trabalha com B2B. Se você precisa de informações confiáveis sobre empresas, esta plataforma é para você.
      </Text>
    </Box>
  )
}