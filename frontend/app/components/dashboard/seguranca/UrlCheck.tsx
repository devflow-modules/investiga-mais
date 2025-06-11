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

type UrlResponse = {
    url: string
    threat_found: boolean
    matches: Array<{
        threatType: string
        platformType: string
        threat: { url: string }
    }>
}

export default function UrlCheck() {
    const [url, setUrl] = useState('')
    const [urlResult, setUrlResult] = useState<UrlResponse | null>(null)
    const [loadingUrl, setLoadingUrl] = useState(false)

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

    const handleCheckUrl = async () => {
        setLoadingUrl(true)
        setUrlResult(null)
        try {
            const response = await apiFetchJSON(`/api/seguranca/safe-browsing?url=${encodeURIComponent(url)}`)
            setUrlResult(response.data as UrlResponse)

            showSuccessToast('Análise de URL concluída ✅')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido'
            showErrorToast('Não foi possível completar a verificação de URL ⚠️', message)
        } finally {
            setLoadingUrl(false)
        }
    }

    return (
        <Card.Root>
            <Card.Header>
                <SectionHeading
                    title="Verificar Segurança de um Site"
                    subtitle="Verifique se o site apresenta tentativas de golpe, malware ou riscos de phishing."
                    icon="🔒"
                />
            </Card.Header>
            <Card.Body>
                <Stack gap={4}>
                    <Input
                        placeholder="Digite a URL do site"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                        colorScheme="blue"
                        onClick={handleCheckUrl}
                        loading={loadingUrl}
                    >
                        Analisar Site
                    </Button>

                    {urlResult && (
                        <Card.Root variant="outline" mt={4}>
                            <Card.Body>
                                <Text><b>Site analisado:</b> {urlResult.url}</Text>
                                <Text><b>Este site apresenta risco?</b> {urlResult.threat_found ? '⚠️ Sim' : '✅ Não'}</Text>

                                {urlResult.threat_found && (
                                    <Box mt={2}>
                                        {urlResult.matches.map((match, idx) => (
                                            <Card.Root key={idx} variant="subtle" mt={2}>
                                                <Card.Body bg="red.50" borderRadius="md">
                                                    <Text><b>Tipo de ameaça:</b> {match.threatType}</Text>
                                                    <Text><b>Plataforma:</b> {match.platformType}</Text>
                                                    <Text><b>URL de ameaça:</b> {match.threat.url}</Text>
                                                </Card.Body>
                                            </Card.Root>
                                        ))}
                                    </Box>
                                )}
                            </Card.Body>
                        </Card.Root>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    )
}
