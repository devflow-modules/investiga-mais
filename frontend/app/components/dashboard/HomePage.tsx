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
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Consulta } from '../../../types/Consulta'
import { formatarCNPJ } from '@shared/formatters/formatters'
import { apiFetchJSON } from '../../../src/utils/apiFetchJSON'
import { useLogout } from '../../../src/hooks/useLogout'

export default function HomePage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<string | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [carregandoConsultas, setCarregandoConsultas] = useState(true)
  const { logout } = useLogout()

  useEffect(() => {
    console.log('[HomePage] useEffect iniciou')
    fetchConsultas()
  }, [])

  const fetchConsultas = async () => {
    setCarregandoConsultas(true)

    const json = await apiFetchJSON('/api/consulta')

    if (json.success && Array.isArray(json.data?.resultados)) {
      console.log('[DEBUG] Resultados recebidos:', json.data.resultados)

      const formatado = json.data.resultados.map((c: Consulta): Consulta => ({
        ...c,
        criadoFormatado: new Date(c.criadoEm).toLocaleString('pt-BR'),
      }))

      setConsultas(formatado)

      const nome = json.data?.usuario?.nome
      const email = json.data?.usuario?.email

      setUsuario(nome?.trim() ? nome : email || 'Usuário')
    } else {
      console.warn('[HomePage] Erro ao buscar consultas, redirecionando para login')
      router.replace('/login')
    }

    setCarregandoConsultas(false)
  }

  const verDetalhes = (cnpj: string) => {
    router.push(`/dashboard/historico?cnpj=${cnpj}`)
  }

  return (
    <Box bg="gray.50" minH="100vh" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={6} rounded="xl" shadow="md">
        <Flex justify="space-between" align="center" mb={6} wrap="wrap">
          <Heading fontSize="2xl" color="gray.800">
            Painel do Usuário
          </Heading>
          <Button colorScheme="red" onClick={logout} size="sm" mt={{ base: 4, md: 0 }}>
            Sair
          </Button>
        </Flex>
        
        <Text color="gray.600" mb={6}>
          Olá,{' '}
          <Text as="span" fontWeight="bold" color="gray.800">
            {carregandoConsultas ? (
              <Spinner size="xs" color="blue.500" />
            ) : (
              usuario?.trim() && usuario !== 'Usuário' ? usuario : 'Bem-vindo!'
            )}
          </Text>{' '}
          👋
        </Text>

        <Heading fontSize="xl" color="blue.600" mb={4}>
          Últimas Consultas
        </Heading>

        {carregandoConsultas ? (
          <Flex justify="center" mt={8}>
            <Spinner size="lg" color="blue.500" />
          </Flex>
        ) : consultas.length === 0 ? (
          <Text color="gray.500" textAlign="center" mt={8}>
            Nenhuma consulta encontrada ainda.{' '}
            <Link
              href="/dashboard/consulta"
              color="blue.500"
              fontWeight="bold"
              _hover={{ textDecoration: 'underline' }}
            >
              Comece sua primeira consulta →
            </Link>
          </Text>
        ) : (
          <Stack gap={4} mt={4}>
            {consultas
              .slice()
              .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
              .map((consulta) => (
                <Box
                  key={consulta.id}
                  p={4}
                  bg="gray.50"
                  rounded="lg"
                  borderWidth="1px"
                  shadow="sm"
                  transition="all 0.2s ease"
                  _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="md">
                      {consulta.nome}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={
                        consulta.status.toLowerCase() === 'consultado'
                          ? 'green.600'
                          : consulta.status.toLowerCase() === 'pendente'
                            ? 'yellow.600'
                            : 'red.600'
                      }
                    >
                      {consulta.status}
                    </Text>
                  </Flex>

                  <Text fontSize="sm" color="gray.600" mb={1}>
                    CNPJ: {formatarCNPJ(consulta.cnpj)}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={3}>
                    Data: {consulta.criadoFormatado}
                  </Text>

                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => verDetalhes(consulta.cnpj)}
                  >
                    Ver detalhes
                  </Button>
                </Box>
              ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
