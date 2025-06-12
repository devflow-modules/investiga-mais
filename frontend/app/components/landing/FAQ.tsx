'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiMessageCircle } from 'react-icons/fi'
import { Collapse } from '@chakra-ui/transition'
import { useState } from 'react'

const faqs = [
  {
    q: 'Como faço para verificar se um site é confiável?',
    a: 'Basta estar logado na plataforma. Depois, acesse a seção de consulta e informe o endereço do site ou nome da empresa que deseja investigar.'
  },
  {
    q: 'As consultas ficam salvas?',
    a: 'Sim, todas as consultas são armazenadas automaticamente no seu histórico pessoal.'
  },
  {
    q: 'Tem limite de consultas?',
    a: 'Não, consultas ilimitadas durante o período contratado, seja mensal, semestral, anual ou vitalício.'
  },
  {
    q: 'É seguro usar o Investiga+?',
    a: 'Com criptografia e práticas modernas de segurança, sua navegação e dados estão sempre protegidos.'
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim! Nossa plataforma é 100% responsiva, sem precisar instalar nada.'
  },
  {
    q: 'Como recebo suporte?',
    a: 'Você pode nos chamar direto no WhatsApp com um clique no botão abaixo.'
  },
  {
    q: 'Quanto tempo demora para consultar?',
    a: 'Geralmente menos de 5 segundos. O tempo pode variar dependendo da complexidade dos dados e das verificações em fontes externas.'
  },
  {
    q: 'Precisa baixar algum programa para conseguir utilizar?',
    a: 'Não! O Investiga+ funciona diretamente no navegador. Não é necessário baixar ou instalar nada.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Box py={20} px={6} bg="white">
      <Heading textAlign="center" fontSize="3xl" mb={4} color="textPrimary">
        Perguntas Frequentes
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="md" mb={10}>
        Tire suas dúvidas e comece agora com mais segurança.
      </Text>

      <VStack gap={4} maxW="3xl" mx="auto">
        {faqs.map((item, i) => (
          <Box
            key={i}
            w="full"
            bg={openIndex === i ? 'gray.50' : 'gray.100'}
            p={4}
            borderRadius="md"
            boxShadow="sm"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            cursor="pointer"
            transition="background 0.2s"
          >
            <HStack justify="space-between">
              <HStack>
                <Icon as={FiHelpCircle} boxSize={4} color="blue.500" />
                <Text fontWeight="bold">{item.q}</Text>
              </HStack>
              <Icon as={openIndex === i ? FiChevronUp : FiChevronDown} boxSize={4} />
            </HStack>
            <Collapse in={openIndex === i}>
              <Text mt={3} color="gray.600" fontSize="sm">{item.a}</Text>
            </Collapse>
          </Box>
        ))}
      </VStack>

      <Box textAlign="center" mt={12}>
        <a
          href="https://wa.me/5511988143482?text=Olá! Preciso de ajuda com o Investiga+"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#22c55e',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <FiMessageCircle style={{ marginRight: '0.5rem' }} />
          Suporte via WhatsApp
        </a>
      </Box>
    </Box>
  )
}
