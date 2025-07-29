'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react'
import { PlanoCard } from '../landing/PlanoCard'


export function PlanosSection() {

  return (
    <Box as="section" py={[10, 16]} px={[4, 6]} bg="gray.50">
      <Stack gap={4} textAlign="center" maxW="4xl" mx="auto">
        <Heading as="h2" fontSize={['xl', '3xl']} fontWeight="bold">
          Escolha o plano ideal para sua segurança digital
        </Heading>
        <Text fontSize={['sm', 'md']} color="gray.600">
          Proteja seus dados e investigue empresas com confiança. Comece agora mesmo.
        </Text>
      </Stack>

      <SimpleGrid
        mt={10}
        columns={[1, null, 2]}
        gap={[8, 10]}
        maxW="6xl"
        mx="auto"
        alignItems="stretch"
      >
        <PlanoCard tipo="basico" />
        <PlanoCard tipo="premium" />
      </SimpleGrid>
    </Box>
  )
}