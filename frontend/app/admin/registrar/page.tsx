'use client'

import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  Select,
  Portal,
  Spinner
} from '@chakra-ui/react'
import { useState } from 'react'
import { validarEmail, validarCPF, validarTelefone } from '../../../../shared/validators'
import { generoOptions } from '../../components/dashboard/historico/createListCollection'
import { mascararCPF } from '@/utils/mascararCPF'
import { mascararTelefone } from '@/utils/mascararTelefone'
import { toaster } from '@/components/ui/toaster'

export default function RegistrarUsuarioManual() {
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [genero, setGenero] = useState('')

  const [carregando, setCarregando] = useState(false)

  const isEmailValid = validarEmail(email)
  const isCPFValid = validarCPF(cpf.replace(/\D/g, ''))
  const isNomeValid = nome.trim().length >= 3
  const isTelefoneValid = !telefone || validarTelefone(telefone)
  const isGeneroValid = genero !== ''

  const isFormValid = isEmailValid && isCPFValid && isNomeValid && isTelefoneValid && isGeneroValid

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
          telefone,
          genero
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

      handleLimparCampos()

    } catch (err: unknown) {
      console.error('[Admin] Erro ao registrar usuário:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado.'

      toaster.create({
        title: 'Erro ao registrar usuário',
        description: errorMessage,
        type: 'error',
      })
    } finally {
      setCarregando(false)
    }
  }

  const handleLimparCampos = () => {
    setEmail('')
    setCpf('')
    setNome('')
    setTelefone('')
    setGenero('')
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
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
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

          {/* Gênero */}
          <Box>
            <Select.Root
              collection={generoOptions}
              value={[genero]}
              onValueChange={(val) => setGenero(val?.value?.[0] ?? '')}
              size="md"
              width="100%"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText>
                    {generoOptions.items.find((item) => item.value === genero)?.label || 'Selecione o gênero'}
                  </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>

              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {generoOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {!isGeneroValid && (
              <Text fontSize="xs" color="red.500" mt={1}>Selecione um gênero</Text>
            )}
          </Box>

        </VStack>

        {/* Botões */}
        <Box w="full" mt={4}>
          <VStack gap={3}>
            <Button
              colorScheme="blue"
              onClick={handleRegistrar}
              disabled={!isFormValid || carregando}
              width="full"
            >
              {carregando && <Spinner size="sm" mr={2} />} Registrar Usuário
            </Button>

            <Button
              variant="outline"
              onClick={handleLimparCampos}
              width="full"
            >
              Limpar campos
            </Button>
          </VStack>
        </Box>

      </Box>
    </Box>
  )
}
