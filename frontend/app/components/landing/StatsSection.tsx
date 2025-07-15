'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { CTAButton } from '../ui/BaseButton'

const MotionBox = motion.create(Box)

export default function StatsSection() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const stats = [
    { value: 792000, label: 'Golpes em 2025' },
    { value: 267000, label: 'Sites falsos ativos' },
    {
      value: 3500000000,
      label: 'Perdidos em 2024',
      prefix: 'R$',
      formatted: isMobile ? undefined : 'R$3.5 Bi'
    }
  ]

  return (
    <Box as="section" py={20} px={6} bg="white" textAlign="center">
      <Heading as="h1" fontSize={{ base: '2xl', md: '4xl' }} color="blue.900" mb={4}>
        Sua segurança é importante.
      </Heading>

      <Heading as="h2" fontSize={{ base: 'xl', md: '3xl' }} color="blue.900" mb={4}>
        Milhares já caíram em golpes. Você não precisa ser o próximo.
      </Heading>

      <Text fontSize="md" color="gray.600" maxW="2xl" mx="auto" mb={12}>
        Um clique errado pode custar seu nome, seu cartão e sua paz. Proteja-se com informações confiáveis.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} maxW="5xl" mx="auto" mb={12}>
        {stats.map((stat, i) => (
          <MotionBox
            key={i}
            p={6}
            bg="blue.900"
            color="green.300"
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <Text fontSize="4xl" fontWeight="bold">
              {stat.formatted ? (
                stat.formatted
              ) : (
                <>
                  {stat.prefix || ''}
                  <CountUp end={stat.value} separator="." duration={2} />
                </>
              )}
            </Text>
            <Text fontSize="sm" mt={2} color="green.100">
              {stat.label.toUpperCase()}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>

      <VStack gap={6}>
        <HStack gap={3} justify="center">
          <Icon as={FiShield} color="green.400" boxSize={6} />
          <Text fontWeight="medium" color="gray.700">
            Mais de <b>100.000</b> golpes evitados e dados pessoais protegidos.
          </Text>
        </HStack>

        <Text fontWeight="medium" color="gray.700">
          Não espere mais um golpe para começar a se proteger.
        </Text>
        <CTAButton
          variant="cta"
          size="lg"
          px={6}
          py={4}
          borderRadius="md"
          withArrow
          as="button"
          href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comece Agora
        </CTAButton>
      </VStack>
    </Box>
  )
}
