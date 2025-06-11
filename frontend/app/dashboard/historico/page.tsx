'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiltroStatus } from '../../components/dashboard/historico/FiltroStatus'
import { ConsultaCard } from '../../components/dashboard/historico/ConsultaCard'
import { ConsultaDrawerDetalhes } from '../../components/dashboard/historico/ConsultaDrawerDetalhes'
import { useDebouncedValue } from '../../../src/hooks/useDebouncedValue'
import { useSearchParams } from 'next/navigation'
import { apiFetchJSON } from '../../../src/utils/apiFetchJSON'
import { limparCNPJ } from '../../../../shared/formatters/formatters'

interface Consulta {
  id: number
  nome: string
  cpf: string
  cnpj: string
  status: string
  criadoEm: string
}

export default function Historico() {
  const searchParams = useSearchParams()
  const cnpjParam = searchParams.get('cnpj')

  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [status, setStatus] = useState('')
  const [data, setData] = useState('')
  const [buscaNome, setBuscaNome] = useState('')
  const [buscaCnpj, setBuscaCnpj] = useState('')
  const [carregando, setCarregando] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalResultados, setTotalResultados] = useState(0)
  const limit = 5

  const [modalCnpj, setModalCnpj] = useState<string | null>(null)

  const debouncedNome = useDebouncedValue(buscaNome)
  const debouncedCnpj = useDebouncedValue(buscaCnpj)

  useEffect(() => {
    console.log('[Historico] Disparando buscarConsultas()')
    buscarConsultas()
  }, [page, status, data, debouncedNome, debouncedCnpj])

  useEffect(() => {
    if (cnpjParam) {
      console.log('[Historico] Detalhes solicitado via URL:', cnpjParam)
      setModalCnpj(cnpjParam)
    }
  }, [cnpjParam])

  const buscarConsultas = async () => {
    setCarregando(true)
    console.log('[Historico] buscando consultas... page=', page)

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (status) queryParams.append('status', status)
    if (data) queryParams.append('data', data)
    if (debouncedNome) queryParams.append('nome', debouncedNome)
    if (debouncedCnpj) queryParams.append('cnpj', limparCNPJ(debouncedCnpj))

    const json = await apiFetchJSON(`/api/consulta?${queryParams.toString()}`)

    if (json.success && Array.isArray(json.data?.resultados)) {
      console.log('[Historico] /consulta response:', json)

      setConsultas(json.data.resultados)
      setTotalResultados(json.data.total ?? json.data.resultados?.length ?? 0)
      setTotalPaginas(
        Math.max(1, Math.ceil((json.data.total ?? json.data.resultados?.length ?? 0) / limit))
      )
    } else {
      console.warn('[Historico] Erro ao buscar consultas:', json.error || json.message)
      setConsultas([])
      setTotalPaginas(1)
    }

    setCarregando(false)
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={8} rounded="lg" shadow="md">
        <Heading size="lg" mb={6}>Histórico de Consultas</Heading>

        <Flex justify="flex-end" mb={4}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={() => {
              setPage(1)
              setBuscaNome('')
              setBuscaCnpj('')
              setStatus('')
              setData('')
            }}
          >
            Limpar filtros
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={6}>
          <Input
            placeholder="Buscar por nome"
            value={buscaNome}
            onChange={(e) => {
              setPage(1)
              setBuscaNome(e.target.value)
            }}
          />
          <Input
            placeholder="Buscar por CNPJ"
            value={buscaCnpj}
            onChange={(e) => {
              setPage(1)
              setBuscaCnpj(e.target.value)
            }}
          />
          <FiltroStatus
            value={status}
            onChange={(value) => {
              setPage(1)
              setStatus(value.toLowerCase()) // garante lowercase
            }}
          />
          <Input
            type="date"
            value={data}
            onChange={(e) => {
              setPage(1)
              setData(e.target.value)
            }}
          />
        </SimpleGrid>

        {carregando ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="lg" color="blue.500" />
          </Flex>
        ) : consultas.length === 0 ? (
          <Text color="gray.600">Nenhuma consulta encontrada com os filtros aplicados.</Text>
        ) : (
          <>
            <Text mb={2} color="gray.600">
              {totalResultados} resultado(s) encontrados | Página {page} de {totalPaginas}
            </Text>

            <VStack gap={4} align="stretch">
              {consultas.map((c) => (
                <ConsultaCard key={c.id} consulta={c} onOpenDetalhes={() => setModalCnpj(c.cnpj)} />
              ))}
            </VStack>

            <Flex justify="space-between" align="center" mt={6}>
              <Button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Text>
                Página {page} de {totalPaginas}
              </Text>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPaginas}
              >
                Próxima
              </Button>
            </Flex>
          </>
        )}
      </Box>

      <ConsultaDrawerDetalhes
        cnpj={modalCnpj}
        isOpen={!!modalCnpj}
        onClose={() => setModalCnpj(null)}
      />
    </Box>
  )
}
