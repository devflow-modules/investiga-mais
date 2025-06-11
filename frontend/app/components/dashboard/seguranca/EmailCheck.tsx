'use client'

import {
    Box,
    Button,
    Card,
    Heading,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { apiFetchJSON } from '../../../../src/utils/apiFetchJSON'
import { toaster } from '../../../../src/components/ui/toaster'
import SectionHeading from './SectionHeading'


type EmailResponse = {
    email: string
    deliverability: string
    is_free_email: boolean
    is_disposable_email: boolean
    quality_score: string
}

export default function EmailCheck() {
    const [email, setEmail] = useState('')
    const [emailResult, setEmailResult] = useState<EmailResponse | null>(null)
    const [loadingEmail, setLoadingEmail] = useState(false)

    const showSuccessToast = (title: string) => {
        toaster.create({
            title,
            description: 'Veja abaixo os resultados detalhados da análise.',
            duration: 5000,
        })
    }

    const showErrorToast = (title: string, message: string) => {
        toaster.create({
            title,
            description: `Detalhes do erro: ${message}`,
            duration: 6000,
        })
    }

    const handleCheckEmail = async () => {
        setLoadingEmail(true)
        setEmailResult(null)
        try {
            const response = await apiFetchJSON(`/api/seguranca/email-verify/${encodeURIComponent(email)}`)
            setEmailResult(response.data as EmailResponse)

            showSuccessToast('Validação de email concluída ✅')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido'
            showErrorToast('Não foi possível completar a verificação de email ⚠️', message)
        } finally {
            setLoadingEmail(false)
        }
    }

    return (
        <Card.Root>
            <Card.Header>
                <SectionHeading
                    title="Verificar Reputação do Email"
                    subtitle="Analise se o email é válido e confiável antes de enviar informações."
                    icon="📧"
                />
            </Card.Header>
            <Card.Body>
                <Stack gap={4}>
                    <Input
                        placeholder="Digite o email a ser analisado"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        colorScheme="blue"
                        onClick={handleCheckEmail}
                        loading={loadingEmail}
                    >
                        Analisar Email
                    </Button>

                    {emailResult && (
                        <Card.Root variant="outline" mt={4}>
                            <Card.Body>
                                <Text><b>Email:</b> {emailResult.email}</Text>
                                <Text><b>Está apto para receber emails?</b> {emailResult.deliverability}</Text>
                                <Text><b>É um email gratuito (ex: Gmail)?</b> {emailResult.is_free_email ? 'Sim' : 'Não'}</Text>
                                <Text><b>É um email descartável?</b> {emailResult.is_disposable_email ? 'Sim' : 'Não'}</Text>
                                <Text><b>Nível de confiança:</b> {emailResult.quality_score}</Text>
                            </Card.Body>
                        </Card.Root>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    )
}
