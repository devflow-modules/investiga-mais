'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCreditCard, FiUserCheck, FiBriefcase } from 'react-icons/fi'
import Testimonials from './Testimonials'

const MotionBox = motion.create(Box)

const profiles = [
  {
    icon: FiCreditCard, // Representa bem o ato de comprar online
    label: 'Compradores online',
  },
  {
    icon: FiUserCheck, // Representa bem a verificação de identidade, ideal para autônomos/freelancers
    label: 'Autônomos',
  },
  {
    icon: FiBriefcase, // Mais apropriado para representar empresas
    label: 'Empresas',
  }
]

const testimonials = [
  {
    name: 'Sandra A.',
    role: 'Consumidora online experiente',
    quote:
      'Já quase comprei em um site falso. Agora sempre checo com o Investiga+ antes de fazer qualquer compra.'
  },
  {
    name: 'Marcelo R.',
    role: 'Usuário digital ativo',
    quote:
      'Hoje em dia tudo é online. Com o Investiga+ me sinto mais seguro para comprar e proteger meus dados.'
  },
  {
    name: 'Carlos M.',
    role: 'Desenvolvedor autônomo',
    quote:
      'Antes do Investiga+, já caí em duas fraudes. Hoje só negocio com quem eu consigo verificar — me sinto muito mais seguro.'
  },
  {
    name: 'Juliana R.',
    role: 'Empreendedora digital',
    quote:
      'Usamos o Investiga+ para cada novo cliente. É rápido e nos protege de dores de cabeça futuras.'
  },
  {
    name: 'Eduardo V.',
    role: 'Especialista em vendas B2B',
    quote:
      'Minhas recomendações agora têm muito mais segurança. O Investiga+ virou parte do meu processo.'
  },
  {
    name: 'Rafael C.',
    role: 'Gestor de e-commerce',
    quote:
      'Avalio todos os fornecedores antes de fechar negócio. O Investiga+ trouxe agilidade e confiança.'
  }
]

export default function TargetAudience() {
  return (
    <Box as="section" id="publico-alvo" py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }} bg="white">
      <MotionBox
        textAlign="center"
        maxW="5xl"
        mx="auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Heading fontSize={{ base: '2xl', md: '4xl' }} mb={4} color="textPrimary">
          Quem já usa o Investiga+ para evitar golpes e prejuízos?
        </Heading>

        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 3 }}
          gap={6}
          mt={10}
          alignItems="stretch"
        >
          {profiles.map((p) => (
            <VStack
              key={p.label}
              bg="gray.50"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              textAlign="center"
              gap={3}
              h="100%"
            >
              <Icon as={p.icon} boxSize={6} color="blue.500" aria-hidden />
              <Text fontWeight="bold" fontSize="lg">{p.label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </MotionBox>

      <Box mt={{ base: 6, sm: 8, md: 10, lg: 12 }} maxW="4xl" mx="auto" textAlign="center">
        <Testimonials />
      </Box>

    </Box>
  )
}
