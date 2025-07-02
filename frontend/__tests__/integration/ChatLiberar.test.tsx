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

describe('ChatAdminPage - Liberar Atendimento', () => {
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
                atendenteId: '123' // faz o botão aparecer
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

    const botao = await screen.findByText('Liberar Atendimento')
    expect(botao).toBeInTheDocument()

    fireEvent.click(botao)

    await waitFor(() => {
      // Após a liberação, o botão deve sumir
      expect(screen.queryByText('Liberar Atendimento')).not.toBeInTheDocument()
    })
  })
})
