'use client'

import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { validarCNPJ } from '../../../../shared/validators/frontend'
import type { DadosEmpresaReceitaWS } from '../../../types'
import DetalhesEmpresa from '../../components/dashboard/consulta/DetalhesEmpresa'
import { apiFetchJSON } from '../../../src/utils/apiFetchJSON'
import { limparCNPJ } from '../../../../shared/formatters/formatters'

export default function ConsultaCNPJ() {
  const [cnpj, setCnpj] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [dados, setDados] = useState<DadosEmpresaReceitaWS | null>(null)
  const [carregando, setCarregando] = useState(false)

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setErro('')
    setDados(null)
    setCarregando(true)

    const cnpjLimpo = limparCNPJ(cnpj)

    if (!validarCNPJ(cnpjLimpo)) {
      setErro('CNPJ inválido')
      setCarregando(false)
      return
    }

    const json = await apiFetchJSON(`/api/consulta/${cnpjLimpo}`, {
      method: 'GET',
    })

    if (json.success && json.data?.empresa) {
      setDados(json.data.empresa)
      setMensagem(json.message || 'Consulta realizada com sucesso.')
    } else {
      setErro(json.error || json.message || 'Empresa não encontrada.')
    }

    setCarregando(false)
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={8} rounded="lg" shadow="md">
        <Heading size="lg" mb={6}>Consulta de CNPJ</Heading>

        <form onSubmit={buscar}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
            <Input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Digite o CNPJ"
              maxLength={18}
              required
            />
            <Button
              type="submit"
              colorScheme="blue"
              loading={carregando}
              loadingText="Buscando..."
              width="100%"
            >
              Buscar
            </Button>
          </SimpleGrid>
        </form>

        {erro && (
          <Text color="red.600" mb={4} fontWeight="medium">
            {erro}
          </Text>
        )}
        {mensagem && (
          <Text color="green.600" mb={4} fontWeight="medium">
            {mensagem}
          </Text>
        )}

        {dados && (
          <Box mt={6}>
            <DetalhesEmpresa dados={dados} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
