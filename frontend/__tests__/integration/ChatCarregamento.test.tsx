import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import type { Conversa, Mensagem } from '@types'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

// Estado simulado
let mensagensFake: Mensagem[] = []
const carregarMaisMock = jest.fn()

let observerInstances: {
  callback: (entries: { isIntersecting: boolean }[]) => void
}[] = []

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: mensagensFake,
    setMensagens: (newMensagens: Mensagem[] | ((prev: Mensagem[]) => Mensagem[])) => {
      mensagensFake = typeof newMensagens === 'function' ? newMensagens(mensagensFake) : newMensagens
    },
    carregarMais: carregarMaisMock,
    hasMore: true,
    loading: false
  })
}))

jest.mock('@/hooks/useChatActions', () => ({
  useChatActions: (
    _c: Conversa | null,
    _m: Mensagem[],
    setMensagens: (mensagens: Mensagem[]) => void,
    _msg: string,
    setMensagem: (msg: string) => void
  ) => ({
    enviando: false,
    enviar: () => {
      setMensagens([
        {
          id: Date.now(),
          conteudo: 'Nova mensagem',
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
      ultimaMensagemEm: new Date().toISOString(),
      ultimaMensagem: 'Olá!',
      atendenteId: null
    }
  ])

  global.IntersectionObserver = class {
    constructor(callback: any) {
      observerInstances.push({ callback })
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any

  HTMLElement.prototype.scrollIntoView = jest.fn()
})

beforeEach(() => {
  mensagensFake = [
    {
      id: 1,
      conteudo: 'Mensagem antiga',
      direcao: 'entrada',
      timestamp: new Date().toISOString()
    }
  ]
  observerInstances = []
  carregarMaisMock.mockClear()
})

describe('ChatAdminPage - Carregamento incremental', () => {
  it('chama carregarMais ao detectar interseção com topo', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Teste')
    fireEvent.click(conversa)

    await waitFor(() => {
      expect(observerInstances.length).toBeGreaterThan(0)
    })

    // Simula scroll no topo
    observerInstances[0].callback([{ isIntersecting: true }])

    await waitFor(() => {
      expect(carregarMaisMock).toHaveBeenCalled()
    })
  })
})
