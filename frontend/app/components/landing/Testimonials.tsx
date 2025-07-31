'use client'

import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Circle,
  Image,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const MotionBox = motion.create(Box)

const testimonials = [
  {
    name: 'André Lins',
    role: 'Comprador Online',
    quote:
      'Eu já tinha levado um golpe comprando online, então comecei a usar o Investiga+ sempre que tenho dúvida sobre um vendedor. Já evitei dois prejuízos. Vale cada centavo.',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg'
  },
  {
    name: 'Fernanda C.',
    role: 'Autônoma / Profissional Liberal',
    quote:
      'Como trabalho por conta, preciso checar quem são meus clientes antes de fechar negócio. O Investiga+ já me ajudou a evitar um calote e ainda uso pra conferir propostas suspeitas que recebo por e-mail.',
    avatar: 'https://randomuser.me/api/portraits/women/53.jpg'
  },
  {
    name: 'Rodrigo M.',
    role: 'Representante de Empresa',
    quote:
      'Antes de fechar parcerias ou contratar fornecedores, fazemos uma análise com o Investiga+. Evita retrabalho, dor de cabeça e protege a reputação da empresa.',
    avatar: 'https://randomuser.me/api/portraits/men/69.jpg'
  }
]

const colors = ['blue.500', 'green.500', 'purple.500', 'red.500', 'orange.500']

export default function Testimonials() {
  return (
    <Box as="section" px={{ base: 4, md: 6 }} textAlign="center">
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
