'use client'

import { Box, VStack, Text, Heading, HStack } from '@chakra-ui/react'
import { CTAButton } from '../ui/BaseButton'

export function HeroHeadingSection() {
    return (
        <Box
            as="section"
            role="region"
            aria-labelledby="hero-heading"
            h="40vh"
            bgImage="url('/hero-illustration.png')"
            bgSize="cover"
            position="center"
            bgRepeat="no-repeat"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            px={4}
        >
            <VStack gap={4} color="white">
                <Text fontSize="sm" fontWeight="bold" color="green.300" textTransform="uppercase">
                    Plataforma Confiável
                </Text>

                <Heading id="hero-heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold">
                    ANTES DE COMPRAR ONLINE, INVESTIGA+
                </Heading>

                <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.900">
                    VOCÊ AINDA ESTÁ COMPRANDO NA INTERNET SEM INVESTIGAR A EMPRESA POR COMPLETO?
                </Text>

                <CTAButton
                    variant="cta"
                    borderRadius="full"
                    withArrow
                    as="button"
                    href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
                    rel="noopener noreferrer"
                >
                    NÃO QUERO MAIS CAIR EM GOLPES
                </CTAButton>
                {/* Correção semântica aqui */}
                <HStack gap={1} justify="center">
                    <Text fontSize="sm" color="whiteAlpha.800">
                        Já possui uma conta?
                    </Text>
                    <CTAButton
                        as="a"
                        href="/login"
                        variant="ghostLink"
                        size="sm"
                        px="0"
                        withArrow={false}
                    >
                        Acesse aqui
                    </CTAButton>
                </HStack>
            </VStack>
        </Box>
    )
}
