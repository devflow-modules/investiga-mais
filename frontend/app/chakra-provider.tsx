'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme'
import { UserProvider } from './context/UserContext'



export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>
    <UserProvider>
      {children}
    </UserProvider>
  </ChakraProvider>
}

