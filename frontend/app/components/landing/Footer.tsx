'use client'

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Link
} from '@chakra-ui/react'
import { FiShield, FiMapPin } from 'react-icons/fi'
import NextLink from 'next/link'
import Script from 'next/script'

export default function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="whiteAlpha.900" py={12} px={6}>
      {/* Branding e direitos */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        maxW="6xl"
        mx="auto"
        gap={6}
      >
        <VStack align="start" gap={1}>
          <Text as="strong" fontSize="lg">
            Investiga+
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700">
            © {new Date().getFullYear()} Investiga Mais. Todos os direitos reservados.
          </Text>
        </VStack>
      </Flex>

      {/* Divisor */}
      <Box my={8} height="1px" width="100%" bg="whiteAlpha.300" />

      {/* Benefícios */}
      <Box display="flex" justifyContent="center">
        <HStack
          gap={6}
          wrap="wrap"
          justify="center"
          textAlign="center"
        >
          <HStack gap={2} color="green.300">
            <Icon as={FiShield} boxSize={4} />
            <Text fontSize="sm" fontWeight="medium">
              Site 100% seguro e criptografado
            </Text>
          </HStack>

          <HStack gap={2} color="green.300">
            <Icon as={FiMapPin} boxSize={4} />
            <Text fontSize="sm" fontWeight="medium">
              Feito no Brasil com responsabilidade
            </Text>
          </HStack>

          <Text fontSize="sm" fontWeight="medium" color="green.300">
            +100.000 verificações realizadas
          </Text>
        </HStack>
      </Box>

      {/* Links legais */}
      <HStack gap={6} mt={6} justify="center" wrap="wrap">
        <Link
          as={NextLink}
          href="/politica-de-privacidade"
          fontSize="xs"
          color="whiteAlpha.600"
          _hover={{ textDecoration: 'underline', color: 'whiteAlpha.800' }}
        >
          Política de Privacidade
        </Link>
        <Link
          as={NextLink}
          href="/termos-de-uso"
          fontSize="xs"
          color="whiteAlpha.600"
          _hover={{ textDecoration: 'underline', color: 'whiteAlpha.800' }}
        >
          Termos de Uso
        </Link>
      </HStack>

      {/* Mensagem final */}
      <Text fontSize="xs" textAlign="center" color="whiteAlpha.700" mt={4}>
        Criado com ❤️ para proteger seus dados.
      </Text>

      {/* SEO JSON-LD */}
      <Script id="jsonld-footer" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Investiga Mais",
          url: "https://investigamais.com",
          logo: "https://investigamais.com/logo_112x112.png",
          telephone: "+55-11-99019-1040",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+55-11-99019-1040",
            contactType: "customer service",
            areaServed: "BR",
            availableLanguage: ["Portuguese"]
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "BR"
          }
        })}
      </Script>
    </Box>
  )
}
