'use client'

import { apiFetchJSON } from '../../src/utils/apiFetchJSON'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useBreakpointValue,
  Spinner,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { UsuarioResponse } from '../../types/api'
import { useUser } from '../../src/context/UserContext'

const schema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Informe a senha'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [loading, setLoading] = useState(false)
  const [erroApi, setErroApi] = useState('')

  const { setUser } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleLogin = async (data: FormData) => {
    setErroApi('')
    setLoading(true)

    try {
      const json = await apiFetchJSON<UsuarioResponse>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (json.success && json.data?.usuario) {
        console.log('🛡️ Role logada:', json.data.usuario.role)

        // ✅ Atualiza UserContext com o usuario logado
        setUser({
          id: json.data.usuario.id,
          email: json.data.usuario.email,
          role: json.data.usuario.role,
          nome: json.data.usuario.nome || '',
        })

        // ✅ Redireciona de acordo com a role
        let destino = '/dashboard' // fallback default

        if (json.data.usuario.role === 'admin') {
          destino = '/admin/registrar'
        } else if (json.data.usuario.role === 'operador') {
          destino = '/painel'
        } else if (json.data.usuario.role === 'cliente') {
          destino = '/dashboard'
        }

        console.log(`[handleLogin] Redirecionando para: ${destino}`)

        router.push(destino)
        router.refresh()
      } else {
        setErroApi(json.error || json.message || 'Erro ao fazer login.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="background"
      px={4}
    >
      <Box
        as="form"
        onSubmit={handleSubmit(handleLogin)}
        bg="white"
        p={8}
        rounded="md"
        boxShadow="md"
        maxW="sm"
        w="full"
      >
        <VStack gap={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" color="textPrimary" textAlign="center">
            Entre na sua conta com segurança
          </Text>

          <Input
            placeholder="Email"
            {...register('email')}
            autoFocus
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: 'blue.500', bg: 'white' }}
          />
          {errors.email && (
            <Text fontSize="xs" color="red.500">
              {errors.email.message}
            </Text>
          )}

          <Input
            type="password"
            placeholder="Senha"
            {...register('senha')}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: 'blue.500', bg: 'white' }}
          />
          {errors.senha && (
            <Text fontSize="xs" color="red.500">
              {errors.senha.message}
            </Text>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            fontWeight="bold"
            size="lg"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Entrar'}
          </Button>

          {erroApi && (
            <Text fontSize="sm" color="red.600" textAlign="center">
              {erroApi}
            </Text>
          )}

          <Text fontSize="sm" textAlign="center">
            <a href="/recuperar" style={{ color: '#1E40AF' }}>
              Esqueceu a senha?
            </a>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}
