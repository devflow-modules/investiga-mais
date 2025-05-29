import { Box, Heading, Text } from '@chakra-ui/react'

export default function Testimonials() {
  return (
    <Box py={12} px={6} bg="background" textAlign="center">
      <Heading fontSize="2xl" mb={4}>Depoimentos</Heading>
      <Text mb={6} fontStyle="italic" color="textSecondary">"A plataforma me ajudou a tomar decisões mais assertivas nos meus negócios."</Text>
      <Text fontStyle="italic" color="textSecondary">"Informações rápidas e confiáveis. Recomendo a todos que precisam analisar empresas."</Text>
    </Box>
  )
}