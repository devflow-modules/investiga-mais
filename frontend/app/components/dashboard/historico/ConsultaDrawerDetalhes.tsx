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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

// IMPORTA OS FORMATTERS CENTRALIZADOS
import {
  formatarCNPJ,
  formatarMoeda,
  formatarDataHora,
  limparCNPJ,
} from '../../../../../shared/formatters/formatters'

interface ConsultaDrawerDetalhesProps {
  cnpj: string | null
  isOpen: boolean
  onClose: () => void
}

export function ConsultaDrawerDetalhes({ cnpj, isOpen, onClose }: ConsultaDrawerDetalhesProps) {
  const [carregando, setCarregando] = useState(false)
  const [dadosEmpresa, setDadosEmpresa] = useState<any>(null)

  useEffect(() => {
    if (isOpen && cnpj) {
      buscarDetalhes(limparCNPJ(cnpj))
    }
  }, [isOpen, cnpj])

  const buscarDetalhes = async (cnpjLimpo: string) => {
    setCarregando(true)
    setDadosEmpresa(null)

    try {
      const res = await fetch(`/api/consulta/${cnpjLimpo}`, {
        credentials: 'include',
      })

      console.log('[ConsultaDrawerDetalhes] Status:', res.status)

      if (!res.ok) {
        throw new Error('Erro ao buscar detalhes')
      }

      const data = await res.json()
      console.log('[ConsultaDrawerDetalhes] Dados:', data)

      setDadosEmpresa(data.empresa || null)
    } catch (err) {
      console.error('[ConsultaDrawerDetalhes] Erro ao buscar detalhes:', err)
      setDadosEmpresa(null)
    } finally {
      setCarregando(false)
    }
  }

  const DividerLine = () => (
    <Box h="1px" w="full" bg="gray.200" my={2} />
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
            ) : dadosEmpresa ? (
              <VStack align="start" gap={3}>
                <Box>
                  <Text fontWeight="bold">Razão Social:</Text>
                  <Text>{dadosEmpresa.nome}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">CNPJ:</Text>
                  <Text>{formatarCNPJ(dadosEmpresa.cnpj)}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Situação:</Text>
                  <Text>{dadosEmpresa.situacao}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Abertura:</Text>
                  <Text>{dadosEmpresa.abertura}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Natureza Jurídica:</Text>
                  <Text>{dadosEmpresa.natureza_juridica}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Capital Social:</Text>
                  <Text>{formatarMoeda(dadosEmpresa.capital_social)}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Tipo:</Text>
                  <Text>{dadosEmpresa.tipo}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Última atualização:</Text>
                  <Text>{formatarDataHora(dadosEmpresa.ultima_atualizacao)}</Text>
                </Box>
                <DividerLine />

                <Box>
                  <Text fontWeight="bold">Endereço:</Text>
                  <Text>
                    {dadosEmpresa.logradouro}, {dadosEmpresa.numero}, {dadosEmpresa.bairro} <br />
                    {dadosEmpresa.municipio} - {dadosEmpresa.uf}, {dadosEmpresa.cep}
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
