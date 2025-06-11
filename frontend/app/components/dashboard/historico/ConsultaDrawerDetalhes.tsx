'use client'

import {
  Box,
  Button,
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  Flex,
  Skeleton,
  Text,
  VStack,
  Alert
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  formatarCNPJ,
  formatarMoeda,
  formatarDataHora,
  limparCNPJ,
} from '../../../../../shared/formatters/formatters'
import { MdError } from "react-icons/md";

interface ConsultaDrawerDetalhesProps {
  cnpj: string | null
  isOpen: boolean
  onClose: () => void
}

export function ConsultaDrawerDetalhes({ cnpj, isOpen, onClose }: ConsultaDrawerDetalhesProps) {
  const [carregando, setCarregando] = useState(false)
  const [dadosEmpresa, setDadosEmpresa] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && cnpj) {
      buscarDetalhes(limparCNPJ(cnpj))
    }
  }, [isOpen, cnpj])

  const buscarDetalhes = async (cnpjLimpo: string) => {
    // Evita refetch se já temos dados válidos e não estamos carregando
    if (dadosEmpresa?.cnpj === cnpjLimpo && !carregando) {
      console.log('[ConsultaDrawerDetalhes] Dados já carregados, pulando fetch.')
      return
    }

    setCarregando(true)
    setErro(null)

    // Mantém dadosEmpresa atual até novo resultado (para UX mais suave)
    try {
      const res = await fetch(`/api/consulta/${cnpjLimpo}`, {
        credentials: 'include',
      })

      console.log('[ConsultaDrawerDetalhes] Status:', res.status)

      const data = await res.json()
      console.log('[ConsultaDrawerDetalhes] Dados empresa:', data)

      if (!res.ok || !data.success || !data.data?.empresa) {
        throw new Error(data.message || 'Erro ao obter dados da empresa.')
      }

      // Adiciona cnpj no dadosEmpresa para próxima checagem
      setDadosEmpresa({ ...data.data.empresa, cnpj: cnpjLimpo })
    } catch (err: any) {
      console.error('[ConsultaDrawerDetalhes] Erro ao buscar detalhes:', err)
      setErro(err.message || 'Erro ao buscar detalhes da empresa.')
      setDadosEmpresa(null)
    } finally {
      setCarregando(false)
    }
  }


  const DividerLine = () => (
    <Box h="1px" w="full" bg="gray.200" my={2} />
  )

  const renderCampo = (label: string, valor?: any) => (
    <Box>
      <Text fontWeight="bold">{label}</Text>
      <Text>{valor || '-'}</Text>
    </Box>
  )

  return (
    <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent
          maxW="lg"
          bg="white"
          style={{
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <DrawerCloseTrigger asChild>
            <Button variant="ghost" position="absolute" top={4} right={4}>
              Fechar
            </Button>
          </DrawerCloseTrigger>

          <DrawerHeader fontWeight="bold" borderBottomWidth="1px">
            📄 Detalhes da Empresa
            {cnpj && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                CNPJ: {formatarCNPJ(limparCNPJ(cnpj))}
              </Text>
            )}
          </DrawerHeader>

          <DrawerBody overflowY="auto" px={6} py={6} maxH="calc(100vh - 100px)">
            {carregando ? (
              <VStack gap={4} align="stretch">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height="20px" />
                ))}
              </VStack>
            ) : erro ? (
              <Alert.Root status="error" borderRadius="md" mb={4} flexDirection="column" alignItems="start">
                <Alert.Indicator>
                  <MdError />
                </Alert.Indicator>
                <Alert.Title>Erro ao buscar detalhes</Alert.Title>
                <Alert.Description fontSize="sm">{erro}</Alert.Description>
              </Alert.Root>
            ) : dadosEmpresa ? (
              <VStack align="start" gap={3}>
                {renderCampo('Razão Social', dadosEmpresa.nome)}
                <DividerLine />

                {renderCampo('Nome Fantasia', dadosEmpresa.fantasia)}
                <DividerLine />

                {renderCampo('CNPJ', formatarCNPJ(dadosEmpresa.cnpj))}
                <DividerLine />

                {renderCampo('Situação', dadosEmpresa.situacao)}
                <DividerLine />

                {renderCampo('Data Situação', dadosEmpresa.data_situacao)}
                <DividerLine />

                {dadosEmpresa.situacao_especial && (
                  <>
                    {renderCampo('Situação Especial', dadosEmpresa.situacao_especial)}
                    <DividerLine />
                  </>
                )}

                {renderCampo('Abertura', dadosEmpresa.abertura)}
                <DividerLine />

                {renderCampo('Natureza Jurídica', dadosEmpresa.natureza_juridica)}
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Atividade Principal:</Text>
                  <Text>
                    {dadosEmpresa.atividade_principal?.map((a: any) => `${a.code} - ${a.text}`).join(', ') || '-'}
                  </Text>
                </Box>
                <DividerLine />

                {dadosEmpresa.atividades_secundarias?.length > 0 && (
                  <>
                    <Box>
                      <Text fontWeight="bold">Atividades Secundárias:</Text>
                      <VStack align="start" gap={1}>
                        {dadosEmpresa.atividades_secundarias.map((a: any, i: number) => (
                          <Text key={i}>
                            {a.code} - {a.text}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                    <DividerLine />
                  </>
                )}

                {renderCampo('Capital Social', formatarMoeda(dadosEmpresa.capital_social))}
                <DividerLine />

                {renderCampo('Tipo', dadosEmpresa.tipo)}
                <DividerLine />

                {renderCampo('Última atualização', formatarDataHora(dadosEmpresa.ultima_atualizacao))}
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Endereço:</Text>
                  <Text>
                    {dadosEmpresa.logradouro}, {dadosEmpresa.numero}, {dadosEmpresa.bairro} <br />
                    {dadosEmpresa.municipio} - {dadosEmpresa.uf}, {dadosEmpresa.cep}
                  </Text>
                </Box>
                <DividerLine />

                {renderCampo('Email', dadosEmpresa.email)}
                <DividerLine />

                {renderCampo('Telefone', dadosEmpresa.telefone)}
                <DividerLine />

                {dadosEmpresa.qsa?.length > 0 && (
                  <>
                    <Box>
                      <Text fontWeight="bold">Quadro Societário (QSA):</Text>
                      <VStack align="start" gap={1}>
                        {dadosEmpresa.qsa.map((q: any, i: number) => (
                          <Text key={i}>
                            {q.nome} - {q.qual}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                    <DividerLine />
                  </>
                )}

                <Box>
                  <Text fontWeight="bold">Simples:</Text>
                  <Text>
                    {dadosEmpresa.simples?.optante
                      ? `Optante desde ${formatarDataHora(dadosEmpresa.simples.data_opcao)}`
                      : 'Não optante'}
                  </Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Simei:</Text>
                  <Text>
                    {dadosEmpresa.simei?.optante
                      ? `Optante desde ${formatarDataHora(dadosEmpresa.simei.data_opcao)}`
                      : 'Não optante'}
                  </Text>
                </Box>

                <Button mt={6} onClick={onClose} w="full" variant="outline" colorScheme="gray">
                  Fechar
                </Button>
              </VStack>
            ) : (
              <Text color="gray.600">Nenhuma informação disponível.</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerPositioner>
    </Drawer.Root>
  )
}
