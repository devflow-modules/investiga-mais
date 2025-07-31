'use client'

import Image from 'next/image'
import {
  Box,
  Stack,
  Text,
  Heading,
  HStack,
  Icon
} from '@chakra-ui/react'
import { CTAButton } from '../ui/BaseButton'
import { FaWhatsapp } from 'react-icons/fa'

export function HeroHeadingSection() {
  return (
    <Box
      as="section"
      role="region"
      aria-labelledby="hero-heading"
      minH={{ base: '100vh', md: '85vh', lg: '100vh' }}
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
        zIndex={1}
        bg="blackAlpha.600"
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
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
          fontWeight="extrabold"
          lineHeight={{ base: 'short', md: 'shorter' }}
          textAlign="center"
          color="white"
          maxW="5xl"
          mx="auto"
          mb={{ base: 4, md: 6 }}
        >
          ANTES DE COMPRAR ONLINE, INVESTIGA+
        </Heading>

        <Text
          fontSize={{ base: 'md', sm: 'lg', md: 'xl', lg: 'xl' }}
          color="whiteAlpha.900"
          textAlign="center"
          maxW="3xl"
          mx="auto"
          mb={{ base: 8, md: 10 }}
          px={{ base: 4, sm: 6, md: 0 }}
        >
          Não seja mais uma vítima de <strong>golpes digitais</strong>. Proteja seus <strong>dados</strong>, descubra quem aplicou o golpe e nunca mais tenha <strong>prejuízos financeiros</strong> na internet.
        </Text>



        <CTAButton
          variant="whatsapp"
          withArrow={false}
          borderRadius="md"
          as="a"
          href="https://wa.me/5511990191040"
          rel="noopener noreferrer"
          aria-label="Abrir conversa no WhatsApp"
          w={['90%', 'auto']}
          mx="auto"
          whiteSpace="nowrap"
        >
          <HStack gap={2} align="center" justify="center">
            <Text as="span" fontWeight="bold" fontSize={['sm', 'md']}>
              Não quero mais cair em Golpes
            </Text>
            <Icon as={FaWhatsapp} boxSize={['1em', '1.2em']} />
          </HStack>
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
