'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DetalhesEmpresa from './DetalhesEmpresa'
import type { Consulta, DadosEmpresaReceitaWS } from '@types'

export default function DashboardPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<string | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [detalhes, setDetalhes] = useState<DadosEmpresaReceitaWS | null>(null)
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false)

  const cacheDetalhes = useRef<Record<string, DadosEmpresaReceitaWS>>({})
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    fetchConsultas()
  }, [])

  const fetchConsultas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consulta`, {
        credentials: 'include',
      })

      if (res.status === 401 || res.status === 403) {
        router.replace('/login')
        return
      }

      const data = await res.json()

      const formatado = data.resultados.map((c: Consulta): Consulta => ({
        ...c,
        criadoFormatado: new Date(c.criadoEm).toLocaleString('pt-BR'),
      }))

      setConsultas(formatado)
      setUsuario(data.usuario?.email || 'Usuário')
    } catch (err) {
      console.error('Erro ao buscar consultas', err)
      router.replace('/login')
    }
  }

  const verDetalhes = async (cnpj: string) => {
    if (cacheDetalhes.current[cnpj]) {
      setDetalhes(cacheDetalhes.current[cnpj])
      return
    }

    setCarregandoDetalhes(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consulta/cnpj/${cnpj}`, {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.sucesso && json.empresa) {
        cacheDetalhes.current[cnpj] = json.empresa
        setDetalhes(json.empresa)
      } else {
        setDetalhes(null)
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da empresa', err)
      setDetalhes(null)
    } finally {
      setCarregandoDetalhes(false)
    }
  }

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }

  return (
    <Box bg="background" minH="100vh" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={6} rounded="xl" shadow="md">
        <Flex justify="space-between" align="center" mb={6} wrap="wrap">
          <Heading fontSize="2xl" color="textPrimary">
            Painel do Usuário
          </Heading>
          <Button colorScheme="red" onClick={logout} size="sm" mt={{ base: 4, md: 0 }}>
            Sair
          </Button>
        </Flex>

        <Text color="textSecondary" mb={6}>
          Olá,{' '}
          <Text as="span" fontWeight="bold" color="textPrimary">
            {usuario}
          </Text>{' '}
          👋
        </Text>

        <Heading fontSize="xl" color="accent" mb={4}>
          Últimas Consultas
        </Heading>

        {consultas.length === 0 ? (
          <Text color="gray.500">Nenhuma consulta encontrada.</Text>
        ) : (
          <Stack gap={4}>
            {consultas.map((consulta) => (
              <Box key={consulta.id} p={4} bg="gray.50" rounded="md" borderWidth="1px">
                <Text><strong>Nome:</strong> {consulta.nome}</Text>
                <Text><strong>CPF:</strong> {consulta.cpf}</Text>
                <Text><strong>Status:</strong> {consulta.status}</Text>
                <Text><strong>Data:</strong> {consulta.criadoFormatado}</Text>
                <Link
                  as="button"
                  mt={2}
                  color="blue.500"
                  fontWeight="medium"
                  onClick={() => verDetalhes(consulta.cnpj)}
                  _hover={{ textDecoration: 'underline' }}
                >
                  Ver detalhes
                </Link>
              </Box>
            ))}
          </Stack>
        )}

        {carregandoDetalhes && (
          <Flex justify="center" mt={6}>
            <Spinner size="lg" color="accent" />
          </Flex>
        )}

        {detalhes && (
          <Box mt={10}>
            <DetalhesEmpresa dados={detalhes} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
