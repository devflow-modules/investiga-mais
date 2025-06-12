'use client'

import { Suspense, useState } from 'react'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { apiFetchJSON } from '../../src/utils/apiFetchJSON'

const schema = z
  .object({
    novaSenha: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .regex(/[A-Za-z]/, 'Deve conter letras')
      .regex(/\d/, 'Deve conter números')
      .regex(/[^A-Za-z0-9]/, 'Deve conter um símbolo'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

type FormData = z.infer<typeof schema>

export default function RedefinirSenha() {
  return (
    <Suspense fallback={<Spinner size="lg" color="blue.500" />}>
      <RedefinirSenhaInner />
    </Suspense>
  )
}

function RedefinirSenhaInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setMensagem('')
    setErro('')

    try {
      const json = await apiFetchJSON('/api/auth/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha: data.novaSenha }),
      })

      if (json.success) {
        setMensagem(json.message || 'Senha redefinida com sucesso!')
        setTimeout(() => router.push('/login'), 2500)
      } else {
        setErro(json.error || json.message || 'Erro ao redefinir senha.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Suspense fallback={<Spinner size="lg" color="blue.500" />}>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={6} bg="background">
          <Text fontSize="lg" color="red.600">Token inválido ou ausente.</Text>
        </Box>
      </Suspense>
    )
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4} bg="background">
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        p={{ base: 6, md: 10 }}
        rounded="lg"
        boxShadow="lg"
        maxW="sm"
        w="full"
      >
        <VStack gap={5} align="stretch">
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="textPrimary" textAlign="center">
            Redefinir sua senha
          </Text>

          <Box position="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nova senha"
              {...register('novaSenha')}
              autoFocus
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'blue.500', bg: 'white' }}
              pr="3rem"
              fontSize="md"
            />
            <Box
              position="absolute"
              top="50%"
              right="0.75rem"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </Box>
          </Box>
          {errors.novaSenha && (
            <Text fontSize="xs" color="red.500">{errors.novaSenha.message}</Text>
          )}

          <Box position="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar nova senha"
              {...register('confirmarSenha')}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'blue.500', bg: 'white' }}
              pr="3rem"
              fontSize="md"
            />
            <Box
              position="absolute"
              top="50%"
              right="0.75rem"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </Box>
          </Box>
          {errors.confirmarSenha && (
            <Text fontSize="xs" color="red.500">{errors.confirmarSenha.message}</Text>
          )}

          <Button type="submit" colorScheme="green" size="lg" fontWeight="bold" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : 'Atualizar senha'}
          </Button>

          {mensagem && (
            <Text fontSize="sm" textAlign="center" color="green.600">
              {mensagem}
            </Text>
          )}

          {erro && (
            <Text fontSize="sm" textAlign="center" color="red.600">
              {erro}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  )
}
