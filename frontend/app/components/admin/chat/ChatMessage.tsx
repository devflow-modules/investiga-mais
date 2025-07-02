'use client'

import {
  getAlign,
  getBgColor,
  getStatusIcon,
  getTextColor,
  getTimeFormatted
} from '@/utils/chatMessageHelpers'
import { Box, HStack, Text, useToken } from '@chakra-ui/react'
import { motion as framerMotion } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ChatMessageProps } from '@types'

const MotionBox = framerMotion.create(Box)

export function ChatMessage({
  conteudo,
  direcao,
  timestamp,
  status,
  atendente,
  onRetry
}: ChatMessageProps) {
  const [bgEntrada, bgSaida, gray200] = useToken('colors', [
    'gray100',
    'accent',
    'gray200'
  ])

  const align = getAlign(direcao)
  const bg = getBgColor(direcao, false, bgEntrada, bgSaida)
  const color = getTextColor(direcao)
  const time = getTimeFormatted(timestamp)
  const statusIcon = direcao === 'saida' && status ? getStatusIcon(status) : null
  const isSaida = direcao === 'saida'

  // Tooltip content
  const tooltipText = isSaida
    ? [
        atendente?.nome && `Enviado por: ${atendente.nome}`,
        status && `Status: ${status}`,
        timestamp &&
          `Horário: ${format(
            new Date(timestamp),
            "dd/MM/yyyy 'às' HH:mm:ss",
            { locale: ptBR }
          )}`
      ]
        .filter(Boolean)
        .join('\n')
    : undefined

  return (
    <Tooltip
      content={tooltipText}
      disabled={!tooltipText}
      // tipagem para evitar erro: qualquer prop extra é repassada internamente
      {...{ placement: 'top-start' }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        alignSelf={align}
        position="relative"
        px={4}
        py={2.5}
        maxW="85%"
        rounded="xl"
        boxShadow="md"
        bg={bg}
        color={color}
        fontSize="sm"
        border={!isSaida ? '1px solid' : undefined}
        borderColor={!isSaida ? gray200 : undefined}
        wordBreak="break-word"
        whiteSpace="pre-wrap"
        mt={1.5}
        mb={1.5}
        _hover={onRetry ? { cursor: 'pointer', opacity: 0.95 } : undefined}
        onClick={onRetry}
      >
        {/* Seta estilo balão */}
        <Box
          position="absolute"
          bottom="0"
          transform={
            isSaida
              ? 'translateY(50%) translateX(10%)'
              : 'translateY(50%) translateX(-10%)'
          }
          right={isSaida ? '0' : undefined}
          left={!isSaida ? '0' : undefined}
          w={0}
          h={0}
          borderStyle="solid"
          borderWidth={isSaida ? '8px 0 8px 12px' : '8px 12px 8px 0'}
          borderColor={
            isSaida
              ? `transparent transparent transparent ${bg}`
              : `transparent ${bg} transparent transparent`
          }
        />

        <Text mb={1.5} lineHeight="1.5">
          {conteudo}
        </Text>

        <HStack justify="flex-end" gap={1}>
          {time && (
            <Text fontSize="xs" color={isSaida ? 'whiteAlpha.700' : 'gray.500'}>
              {time}
            </Text>
          )}
          {statusIcon && (
            <Box
              as={statusIcon.Icon}
              boxSize={3.5}
              color={statusIcon.color}
              title={statusIcon.title}
            />
          )}
        </HStack>
      </MotionBox>
    </Tooltip>
  )
}
