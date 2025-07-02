import { ChatInput } from '@/components/admin/chat/ChatInput'
import { fireEvent, screen } from '@testing-library/react'
import { useState } from 'react'
import { renderWithChakra } from 'tests/helpers/renderWithChakra'

function Wrapper({
    initial = '',
    carregando = false,
    onEnviar = () => { }
}) {
    const [mensagem, setMensagem] = useState(initial)
    return (
        <ChatInput
            mensagem={mensagem}
            setMensagem={setMensagem}
            onEnviar={onEnviar}
            carregando={carregando}
        />
    )
}

describe('ChatInput', () => {
    it('renderiza input e botão corretamente', () => {
        renderWithChakra(<Wrapper />)
        expect(screen.getByPlaceholderText(/Digite uma mensagem/)).toBeInTheDocument()
        expect(screen.getByLabelText('Botão de envio de mensagem')).toBeInTheDocument()
    })

    it('atualiza o valor do input quando digitado', () => {
        renderWithChakra(<Wrapper />)
        const input = screen.getByPlaceholderText(/Digite uma mensagem/)
        fireEvent.change(input, { target: { value: 'Testando' } })
        expect(input).toHaveValue('Testando')
    })

    it('botão está desabilitado se input estiver vazio', () => {
        renderWithChakra(<Wrapper initial="  " />)
        const button = screen.getByLabelText('Botão de envio de mensagem')
        expect(button).toBeDisabled()
    })

    it('botão está habilitado quando há texto', () => {
        renderWithChakra(<Wrapper initial="Olá" />)
        const button = screen.getByLabelText('Botão de envio de mensagem')
        expect(button).not.toBeDisabled()
    })

    it('chama onEnviar ao enviar mensagem com conteúdo', () => {
        const mock = jest.fn()
        renderWithChakra(<Wrapper initial="Oi" onEnviar={mock} />)
        fireEvent.submit(screen.getByRole('form'))
        expect(mock).toHaveBeenCalled()
    })

    it('não chama onEnviar se mensagem estiver vazia', () => {
        const mock = jest.fn()
        renderWithChakra(<Wrapper initial=" " onEnviar={mock} />)
        fireEvent.submit(screen.getByRole('form'))
        expect(mock).not.toHaveBeenCalled()
    })

    it('exibe estado de carregamento no botão quando prop carregando for true', () => {
        renderWithChakra(<Wrapper initial="Enviando" carregando={true} />)
        const button = screen.getByLabelText('Botão de envio de mensagem')
        expect(button).toBeDisabled()
        expect(button).toHaveTextContent('Enviar') // opcional
        expect(button.querySelector('.chakra-spinner')).toBeInTheDocument()
    })
})
