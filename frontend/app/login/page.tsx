'use client'

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleLogin = async (data: FormData) => {
    setErroApi('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (json.sucesso) {
        console.log('✅ Login bem-sucedido, redirecionando...')
        router.push('/dashboard')
        router.refresh() // Garante revalidação do middleware + layout
      } else {
        setErroApi(json.erro || 'Erro ao fazer login.')
      }
    } catch {
      setErroApi('Erro ao conectar com o servidor.')
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
