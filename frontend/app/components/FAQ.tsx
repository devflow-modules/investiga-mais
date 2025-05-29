import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function FAQ() {
  return (
    <Box py={12} px={6} bg="white">
      <Heading textAlign="center" fontSize="2xl" mb={6}>Perguntas Frequentes</Heading>
      <VStack align="start" gap={4} maxW="3xl" mx="auto">
        <Box>
          <Text fontWeight="bold">Como faço para consultar um CNPJ?</Text>
          <Text color="textSecondary">Você precisa estar logado na plataforma. Após o login, vá até a seção de consultas e insira o CNPJ desejado.</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Posso salvar as consultas realizadas?</Text>
          <Text color="textSecondary">Sim, todas as consultas são salvas automaticamente no seu histórico para acesso futuro.</Text>
        </Box>
      </VStack>
    </Box>
  )
}