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
    <NextLink href={href} passHref>
      <ChakraLink
        px={3}
        py={2}
        rounded="md"
        fontWeight="medium"
        _hover={{ textDecoration: 'none', bg: 'gray.200' }}
      >
        {children}
      </ChakraLink>
    </NextLink>
  )
}

export default function Header() {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Box bg="white" px={4} boxShadow="sm" position="sticky" top="0" zIndex="999">
      <Flex h={16} align="center" justify="space-between" maxW="7xl" mx="auto">
          <ChakraLink
            as={NextLink}
            href="/"
            _hover={{ textDecoration: 'none' }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Image src="/logo.png" alt="Logo" boxSize="32px" />
            <Text fontWeight="bold" fontSize="xl" color="gray.800">INVESTIGA+</Text>
          </ChakraLink>

        <HStack as="nav" display={{ base: 'none', md: 'flex' }} gap={4} align="center">
          {Links.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
          <NextLink href="/login" passHref>
            <Button
              as="a"
              colorScheme="blue"
              size="md"
              fontWeight="bold"
              rounded="full"
              aria-label="Começar agora"
            >
              Comece Agora
            </Button>
          </NextLink>
        </HStack>
        <IconButton
          aria-label="Abrir menu"
          size="md"
          display={{ md: 'none' }}
          onClick={open ? onClose : onOpen}
          aria-expanded={open}
        >
          {open ? <FiX /> : <FiMenu />}
        </IconButton>
      </Flex>

      {open && (
        <Box pb={4} px={2} display={{ md: 'none' }} boxShadow="lg">
          <Stack as="nav" gap={3}>
            {Links.map((link) => (
              <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
            ))}
            <NextLink href="/login" passHref>
              <Button
                as="a"
                colorScheme="blue"
                size="md"
                fontWeight="bold"
                rounded="full"
              >
                Comece Agora
              </Button>
            </NextLink>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
