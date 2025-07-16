'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Circle,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const MotionBox = motion.create(Box)

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Freelancer de TI',
    quote:
      'Antes do Investiga+, já caí em duas fraudes. Hoje só negocio com quem eu consigo verificar — me sinto muito mais seguro.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Juliana R.',
    role: 'Sócia em agência de marketing',
    quote:
      'Usamos o Investiga+ para cada novo cliente. É rápido e nos protege de dores de cabeça futuras.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Eduardo V.',
    role: 'Comprador Online',
    quote:
      'Minhas recomendações agora têm muito mais segurança. O Investiga+ virou parte do meu processo.',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg'
  }
]

const colors = ['blue.500', 'green.500', 'purple.500', 'red.500', 'orange.500']

export default function Testimonials() {
  return (
    <Box as="section" py={20} px={6} bg="background" textAlign="center">
      <Heading as="h2" fontSize="3xl" mb={10} color="textPrimary">
        O que dizem sobre o Investiga+
      </Heading>

      <VStack gap={10} maxW="4xl" mx="auto">
        {testimonials.map((item, i) => (
          <MotionBox
            as="article"
            key={i}
            bg="white"
            p={6}
            rounded="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            aria-label={`Depoimento de ${item.name}`}
          >
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              fontStyle="italic"
              color="gray.700"
              lineHeight="1.7"
            >
              “{item.quote}”
            </Text>

            <HStack mt={5} gap={3} justify="center" align="center">
              {item.avatar ? (
                <Image
                  src={item.avatar}
                  alt={`Foto de ${item.name}`}
                  boxSize="36px"
                  rounded="full"
                  objectFit="cover"
                  loading="lazy"
                />
              ) : (
                <Circle
                  size="36px"
                  bg={colors[i % colors.length]}
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  {item.name.charAt(0)}
                </Circle>
              )}

              <VStack gap={0} align="start">
                <Text fontWeight="bold" fontSize="sm">
                  {item.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.role}
                </Text>
              </VStack>
            </HStack>

            <HStack mt={3} justify="center" color="yellow.400" aria-label="Avaliação 5 estrelas">
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
