'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Collapsible,
} from '@chakra-ui/react'
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiMessageCircle,
} from 'react-icons/fi'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'

const MotionBox = motion.create(Box)

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
    <Box as="section" py={20} px={6} bg="white">
      <Heading as="h2" textAlign="center" fontSize="3xl" mb={4} color="textPrimary">
        Perguntas Frequentes
      </Heading>

      <Text textAlign="center" color="gray.600" fontSize="md" mb={10}>
        Tire suas dúvidas e comece agora com mais segurança.
      </Text>

      <VStack gap={4} maxW="3xl" mx="auto" as="ul" role="list">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <Collapsible.Root
              w="full"
              key={i}
              open={isOpen}
              onOpenChange={() => setOpenIndex(isOpen ? null : i)}
            >
              <Collapsible.Trigger asChild>
                <MotionBox
                  as="li"
                  w="full"
                  bg={isOpen ? 'gray.50' : 'gray.100'}
                  p={4}
                  borderRadius="md"
                  boxShadow="sm"
                  cursor="pointer"
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  role="listitem"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FiHelpCircle} boxSize={4} color="blue.500" />
                      <Text fontWeight="bold">{item.q}</Text>
                    </HStack>
                    <Icon as={isOpen ? FiChevronUp : FiChevronDown} boxSize={4} />
                  </HStack>
                </MotionBox>
              </Collapsible.Trigger>

              <Collapsible.Content>
                <Text mt={3} color="gray.600" fontSize="sm" px={4} id={`faq-${i}`}>
                  {item.a}
                </Text>
              </Collapsible.Content>
            </Collapsible.Root>
          )
        })}
      </VStack>

      <Box textAlign="center" mt={12}>
        <a
          href="https://wa.me/55111990191040?text=Olá! Preciso de ajuda com o Investiga+"
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

      <Script id="faq-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </Script>
    </Box>
  )
}
