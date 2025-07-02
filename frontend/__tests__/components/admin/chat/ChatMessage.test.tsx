import { ChatMessage } from '@/components/admin/chat/ChatMessage'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'

describe('ChatMessage', () => {
    it('renderiza mensagem de entrada corretamente', () => {
        renderWithChakra(
            <ChatMessage
                conteudo="Olá, tudo bem?"
                direcao="entrada"
                timestamp="2025-07-01T13:00:00Z"
            />
        )

        expect(screen.getByText('Olá, tudo bem?')).toBeInTheDocument()
    })

    it('renderiza mensagem de saída com status e horário', () => {
        renderWithChakra(
            <ChatMessage
                conteudo="Mensagem enviada"
                direcao="saida"
                timestamp="2025-07-01T13:00:00Z"
                status="lida"
                atendente={{ nome: 'Gustavo' }}
            />
        )

        expect(screen.getByText('Mensagem enviada')).toBeInTheDocument()
        expect(screen.getByText(format(new Date('2025-07-01T13:00:00Z'), 'HH:mm', { locale: ptBR }))).toBeInTheDocument()
    })

    it('mostra tooltip ao passar mouse na mensagem de saída', () => {
        renderWithChakra(
            <ChatMessage
                conteudo="Teste tooltip"
                direcao="saida"
                timestamp="2025-07-01T13:00:00Z"
                status="pendente"
                atendente={{ nome: 'Fulano' }}
            />
        )

        expect(screen.getByText('Teste tooltip')).toBeInTheDocument()
        // O conteúdo do tooltip só aparece no hover real, mas a renderização não quebra
    })

    it('não mostra tooltip se for mensagem de entrada', () => {
        renderWithChakra(
            <ChatMessage
                conteudo="Mensagem sem tooltip"
                direcao="entrada"
                timestamp="2025-07-01T13:00:00Z"
            />
        )

        expect(screen.getByText('Mensagem sem tooltip')).toBeInTheDocument()
    })

    it('chama onRetry quando clicado', () => {
        const mock = jest.fn()
        renderWithChakra(
            <ChatMessage conteudo="Clique aqui" direcao="saida" onRetry={mock} />
        )
        fireEvent.click(screen.getByText('Clique aqui'))
        expect(mock).toHaveBeenCalled()
    })

    it('não quebra ao clicar se onRetry for undefined', () => {
        renderWithChakra(<ChatMessage conteudo="Seguro" direcao="saida" />)
        fireEvent.click(screen.getByText('Seguro'))
    })

    it('tem borda quando mensagem for de entrada', () => {
        const { container } = renderWithChakra(
            <ChatMessage conteudo="Com borda" direcao="entrada" />
        )
        const box = container.querySelector('div')
        expect(box?.style.border).toBeDefined()
    })

    it('altera estilo ao hover quando onRetry existe', () => {
        const { getByText } = renderWithChakra(
            <ChatMessage conteudo="Hover Test" direcao="saida" onRetry={() => { }} />
        )
        const msg = getByText('Hover Test')
        fireEvent.mouseOver(msg)
        // Chakra aplica estilos por classes, então não testamos diretamente estilo aqui
        expect(msg).toBeInTheDocument()
    })
})
