'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { validarCNPJ } from '../../../../shared/validators/frontend'
import type { DadosEmpresaReceitaWS } from '../../../types/DadosEmpresaReceitaWS'
import DetalhesEmpresa from '../../components/dashboard/consulta/DetalhesEmpresa'
import DashboardLayout from '../../components/dashboard/DashboardLayoutContainer'

export default function ConsultaCNPJ() {
  const [cnpj, setCnpj] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [dados, setDados] = useState<DadosEmpresaReceitaWS | null>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setErro('')
    setDados(null)

    const cnpjLimpo = cnpj.replace(/[^\d]+/g, '')

    if (!validarCNPJ(cnpjLimpo)) {
      setErro('CNPJ inválido')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consulta/${cnpjLimpo}`, {
        method: 'GET',
        credentials: 'include', // Envia cookie
      })
      const json = await response.json()
      if (json.sucesso && json.empresa) {
        setDados(json.empresa)
        setMensagem('Consulta realizada com sucesso.')
      } else {
        setErro('Empresa não encontrada.')
      }
    } catch {
      setErro('Erro ao consultar CNPJ.')
    }
  }

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 10 }} py={6} w="full">
        <Flex direction="column" maxW="5xl" mx="auto">
          {/* Formulário */}
          <Box
            bg="white"
            p={{ base: 6, md: 8 }}
            rounded="lg"
            shadow="md"
            w="full"
          >
            <Heading size="md" mb={4}>
              Consulta de CNPJ
            </Heading>

            <form onSubmit={buscar}>
              <VStack gap={4} align="stretch">
                <Input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="Digite o CNPJ"
                  maxLength={18}
                  required
                />
                <Button type="submit" colorScheme="blackAlpha" width="100%">
                  Buscar
                </Button>
              </VStack>
            </form>

            {erro && <Text color="red.500" mt={4}>{erro}</Text>}
            {mensagem && <Text color="green.600" mt={4}>{mensagem}</Text>}
          </Box>

          {/* Resultado */}
          {dados && (
            <DetalhesEmpresa dados={dados} />
          )}
        </Flex>
      </Box>
    </DashboardLayout>
  )
}
