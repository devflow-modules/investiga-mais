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
import { FiMenu, FiHome, FiSearch, FiClock, FiUser, FiLogOut  } from 'react-icons/fi'
import { MdOutlineSecurity } from "react-icons/md";
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { useSidebar } from '../../../src/context/SidebarContext'
import { Tooltip } from './Tooltip' // Tooltip customizado, com fallback de arrow + content
import { useLogout } from '../../../src/utils/logout'

const links = [
  { href: '/dashboard', label: 'Início', icon: FiHome },
  { href: '/dashboard/consulta', label: 'Consulta CNPJ', icon: FiSearch },
  { href: '/dashboard/historico', label: 'Histórico', icon: FiClock },
  { href: '/dashboard/perfil', label: 'Meu Perfil', icon: FiUser },
  { href: '/dashboard/seguranca', label: 'Segurança', icon: MdOutlineSecurity }
]

interface SidebarProps {
  pathname: string
}

export default function Sidebar({ pathname }: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { isExpanded, toggleSidebar } = useSidebar()
  const { logout } = useLogout()

  const renderLink = (href: string, label: string, icon: JSX.Element) => {
    const isActive = pathname === href

    const button = (
      <LinkBox as="article" w="full">
        <NextLink href={href} passHref>
          <LinkOverlay
            as={Button}
            w="full"
            justifyContent={isExpanded ? 'flex-start' : 'center'}
            fontWeight="medium"
            px={isExpanded ? 4 : 2}
            fontSize="md"
            color={isActive ? 'blue.300' : 'whiteAlpha.800'}
            bg={isActive ? 'whiteAlpha.200' : 'transparent'}
            _hover={{
              bg: 'whiteAlpha.300',
              color: 'white',
            }}
            transition="all 0.2s ease"
          >
            <HStack gap={3}>
              <Box as="span">{icon}</Box>
              {isExpanded && <Text>{label}</Text>}
            </HStack>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    )

    // ✅ Correção: garantir sempre uma key no root
    return (
      <Box key={href} w="full">
        {isExpanded ? (
          button
        ) : (
          <Tooltip content={label} showArrow>
            {button}
          </Tooltip>
        )}
      </Box>
    )
  }


  const renderFooter = () => (
    <>
      <Box h="1px" w="full" bg="whiteAlpha.300" my={4} borderRadius="full" />
      <Button
        variant="ghost"
        onClick={logout}
        w="full"
        justifyContent={isExpanded ? 'flex-start' : 'center'}
        size="md"
        fontWeight="medium"
        px={isExpanded ? 4 : 2}
        fontSize="md"
        color="whiteAlpha.700"
        _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
        transition="all 0.2s ease"
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
            color="whiteAlpha.800"
            bg="primary"
            _hover={{
              bg: 'whiteAlpha.300',
              transform: 'scale(1.1) rotate(5deg)',
            }}
            _active={{
              transform: 'scale(0.95)',
            }}
            transition="all 0.2s ease"
          >
            <FiMenu />
          </IconButton>

          <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                bg="primary"
                color="white"
                p={6}
                rounded="md"
                transition="all 0.3s ease" // mais suave
              >
                <Drawer.CloseTrigger asChild>
                  <IconButton
                    aria-label="Fechar menu"
                    position="absolute"
                    top={4}
                    right={4}
                    variant="ghost"
                    color="whiteAlpha.700"
                    _hover={{
                      bg: 'whiteAlpha.300',
                      transform: 'scale(1.1) rotate(5deg)',
                    }}
                    _active={{
                      transform: 'scale(0.95)',
                    }}
                    transition="all 0.2s ease"
                  >
                    <FiMenu />
                  </IconButton>
                </Drawer.CloseTrigger>

                <Drawer.Header fontWeight="bold" fontSize="lg" color="whiteAlpha.900">
                  🔍 Investiga+
                </Drawer.Header>

                <Drawer.Body display="flex" flexDirection="column" justifyContent="space-between" h="full">
                  <VStack align="start" gap={3} mt={8}>
                    {links.map(({ href, label, icon: Icon }) => (
                      <Box key={href} w="full">
                        {renderLink(href, label, <Icon />)}
                      </Box>
                    ))}
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
          <Flex
            align="center"
            justify={isExpanded ? 'space-between' : 'center'}
            px={isExpanded ? 2 : 0}
            py={2}
          >
            {isExpanded && (
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="whiteAlpha.900"
                transition="opacity 0.2s ease"
              >
                🔍 Investiga+
              </Text>
            )}

            <IconButton
              aria-label="Alternar menu"
              size="sm"
              onClick={toggleSidebar}
              variant="ghost"
              color="whiteAlpha.700"
              _hover={{
                bg: 'whiteAlpha.300',
                color: 'white',
                transform: 'scale(1.1) rotate(5deg)', // micro animação no hover
              }}
              _active={{
                transform: 'scale(0.95)', // feedback ao clicar
              }}
              transition="all 0.2s ease"
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
