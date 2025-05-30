'use client'

import {
  Box,
  Grid,
  Heading,
  Image,
  Stack,
  HStack,
  Icon,
  Text,
  Button,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiBriefcase, FiMapPin, FiClock, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionStack = motion(Stack)

const features = [
  {
    icon: FiBriefcase,
    label: 'Dados da empresa',
    text: 'Acesse <strong>razão social</strong>, <strong>status</strong>, <strong>natureza jurídica</strong> e <strong>data de abertura</strong>.'
  },
  {
    icon: FiMapPin,
    label: 'Endereço e atividade',
    text: 'Veja o <strong>endereço oficial</strong>, atividades econômicas (<strong>CNAE</strong>) e quem são os <strong>sócios</strong> (QSA).'
  },
  {
    icon: FiClock,
    label: 'Cache e histórico',
    text: 'Economize tempo com <strong>consultas rápidas</strong>, cache automático e histórico inteligente.'
  },
  {
    icon: FiShield,
    label: 'Segurança',
    text: 'Tudo <strong>100% online</strong>, seguro e protegido – sem precisar instalar nada.'
  }
]

export default function Features() {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box py={20} px={6} bg="white">
      <MotionBox
        maxW="4xl"
        mx="auto"
        as={Grid}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={10}
        alignItems="center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Image
          src="/cnpj-consulta.png"
          alt="Tela do sistema de consulta CNPJ"
          borderRadius="md"
          boxShadow="lg"
          loading="lazy"
        />

        <Box>
          <Heading fontSize="3xl" mb={4} color="textPrimary" id="feature-heading" textAlign={{ base: 'center', md: 'left' }}>
            Verifique qualquer empresa antes de correr riscos online
          </Heading>

          <Text fontSize="md" mb={6} color="gray.600" id="feature-sub" textAlign={{ base: 'center', md: 'left' }}>
            Tenha clareza antes de confiar sua compra ou dados pessoais.
          </Text>

          <Stack color="gray.700" gap={6} role="list" aria-labelledby="feature-heading" aria-describedby="feature-sub">
            {features.map((item, index) => (
              <Box key={index}>
                <HStack align="start">
                  <Box
                    bg="blue.50"
                    p={2}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={item.icon} boxSize={5} color="blue.500" mt={1} />
                  </Box>
                  <Text dangerouslySetInnerHTML={{ __html: item.text }} />
                </HStack>
                {isMobile && index < features.length - 1 && <Box as="hr" borderColor="gray.200" my={4} />}
              </Box>
            ))}
          </Stack>

          <MotionBox
            mt={6}
            bg="gray.50"
            px={4}
            py={2}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Text fontSize="sm" color="gray.600">
              ✅ Mais de <strong>12.000 consultas realizadas</strong> por quem busca segurança online
            </Text>
          </MotionBox>

          <MotionButton
            mt={8}
            mx="auto"
            w={{ base: 'full', md: 'auto' }}
            colorScheme="green"
            size="lg"
            onClick={() => router.push('/login')}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Começar agora — é grátis e leva menos de 1 minuto
          </MotionButton>
        </Box>
      </MotionBox>
    </Box>
  )
}
