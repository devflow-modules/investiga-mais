'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react'
import { PlanoCard } from '../landing/PlanoCard'
import { useViewSection } from '@/hooks/useViewSection'

export function PlanosSection() {
  const ref = useViewSection('view_pacotes')

  return (
    <Box ref={ref} as="section" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }} bg="gray.50">
      <Stack gap={4} textAlign="center" maxW="4xl" mx="auto">
        <Heading as="h2" fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold">
          Confira qual dos nossos pacotes te atende melhor
        </Heading>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
          Proteja seus dados e investigue empresas com confiança.
        </Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
          Comece agora mesmo!
        </Text>
      </Stack>

      <SimpleGrid
        mt={10}
        columns={{ base: 1, md: 2, lg: 2 }}
        gap={{ base: 6, md: 8 }}
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
