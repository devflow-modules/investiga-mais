'use client'

import {
  Box,
  VStack,
  IconButton,
  Button,
  Text,
  HStack,
  Flex,
  LinkBox,
  LinkOverlay,
  useBreakpointValue,
  Drawer,
} from '@chakra-ui/react'
import { FiMenu, FiUserPlus, FiLogOut, FiDatabase, FiSettings } from 'react-icons/fi'
import { useLogout } from '../../../src/hooks/useLogout'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from '../../../src/context/SidebarContext'
import { Tooltip } from '@/components/dashboard/Tooltip'
import { useState } from 'react'

const adminLinks = [
  { href: '/admin/registrar', label: 'Registrar Usuário', icon: FiUserPlus },
  { href: '/admin/logs', label: 'Logs', icon: FiDatabase },
  { href: '/admin/configuracoes', label: 'Configurações', icon: FiSettings },
]

interface SidebarProps {
  pathname: string
}

export default function AdminSidebar({ pathname }: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { isExpanded, toggleSidebar } = useSidebar()
  const { logout } = useLogout()
  
  const renderLink = (href: string, label: string, Icon: any) => {
    const isActive = pathname === href

    const button = (
      <LinkBox as="article" w="full" key={href}>
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
              <Box as="span">
                <Icon />
              </Box>
              {isExpanded && <Text>{label}</Text>}
            </HStack>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    )

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
                transition="all 0.3s ease"
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
                  🛠️ Admin Panel
                </Drawer.Header>

                <Drawer.Body display="flex" flexDirection="column" justifyContent="space-between" h="full">
                  <VStack align="start" gap={3} mt={8}>
                    {adminLinks.map(({ href, label, icon }) => (
                      <Box key={href} w="full">
                        {renderLink(href, label, icon)}
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
                🛠️ Admin Panel
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
                transform: 'scale(1.1) rotate(5deg)',
              }}
              _active={{
                transform: 'scale(0.95)',
              }}
              transition="all 0.2s ease"
            >
              <FiMenu />
            </IconButton>
          </Flex>

          <VStack align="start" gap={3} mt={8}>
            {adminLinks.map(({ href, label, icon }) =>
              renderLink(href, label, icon)
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
