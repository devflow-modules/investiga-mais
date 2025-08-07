'use client'

import {
  Box,
  Stack,
  Heading,
  Text,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { FaCheckCircle, FaGift, FaUserShield } from 'react-icons/fa'
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
        icone: FaUserShield,
        descricao: 'Receba ajuda imediata sempre que precisar.'
      },
      { texto: 'Acesso fácil e vitalício', icone: FaCheckCircle },
      { texto: 'Consultas rápidas, resultado imediato', icone: FaCheckCircle },
      { texto: 'Garantia estendida de 30 dias', icone: FaCheckCircle },
      { texto: 'Proteja seus dados pessoais e empresariais', icone: FaCheckCircle },
      { texto: 'Descubra quem aplicou o Golpe em você', icone: FaCheckCircle },
      { texto: 'Nunca mais tenha prejuízos financeiros', icone: FaCheckCircle },
      { texto: 'Não seja mais uma vítima de golpes digitais', icone: FaCheckCircle },
      { texto: 'Proteja sua família', icone: FaCheckCircle },
      {
        texto: 'Aula Exclusiva - Golpes Modernos',
        icone: FaGift,
      },
      {
        texto: 'Aula Exclusiva - Pix Seguro',
        icone: FaGift,
      },
      {
        texto: 'Aula Exclusiva - Senhas Fortes',
        icone: FaGift,
      },
      {
        texto: 'Aula Exclusiva - WhatsApp Blindado',
        icone: FaGift,
      },
      {
        texto: 'Aula Exclusiva - App de Banco Seguro',
        icone: FaGift,
      },
      {
        texto: 'Aula Exclusiva - Como Proteger sua Família',
        icone: FaGift,
      },
    ]
    : [
      { texto: '5 Consultas Completas', icone: FaCheckCircle },
      { texto: 'Suporte via email', icone: FaCheckCircle },
      { texto: 'Acesso fácil e vitalício', icone: FaCheckCircle },
      { texto: 'Consultas rápidas, resultado imediato', icone: FaCheckCircle },
      { texto: 'Garantia estendida de 30 dias', icone: FaCheckCircle },
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
          {isPremium ? 'Acesso Premium' : 'Acesso Básico'}
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
            <Box
              as="div"
              key={beneficio.texto}
              display="flex"
              alignItems="start"
              mb={3}
            >
              <Icon
                as={beneficio.icone}
                color={
                  beneficio.icone === FaGift
                    ? 'purple.400'
                    : beneficio.icone === FaUserShield
                      ? 'purple.500'
                      : 'green.400'
                }
                mt={1}
                mr={2}
                boxSize={beneficio.icone === FaUserShield ? '1.25em' : 4}
                aria-hidden="true"
              />

              <Box>
                {/* Título e Bônus lado a lado */}
                <Box as="dt" display="flex" alignItems="center" gap={2}>
                  <Text fontWeight="semibold">{beneficio.texto}</Text>

                  {beneficio.icone === FaGift && beneficio.texto !== 'Consultor de Segurança Digital disponível 24h via WhatsApp' && (
                    <Badge
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

                {beneficio.descricao && (
                  <Box as="dd" fontSize="sm" color="gray.600">
                    {beneficio.descricao}
                  </Box>
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
              ? 'https://pay.kirvano.com/9f33dc01-c7b8-4758-81c8-64782f1293d9?utm_source=facebook&utm_medium=cpc&utm_campaign=promo_premium'
              : 'https://pay.kirvano.com/a5c82c5a-e304-477f-8a20-2d6a08856077?utm_source=facebook&utm_medium=cpc&utm_campaign=promo_basico'
          }
          onClick={() => {
            const valor = isPremium ? 19.9 : 12.9

            // Google Analytics
            window.gtag?.('event', 'clique_pacote', {
              pacote: tipo,
              valor,
            })

            // Meta Pixel - Lead (somente uma vez por sessão)
            const leadKey = `lead_${tipo}`

            if (!sessionStorage.getItem(leadKey)) {
              window.fbq?.('track', 'Lead', {
                content_name: tipo,
              })
              sessionStorage.setItem(leadKey, '1')
            }

            // Meta Pixel - Purchase (sempre dispara)
            window.fbq?.('track', 'Purchase', {
              value: valor,
              currency: 'BRL',
              content_name: tipo,
            })
          }}

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
