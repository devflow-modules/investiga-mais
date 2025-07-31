'use client'

import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  Text,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'
import { RiskItem } from './RiskItem'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const MotionIcon = motion.create(Icon)

export function RisksSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const problemas = [
    'Oferta com preço muito abaixo do normal',
    'O site solicita informações pessoais desnecessárias',
    'Solicitam pagamento antes de entregar o resultado',
    'Dizem que não podem atender ligações ou chamadas de vídeo',
    'Após o pagamento, a empresa desaparece',
  ]

  return (
    <Box
      as="section"
      role="region"
      bg="background"
      aria-labelledby="risks-heading"
      minH="35vh"
      py={{ base: 12, md: 24 }}
      px={{ base: 6, md: 10, lg: 16 }}
      display="flex"
      alignItems="center"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        maxW="6xl"
        mx="auto"
        gap={{ base: 10, md: 20 }}
        align="flex-start"
        color="textPrimary"
      >
        {/* Título e introdução */}
        <VStack w="full" align={{ base: 'center', md: 'start' }} gap={6} flex={1}>
          <Box as="span" role="img" aria-hidden>
            {prefersReducedMotion ? (
              <Icon as={FiAlertTriangle} color="warning" boxSize={10} />
            ) : (
              <MotionIcon
                as={FiAlertTriangle}
                color="warning"
                boxSize={10}
                initial={{ y: 0 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </Box>

          <Heading
            id="risks-heading"
            textAlign={{ base: 'center', md: 'left' }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="accent"
            fontWeight="bold"
            textTransform="uppercase"
            lineHeight="short"
          >
            TEMOS CERTEZA QUE VOCÊ JÁ VIU ISSO ANTES
          </Heading>
        </VStack>

        {/* Lista de problemas */}
        <VStack align="start" gap={5} flex={2} px={{ base: 2, md: 4 }}>
          {problemas.map((text, index) => (
            <RiskItem key={text} text={text} index={index} />
          ))}

        </VStack>
      </Flex>
    </Box>
  )
}
