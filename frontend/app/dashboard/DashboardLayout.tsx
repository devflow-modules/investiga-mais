'use client'

import { Box, Flex, Heading, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { FiMenu } from 'react-icons/fi'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Token inválido')
      } catch (err) {
        router.replace('/login')
      }
    }

    verificarLogin()
  }, [])

  const toggleMenu = () => setOpen(!open)

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Sidebar pathname={pathname} />

      {/* Conteúdo */}
      <Box flex="1" bg="background" p={{ base: 4, md: 6 }} overflowY="auto" w="full">
        {/* Cabeçalho mobile */}
        {isMobile && (
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Menu</Heading>
            <IconButton
              aria-label="Abrir menu"
              onClick={toggleMenu}
              variant="ghost"
            >
              <FiMenu />
            </IconButton>
          </Flex>
        )}

        {children}
      </Box>
    </Flex>
  )
}
