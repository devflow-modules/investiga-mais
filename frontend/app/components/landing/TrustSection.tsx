'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react'
import { CTAButton } from '../ui/BaseButton'
import { FaWhatsapp } from 'react-icons/fa'

export default function SafetyStatement() {
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl' })

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={6}
      bg="background"
      color="textPrimary"
      textAlign="center"
    >
      <VStack gap={6} maxW="3xl" mx="auto">
        <Heading
          as="h2"
          fontSize={headingSize}
          fontWeight="bold"
          lineHeight="1.3"
        >
          Atualmente você compra na internet com o coração na mão e contando com a sorte…
        </Heading>

        <Text as="p" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold" color="textPrimary">
          Com o Investiga+ você tem a certeza de que vai receber o que está comprando
          e que seus dados pessoais estarão protegidos!
        </Text>

        <Text as="p" fontSize="lg" color="textSecondary" fontWeight="medium">
          Agora você só cai em golpe se quiser!
        </Text>

        <CTAButton
          variant="cta"
          withArrow={false}
          href="https://wa.me/5511990191040?text=Quero%20ter%20acesso%20à%20ferramenta%20do%20Investiga%2B?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Investiga%2B"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack gap={3}>
            <Text>Não quero mais cair em Golpes</Text>
            <Icon as={FaWhatsapp} boxSize={['1em', '1.2em']} />
          </HStack>
        </CTAButton>

      </VStack>
    </Box>
  )
}
