import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import type { Mensagem } from '@types'

// Mock da função retry
const retryMock = jest.fn()

jest.mock('@/utils/retryEnvioMensagem', () => ({
  retryEnvioMensagem: (...args: any[]) => {
    retryMock(...args)
  }
}))

jest.mock('@/hooks/useMensagensConversa', () => ({
  useMensagensConversa: () => ({
    mensagens: [
      {
        id: 1,
        conteudo: 'Falhou ao enviar',
        direcao: 'saida',
        status: 'falhou',
        timestamp: new Date().toISOString()
      }
    ],
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

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            conversas: [
              {
                id: 1,
                nome: 'Usuário Falha',
                numero: '+5511999998888',
                ultimaMensagem: 'Erro',
                ultimaMensagemEm: new Date().toISOString(),
                atendenteId: null
              }
            ]
          }
        })
    })
  ) as jest.Mock
})

describe('ChatAdminPage - Mensagem com falha e retry', () => {
  it('exibe botão de retry e chama função ao clicar', async () => {
    renderWithChakra(<ChatAdminPage />)

    const conversa = await screen.findByText('Usuário Falha')
    fireEvent.click(conversa)

    const mensagem = await screen.findByText('Falhou ao enviar')
    expect(mensagem).toBeInTheDocument()

    const retryButton = screen.getByTitle('Falhou')
    expect(retryButton).toBeInTheDocument()

    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(retryMock).toHaveBeenCalled()
    })
  })
})
