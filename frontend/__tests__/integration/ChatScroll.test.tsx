import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'

// Mocks globais
let scrollMock = jest.fn()

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: [],
    setMensagens: jest.fn(),
    carregarMais: jest.fn(),
    hasMore: false,
    loading: false,
  }),
}))

jest.mock('@/hooks/useChatActions', () => ({
  useChatActions: () => ({
    enviando: false,
    enviar: () => {
      const novoElemento = document.createElement('div')
      novoElemento.scrollIntoView = scrollMock
      document.body.appendChild(novoElemento)
      novoElemento.scrollIntoView()
    },
    setEnviando: jest.fn(),
  }),
}))

describe('ChatAdminPage - Scroll automático ao enviar', () => {
  beforeAll(() => {
    mockFetchConversa()
  })

  beforeEach(() => {
    scrollMock = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollMock
  })

  it('aciona scrollIntoView ao enviar nova mensagem', async () => {
    renderWithChakra(<ChatAdminPage />)

    // Aguardamos a lista de conversas carregar
    const conversa = await screen.findByText('Usuário Teste')
    fireEvent.click(conversa)

    // Digita uma mensagem e envia
    const input = await screen.findByPlaceholderText('Digite uma mensagem...')
    fireEvent.change(input, { target: { value: 'Teste de scroll' } })

    const enviar = screen.getByLabelText('Botão de envio de mensagem')
    fireEvent.click(enviar)

    // Valida se scrollIntoView foi chamado após o envio
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalled()
    })
  })
})
