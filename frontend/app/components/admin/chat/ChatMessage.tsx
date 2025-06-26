'use client'

import { Box, Text, useToken, HStack } from '@chakra-ui/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { JSX } from 'react'
import { BiTimeFive, BiCheck, BiCheckDouble } from 'react-icons/bi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { MdErrorOutline } from 'react-icons/md'

type Direcao = 'entrada' | 'saida'
type Status = 'pendente' | 'simulada' | 'enviada' | 'entregue' | 'lida' | 'falhou'

interface ChatMessageProps {
  conteudo: string
  direcao: Direcao
  timestamp?: string
  status?: Status
}

export function ChatMessage({ conteudo, direcao, timestamp, status }: ChatMessageProps) {
  const [bgEntrada, bgSaida, gray300, gray600] = useToken('colors', ['gray.200', 'accent', 'gray.300', 'gray.600'])

  const align = direcao === 'saida' ? 'flex-end' : 'flex-start'
  const bg = direcao === 'saida' ? bgSaida : bgEntrada
  const color = direcao === 'saida' ? 'white' : 'textPrimary'
  const time = timestamp ? format(new Date(timestamp), 'HH:mm', { locale: ptBR }) : ''

  const statusIconMap: Record<Status, JSX.Element> = {
    pendente: <AiOutlineClockCircle size={16} title="Pendente" />,
    simulada: <BiTimeFive size={16} title="Simulada" />,
    enviada: <BiTimeFive size={16} title="Enviada" />,
    entregue: <BiCheck size={16} title="Entregue" />,
    lida: <BiCheckDouble size={16} title="Lida" />,
    falhou: <MdErrorOutline size={16} color="red" title="Falhou" />,
  }

  return (
    <Box
      alignSelf={align}
      bg={bg}
      color={color}
      px={4}
      py={2}
      rounded="xl"
      maxW="80%"
      boxShadow="sm"
      fontSize="sm"
      border={direcao === 'entrada' ? '1px solid' : undefined}
      borderColor={direcao === 'entrada' ? gray300 : undefined}
      aria-label={direcao === 'entrada' ? 'Mensagem recebida' : 'Mensagem enviada'}
    >
      <Text mb={1}>{conteudo}</Text>

      <HStack justify="flex-end" gap={1}>
        {time && <Text fontSize="xs" opacity={0.7}>{time}</Text>}
        {direcao === 'saida' && status && statusIconMap[status]}
      </HStack>
    </Box>
  )
}
