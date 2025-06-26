'use client'

import {
  Box, Flex, Heading, Text, VStack, Spinner, Badge
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { toaster } from '../../components/ui/toaster'
import { format } from 'date-fns'
import { ChatMessage } from '@/components/admin/chat/ChatMessage'
import { ChatInput } from '@/components/admin/chat/ChatInput'
import { date } from 'zod'

interface Mensagem {
  id: number
  conteudo: string
  direcao: 'entrada' | 'saida'
  timestamp: string
  status?: 'pendente' | 'enviada' | 'simulada' | 'lida' | 'entregue' | 'falhou'
  atendente?: {
    nome: string
    email: string
  } | null
}

interface Conversa {
  id: number
  nome?: string
  numero: string
  ultimaMensagem: string
  ultimaMensagemEm: string
  naoLidas: number
}

export default function ChatAdminPage() {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [mensagem, setMensagem] = useState('')
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null)
  const [carregandoConversas, setCarregandoConversas] = useState(true)
  const [carregandoMensagens, setCarregandoMensagens] = useState(false)
  const mensagensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carregarConversas = async () => {
      try {
        const res = await fetch('/api/admin/conversas', { credentials: 'include' })
        const json = await res.json()

        console.log('[DEBUG] Response da API /conversas:', json) // 🔍

        if (json.success && Array.isArray(json.data.conversas)) {
          setConversas(json.data.conversas)
          console.log('[DEBUG] Conversas carregadas:', json.data) // 🔍
        } else {
          console.warn('[DEBUG] Conversas inválidas:', json)
          setConversas([])
          toaster.create({ title: 'Erro', description: 'Conversas inválidas.', type: 'error' })
        }
      } catch (e) {
        console.error('[DEBUG] Erro ao carregar conversas:', e)
        setConversas([])
        toaster.create({ title: 'Erro', description: 'Erro ao carregar conversas.', type: 'error' })
      } finally {
        setCarregandoConversas(false)
      }
    }

    carregarConversas()
  }, [])

  useEffect(() => {
    mensagensRef.current?.scrollTo({ top: mensagensRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensagens])

  const carregarMensagens = async (conversa: Conversa) => {
    setConversaSelecionada(conversa)
    setMensagens([])
    setCarregandoMensagens(true)

    console.log('[DEBUG] Carregando mensagens da conversa:', conversa)

    try {
      const res = await fetch(`/api/admin/conversas/${conversa.id}/mensagens`, {
        credentials: 'include'
      })
      const json = await res.json()

      console.log('[DEBUG] Resposta da API /mensagens:', json)

      if (json.success && Array.isArray(json.data.mensagens)) {
        setMensagens(json.data.mensagens)
        console.log('[DEBUG] Mensagens carregadas:', json.data.mensagens)
      } else {
        toaster.create({ title: 'Erro', description: json.error || 'Erro ao carregar mensagens.', type: 'error' })
        console.warn('[DEBUG] Falha ao carregar mensagens:', json)
      }
    } catch (e) {
      console.error('[DEBUG] Erro na requisição de mensagens:', e)
      toaster.create({ title: 'Erro', description: 'Erro ao carregar mensagens.', type: 'error' })
    } finally {
      setCarregandoMensagens(false)
    }
  }


  const enviar = async () => {
    if (!mensagem.trim() || !conversaSelecionada) return

    const msg = mensagem
    const tempId = Date.now()
    
    setMensagens((prev) => [...prev, {
      id: tempId,
      conteudo: msg,
      direcao: 'saida',
      timestamp: new Date().toISOString(),
      status: 'pendente'
    }])
    setMensagem('')

    try {
      const res = await fetch(`/api/admin/conversas/${conversaSelecionada.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mensagem: msg })
      })
      const json = await res.json()

      if (json.success && json.data) {
        setMensagens((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, id: json.data.id, status: json.data.status } : m
          )
        )
      } else {
        toaster.create({ title: 'Erro', description: json.message, type: 'error' })
      }
    } catch {
      toaster.create({ title: 'Erro', description: 'Erro ao enviar mensagem.', type: 'error' })
    }
  }

  const agruparPorData = (mensagens: Mensagem[]) => {
    const agrupadas: { data: string, mensagens: Mensagem[] }[] = []
    mensagens.forEach((msg) => {
      const data = format(new Date(msg.timestamp), 'yyyy-MM-dd')
      const grupoExistente = agrupadas.find((g) => g.data === data)
      if (grupoExistente) grupoExistente.mensagens.push(msg)
      else agrupadas.push({ data, mensagens: [msg] })
    })
    return agrupadas
  }

  return (
    <Flex h="calc(100vh - 80px)">
      {/* Lista de conversas */}
      <Box w="30%" borderRight="1px solid #E2E8F0" overflowY="auto" aria-label="Lista de conversas">
        <Heading size="md" p={4}>Conversas</Heading>
        <VStack align="stretch" gap={1} role="list">
          {carregandoConversas ? (
            <Flex p={4}><Spinner size="sm" /></Flex>
          ) : (
            conversas.map((c) => (
              <Box
                key={c.id}
                p={3}
                bg={conversaSelecionada?.id === c.id ? 'blue.50' : 'white'}
                borderBottom="1px solid #E2E8F0"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => carregarMensagens(c)}
                aria-label={`Conversa com ${c.nome || c.numero}`}
                role="listitem"
              >
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="textPrimary">{c.nome || c.numero}</Text>
                  <Text fontSize="xs" color="gray.500">{c.ultimaMensagemEm && format(new Date(c.ultimaMensagemEm), 'HH:mm')}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="textSecondary" lineClamp={1}>{c.ultimaMensagem}</Text>
                  {c.naoLidas > 0 && <Badge colorScheme="blue" fontSize="xs">{c.naoLidas}</Badge>}
                </Flex>
              </Box>
            ))
          )}
        </VStack>
      </Box>

      {/* Chat da conversa */}
      <Flex direction="column" flex="1" p={4} aria-label="Janela de conversa">
        {conversaSelecionada ? (
          <>
            <Heading size="sm" mb={2} color="textPrimary">
              Conversando com: {conversaSelecionada.nome || conversaSelecionada.numero}
            </Heading>

            <Box ref={mensagensRef} flex="1" overflowY="auto" bg="gray.50" p={4} rounded="md">
              {carregandoMensagens ? (
                <Flex justify="center" align="center" h="100%">
                  <Spinner />
                </Flex>
              ) : mensagens.length === 0 ? (
                <Text color="gray.400" textAlign="center">Nenhuma mensagem ainda.</Text>
              ) : (
                <VStack gap={4} align="stretch">
                  {agruparPorData(mensagens).map((grupo, idx) => (
                    <Box key={idx}>
                      <Text fontSize="xs" color="gray.500" textAlign="center" my={2}>
                        {format(new Date(grupo.mensagens[0].timestamp), 'dd/MM/yyyy')}
                      </Text>
                      {grupo.mensagens.map((m, i) => (
                        <ChatMessage
                          key={m.id || i}
                          conteudo={m.conteudo}
                          direcao={m.direcao}
                          status={m.status}
                        />
                      ))}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>

            <ChatInput
              mensagem={mensagem}
              setMensagem={setMensagem}
              onEnviar={enviar}
            />
          </>
        ) : (
          <Flex justify="center" align="center" h="full">
            <Text color="gray.500">Selecione uma conversa para começar</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
