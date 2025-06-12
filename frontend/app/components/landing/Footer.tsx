'use client'

import { Box, Flex, Link, Text, VStack, HStack, Icon } from '@chakra-ui/react'
import { FiShield, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="whiteAlpha.900" py={10} px={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        maxW="6xl"
        mx="auto"
        gap={6}
      >
        <VStack align="start" gap={2}>
          <Text fontWeight="bold" fontSize="lg">
            Investiga+
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700">
            © {new Date().getFullYear()} Investiga Mais. Todos os direitos reservados.
          </Text>
        </VStack>


      </Flex>

      <Box mt={8} height="1px" width="100%" bg="whiteAlpha.300" />

      <Box mt={6} display="flex" justifyContent="center">
        <HStack gap={4} wrap="wrap" justify="center">
          <HStack gap={2} color="green.300">
            <Icon as={FiShield} boxSize={4} />
            <Text fontSize="sm" fontWeight="medium">
              Site 100% seguro e criptografado
            </Text>
          </HStack>
          <HStack gap={2} color="green.300">
            <Icon as={FiMapPin} boxSize={4} />
            <Text fontSize="sm" fontWeight="medium">
              Feito no Brasil com responsabilidade
            </Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium" color="green.300">
            +100.000 verificações realizadas
          </Text>
        </HStack>
      </Box>

      <Text fontSize="xs" textAlign="center" color="whiteAlpha.700" mt={4}>
        Criado com ❤️ para proteger seus dados.
      </Text>
    </Box>
  )
}