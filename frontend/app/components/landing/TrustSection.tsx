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
import { FiSend } from 'react-icons/fi'
import { CTAButton } from '../ui/BaseButton'

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
        <Heading fontSize={headingSize} fontWeight="bold">
          Atualmente você compra na internet com o coração na mão e contando com a sorte…
        </Heading>

        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold">
          Com o Investiga+ você tem{' '}
          <Text as="span" fontWeight="bold" color="textPrimary">
            a certeza de que vai receber o que está comprando e que seus dados pessoais estarão protegidos!
          </Text>
        </Text>

        <Text fontSize="lg" color="textSecondary" fontWeight="medium">
          Agora você só cai em golpe se quiser!
        </Text>

        <CTAButton
          variant="cta"
          withArrow={false}
          href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack gap={3}>
            <Text whiteSpace="nowrap">NÃO QUERO MAIS CAIR EM GOLPES</Text>
            <Icon as={FiSend} />
          </HStack>
        </CTAButton>
      </VStack>
    </Box>
  )
}
