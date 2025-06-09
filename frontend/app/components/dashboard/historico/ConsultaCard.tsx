'use client'

import { Badge, Box, Button, Flex, HStack, Text, useBreakpointValue } from '@chakra-ui/react'

interface ConsultaCardProps {
  consulta: {
    id: number
    nome: string
    cnpj: string
    status: string
    criadoEm: string
  }
  onOpenDetalhes: () => void
}

export function ConsultaCard({ consulta, onOpenDetalhes }: ConsultaCardProps) {
  // Mapeia cor de status
  const statusColor = {
    consultado: 'green',
    pendente: 'yellow',
    erro: 'red',
  }[consulta.status.toLowerCase()] ?? 'gray'

  // Responsivo: padding maior no desktop
  const cardPadding = useBreakpointValue({ base: 3, md: 4 })

  return (
    <Box p={cardPadding} rounded="md" bg="gray.50" borderWidth="1px" shadow="sm" _hover={{ shadow: 'md' }} transition="all 0.2s ease">
      {/* Header: Nome + Status */}
      <Flex justify="space-between" align="start" mb={3}>
        <Text
          fontWeight="bold"
          fontSize="md"
          overflow="hidden"
          textOverflow="ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {consulta.nome}
        </Text>
        <Badge colorScheme={statusColor} px={2} py={1} fontSize="0.8em" borderRadius="md">
          {consulta.status}
        </Badge>
      </Flex>

      {/* CNPJ */}
      <HStack gap={2} mb={2}>
        <Text fontWeight="semibold">CNPJ:</Text>
        <Text color="gray.700">{consulta.cnpj}</Text>
      </HStack>

      {/* Data */}
      <HStack gap={2} mb={4}>
        <Text fontWeight="semibold">Data:</Text>
        <Text color="gray.700">{new Date(consulta.criadoEm).toLocaleString()}</Text>
      </HStack>

      {/* Botão */}
      <Button size="sm" colorScheme="blue" variant="solid" w="full" onClick={onOpenDetalhes}>
        Ver detalhes
      </Button>
    </Box>
  )
}
