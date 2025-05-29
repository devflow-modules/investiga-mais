import { Box, Flex, Link, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box bg="primary" color="white" py={6} px={6}>
      <Flex maxW="4xl" mx="auto" direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
        <Text>&copy; 2025 Investiga Mais. Todos os direitos reservados.</Text>
        <Flex gap={4} mt={{ base: 4, md: 0 }}>
          <Link href="/termos" _hover={{ textDecoration: 'underline' }}>Termos de Uso</Link>
          <Link href="/privacidade" _hover={{ textDecoration: 'underline' }}>Política de Privacidade</Link>
          <Link href="/contato" _hover={{ textDecoration: 'underline' }}>Contato</Link>
        </Flex>
      </Flex>
    </Box>
  )
}