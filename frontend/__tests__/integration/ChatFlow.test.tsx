import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import type { Conversa, Mensagem } from '@types'
import React from 'react'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

// Estado real simulado
let mensagensFake: Mensagem[] = []

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: mensagensFake,
    setMensagens: (next: Mensagem[] | ((prev: Mensagem[]) => Mensagem[])) => {
      mensagensFake = typeof next === 'function' ? next(mensagensFake) : next
    },
    carregarMais: jest.fn(),
    hasMore: false,
    loading: false
  })
}))

jest.mock('@/hooks/useChatActions', () => ({
  useChatActions: (
    _c: Conversa | null,
    _m: Mensagem[],
    setMensagens: React.Dispatch<React.SetStateAction<Mensagem[]>>,
    _msg: string,
    setMensagem: React.Dispatch<React.SetStateAction<string>>
  ) => ({
    enviando: false,
    enviar: () => {
      setMensagens(prev => [
        ...prev,
        {
          id: Date.now(),
          conteudo: 'Mensagem Teste',
          direcao: 'saida',
          timestamp: new Date().toISOString()
        }
      ])
      setMensagem('')
    },
    setEnviando: jest.fn()
  })
}))

beforeAll(() => {
  mockFetchConversa([
    {
      id: 1,
      nome: 'Usuário Teste',
      numero: '+5511999999999',
      ultimaMensagem: 'Olá!',
      ultimaMensagemEm: new Date().toISOString(),
      atendenteId: null
    }
  ])

  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any

  HTMLElement.prototype.scrollIntoView = jest.fn()
})

beforeEach(() => {
  mensagensFake = []
})

describe('ChatAdminPage - Fluxo completo de envio', () => {
  it('permite selecionar conversa, enviar mensagem e renderizar no chat', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Teste')
    fireEvent.click(conversa)

    const input = await screen.findByPlaceholderText('Digite uma mensagem...')
    fireEvent.change(input, { target: { value: 'Mensagem Teste' } })

    const botao = screen.getByLabelText('Botão de envio de mensagem')
    fireEvent.click(botao)

    await waitFor(() => {
      expect(screen.getByText('Mensagem Teste')).toBeInTheDocument()
    })
  })
})
