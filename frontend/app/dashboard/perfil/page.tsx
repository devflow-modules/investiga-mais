'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/hooks/useAuth'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CompletePerfilSection } from '@/components/dashboard/perfil/CompletePerfilSection'
import { apiFetchJSON } from '../../../src/utils/apiFetchJSON'
import { useLogout } from '../../../src/utils/logout'

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
  const [usuario, setUsuario] = useState<{ email?: string; cpf?: string }>({})
  const [lastChecked, setLastChecked] = useState<string>('')
  const { logout } = useLogout()

  useAuth() // garante proteção da rota

  useEffect(() => {
    const buscarPerfil = async () => {
      const json = await apiFetchJSON('/api/auth/verify')

      // Se resposta 304 → considerar autenticado
      const isAuthenticated = json.success && (json.statusCode === 304 || json.data?.usuario)

      if (isAuthenticated) {
        if (json.statusCode === 304) {
          console.log('[Perfil] usuario autenticado (304 cache), mantendo último usuário.')
        } else {
          console.log('[Perfil] usuario autenticado:', json.data?.usuario)
          if (json.data?.usuario) {
            setUsuario(json.data.usuario)
          }
        }
        setLastChecked(new Date().toLocaleString('pt-BR'))
      } else {
        console.warn('[Perfil] Erro ao buscar perfil:', json.error || json.message)
        router.replace('/login')
      }
    }

    buscarPerfil()
  }, [router])


  const formatarCPF = (cpf: string | undefined) => {
    if (!cpf || cpf.length !== 11) return cpf || ''
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }


  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="lg" mx="auto" bg="white" p={8} rounded="lg" shadow="md">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Meu Perfil
          </Text>
          <Button onClick={logout} colorScheme="red" variant="solid" size="sm">
            Sair
          </Button>
        </Flex>

        {/* Avatar + dados */}
        <Flex align="center" gap={4} mb={6}>
          <Flex
            w="48px"
            h="48px"
            borderRadius="full"
            bg={gerarCorAvatar(usuario.email)}
            color="white"
            fontWeight="bold"
            fontSize="xl"
            align="center"
            justify="center"
            flexShrink={0}
          >
            {usuario.email?.charAt(0).toUpperCase()}
          </Flex>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {usuario.email}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Última verificação: {lastChecked}
            </Text>
          </Box>
        </Flex>


        {/* Divider fake */}
        <Box h="1px" w="full" bg="gray.200" my={4} borderRadius="full" />

        {/* Dados do usuário */}
        <VStack align="start" gap={3} fontSize="sm" color="gray.700" mb={8}>
          <Box>
            <Text fontWeight="bold" mb={1}>
              Email:
            </Text>
            <Text>{usuario.email || '-'}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1}>
              CPF:
            </Text>
            <Text>{formatarCPF(usuario.cpf)}</Text>
          </Box>
        </VStack>

        {/* Seção de completar perfil */}
        <CompletePerfilSection />
      </Box>
    </Box>
  )
}
