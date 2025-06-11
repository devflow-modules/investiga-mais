'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { validarEmail, validarCPF, validarTelefone } from '../../../../shared/validators'
import { formatarTelefone } from '../../../../shared/formatters/formatters'
import { toaster } from '../../../src/components/ui/toaster'
import { mascararCPF } from '../../../src/utils/mascararCPF'
import { mascararTelefone } from '../../../src/utils/mascararTelefone'


export default function RegistrarUsuarioManual() {
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  const [carregando, setCarregando] = useState(false)

  const isEmailValid = validarEmail(email)
  const isCPFValid = validarCPF(cpf.replace(/\D/g, ''))
  const isNomeValid = nome.trim().length >= 3
  const isTelefoneValid = !telefone || validarTelefone(telefone)

  const isFormValid = isEmailValid && isCPFValid && isNomeValid && isTelefoneValid

  const handleRegistrar = async () => {
    if (!isFormValid) {
      toaster.create({
        title: 'Erro de validação',
        description: 'Preencha os campos obrigatórios corretamente.',
        type: 'error',
      })
      return
    }

    setCarregando(true)

    try {
      const res = await fetch('/api/admin/registrar-manual', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          cpf: cpf.replace(/\D/g, ''),
          nome,
          telefone
        })
      })

      const data = await res.json()

      if (!res.ok || !data.data?.sucesso) {
        throw new Error(data?.mensagem || 'Erro ao registrar usuário.')
      }

      toaster.create({
        title: 'Usuário registrado!',
        description: data.mensagem,
        type: 'success',
      })

      setEmail('')
      setCpf('')
      setNome('')
      setTelefone('')

    } catch (err: any) {
      console.error('[Admin] Erro ao registrar usuário:', err)

      toaster.create({
        title: 'Erro ao registrar usuário',
        description: err.message || 'Erro inesperado.',
        type: 'error',
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="lg" mx="auto" bg="white" p={8} rounded="2xl" shadow="xl">
        <Heading size="lg" mb={6}>Registrar Usuário Manualmente</Heading>

        <VStack gap={4} align="stretch" mb={6}>

          {/* Email */}
          <Box>
            <Input
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailValid && email !== '' && (
              <Text fontSize="xs" color="red.500" mt={1}>Email inválido</Text>
            )}
          </Box>

          {/* CPF */}
          <Box>
            <Input
              placeholder="CPF *"
              value={mascararCPF(cpf)}
              onChange={(e) => {
                // Sempre salva o CPF "limpo" no state (só números)
                setCpf(e.target.value.replace(/\D/g, ''))
              }}
            />
            {!isCPFValid && cpf !== '' && (
              <Text fontSize="xs" color="red.500" mt={1}>CPF inválido</Text>
            )}
          </Box>

          {/* Nome */}
          <Box>
            <Input
              placeholder="Nome completo *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {!isNomeValid && nome !== '' && (
              <Text fontSize="xs" color="red.500" mt={1}>Nome deve ter pelo menos 3 caracteres</Text>
            )}
          </Box>

          {/* Telefone */}
          <Box>
            <Input
              placeholder="Telefone (opcional)"
              value={mascararTelefone(telefone)}
              onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
            />
            {!isTelefoneValid && telefone !== '' && (
              <Text fontSize="xs" color="red.500" mt={1}>Telefone inválido</Text>
            )}
          </Box>

        </VStack>

        <Button
          colorScheme="blue"
          onClick={handleRegistrar}
          loading={carregando}
          disabled={!isFormValid || carregando}
          loadingText="Registrando..."
          width="full"
        >
          Registrar Usuário
        </Button>
      </Box>
    </Box>
  )
}
