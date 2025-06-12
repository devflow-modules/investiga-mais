'use client'

import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  List,
  ListItem,
} from '@chakra-ui/react'
import React from 'react'
import type { DadosEmpresaReceitaWS } from '../../../../types'

type DetalhesEmpresaProps = {
  dados: DadosEmpresaReceitaWS | null
}

export default function DetalhesEmpresa({ dados }: DetalhesEmpresaProps) {
  if (!dados) return null

  return (
    <Box bg="white" rounded="lg" shadow="md" p={6} mt={6}>
      <Heading as="h2" size="md" mb={4}>
        📄 Detalhes da Empresa
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} fontSize="sm">
        <Text><strong>Nome:</strong> {dados.nome || '—'}</Text>
        <Text><strong>Fantasia:</strong> {dados.fantasia || '—'}</Text>
        <Text><strong>CNPJ:</strong> {dados.cnpj || '—'}</Text>
        <Text><strong>Situação:</strong> {dados.situacao || '—'}</Text>
        <Text><strong>Abertura:</strong> {dados.abertura || '—'}</Text>
        <Text><strong>Tipo:</strong> {dados.tipo || '—'}</Text>
        <Text><strong>Porte:</strong> {dados.porte || '—'}</Text>
        <Text><strong>Natureza Jurídica:</strong> {dados.natureza_juridica || '—'}</Text>
        <Text><strong>Capital Social:</strong> R$ {dados.capital_social || '—'}</Text>
        <Text><strong>Telefone:</strong> {dados.telefone || '—'}</Text>
        <Text><strong>Email:</strong> {dados.email || '—'}</Text>
        <Text><strong>UF:</strong> {dados.uf || '—'}</Text>
        <Text><strong>Município:</strong> {dados.municipio || '—'}</Text>
        <Text><strong>Bairro:</strong> {dados.bairro || '—'}</Text>
        <Text><strong>Logradouro:</strong> {dados.logradouro || '—'}</Text>
        <Text><strong>Número:</strong> {dados.numero || '—'}</Text>
        <Text><strong>Complemento:</strong> {dados.complemento || '—'}</Text>
        <Text><strong>CEP:</strong> {dados.cep || '—'}</Text>

        <Box gridColumn={{ md: '1 / -1' }}>
          <Text>
            <strong>Atividade Principal:</strong> {dados.atividade_principal?.[0]?.text || '—'}
          </Text>
        </Box>

        {dados.atividades_secundarias?.length > 0 && (
          <Box gridColumn={{ md: '1 / -1' }}>
            <Text fontWeight="bold" mb={1}>Atividades Secundárias:</Text>
            <List.Root gap={1} pl={5}>
              {dados.atividades_secundarias.map((atividade, index) => (
                <ListItem key={index}>{atividade.text}</ListItem>
              ))}
            </List.Root>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  )
}
