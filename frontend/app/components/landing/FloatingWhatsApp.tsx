'use client'

import {
    Box,
    HStack,
    Text,
    Icon
} from '@chakra-ui/react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'
import { CTAButton } from '@/components/ui/BaseButton'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const MotionBox = motion.create(Box)

export function FloatingWhatsApp() {
    const prefersReducedMotion = usePrefersReducedMotion()

    return (
        <MotionBox
            position="fixed"
            bottom="6"
            right="6"
            zIndex="999"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.5, y: 50 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.4 }}
        >
            <Tooltip content="Fale conosco no WhatsApp" showArrow>
                <Box position="relative">
                    {!prefersReducedMotion && (
                        <Box
                            position="absolute"
                            top="-1"
                            right="-1"
                            boxSize="3"
                            bg="ctaGreen"
                            borderRadius="full"
                            animation="pulse 2s infinite"
                            zIndex="1"
                        />
                    )}

                    <CTAButton
                        as="a"
                        href="https://wa.me/5511990191040?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20o%20Investiga%2B"
                        variant="whatsapp"
                        borderRadius="full"
                        size="lg"
                        px={6}
                        py={4}
                        withArrow={false}
                        rel="noopener noreferrer"
                        target="_blank"
                        aria-label="Fale conosco no WhatsApp"
                        title="Fale conosco no WhatsApp"
                    >
                        <HStack gap={2}>
                            <Icon as={FaWhatsapp} boxSize="1.5em" />
                            <Text fontWeight="bold" display={{ base: 'none', md: 'inline' }}>
                                Fale Conosco
                            </Text>
                        </HStack>
                    </CTAButton>

                </Box>
            </Tooltip>
        </MotionBox>
    )
}
