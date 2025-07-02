import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import type { Conversa, Mensagem } from '@types'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

const setMensagensMock = jest.fn()

jest.mock('@/hooks/useMensagensConversa', () => {
  return {
    useMensagensConversa: (_: { conversaId: number }) => ({
      mensagens: [
        {
          id: 123,
          conteudo: 'Mensagem antiga',
          direcao: 'entrada',
          timestamp: new Date().toISOString(),
        },
      ],
      setMensagens: setMensagensMock,
      carregarMais: jest.fn(),
      hasMore: false,
      loading: false,
    }),
  }
})

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
          id: 999,
          conteudo: 'Teste',
          direcao: 'saida',
          timestamp: new Date().toISOString(),
        },
      ])
      setMensagem('')
    },
    setEnviando: jest.fn(),
  }),
}))

describe('ChatAdminPage - Troca de conversa', () => {
  beforeEach(() => {
    setMensagensMock.mockClear()
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    mockFetchConversa([
      {
        id: 1,
        nome: 'Usuário 1',
        numero: '+5511999991111',
        ultimaMensagem: 'Olá!',
        ultimaMensagemEm: new Date().toISOString(),
        atendenteId: null,
      },
      {
        id: 2,
        nome: 'Usuário 2',
        numero: '+5511999992222',
        ultimaMensagem: 'Oi!',
        ultimaMensagemEm: new Date().toISOString(),
        atendenteId: null,
      },
    ])
  })

  it('substitui mensagens ao trocar de conversa', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa1 = await screen.findByText('Usuário 1')
    fireEvent.click(conversa1)

    await waitFor(() => {
      expect(screen.getByText(/Conversando com/i)).toHaveTextContent('Usuário 1')
    })

    const conversa2 = await screen.findByText('Usuário 2')
    fireEvent.click(conversa2)

    await waitFor(() => {
      expect(screen.getByText(/Conversando com/i)).toHaveTextContent('Usuário 2')
    })
  })
})
