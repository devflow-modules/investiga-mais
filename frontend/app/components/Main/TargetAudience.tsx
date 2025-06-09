'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  HStack
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiUsers, FiBriefcase, FiUserCheck, FiShoppingCart } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'

const MotionBox = motion(Box)

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
    quote: 'Já quase comprei em um site falso. Agora sempre checo com o Investiga+ antes de fazer qualquer compra.'
  },
  {
    name: 'Marcelo R.',
    role: 'Usuário digital ativo',
    quote: 'Hoje em dia tudo é online. Com o Investiga+ me sinto mais seguro para comprar e proteger meus dados.'
  },
  {
    name: 'Carlos M.',
    role: 'Desenvolvedor autônomo',
    quote: 'Antes do Investiga+, já caí em duas fraudes. Hoje só negocio com quem eu consigo verificar — me sinto muito mais seguro.'
  },
  {
    name: 'Juliana R.',
    role: 'Empreendedora digital',
    quote: 'Usamos o Investiga+ para cada novo cliente. É rápido e nos protege de dores de cabeça futuras.'
  },
  {
    name: 'Eduardo V.',
    role: 'Especialista em vendas B2B',
    quote: 'Minhas recomendações agora têm muito mais segurança. O Investiga+ virou parte do meu processo.'
  },
  {
    name: 'Rafael C.',
    role: 'Gestor de e-commerce',
    quote: 'Avalio todos os fornecedores antes de fechar negócio. O Investiga+ trouxe agilidade e confiança.'
  }
]

export default function TargetAudience() {
  const [index, setIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box id="publico-alvo" py={20} px={6} bg="white">
      <MotionBox
        textAlign="center"
        maxW="4xl"
        mx="auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Heading fontSize="3xl" mb={4} color="textPrimary">
          Quem já usa o Investiga+ para evitar golpes e prejuízos?
        </Heading>
        <Text
          fontSize="md"
          color="gray.600"
          maxW="2xl"
          mx="auto"
          textAlign={{ base: 'center', md: 'left' }}
        >
          Se você vende, presta serviços ou faz parcerias, precisa investigar antes de confiar. Ideal para profissionais e negócios que não podem correr riscos.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 4 }} gap={8} mt={10}>
          {profiles.map((p, i) => (
            <VStack
              key={i}
              bg="gray.50"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              align="start"
            >
              <Icon as={p.icon} boxSize={6} color="blue.500" />
              <Text fontWeight="bold" fontSize="lg">{p.label}</Text>
              <Text fontSize="sm" color="gray.600">{p.desc}</Text>
            </VStack>
          ))}
        </SimpleGrid>

        <Box
          mt={14}
          bg="gray.100"
          px={6}
          py={5}
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
              <Text fontWeight="bold" fontSize={{ base: 'xl', md: 'lg' }}>
                {testimonials[index].name}
              </Text>
              <Text fontSize="sm" color="gray.500">{testimonials[index].role}</Text>
              <Text mt={4} fontSize="sm" color="gray.700">
                “{testimonials[index].quote}”
              </Text>
            </motion.div>
          </AnimatePresence>

          <HStack gap={1} mt={4} justify="center">
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                as={AiFillStar}
                color="yellow.400"
                _hover={{ color: 'yellow.600' }}
                transition="color 0.2s"
                cursor="pointer"
              />
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
              />
            ))}
          </HStack>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: '1.5rem' }}
          >
            <Box
              as="button"
              bg="black"
              color="white"
              fontWeight="bold"
              px={6}
              py={2}
              rounded="md"
              _hover={{ bg: 'gray.800' }}
              onClick={() => router.push('/login')}
            >
              Quero experimentar agora
            </Box>
          </motion.div>
        </Box>
      </MotionBox>
    </Box>
  )
}
