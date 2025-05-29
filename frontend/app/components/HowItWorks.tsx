'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

export default function HowItWorks() {
  return (
    <Box
      py={{ base: 12, md: 20 }}
      px={6}
      bg="background" // usa seu token do tema
      textAlign="center"
    >
      <VStack gap={4}>
        <Icon as={FiSearch} boxSize={8} color="accent" />
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="textPrimary">
          Como funciona?
        </Heading>
        <Text
          fontSize="lg"
          maxW="2xl"
          mx="auto"
          color="textSecondary"
        >
          Basta inserir o CNPJ da empresa que deseja consultar e, em segundos,
          você terá acesso a todas as informações disponíveis. Nosso sistema é
          rápido, seguro e fácil de usar.
        </Text>
      </VStack>
    </Box>
  )
}
