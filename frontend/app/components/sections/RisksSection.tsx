'use client'

import { Box, Flex, Heading, Icon, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'
import { RiskItem } from './RiskItem'

export function RisksSection() {
  const problemas = [
    'Oferta com preço muito abaixo do normal',
    'O site solicita informações pessoais desnecessárias',
    'Solicitam pagamento antes de entregar o resultado',
    'Dizem que não podem atender ligações ou chamadas de vídeo',
    'Após o pagamento, a empresa desaparece',
    'Foto do WhatsApp desaparece e bloqueiam nas redes sociais',
    'Ninguém atende o telefone e não respondem mensagens ou e-mails',
    'Produto não condiz com o que foi ofertado',
  ]

  return (
<Box
  as="section"
  role="region"
  aria-labelledby="risks-heading"
  minH="55vh"
  bg="linear-gradient(to bottom, #f0f4f8, #e3eaf5, #d6e1f1)" // ou um tom azul pastel bonito
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
        align="flex-start"
        color="textPrimary"
      >
        {/* TÍTULO */}
        <VStack w="full" align={{ base: 'center', md: 'start' }} gap={6} flex={1}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ alignSelf: 'center' }}
          >
            <Icon as={FiAlertTriangle} color="warning" boxSize={10} />
          </motion.div>

          <Heading
            id="risks-heading"
            w="full"
            textAlign={{ base: 'center', md: 'left' }} // melhor UX
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="accent"
            fontWeight="bold"
            textTransform="uppercase"
            lineHeight="short"
          >
            TEMOS CERTEZA QUE VOCÊ JÁ VIU ISSO ANTES
          </Heading>

          <Text fontSize={{ base: 'md', md: 'lg' }} color="textSecondary" maxW="md" textAlign={{ base: 'center', md: 'left' }}>
            Estes são alguns dos sinais de que você pode estar prestes a cair em um golpe. Fique atento!
          </Text>
        </VStack>

        {/* LISTA */}
        <VStack align="start" gap={5} flex={2} px={{ base: 2, md: 4 }}>
          {problemas.map((text, index) => (
            <RiskItem key={index} text={text} index={index} />
          ))}

          {/* CHAMADA FINAL */}
          <Box pt={6} textAlign={{ base: 'center', md: 'left' }} w="full">
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} mb={1} color="textPrimary">
              O PROBLEMA NÃO É A INTERNET…
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="textPrimary" fontWeight="semibold">
              O PROBLEMA É VOCÊ CONFIAR ANTES DE INVESTIGAR!
            </Text>
          </Box>
        </VStack>
      </Flex>
    </Box>
  )
}
