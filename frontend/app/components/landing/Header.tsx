'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Link as ChakraLink,
  useDisclosure
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'
import { CTAButton } from '../ui/BaseButton'
import Image from 'next/image'

const Links = [
  { label: 'Início', href: '/' },
  { label: 'Funções', href: '#features' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Público-Alvo', href: '#publico-alvo' },
  { label: 'Estatísticas', href: '#estatisticas' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Login', href: '/login' },
]

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ChakraLink
      as={NextLink}
      href={href}
      px={3}
      py={2}
      rounded="md"
      fontWeight="medium"
      _hover={{ textDecoration: 'none', bg: 'gray.200' }}
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
        <ChakraLink
          as={NextLink}
          href="/"
          _hover={{ textDecoration: 'none' }}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Box boxSize="32px" borderRadius="full" overflow="hidden">
            <Image
              src="/og-image.webp"
              alt="Logo Investiga+"
              width={32}
              height={32}
              priority
            />
          </Box>

          <Text fontWeight="bold" fontSize="xl" color="gray.800">INVESTIGA+</Text>
        </ChakraLink>

        <HStack as="nav" display={{ base: 'none', md: 'flex' }} gap={4} align="center">
          {Links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}

          <CTAButton
            href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
            rel="noopener noreferrer"
            variant="cta"
            withArrow
            size="md"
            px={6}
            py={3}
          >
            Comece Agora
          </CTAButton>
        </HStack>

        <IconButton
          aria-label="Abrir menu"
          size="md"
          display={{ md: 'none' }}
          onClick={open ? onClose : onOpen}
        >
          {open ? <FiX /> : <FiMenu />}
        </IconButton>
      </Flex>

      {open && (
        <Box pb={4} px={2} display={{ md: 'none' }} boxShadow="lg">
          <Stack as="nav" gap={3}>
            {Links.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}

            <CTAButton
              href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
              rel="noopener noreferrer"
              variant="cta"
              withArrow
              size="md"
              px={6}
              py={3}
            >
              Comece Agora
            </CTAButton>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
