'use client'

import Image from 'next/image'
import {
  Box,
  Stack,
  Text,
  Heading,
  HStack
} from '@chakra-ui/react'
import { CTAButton } from '../ui/BaseButton'

export function HeroHeadingSection() {
  return (
    <Box
      as="section"
      role="region"
      aria-labelledby="hero-heading"
      minH={['100vh', '30vh']}
      position="relative"
      zIndex={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={4}
      py={[8, 16]}
      overflow="hidden"
    >
      <Box position="absolute" inset={0} zIndex={-1} width="100%" height="100%">
        <Image
          src="/hero-illustration.webp"
          alt="Ilustração de segurança digital para identificar sites confiáveis"
          fill
          priority
          loading="eager"
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </Box>


      <Stack
        direction="column"
        gap={6} color="white"
        maxW="xl" mx="auto"
        w="100%"
        position="relative"
        zIndex={1} // => precisa estar acima da imagem
        bg="blackAlpha.600" // opcional, para melhor contraste
        p={6}
        borderRadius="md">
        <Text
          fontSize={['xs', 'sm']}
          fontWeight="bold"
          color="green.300"
          textTransform="uppercase"
        >
          Plataforma Confiável
        </Text>

        <Heading
          id="hero-heading"
          fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
          fontWeight="bold"
          lineHeight="short"
        >
          ANTES DE COMPRAR ONLINE, INVESTIGA+
        </Heading>

        <Text
          fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
          color="whiteAlpha.900"
          px={[2, 0]}
        >
          VOCÊ AINDA ESTÁ COMPRANDO NA INTERNET SEM INVESTIGAR A EMPRESA POR COMPLETO?
        </Text>

        <CTAButton
          variant="cta"
          borderRadius="md"
          as="a"
          href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
          rel="noopener noreferrer"
          w={['90%', 'auto']}
          mx="auto"
          whiteSpace="nowrap"
        >
          NÃO QUERO CAIR MAIS EM GOLPES
        </CTAButton>

        <HStack gap={1} justify="center" alignItems="center" fontSize="sm" mt={2}>
          <Text color="whiteAlpha.800">Já possui uma conta?</Text>
          <CTAButton
            as="a"
            href="/login"
            variant="ghostLink"
            size="sm"
            px="0"
            withArrow={false}
          >
            Acesse aqui
          </CTAButton>
        </HStack>
      </Stack>
    </Box>
  )
}
