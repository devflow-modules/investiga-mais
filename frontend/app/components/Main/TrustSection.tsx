'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'

const MotionButton = motion(Box)

export default function SafetyStatement() {
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl' })

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={6}
      bg="background"
      color="textPrimary"
      textAlign="center"
    >
      <VStack gap={6} maxW="3xl" mx="auto">
        <Heading fontSize={headingSize} fontWeight="bold">
          Atualmente você compra na internet com o coração na mão e contando com a sorte…
        </Heading>

        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold">
          Com o Investiga+ você tem{' '}
          <Text as="span" fontWeight="bold" color="textPrimary">
            a certeza de que vai receber o que está comprando!
          </Text>
        </Text>

        <Text fontSize="lg" color="textSecondary" fontWeight="medium">
          Agora você só cai em golpe se quiser!
        </Text>

        <MotionButton
          as="button"
          aria-label="Iniciar proteção contra golpes"
          bg="green.400"
          color="primary"
          fontWeight="bold"
          px={6}
          py={4}
          rounded="full"
          fontSize="lg"
          _hover={{ bg: 'green.500' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <HStack gap={3}>
            <Text>NÃO QUERO MAIS CAIR EM GOLPES</Text>
            <Icon as={FiSend} />
          </HStack>
        </MotionButton>
      </VStack>
    </Box>
  )
}
