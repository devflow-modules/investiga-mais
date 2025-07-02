
import ChatAdminPage from '@/admin/chat/page'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import type { Mensagem } from '@types'

// Estado simulado de mensagens
let mensagensFake: Mensagem[] = []

jest.mock('@/hooks/useMensagensConversa', () => ({
    useMensagensConversa: () => ({
        mensagens: mensagensFake,
        setMensagens: (newMensagens: Mensagem[] | ((prev: Mensagem[]) => Mensagem[])) => {
            if (typeof newMensagens === 'function') {
                mensagensFake = newMensagens(mensagensFake)
            } else {
                mensagensFake = newMensagens
            }
        },
        carregarMais: jest.fn(),
        hasMore: false,
        loading: false,
    }),
}))

jest.mock('@/hooks/useChatActions', () => ({
    useChatActions: (
        _conversa: any,
        _mensagens: Mensagem[],
        setMensagens: React.Dispatch<React.SetStateAction<Mensagem[]>>,
        _mensagem: string,
        setMensagem: React.Dispatch<React.SetStateAction<string>>
    ) => ({
        enviando: false,
        enviar: () => {
            setMensagens((prev) => [
                ...prev,
                {
                    id: Date.now(), 
                    conteudo: 'Mensagem Teste',
                    direcao: 'saida',
                    timestamp: new Date().toISOString(),
                },
            ])
            setMensagem('')
        },
        setEnviando: jest.fn(),
    }),
}))


beforeAll(() => {
    global.IntersectionObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    } as any

    HTMLElement.prototype.scrollIntoView = jest.fn()
})

beforeEach(() => {
    mensagensFake = [] // Resetar antes de cada teste
})

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                success: true,
                data: {
                    conversas: [
                        {
                            id: 1,
                            nome: 'Usuário Teste',
                            numero: '+5511999999999',
                            ultimaMensagemEm: new Date().toISOString(),
                            ultimaMensagem: 'Olá!',
                            atendenteId: null,
                        },
                    ],
                },
            }),
    })
) as jest.Mock

describe('ChatAdminPage - Integração', () => {
    it('fluxo completo: selecionar conversa, enviar mensagem e ver no chat', async () => {
        renderWithChakra(<ChatAdminPage />)

        const conversa = await screen.findByText('Usuário Teste')
        fireEvent.click(conversa)

        const input = screen.getByPlaceholderText('Digite uma mensagem...')
        fireEvent.change(input, { target: { value: 'Mensagem Teste' } })

        const botao = screen.getByRole('button', {
            name: /botão de envio de mensagem/i,
        })
        fireEvent.click(botao)

        await waitFor(() => {
            expect(screen.getByText('Mensagem Teste')).toBeInTheDocument()
        })
    })
})
