'use client'

import {
  Box,
  Stack,
  Heading,
  Text,
  Icon,
  Badge,
  ListItem,
  List,
} from '@chakra-ui/react'
import { FaCheckCircle, FaGift } from 'react-icons/fa'
import { CTAButton } from '../ui/BaseButton'
import { motion } from 'framer-motion'

const MotionBox = motion.create(Box)
const MotionCTAButton = motion.create(CTAButton)

interface PlanoCardProps {
  tipo: 'basico' | 'premium'
}

export function PlanoCard({ tipo }: PlanoCardProps) {
  const isPremium = tipo === 'premium'

  const beneficios = isPremium
    ? [
        { texto: 'Consultas Completas sem Limites', icone: FaCheckCircle },
        {
          texto: 'Consultor de Segurança Digital disponível 24h via WhatsApp',
          icone: FaGift,
          descricao: 'Receba ajuda imediata sempre que precisar.'
        },
        { texto: 'Início imediato', icone: FaCheckCircle },
        { texto: 'Garantia de 7 dias (Lei do Consumidor)', icone: FaCheckCircle },
        { texto: 'Proteja seus dados pessoais e empresariais', icone: FaCheckCircle },
        { texto: 'Descubra quem aplicou o Golpe em você', icone: FaCheckCircle },
        { texto: 'Nunca mais tenha prejuízos financeiros', icone: FaCheckCircle },
        { texto: 'Não seja mais uma vítima de golpes digitais', icone: FaCheckCircle },
        { texto: 'Proteja sua família', icone: FaCheckCircle },
        {
          texto: 'Golpes Modernos',
          icone: FaGift,
        },
        {
          texto: 'Pix Seguro',
          icone: FaGift,
        },
        {
          texto: 'Senhas Fortes',
          icone: FaGift,
        },
        {
          texto: 'WhatsApp Blindado',
          icone: FaGift,
        },
        {
          texto: 'App de Banco Seguro',
          icone: FaGift,
        },
        {
          texto: 'Como Proteger sua Família',
          icone: FaGift,
        },
      ]
    : [
        { texto: '5 Consultas Completas', icone: FaCheckCircle },
        { texto: 'Suporte via email', icone: FaCheckCircle },
        { texto: 'Início imediato', icone: FaCheckCircle },
        { texto: 'Garantia de 7 dias (Lei do Consumidor)', icone: FaCheckCircle },
        { texto: 'Suporte 24h via email', icone: FaCheckCircle },
        { texto: 'Proteja seus dados pessoais e empresariais', icone: FaCheckCircle },
        { texto: 'Descubra quem aplicou o Golpe em você', icone: FaCheckCircle },
        { texto: 'Nunca mais tenha prejuízos financeiros', icone: FaCheckCircle },
        { texto: 'Não seja mais uma vítima de golpes digitais', icone: FaCheckCircle },
        { texto: 'Proteja sua família', icone: FaCheckCircle },
      ]

  return (
    <MotionBox
      bg={isPremium ? 'green.50' : 'white'}
      boxShadow={isPremium ? 'lg' : 'md'}
      borderRadius="lg"
      p={[5, 6]}
      borderWidth={isPremium ? '2px' : '1px'}
      borderColor={isPremium ? 'green.400' : 'gray.200'}
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      {isPremium && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          bg="green.400"
          color="white"
          px={2}
          py={0.5}
          borderRadius="full"
          fontSize="0.75rem"
          fontWeight="semibold"
        >
          Mais Vendido 🔥
        </Badge>
      )}

      <Stack gap={4} role="list">
        <Heading as="h3" fontSize="xl">
          {isPremium ? 'Pacote Premium' : 'Pacote Básico'}
        </Heading>

        {isPremium && (
          <>
            <Badge colorScheme="green" fontSize="xs" w="fit-content">
              Economize 70%
            </Badge>
            <Text fontSize="lg" color="gray.600" textDecoration="line-through">
              R$ 69,90
            </Text>
          </>
        )}

        <Text
          fontSize="3xl"
          fontWeight="bold"
          color={isPremium ? 'green.700' : 'gray.800'}
        >
          {isPremium ? 'R$ 19,90' : 'R$ 12,90'}
        </Text>

        <Box as="dl" gap={3} role="list">
          {beneficios.map((beneficio) => (
            <Box as="div" key={beneficio.texto} display="flex" alignItems="start" mb={3}>
              <Icon
                as={beneficio.icone}
                color={beneficio.icone === FaGift ? 'purple.400' : 'green.400'}
                mt={1}
                mr={2}
                aria-hidden="true"
              />
              <Box>
                <Box as="dt" fontWeight="semibold">{beneficio.texto}</Box>
                {beneficio.descricao && (
                  <Box as="dd" fontSize="sm" color="gray.600">{beneficio.descricao}</Box>
                )}
                {beneficio.icone === FaGift && (
                  <Badge
                    ml={1}
                    bg="purple.500"
                    color="white"
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="xs"
                  >
                    Bônus
                  </Badge>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <MotionCTAButton
          data-plan={tipo}
          variant={isPremium ? 'whatsapp' : 'cta'}
          href={
            isPremium
              ? 'https://pay.kirvano.com/b9e2adfb-4420-4460-aed5-03ddfee98fe0'
              : 'https://pay.kirvano.com/1ba6b342-7aee-4eb4-b776-839a7fb27e83'
          }
          rel="noopener noreferrer"
          aria-label="Compre agora"
          withArrow={false}
          w="full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Compre agora
        </MotionCTAButton>
      </Stack>
    </MotionBox>
  )
}
