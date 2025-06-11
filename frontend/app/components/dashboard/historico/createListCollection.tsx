'use client'

import { createListCollection } from '@chakra-ui/react'

export const statusOptions = createListCollection({
  items: [
    { label: 'Todos os Status', value: '' },
    { label: 'Consultado', value: 'consultado' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Erro', value: 'erro' },
  ]
})

export const generoOptions = createListCollection({
  items: [
    { label: 'Selecione o gênero', value: '' },
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
  ],
})