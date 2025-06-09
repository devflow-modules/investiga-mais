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
  Flex,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { useState, type JSX } from 'react'
import { FiMenu, FiHome, FiSearch, FiClock, FiUser, FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { useSidebar } from '../../../src/context/SidebarContext'
import { Tooltip } from './Tooltip' // Tooltip customizado, com fallback de arrow + content

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
  const { isExpanded, toggleSidebar } = useSidebar()

  const renderLink = (href: string, label: string, icon: JSX.Element) => {
    const isActive = pathname === href

    const button = (
      <LinkBox as="article" w="full" key={href}>
        <NextLink href={href} passHref>
          <LinkOverlay as={Button} w="full">
            <HStack gap={3}>
              <Box as="span" color={isActive ? 'blue.300' : 'whiteAlpha.700'}>
                {icon}
              </Box>
              {isExpanded && <Text>{label}</Text>}
            </HStack>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    )

    return isExpanded ? (
      button
    ) : (
      <Tooltip content={label} showArrow>
        {button}
      </Tooltip>
    )
  }

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    localStorage.removeItem('token')
    router.push('/login')
  }

  const renderFooter = () => (
    <>
      <Box h="1px" w="full" bg="whiteAlpha.300" my={4} borderRadius="full" />
      <Button
        variant="ghost"
        onClick={logout}
        w="full"
        justifyContent={isExpanded ? 'flex-start' : 'center'}
        size="sm"
        fontWeight="medium"
        px={isExpanded ? 4 : 2}
        fontSize="sm"
        color="whiteAlpha.700"
        _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
      >
        <HStack gap={3}>
          <FiLogOut />
          {isExpanded && <Text>Sair</Text>}
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
                  <VStack align="start" gap={3} mt={8}>
                    {links.map(({ href, label, icon: Icon }) =>
                      renderLink(href, label, <Icon />)
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
          w={isExpanded ? '240px' : '72px'}
          bg="primary"
          color="white"
          p={4}
          zIndex={10}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex align="center" justify={isExpanded ? 'space-between' : 'center'}>
            {isExpanded && <Text fontSize="lg" fontWeight="bold">🔍 Investiga+</Text>}
            <IconButton
              aria-label="Alternar menu"
              size="sm"
              onClick={toggleSidebar}
            >
              <FiMenu />
            </IconButton>
          </Flex>

          <VStack align="start" gap={3} mt={8}>
            {links.map(({ href, label, icon: Icon }) =>
              renderLink(href, label, <Icon />)
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
