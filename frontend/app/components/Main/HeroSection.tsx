'use client'

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  Flex,
  HStack,
  Link,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import { motion } from 'framer-motion'

const MotionHStack = motion(HStack)

export default function HeroSection() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const problemas = [
    'Foto do WhatsApp desaparece depois da compra',
    'Ninguém atende o telefone e nunca respondem mensagens ou E-mails',
    'Oferta com um preço abaixo do normal',
    'Depois do pagamento, a empresa desaparece',
    'Produto não condiz com o ofertado',
    'Solicita pagamento antes de entregar o resultado',
    'O site pede informações pessoais sem necessidade',
  ]

  return (
    <>
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

          <Button
            asChild
            size="lg"
            bg="green.400"
            color="black"
            px={8}
            fontWeight="bold"
            _hover={{ bg: 'green.300' }}
          >
            <a href="/login">NÃO QUERO MAIS CAIR EM GOLPES</a>
          </Button>

          <Text fontSize="sm" color="whiteAlpha.800">
            Já possui uma conta?{' '}
            <Link href="/login" color="green.300" textDecor="underline">
              Acesse aqui
            </Link>
          </Text>
        </VStack>
      </Box>

      <Box
        as="section"
        role="region"
        aria-labelledby="risks-heading"
        minH="60vh"
        bg="radial-gradient(circle at top left, #1E40AF, #0E1D36)"
        py={{ base: 12, md: 24 }}
        px={{ base: 6, md: 10, lg: 16 }}
        display="flex"
        alignItems="center"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          maxW="6xl"
          mx="auto"
          gap={{ base: 10, md: 20 }}
          align="center"
          color="white"
        >
          <VStack
            w="full"
            align={{ base: 'center', md: 'start' }}
            gap={4}
            flex={1}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ alignSelf: 'center', marginBottom: '8px' }}
            >
              <Icon as={FiAlertTriangle} color="yellow.300" boxSize={8} />
            </motion.div>

            <Heading
              id="risks-heading"
              w="full"
              textAlign="center"
              fontSize={{ base: '2xl', md: '3xl' }}
              color="accent"
              fontWeight="bold"
              textTransform="uppercase"
              lineHeight="short"
            >
              TEMOS CERTEZA QUE VOCÊ JÁ VIU ISSO ANTES
            </Heading>
          </VStack>

          <VStack align="start" gap={5} flex={2} px={{ base: 4, md: 0 }}>
            {problemas.map((text, index) => (
              <MotionHStack
                key={index}
                align="start"
                gap={3}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Icon
                  as={FiCheckCircle}
                  color="green.300"
                  boxSize={6}
                  mt={1}
                  aria-label="Item de verificação"
                  role="img"
                />
                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.100">
                  {text}
                </Text>
              </MotionHStack>
            ))}

            <Box pt={4} textAlign={{ base: 'center', md: 'left' }} w="full">
              <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} mb={1}>
                O PROBLEMA NÃO É A INTERNET…
              </Text>
              <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.400">
                O PROBLEMA É VOCÊ CONFIAR ANTES DE INVESTIGAR!
              </Text>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </>
  )
}
