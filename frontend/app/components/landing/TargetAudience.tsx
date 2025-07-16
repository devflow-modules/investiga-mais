'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  FiUsers,
  FiBriefcase,
  FiUserCheck,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi'
import { CTAButton } from '../ui/BaseButton'

const MotionBox = motion.create(Box)

const profiles = [
  {
    icon: FiShoppingCart,
    label: 'Compradores online',
    desc: 'Proteja seus dados antes de comprar online e evite fraudes financeiras.'
  },
  {
    icon: FiUserCheck,
    label: 'Freelancers',
    desc: 'Evite cair em golpes ao fechar contratos com empresas desconhecidas.'
  },
  {
    icon: FiBriefcase,
    label: 'Agências e mentores',
    desc: 'Tenha segurança antes de prestar serviços ou oferecer consultorias.'
  },
  {
    icon: FiUsers,
    label: 'Afiliados e B2B',
    desc: 'Analise empresas antes de fazer parcerias ou campanhas de vendas.'
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
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

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

        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="gray.600"
          maxW="2xl"
          mx="auto"
          textAlign="center"
        >
          Se você compra ou vende online, presta serviços ou faz parcerias, precisa investigar antes de confiar. Ideal para consumidores e profissionais que não podem correr riscos.
        </Text>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={6}
          mt={10}
          alignItems="stretch"
        >
          {profiles.map((p, i) => (
            <VStack
              key={i}
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
              <Text fontSize="sm" color="gray.600">{p.desc}</Text>
            </VStack>
          ))}
        </SimpleGrid>

        <Box
          mt={{ base: 12, md: 14 }}
          bg="gray.100"
          px={{ base: 4, md: 6 }}
          py={{ base: 6, md: 5 }}
          borderRadius="md"
          maxW="lg"
          mx="auto"
          textAlign="center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
                {testimonials[index].name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {testimonials[index].role}
              </Text>
              <Text mt={4} fontSize="sm" color="gray.700">
                “{testimonials[index].quote}”
              </Text>
            </motion.div>
          </AnimatePresence>

          <HStack gap={1} mt={4} justify="center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon as={FiStar} key={i} color="yellow.400" boxSize={4} />
            ))}
          </HStack>

          <HStack gap={2} mt={2} justify="center">
            {testimonials.map((_, i) => (
              <Box
                key={i}
                boxSize={2}
                rounded="full"
                bg={i === index ? 'gray.700' : 'gray.400'}
                cursor="pointer"
                onClick={() => setIndex(i)}
                transition="background 0.3s"
              />
            ))}
          </HStack>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: '1.5rem' }}
          >
            <CTAButton
              variant="cta"
              href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero experimentar agora
            </CTAButton>
          </motion.div>
        </Box>
      </MotionBox>
    </Box>
  )
}
