'use client'

import Image from 'next/image'
import {
  Box,
  Stack,
  Text,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { CTAButton } from '../ui/BaseButton'
import { FaWhatsapp } from 'react-icons/fa'
import { VideoInstitucional } from '../landing/VideoInstitucional'

export function HeroHeadingSection() {
  return (
    <Box
      as="section"
      role="region"
      aria-labelledby="hero-heading"
      minH={{ base: '100vh', md: '90vh' }}
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
        gap={[4, 6, 8]}
        color="white"
        maxW="4xl"
        w="100%"
        position="relative"
        zIndex={1}
        bg="blackAlpha.600"
        p={[4, 6, 10]}
        borderRadius="2xl"
        boxShadow="lg"
        mx="auto"
      >
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
          fontSize={['2xl', '3xl', '4xl', '5xl', '6xl']}
          fontWeight="extrabold"
          lineHeight="shorter"
          color="white"
        >
          ANTES DE COMPRAR ONLINE, INVESTIGA+
        </Heading>

        <Box px={[0, 4]}>
          <VideoInstitucional />
        </Box>

        <Text
          fontSize={['md', 'lg', 'xl']}
          color="whiteAlpha.900"
          textAlign="center"
          maxW="3xl"
          mx="auto"
        >
          Não seja mais uma vítima de <strong>golpes digitais</strong>. Proteja seus <strong>dados</strong>, descubra quem aplicou o golpe e nunca mais tenha <strong>prejuízos financeiros</strong> na internet.
        </Text>

        <CTAButton
          variant="whatsapp"
          withArrow={false}
          borderRadius="md"
          as="a"
          href="#pacotes"
          rel="noopener noreferrer"
          aria-label="Não quero mais cair em Golpes"
          w={['90%', 'auto']}
          mx="auto"
          whiteSpace="nowrap"
        >
          <HStack gap={2} align="center" justify="center">
            <Text as="span" fontWeight="bold" fontSize={['sm', 'md']}>
              Não quero mais cair em Golpes
            </Text>
          </HStack>
        </CTAButton>

        <HStack
          gap={1}
          justify="center"
          alignItems="center"
          fontSize="sm"
          mt={1}
        >
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
