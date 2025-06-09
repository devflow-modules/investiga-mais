'use client'

import {
    Box,
    Button,
    Heading,
    Input,
    Text,
    VStack,
    Flex,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Select, Portal } from '@chakra-ui/react'
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
        fetchPerfil()
    }, [])

    const fetchPerfil = async () => {
        try {
            const res = await fetch('/api/perfil', {
                credentials: 'include',
            })

            if (!res.ok) {
                throw new Error('Erro ao obter perfil')
            }

            const data = await res.json()
            const u = data.usuario

            setNome(u.nome || '')
            setTelefone(u.telefone || '')
            setNascimento(u.nascimento ? u.nascimento.substring(0, 10) : '')
            setCidade(u.cidade || '')
            setUf(u.uf || '')
            setGenero(u.genero || '')
            setBonusConcedidoAt(u.bonusConcedidoAt || null)
        } catch (err) {
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

            if (!res.ok) {
                // Aqui já usa a mensagem de erro vinda da API se existir
                throw new Error(data?.erro || 'Erro ao salvar perfil')
            }

            if (data.bonusConcedido && !bonusConcedidoAt) {
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
                    disabled={carregando}
                >
                    {carregando ? 'Salvando...' : 'Salvar e ganhar benefício 🎁'}
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
