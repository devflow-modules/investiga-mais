'use client'

import {
  Box,
  Grid,
  Heading,
  Stack,
  HStack,
  Icon,
  Text,
  useBreakpointValue
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

const features = [
  {
    icon: FiShield,
    label: 'Proteja seus dados',
    text: 'Saiba se o site é seguro e evite <strong>roubo de informações</strong>.'
  },
  {
    icon: FiUsers,
    label: 'Confirme se a empresa é real',
    text: 'Veja <strong>nome</strong>, <strong>sócios</strong> e <strong>CNPJ</strong> para ter certeza de que a loja existe.'
  },
  {
    icon: FiCheckCircle,
    label: 'Evite golpes disfarçados de loja',
    text: 'Confira <strong>há quanto tempo</strong> o site existe e fuja de armadilhas.'
  },
  {
    icon: FiSearch,
    label: 'Veja o que outros clientes dizem',
    text: 'Consulte <strong>histórico da empresa</strong> e <strong>listas de alerta</strong> antes de comprar.'
  }
]

export default function Features() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const imagemSrc = useBreakpointValue({
    base: '/imagem2.webp',
    md: '/imagem1.webp'
  }) ?? '/imagem2.webp'

  return (
    <Box as="section" aria-labelledby="feature-heading" py={20} px={{ base: 4, md: 6 }} bg="white">
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
        {/* ✅ Imagem responsiva com altura garantida */}
        <Box
          position="relative"
          w="100%"
          aspectRatio={{ base: '4/5', md: '3/4' }}
          maxH={{ base: '300px', md: '500px' }}
        >
          <Image
            src={imagemSrc}
            alt="Tela do sistema de verificação de empresa"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: isMobile ? 'cover' : 'contain',
              borderRadius: '0.5rem'
            }}
          />
        </Box>

        {/* ✅ Conteúdo textual */}
        <Box>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            mb={4}
            color="textPrimary"
            id="feature-heading"
            textAlign={{ base: 'center', md: 'left' }}
          >
            Verifique a credibilidade de sites e empresas com o Investiga+
          </Heading>

          <Text
            fontSize="md"
            mb={6}
            color="gray.600"
            id="feature-sub"
            textAlign={{ base: 'center', md: 'left' }}
          >
            Antes de correr riscos de golpes online, saiba a fundo com quem você está lidando!
          </Text>

          <Stack color="gray.700" gap={6} role="list" aria-labelledby="feature-heading">
            {features.map((item, index) => (
              <Box key={item.label} as="article" role="listitem">
                <HStack align="start" gap={4}>
                  <Box
                    bg="blue.50"
                    p={2}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    aria-hidden
                  >
                    <Icon as={item.icon} boxSize={5} color="blue.500" mt={1} />
                  </Box>
                  <Box>
                    {/* Label (título) da feature */}
                    <Text fontWeight="bold" fontSize="md" mb={1} color="textPrimary">
                      {item.label}
                    </Text>

                    {/* Texto com destaque usando dangerouslySetInnerHTML */}
                    <Text
                      fontSize="md"
                      color="textPrimary"
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </Box>
                </HStack>

                {/* Separador em mobile */}
                {isMobile && index < features.length - 1 && (
                  <Box as="hr" borderColor="gray.200" my={4} />
                )}
              </Box>
            ))}

          </Stack>

          {/* Badge de confiança */}
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
            <CTAButton
              href="#pacotes"
              aria-label="Comece a Verificar Agora"
            >
              Comece a Verificar Agora
            </CTAButton>
          </MotionBox>

        </Box>
      </MotionBox>
    </Box>
  )
}
