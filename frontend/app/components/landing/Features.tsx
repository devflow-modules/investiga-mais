'use client'

import {
  Box,
  Grid,
  Heading,
  Stack,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  FiShield,
  FiSearch,
  FiCheckCircle,
  FiUsers,
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CTAButton } from '../ui/BaseButton'

const MotionBox = motion.create(Box)

// Lista de funcionalidades com ícones, título e descrição
const features = [
  {
    icon: FiShield,
    label: 'Proteja seus dados',
    text: 'Saiba se o site é seguro e evite <strong>roubo de informações</strong>.',
  },
  {
    icon: FiUsers,
    label: 'Confirme se a empresa é real',
    text: 'Veja <strong>nome</strong>, <strong>sócios</strong> e <strong>CNPJ</strong> para ter certeza de que a loja existe.',
  },
  {
    icon: FiCheckCircle,
    label: 'Evite golpes disfarçados de loja',
    text: 'Confira <strong>há quanto tempo</strong> o site existe e fuja de armadilhas.',
  },
  {
    icon: FiSearch,
    label: 'Veja o que outros clientes dizem',
    text: 'Consulte <strong>histórico da empresa</strong> e <strong>listas de alerta</strong> antes de comprar.',
  },
]

export default function Features() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const imagemSrc = useBreakpointValue({
    base: '/imagem2.webp',
    md: '/imagem1.webp'
  }) ?? '/imagem2.webp'

  return (
    <Box
      as="section"
      id="verificacao"
      aria-labelledby="verificacao-heading"
      py={8}
      px={{ base: 4, md: 6 }}
      bg="white"
    >
      <MotionBox
        maxW="6xl"
        mx="auto"
        as={Grid}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={{ base: 10, md: 16 }}
        alignItems="center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* MOBILE: Título antes da imagem */}
        {isMobile && (
          <Box textAlign="center" order={0}>
            <Heading
              as="h2"
              id="verificacao-heading"
              fontSize="2xl"
              mb={4}
              color="textPrimary"
            >
              Verifique a credibilidade de sites e empresas com o Investiga+
            </Heading>
          </Box>
        )}

        {/* IMAGEM: ordem varia conforme dispositivo */}
        <Box
          order={{ base: 1, md: 1 }}
          position="relative"
          w="100%"
          aspectRatio={{ base: '4/5', md: '3/4' }}
          maxH={{ base: '300px', md: '500px' }}
          role="img"
          aria-label="Pessoa pesquisando a reputação de um site"
        >
          <Image
            src={imagemSrc}
            alt="Pessoa pesquisando a reputação de um site"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: isMobile ? 'cover' : 'contain',
              borderRadius: '0.5rem',
            }}
          />
        </Box>

        {/* CONTEÚDO PRINCIPAL */}
        <Box order={{ base: 2, md: 2 }}>
          {/* SUBTÍTULO (visível em todas as versões após imagem) */}
          {!isMobile && (
            <Heading
              as="h2"
              id="verificacao-heading"
              fontSize="3xl"
              mb={4}
              color="textPrimary"
            >
              Verifique a credibilidade de sites e empresas com o Investiga+
            </Heading>
          )}

          <Text fontSize="md" mb={6} color="gray.600" textAlign={{ base: 'center', md: 'left' }}>
            Antes de correr riscos de golpes online, saiba a fundo com quem você está lidando!
          </Text>

          {/* Lista de funcionalidades */}
          <Stack color="gray.700" gap={6}>
            {features.map((item, index) => (
              <Box key={item.label} as="article" aria-labelledby={`feature-${index}`}>
                <HStack align="start" gap={4}>
                  <Box
                    bg="blue.50"
                    p={2}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={item.icon}
                      boxSize={5}
                      color="blue.500"
                      mt={1}
                      aria-hidden="true"
                    />
                  </Box>
                  <Box>
                    <Text
                      id={`feature-${index}`}
                      fontWeight="bold"
                      fontSize="md"
                      mb={1}
                      color="textPrimary"
                    >
                      {item.label}
                    </Text>
                    <Text
                      fontSize="md"
                      color="textPrimary"
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </Box>
                </HStack>
                {/* Separador no mobile entre os itens */}
                {isMobile && index < features.length - 1 && (
                  <Box as="hr" borderColor="gray.200" my={4} />
                )}
              </Box>
            ))}
          </Stack>

          {/* Bloco de prova social */}
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
              ✅ Mais de <strong>100.000 verificações</strong> realizadas por quem busca segurança online
            </Text>
          </MotionBox>

          {/* Botão CTA */}
          <MotionBox
            mt={8}
            mx="auto"
            display="flex"
            justifyContent={{ base: 'center', md: 'flex-start' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <CTAButton href="#pacotes" aria-label="Comece a verificar agora">
              Comece a Verificar Agora
            </CTAButton>
          </MotionBox>
        </Box>
      </MotionBox>
    </Box>
  )
}
