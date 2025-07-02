import ChatAdminPage from '@/admin/chat/page'
import { screen } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'

// Mock necessário para os hooks
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

describe('ChatAdminPage - Comportamento desktop', () => {
  beforeEach(() => {
    // Mock para forçar largura de tela acima do breakpoint "md"
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    window.dispatchEvent(new Event('resize'))

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: {
            conversas: [
              {
                id: 1,
                nome: 'Usuário Desktop',
                numero: '+5511999990000',
                ultimaMensagem: 'Olá!',
                ultimaMensagemEm: new Date().toISOString(),
                atendenteId: null
              }
            ]
          }
        })
      })
    ) as jest.Mock
  })

  it('renderiza painel de lista e painel de mensagens lado a lado', async () => {
    renderWithChakra(<ChatAdminPage />)

    // Lista de conversas deve aparecer mesmo antes de clicar
    expect(await screen.findByText('Usuário Desktop')).toBeInTheDocument()

    // Botão "← Voltar" não deve aparecer no desktop
    const botaoVoltar = screen.queryByText('← Voltar')
    expect(botaoVoltar).not.toBeInTheDocument()
  })
})
