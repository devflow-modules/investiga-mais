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

interface Consulta {
  id: number
  nome: string
  cpf: string
  cnpj: string
  status: string
  criadoEm: string
}

export default function Historico() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [status, setStatus] = useState('')
  const [data, setData] = useState('')
  const [buscaNome, setBuscaNome] = useState('')
  const [buscaCnpj, setBuscaCnpj] = useState('')
  const [carregando, setCarregando] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limit = 5

  const [modalCnpj, setModalCnpj] = useState<string | null>(null)

  const debouncedNome = useDebouncedValue(buscaNome)
  const debouncedCnpj = useDebouncedValue(buscaCnpj)

  useEffect(() => {
    console.log('[Historico] Disparando buscarConsultas()')
    buscarConsultas()
  }, [page, status, data, debouncedNome, debouncedCnpj])

  const buscarConsultas = async () => {
    setCarregando(true)
    console.log('[Historico] buscando consultas... page=', page)

    try {
      const res = await fetch(`/api/consulta?page=${page}&limit=${limit}`, {
        credentials: 'include',
      })

      console.log('[Historico] /consulta status:', res.status)

      const data = await res.json()
      console.log('[Historico] /consulta response:', data)

      setConsultas(data.resultados || [])
      setTotalPaginas(Math.max(1, Math.ceil((data.total ?? data.resultados?.length ?? 0) / limit)))
    } catch (err) {
      console.error('[Historico] Erro ao buscar consultas', err)
    } finally {
      setCarregando(false)
    }
  }

  const filtrar = (c: Consulta) => {
    return (
      (!status || c.status.toLowerCase() === status) &&
      (!data || c.criadoEm.startsWith(data)) &&
      (!debouncedNome || c.nome.toLowerCase().includes(debouncedNome.toLowerCase())) &&
      (!debouncedCnpj || c.cnpj.includes(debouncedCnpj))
    )
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={8} rounded="lg" shadow="md">
        <Heading size="lg" mb={6}>Histórico de Consultas</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={6}>
          <Input
            placeholder="Buscar por nome"
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
          />
          <Input
            placeholder="Buscar por CNPJ"
            value={buscaCnpj}
            onChange={(e) => setBuscaCnpj(e.target.value)}
          />
          <FiltroStatus value={status} onChange={setStatus} />
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </SimpleGrid>

        {carregando ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="lg" color="blue.500" />
          </Flex>
        ) : consultas.filter(filtrar).length === 0 ? (
          <Text color="gray.600">Nenhuma consulta encontrada com os filtros aplicados.</Text>
        ) : (
          <>
            <Text mb={2} color="gray.600">
              Mostrando {consultas.filter(filtrar).length} resultado(s)
            </Text>

            <VStack gap={4} align="stretch">
              {consultas.filter(filtrar).map((c) => (
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

      {/* Drawer de detalhes */}
      <ConsultaDrawerDetalhes
        cnpj={modalCnpj}
        isOpen={!!modalCnpj}
        onClose={() => setModalCnpj(null)}
      />
    </Box>
  )
}
