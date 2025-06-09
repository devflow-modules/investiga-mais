'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Circle,
  Button
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Freelancer de TI',
    quote: 'Antes do Investiga+, já caí em duas fraudes. Hoje só negocio com quem eu consigo verificar — me sinto muito mais seguro.',
  },
  {
    name: 'Juliana R.',
    role: 'Sócia em agência de marketing',
    quote: 'Usamos o Investiga+ para cada novo cliente. É rápido e nos protege de dores de cabeça futuras.',
  },
  {
    name: 'Eduardo V.',
    role: 'Consultor de negócios B2B',
    quote: 'Minhas recomendações agora têm muito mais segurança. O Investiga+ virou parte do meu processo.',
  }
]

const colors = ['blue.500', 'green.500', 'purple.500', 'red.500', 'orange.500']

const MotionBox = motion(Box)

export default function Testimonials() {
  return (
    <Box py={20} px={6} bg="background" textAlign="center">
      <Heading fontSize="3xl" mb={10} color="textPrimary">
        O que dizem sobre o Investiga+
      </Heading>

      <VStack gap={10} maxW="4xl" mx="auto">
        {testimonials.map((item, i) => (
          <MotionBox
            key={i}
            bg="white"
            p={6}
            rounded="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Text fontSize="md" fontStyle="italic" color="gray.700">
              “{item.quote}”
            </Text>

            <HStack mt={4} gap={3} justify="center">
              <Circle size="32px" bg={colors[i % colors.length]} color="white" fontSize="xs" fontWeight="bold">
                {item.name.charAt(0)}
              </Circle>
              <VStack gap={0} align="start">
                <Text fontWeight="bold">{item.name}</Text>
                <Text fontSize="sm" color="gray.500">{item.role}</Text>
              </VStack>
            </HStack>

            <HStack mt={3} justify="center" color="yellow.400">
              {[...Array(5)].map((_, idx) => (
                <Icon as={FiStar} key={idx} />
              ))}
            </HStack>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  )
}
