import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import type { Conversa, Mensagem } from '@types'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

let scrollMock = jest.fn()

beforeAll(() => {
  mockFetchConversa()
})

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: [],
    setMensagens: jest.fn(),
    carregarMais: jest.fn(),
    hasMore: false,
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
          id: 1,
          conteudo: 'Teste de scroll',
          direcao: 'saida',
          timestamp: new Date().toISOString()
        }
      ])
      setMensagem('')
    },
    setEnviando: jest.fn()
  })
}))

describe('ChatAdminPage - Scroll', () => {
  beforeEach(() => {
    scrollMock = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollMock
  })

  it('chama scrollIntoView ao enviar mensagem', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Teste')
    fireEvent.click(conversa)

    const input = await screen.findByPlaceholderText('Digite uma mensagem...')
    fireEvent.change(input, { target: { value: 'Teste de scroll' } })

    const button = screen.getByLabelText('Botão de envio de mensagem')
    fireEvent.click(button)

    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalled()
    })
  })
})
