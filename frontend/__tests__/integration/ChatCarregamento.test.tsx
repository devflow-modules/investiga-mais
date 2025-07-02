import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import type { Conversa, Mensagem } from '@types'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

const carregarMaisMock = jest.fn()

beforeAll(() => {
  mockFetchConversa()
})

beforeEach(() => {
  // Mock do IntersectionObserver com captura de instância
  observerInstances = []
  global.IntersectionObserver = class {
    constructor(callback: any) {
      observerInstances.push({ callback })
    }
    observe = jest.fn()
    unobserve = jest.fn()
    disconnect = jest.fn()
  } as any
})

let observerInstances: { callback: (entries: { isIntersecting: boolean }[]) => void }[] = []

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: [
      {
        id: 1,
        conteudo: 'Mensagem antiga',
        direcao: 'entrada',
        timestamp: new Date().toISOString()
      }
    ],
    setMensagens: jest.fn(),
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
          id: 2,
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

describe('ChatAdminPage - Carregamento incremental', () => {
  it('chama carregarMais ao detectar interseção com topo', async () => {
    renderWithChakra(<ChatAdminPage />)

    // Aguarda e clica na conversa
    const conversa = await screen.findByText('Usuário Teste')
    fireEvent.click(conversa)

    // Aguarda até que o IntersectionObserver tenha sido instanciado
    await waitFor(() => {
      expect(observerInstances.length).toBeGreaterThan(0)
    })

    // Simula interseção no topo
    observerInstances[0].callback([{ isIntersecting: true }])

    // Espera chamada do hook
    await waitFor(() => {
      expect(carregarMaisMock).toHaveBeenCalled()
    })
  })
})
