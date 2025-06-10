'use client'

import {
    Box,
    Button,
    Heading,
    Input,
    Text,
    VStack,
    Flex,
    Portal
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { ufOptions, generoOptions } from './perfilOptions'

export function CompletePerfilSection() {
    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [nascimento, setNascimento] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [genero, setGenero] = useState('')
    const [bonusConcedidoAt, setBonusConcedidoAt] = useState<string | null>(null)

    const [mensagem, setMensagem] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)

    // Ao carregar componente → busca perfil atual
    useEffect(() => {
        const controller = new AbortController()
        fetchPerfil(controller.signal)
        return () => {
            controller.abort()
        }
    }, [])

    const fetchPerfil = async (signal?: AbortSignal) => {
        try {
            const res = await fetch('/api/perfil', {
                credentials: 'include',
                signal,
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                if (signal?.aborted) return // ignora se foi abortado
                throw new Error(data?.message || 'Erro ao obter perfil')
            }

            const u = data.data.usuario

            setNome(u.nome || '')
            setTelefone(u.telefone || '')
            setNascimento(u.nascimento ? u.nascimento.substring(0, 10) : '')
            setCidade(u.cidade || '')
            setUf(u.uf || '')
            setGenero(u.genero || '')
            setBonusConcedidoAt(u.bonusConcedidoAt || null)
        } catch (err: any) {
            if (signal?.aborted) return // ignora se foi abortado
            console.error('[CompletePerfilSection] Erro ao obter perfil:', err)
        }
    }


    const handleSalvarPerfil = async () => {
        setCarregando(true)
        setMensagem(null)

        try {
            const res = await fetch('/api/perfil', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    telefone,
                    nascimento,
                    cidade,
                    uf,
                    genero
                })
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data?.message || 'Erro ao salvar perfil')
            }

            const { bonusConcedido } = data.data

            if (bonusConcedido && !bonusConcedidoAt) {
                setBonusConcedidoAt(new Date().toISOString())
                setMensagem('✅ Perfil atualizado com sucesso! 🎁 Você ganhou um bônus.')
            } else {
                setMensagem('✅ Perfil atualizado com sucesso.')
            }
        } catch (err: any) {
            console.error('[CompletePerfilSection] Erro ao salvar perfil:', err)
            setMensagem(`❌ ${err.message || 'Erro ao salvar perfil. Tente novamente.'}`)
        } finally {
            setCarregando(false)
        }
    }

    const formatarDataISO = (iso: string | undefined) => {
        if (!iso) return ''
        return iso.split('T')[0] // para o campo <input type="date">
    }

    return (
        <Box mt={8} borderTop="1px solid" borderColor="gray.200" pt={6}>
            <Heading size="md" mb={4}>💎 Complete seu perfil e ganhe benefícios</Heading>

            <VStack gap={3} align="stretch">
                <Input
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <Input
                    placeholder="Telefone (WhatsApp)"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />
                <Input
                    type="date"
                    placeholder="Data de nascimento"
                    value={formatarDataISO(nascimento)}
                    onChange={(e) => setNascimento(e.target.value)}
                />
                <Input
                    placeholder="Cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                />

                <Select.Root
                    collection={ufOptions}
                    value={[uf]}
                    onValueChange={(val) => setUf(val?.value?.[0] ?? '')}
                    size="sm"
                    width="100%"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Estado (UF)" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {ufOptions.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    collection={generoOptions}
                    value={[genero]}
                    onValueChange={(val) => setGenero(val?.value?.[0] ?? '')}
                    size="sm"
                    width="100%"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Gênero" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {generoOptions.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Button
                    colorScheme="blue"
                    onClick={handleSalvarPerfil}
                    loading={carregando}
                >
                    Salvar e ganhar benefício 🎁
                </Button>

                {mensagem && (
                    <Flex justify="center" mt={2}>
                        <Text fontSize="sm" color={mensagem.startsWith('✅') ? 'green.600' : 'red.600'}>
                            {mensagem}
                        </Text>
                    </Flex>
                )}

                {bonusConcedidoAt && (
                    <Text mt={2} fontSize="sm" color="green.600" fontWeight="bold" textAlign="center">
                        🎁 Você já recebeu seu bônus em {new Date(bonusConcedidoAt).toLocaleDateString()}
                    </Text>
                )}
            </VStack>
        </Box>
    )
}
