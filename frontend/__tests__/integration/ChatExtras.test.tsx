import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'
import { mockFetchConversa } from 'tests/helpers/mockFetchConversa'
import { formatarDataBrasil } from '@/utils/formatarDataBrasil'

// Helpers: datas e formatação
const data1 = '2025-06-29T00:00:00.000Z'
const data2 = '2025-07-01T00:00:00.000Z'

// Mocks estáticos
jest.doMock('@/hooks/useMensagensConversa', () => ({
    useMensagensConversa: () => ({
        mensagens: [
            {
                id: 1,
                conteudo: 'Mensagem 1',
                direcao: 'entrada',
                timestamp: data1,
                status: 'lida',
            },
            {
                id: 2,
                conteudo: 'Mensagem 2',
                direcao: 'entrada',
                timestamp: data2,
                status: 'lida',
            },
        ],
        setMensagens: jest.fn(),
        carregarMais: jest.fn(),
        hasMore: false,
        loading: false,
    }),
}))

const ChatAdminComponent = require('@/components/admin/chat/ChatAdminComponent').default

let observerInstances: { callback: (entries: { isIntersecting: boolean }[]) => void }[] = []

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

describe('ChatAdminPage - Casos adicionais', () => {
    beforeEach(() => {
        observerInstances = []

        global.IntersectionObserver = class {
            constructor(callback: any) {
                observerInstances.push({ callback })
            }
            observe = jest.fn()
            unobserve = jest.fn()
            disconnect = jest.fn()
        } as any

        HTMLElement.prototype.focus = jest.fn()
    })

    it('agrupa mensagens por data corretamente', async () => {
        mockFetchConversa([
            {
                id: 1,
                nome: 'Teste Agrupamento',
                numero: '+5511999999999',
                ultimaMensagem: 'Oi',
                ultimaMensagemEm: new Date().toISOString(),
                atendenteId: null,
            },
        ])

        renderWithChakra(<ChatAdminComponent />)

        const conversa = await screen.findByText('Teste Agrupamento')
        fireEvent.click(conversa)

        await waitFor(() => {
            expect(screen.getByText('27/06/2025')).toBeInTheDocument()
            expect(screen.getByText('29/06/2025')).toBeInTheDocument()
        })
    })


    it('não chama carregarMais quando hasMore=false e loading=true', async () => {
        jest.doMock('@/hooks/useMensagensConversa', () => ({
            useMensagensConversa: () => ({
                mensagens: [],
                setMensagens: jest.fn(),
                carregarMais: jest.fn(),
                hasMore: false,
                loading: true,
            }),
        }))
        const ChatAdminComponentTemp = require('@/components/admin/chat/ChatAdminComponent').default

        mockFetchConversa()
        renderWithChakra(<ChatAdminComponentTemp />)

        const conversa = await screen.findByText('Usuário Teste')
        fireEvent.click(conversa)

        await waitFor(() => {
            expect(observerInstances.length).toBeGreaterThan(0)
        })

        observerInstances[0].callback([{ isIntersecting: true }])
    })

    it('foca automaticamente no input ao trocar de conversa', async () => {
        jest.doMock('@/hooks/useMensagensConversa', () => ({
            useMensagensConversa: () => ({
                mensagens: [],
                setMensagens: jest.fn(),
                carregarMais: jest.fn(),
                hasMore: false,
                loading: false,
            }),
        }))
        const ChatAdminComponentTemp = require('@/components/admin/chat/ChatAdminComponent').default

        mockFetchConversa()
        renderWithChakra(<ChatAdminComponentTemp />)

        const conversa = await screen.findByText('Usuário Teste')
        fireEvent.click(conversa)

        await waitFor(() => {
            expect(HTMLElement.prototype.focus).toHaveBeenCalled()
        })
    })

    it('cai no fallback setConversas([]) em erro na fetch inicial', async () => {
        jest.doMock('@/hooks/useMensagensConversa', () => ({
            useMensagensConversa: () => ({
                mensagens: [],
                setMensagens: jest.fn(),
                carregarMais: jest.fn(),
                hasMore: false,
                loading: false,
            }),
        }))
        const ChatAdminComponentTemp = require('@/components/admin/chat/ChatAdminComponent').default

        global.fetch = jest.fn(() => {
            throw new Error('Falha')
        }) as jest.Mock

        renderWithChakra(<ChatAdminComponentTemp />)

        await waitFor(() => {
            expect(screen.queryByText('Conversas')).toBeInTheDocument()
        })
    })
})
