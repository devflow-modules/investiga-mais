'use client'

import {
    Button,
    Card,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { apiFetchJSON } from '../../../../src/utils/apiFetchJSON'
import { toaster } from '../../../../src/components/ui/toaster'
import SectionHeading from './SectionHeading'

type IpResponse = {
    ip: string
    risk_level: string
    risk_recommendation: string
    fraud_score: number
    proxy: boolean
    vpn: boolean
    tor: boolean
}

export default function IpCheck() {
    const [ip, setIp] = useState('')
    const [ipResult, setIpResult] = useState<IpResponse | null>(null)
    const [loadingIp, setLoadingIp] = useState(false)

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

    const handleCheckIp = async () => {
        setLoadingIp(true)
        setIpResult(null)
        try {
            const response = await apiFetchJSON(`/api/seguranca/ip-check?ip=${encodeURIComponent(ip)}`)
            setIpResult(response.data as IpResponse)

            showSuccessToast('Verificação de IP concluída ✅')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido'
            showErrorToast('Não foi possível completar a verificação de IP ⚠️', message)
        } finally {
            setLoadingIp(false)
        }
    }

    return (
        <Card.Root>
            <Card.Header>
                <SectionHeading
                    title="Verificar Reputação do IP"
                    subtitle="Descubra se o IP está associado a atividades suspeitas ou riscos."
                    icon="🌐"
                />
            </Card.Header>
            <Card.Body>
                <Stack gap={4}>
                    <Input
                        placeholder="Digite o IP ou hostname"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                    />
                    <Button
                        colorScheme="blue"
                        onClick={handleCheckIp}
                        loading={loadingIp}
                    >
                        Analisar IP
                    </Button>

                    {ipResult && (
                        <Card.Root variant="outline" mt={4}>
                            <Card.Body>
                                <Text><b>IP:</b> {ipResult.ip}</Text>
                                <Text><b>Nível de Risco:</b> {ipResult.risk_level}</Text>
                                <Text><b>Recomendação:</b> {ipResult.risk_recommendation}</Text>
                                <Text><b>Score de Fraude:</b> {ipResult.fraud_score}</Text>
                                <Text><b>Está usando Proxy?</b> {ipResult.proxy ? 'Sim' : 'Não'}</Text>
                                <Text><b>Está usando VPN?</b> {ipResult.vpn ? 'Sim' : 'Não'}</Text>
                                <Text><b>Está na rede TOR?</b> {ipResult.tor ? 'Sim' : 'Não'}</Text>
                            </Card.Body>
                        </Card.Root>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    )
}
