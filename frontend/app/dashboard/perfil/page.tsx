'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/hooks/useAuth'
import {
  Badge,
  Box,
  Button,
  Flex,
  Progress,
  Text,
  VStack
} from '@chakra-ui/react'
import { CompletePerfilSection } from '@/components/dashboard/perfil/CompletePerfilSection'
import { formatarCPF } from '@shared/formatters/formatters'
import { useLogout } from '../../../src/utils/logout'
import { Tooltip } from '../../../src/components/ui/tooltip'
import { Avatar } from '../../../src/components/ui/avatar'

// função que gera uma cor pastel a partir do email
const gerarCorAvatar = (email?: string) => {
  if (!email) return 'gray.400'
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = hash % 360
  return `hsl(${h}, 60%, 70%)`
}

export default function Perfil() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<{
    email?: string
    cpf?: string
    nome?: string
    telefone?: string
    nascimento?: string
    cidade?: string
    uf?: string
    genero?: string
    bonusConcedidoAt?: string
  }>({})
  const [lastChecked, setLastChecked] = useState<string>('')
  const { logout } = useLogout()

  useAuth() // garante proteção da rota

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const res = await fetch('/api/perfil', {
          credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          console.warn('[Perfil] Erro ao buscar perfil:', data?.message || 'Erro desconhecido')
          router.replace('/login')
          return
        }

        console.log('[Perfil] Perfil OK:', data.data)

        if (data.data) {
          setUsuario(data.data)
        }
        setLastChecked(new Date().toLocaleString('pt-BR'))
      } catch (err) {
        console.error('[Perfil] Erro ao buscar perfil:', err)
        router.replace('/login')
      }
    }

    buscarPerfil()
  }, [router])

  // Calcula % do perfil preenchido
  const calcularProgressoPerfil = () => {
    const campos = [
      usuario.nome,
      usuario.telefone,
      usuario.nascimento,
      usuario.cidade,
      usuario.uf,
      usuario.genero,
    ]

    const preenchidos = campos.filter((campo) => campo && campo.trim() !== '').length
    return Math.round((preenchidos / campos.length) * 100)
  }

  const progresso = calcularProgressoPerfil()

  // Identifica campos faltantes
  const camposFaltantes = () => {
    const faltando: string[] = []

    if (!usuario.nome) faltando.push('Nome')
    if (!usuario.telefone) faltando.push('Telefone')
    if (!usuario.nascimento) faltando.push('Nascimento')
    if (!usuario.cidade) faltando.push('Cidade')
    if (!usuario.uf) faltando.push('UF')
    if (!usuario.genero) faltando.push('Gênero')

    return faltando
  }

  const faltantes = camposFaltantes()

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box
        maxW="lg"
        mx="auto"
        bg="white"
        p={8}
        rounded="2xl"
        shadow="xl"
        transition="all 0.3s ease"
        _hover={{ shadow: '2xl' }}
      >
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="extrabold" color="gray.800">
            Meu Perfil
          </Text>
          <Button onClick={logout} colorScheme="red" variant="solid" size="sm">
            Sair
          </Button>
        </Flex>

        {/* Avatar + dados */}
        <Flex direction="column" align="center" mb={6}>
          <Avatar
            size="2xl"
            name={usuario.nome || usuario.email}
            bg={gerarCorAvatar(usuario.email)}
            mb={3}
            border="4px solid"
            borderColor="blue.400"
            transition="all 0.3s ease"
            _hover={{
              transform: 'scale(1.05)',
              borderColor: 'blue.500',
              boxShadow: '0 0 0 6px rgba(66, 153, 225, 0.3)',
            }}
          />
          <Text fontWeight="extrabold" fontSize="xl" mb={1} color="gray.800">
            {usuario.nome || 'Nome não informado'}
          </Text>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {usuario.email}
          </Text>
          <Text fontSize="xs" color="gray.500" opacity={0.8} mb={2}>
            Última verificação: {lastChecked}
          </Text>

          {/* Badge Perfil Completo */}
          {usuario.bonusConcedidoAt ? (
            <Badge colorScheme="green" variant="subtle" px={3} py={1} rounded="md">
              🎁 Perfil Completo - Bônus Recebido em{' '}
              {new Date(usuario.bonusConcedidoAt).toLocaleDateString('pt-BR')}
            </Badge>
          ) : (

            <Tooltip content={
              faltantes.length > 0
                ? `Faltando: ${faltantes.join(', ')}`
                : 'Complete seu perfil'
            }>
              <Badge colorScheme="yellow" variant="subtle" px={3} py={1} rounded="md" cursor="pointer">
                ⚠️ Perfil Incompleto
              </Badge>
            </Tooltip>
          )}
        </Flex>

        <Box h="2px" w="full" bgGradient="linear(to-r, gray.100, gray.300, gray.100)" my={4} borderRadius="full" />

        {/* Progresso do perfil */}
        <Box mb={6}>
          <Progress.Root value={progresso} size="sm" colorPalette={progresso === 100 ? 'green' : 'blue'}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
            <Flex justify="space-between" mt={1} px={1}>
              <Progress.Label fontSize="sm" color="gray.700" fontWeight="bold">
                Progresso do Perfil
              </Progress.Label>
              <Progress.ValueText fontSize="sm" color="gray.600">
                {progresso}%
              </Progress.ValueText>
            </Flex>
          </Progress.Root>
        </Box>


        <Box h="2px" w="full" bgGradient="linear(to-r, gray.100, gray.300, gray.100)" my={4} borderRadius="full" />

        {/* Dados do usuário */}
        <VStack align="stretch" gap={3} fontSize="sm" color="gray.700" mb={8}>
          <Box>
            <Text fontWeight="bold" mb={1} color="gray.600">
              Nome:
            </Text>
            <Text>{usuario.nome || '-'}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} color="gray.600">
              Email:
            </Text>
            <Text>{usuario.email || '-'}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} color="gray.600">
              CPF:
            </Text>
            <Text>{usuario.cpf ? formatarCPF(usuario.cpf) : '-'}</Text>
          </Box>
        </VStack>

        <Box h="2px" w="full" bgGradient="linear(to-r, gray.100, gray.300, gray.100)" my={4} borderRadius="full" />

        {/* Seção de completar perfil */}
        <CompletePerfilSection />
      </Box>
    </Box>
  )
}
