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

describe('ChatAdminPage - Liberar conversa', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url?.toString().includes('/liberar')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true })
        })
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            conversas: [
              {
                id: 1,
                nome: 'Usuário Atendido',
                numero: '+5511999990000',
                ultimaMensagem: 'Oi',
                ultimaMensagemEm: new Date().toISOString(),
                atendenteId: '123'
              }
            ]
          }
        })
      })
    }) as jest.Mock
  })

  it('permite liberar a conversa e esconde o botão após sucesso', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Atendido')
    fireEvent.click(conversa)

    // Product label is "Liberar conversa" (BotaoLiberarConversa)
    const botao = await screen.findByRole('button', { name: /liberar conversa/i })
    expect(botao).toBeInTheDocument()

    fireEvent.click(botao)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /liberar conversa/i })).not.toBeInTheDocument()
    })
  })
})
