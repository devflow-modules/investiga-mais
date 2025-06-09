'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/hooks/useAuth'
import {
  Avatar,
  AvatarFallback,
  Box,
  Button,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CompletePerfilSection } from '@/components/dashboard/perfil/CompletePerfilSection'

export default function Perfil() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<{ email?: string; cpf?: string }>({})
  const [lastChecked, setLastChecked] = useState<string>('')

  useAuth() // garante proteção da rota

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
        })

        console.log('[Perfil] /api/auth/verify status:', res.status)

        if (!res.ok) throw new Error('Token inválido')

        const data = await res.json()
        console.log('[Perfil] usuario autenticado:', data.usuario)

        setUsuario(data.usuario || {})
        setLastChecked(new Date().toLocaleString('pt-BR'))
      } catch (err) {
        console.error('[Perfil] Erro ao buscar perfil:', err)
        router.replace('/login')
      }
    }

    buscarPerfil()
  }, [router])

  const formatarCPF = (cpf: string | undefined) => {
    if (!cpf || cpf.length !== 11) return cpf || ''
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
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
          <Avatar.Root size="lg">
            <AvatarFallback>
              {usuario.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar.Root>
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
