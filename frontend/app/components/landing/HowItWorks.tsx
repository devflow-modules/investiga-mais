'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  Button,
  SimpleGrid,
  Flex,
  useBreakpointValue,
  chakra
} from '@chakra-ui/react'
import { FiSearch, FiShield, FiAlertCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { IconType } from 'react-icons'
import { CTAButton } from '../ui/BaseButton'

const steps: { icon: IconType; title: string; description: string }[] = [
  {
    icon: FiSearch,
    title: '01',
    description: 'Digite o endereço do site ou dados da empresa que deseja verificar.'
  },
  {
    icon: FiShield,
    title: '02',
    description: 'Nosso sistema analisa profundamente histórico, reputação e todos os sinais de risco.'
  },
  {
    icon: FiAlertCircle,
    title: '03',
    description: 'Você recebe uma resposta clara: é confiável ou representa um golpe.'
  }
]

const MotionBox = motion.div

export default function HowItWorks() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const router = useRouter()

  return (
    <Box bg="background" py={{ base: 12, md: 24 }} px={{ base: 4, md: 8 }}>
      <VStack gap={6} maxW="5xl" mx="auto" textAlign="center">
        <Text fontSize="sm" fontWeight="bold" color="green.400" textTransform="uppercase">
          Conheça o Investiga+
        </Text>
        <Heading fontSize={{ base: '2xl', md: '4xl' }} color="textPrimary">
          Como funciona?
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} mt={12} maxW="6xl" mx="auto">
        {steps.map((step, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VStack gap={4} textAlign="center">
              <Flex
                boxSize={16}
                align="center"
                justify="center"
                rounded="full"
                bg="accent"
                color="white"
                fontSize="2xl"
                fontWeight="bold"
              >
                {step.title}
              </Flex>
              <Icon as={step.icon} boxSize={8} color="accent" />
              <Text fontSize="md" fontWeight="medium" color="textPrimary">
                {step.description}
              </Text>
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>

      <VStack gap={6} mt={16}>
        <Flex gap={2} align="center" justify="center">
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="textPrimary">
            <Icon as={FiShield} color="green.400" boxSize={5} aria-label="Seguro" /> Seguro
          </Text>
          <Text color="gray.400">|</Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="textPrimary">
            <Icon as={FiAlertCircle} color="red.400" boxSize={5} aria-label="Golpe" /> Golpe
          </Text>
        </Flex>

        <CTAButton
          variant="cta"
          onClick={() => router.push('/login')}
        >
          QUERO GARANTIR MINHA SEGURANÇA
        </CTAButton>
      </VStack>
    </Box>
  )
}
