'use client'

import { Box, useToken } from '@chakra-ui/react'

export default function ThemeTest() {
  const [primary, secondary] = useToken('colors', ['primary', 'secondary'])

  return (
    <Box
      bgGradient={`linear(to-b, ${primary}, ${secondary})`}
      color="white"
      p={10}
    >
      Teste de cor do tema com tokens do theme
    </Box>
  )
}
