import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'

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
  useChatActions: () => ({
    enviando: false,
    enviar: jest.fn(),
    setEnviando: jest.fn()
  })
}))

describe('ChatAdminPage - Comportamento mobile', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              conversas: [
                {
                  id: 1,
                  nome: 'Usuário Mobile',
                  numero: '+5511999990000',
                  ultimaMensagem: 'Oi',
                  ultimaMensagemEm: new Date().toISOString(),
                  atendenteId: null
                }
              ]
            }
          })
      })
    ) as jest.Mock
  })

  it('exibe lista, entra no chat e volta ao mobile corretamente', async () => {
    // Força o modo mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    })
    window.dispatchEvent(new Event('resize'))

    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Mobile')
    expect(conversa).toBeInTheDocument()

    // Clica para abrir o chat
    fireEvent.click(conversa)

    // Deve aparecer botão "← Voltar"
    const botaoVoltar = await screen.findByRole('button', { name: /voltar/i })
    expect(botaoVoltar).toBeInTheDocument()

    // Agora clica para voltar à lista
    fireEvent.click(botaoVoltar)

    // Deve mostrar de novo a lista com a conversa
    await waitFor(() => {
      expect(screen.getByText('Usuário Mobile')).toBeInTheDocument()
    })
  })
})
