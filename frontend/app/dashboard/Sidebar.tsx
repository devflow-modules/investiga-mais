'use client'

import {
  Box,
  Button,
  VStack,
  IconButton,
  useBreakpointValue,
  Drawer,
  Text,
  HStack,
  Tooltip,
  Flex,
} from '@chakra-ui/react'
import { useState, type JSX } from 'react'
import { FiMenu, FiHome, FiSearch, FiClock, FiUser, FiLogOut } from 'react-icons/fi'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Início', icon: FiHome },
  { href: '/dashboard/consulta', label: 'Consulta CNPJ', icon: FiSearch },
  { href: '/dashboard/historico', label: 'Histórico', icon: FiClock },
  { href: '/dashboard/perfil', label: 'Meu Perfil', icon: FiUser },
]

interface SidebarProps {
  pathname: string
}

export default function Sidebar({ pathname }: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [expanded, setExpanded] = useState(true)

  const renderLink = (href: string, label: string, icon: JSX.Element) => {
    const isActive = pathname === href

    const button = (
      <Button
        key={href}
        asChild
        variant="ghost"
        justifyContent={expanded ? 'flex-start' : 'center'}
        w="full"
        size="sm"
        fontWeight="medium"
        px={expanded ? 4 : 2}
        fontSize="sm"
        colorScheme={isActive ? 'blue' : undefined}
        bg={isActive ? 'whiteAlpha.200' : 'transparent'}
        _hover={{ bg: 'whiteAlpha.300' }}
        color="whiteAlpha.900"
      >
        <NextLink href={href}>
          <HStack gap={3}>
            <Box as="span" color={isActive ? 'blue.300' : 'whiteAlpha.700'}>
              {icon}
            </Box>
            {expanded && <Text>{label}</Text>}
          </HStack>
        </NextLink>
      </Button>
    )

    return expanded ? button : (
      <Tooltip.Root>
        <Tooltip.Trigger>{button}</Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content bg="gray.700" color="white" px={3} py={1} borderRadius="md">
            <Tooltip.Arrow />
            <Text fontSize="sm">{label}</Text>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    )
  }

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    })
    router.push('/login')
  }

  const renderFooter = () => (
    <>
      <Box h="1px" w="full" bg="whiteAlpha.300" my={4} borderRadius="full" />
      <Button
        variant="ghost"
        onClick={logout}
        w="full"
        justifyContent={expanded ? 'flex-start' : 'center'}
        size="sm"
        fontWeight="medium"
        px={expanded ? 4 : 2}
        fontSize="sm"
        color="whiteAlpha.700"
        _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
      >
        <HStack gap={3}>
          <FiLogOut />
          {expanded && <Text>Sair</Text>}
        </HStack>
      </Button>
    </>
  )

  return (
    <>
      {isMobile && (
        <>
          <IconButton
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            position="fixed"
            top={4}
            left={4}
            zIndex="overlay"
            variant="ghost"
          >
            <FiMenu />
          </IconButton>

          <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg="primary" color="white" p={6}>
                <Drawer.CloseTrigger asChild>
                  <IconButton
                    aria-label="Fechar menu"
                    position="absolute"
                    top={4}
                    right={4}
                    variant="ghost"
                  >
                    <FiMenu />
                  </IconButton>
                </Drawer.CloseTrigger>

                <Drawer.Header fontWeight="bold">🔍 Investiga+</Drawer.Header>

                <Drawer.Body display="flex" flexDirection="column" justifyContent="space-between" h="full">
                  <VStack align="start" gap={3} mt={4}>
                    {links.map(link =>
                      renderLink(link.href, link.label, <link.icon key={link.href} />)
                    )}
                  </VStack>

                  {renderFooter()}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
        </>
      )}

      {!isMobile && (
        <Box
          as="aside"
          position="fixed"
          top={0}
          left={0}
          h="100vh"
          w={expanded ? '240px' : '72px'}
          bg="primary"
          color="white"
          p={4}
          transition="width 0.2s ease"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex align="center" justify={expanded ? 'space-between' : 'center'}>
            {expanded && <Text fontSize="lg" fontWeight="bold">🔍 Investiga+</Text>}
            <IconButton
              aria-label="Alternar menu"
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              <FiMenu />
            </IconButton>
          </Flex>

          <VStack align="start" gap={3} mt={8}>
            {links.map(link =>
              renderLink(link.href, link.label, <link.icon key={link.href} />)
            )}
          </VStack>

          <Box mt="auto">
            {renderFooter()}
          </Box>
        </Box>
      )}
    </>
  )
}
