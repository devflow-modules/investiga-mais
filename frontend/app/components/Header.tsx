'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Stack,
  useDisclosure,
  Image,
  Text,
  Link as ChakraLink
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'

const Links = [
  { label: 'Início', href: '/' },
  { label: 'Login', href: '/login' },
]

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ChakraLink
      as={NextLink}
      px={3}
      py={2}
      rounded="md"
      _hover={{ textDecoration: 'none', bg: 'gray.100' }}
      href={href}
    >
      {children}
    </ChakraLink>
  )
}

export default function Header() {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Box bg="white" px={4} boxShadow="sm" position="sticky" top="0" zIndex="999">
      <Flex h={16} align="center" justify="space-between" maxW="7xl" mx="auto">
        <HStack align="center">
          <Image src="/logo.png" alt="Logo" boxSize="32px" />
          <Text fontWeight="bold" fontSize="xl" color="gray.800">INVESTIGA+</Text>
        </HStack>

        <HStack as="nav" display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
          <Button asChild colorScheme="blue" size="sm">
            <a href="/login">Comece Agora</a>
          </Button>
        </HStack>

        <IconButton
          size="md"
          aria-label="Abrir menu"
          display={{ md: 'none' }}
          onClick={open ? onClose : onOpen}
        >
          {open ? <FiX /> : <FiMenu />}
        </IconButton>
      </Flex>
      
      {open && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav">
            {Links.map((link) => (
              <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
            ))}
            <Button asChild colorScheme="blue" size="sm">
              <a href="/login">Comece Agora</a>
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
