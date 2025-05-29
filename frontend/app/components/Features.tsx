'use client'

import {
  Box,
  Grid,
  Heading,
  Image,
  Stack,
  HStack,
  Icon,
  Text
} from '@chakra-ui/react'
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiShield
} from 'react-icons/fi'

export default function Features() {
  return (
    <Box py={16} px={6} bg="white">
      <Grid
        maxW="4xl"
        mx="auto"
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={8}
        alignItems="center"
      >
        <Image
          src="/cnpj-consulta.png"
          alt="Consulta CNPJ"
          borderRadius="md"
          boxShadow="lg"
        />
        <Box>
          <Heading fontSize="2xl" mb={4}>
            O que você encontra?
          </Heading>
          <Stack color="gray.700">
            <HStack>
              <Icon as={FiBriefcase} boxSize={5} color="blue.500" />
              <Text>Nome empresarial, situação, abertura</Text>
            </HStack>
            <HStack>
              <Icon as={FiMapPin} boxSize={5} color="blue.500" />
              <Text>Endereço, atividades e QSA</Text>
            </HStack>
            <HStack>
              <Icon as={FiClock} boxSize={5} color="blue.500" />
              <Text>Consulta com cache automático e histórico</Text>
            </HStack>
            <HStack>
              <Icon as={FiShield} boxSize={5} color="blue.500" />
              <Text>Plataforma 100% online, segura e rápida</Text>
            </HStack>
          </Stack>
        </Box>
      </Grid>
    </Box>
  )
}
