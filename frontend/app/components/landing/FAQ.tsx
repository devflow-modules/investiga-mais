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

// Lista de perguntas frequentes
const faqs = [
  {
    q: 'Como faço para verificar se um site é confiável?',
    a: 'Após a escolha do pacote ideal, digite o endereço do Site ou CNPJ da empresa que deseja verificar. Nosso sistema analisa profundamente histórico, reputação e todos os sinais de risco, e você recebe uma resposta clara: é confiável ou representa um golpe.'
  },
  {
    q: 'As consultas ficam salvas?',
    a: 'Sim, todas as consultas são armazenadas automaticamente no seu histórico pessoal.'
  },
  {
    q: 'Tem limite de consultas?',
    a: 'Para o Pacote Básico o limite é de 5 consultas. Já para o nosso Pacote Premium disponibilizamos consultas sem limites.'
  },
  {
    q: 'É seguro usar o Investiga+?',
    a: 'Com criptografia e práticas modernas de segurança, sua navegação e dados estão sempre protegidos.'
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim! A plataforma funciona em qualquer dispositivo, de maneira fácil, sem precisar baixar ou instalar nenhum aplicativo.'
  },
  {
    q: 'Como recebo suporte?',
    a: 'Temos uma equipe especializada pronta para te atender via WhatsApp. Caso tenha dúvidas, pode nos chamar através do botão "Suporte via WhatsApp" disponível logo abaixo.'
  },
  {
    q: 'Quanto tempo demora para consultar?',
    a: 'A consulta leva menos de 5 segundos. Nosso sistema analisa profundamente histórico, reputação e todos os sinais de risco.'
  },
  {
    q: 'Precisa baixar algum programa para conseguir utilizar?',
    a: 'Não! O Investiga+ funciona diretamente no navegador. Não é necessário baixar ou instalar nada.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Box
      as="section"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
      bg="white"
      aria-labelledby="faq-heading"
    >

      {/* Título da seção FAQ */}
      <Heading
        as="h2"
        id="faq-heading"
        textAlign="center"
        fontSize="3xl"
        mb={4}
        color="textPrimary"
      >
        Perguntas Frequentes
      </Heading>

      <Text
        textAlign="center"
        color="gray.600"
        fontSize="md"
        mb={10}
      >
        Tire suas dúvidas e comece agora com mais segurança.
      </Text>

      {/* Lista de perguntas acessível */}
      <VStack
        gap={4}
        maxW="3xl"
        mx="auto"
        as="ul"
        role="list"
        aria-label="Lista de perguntas frequentes"
      >
        {faqs.map((item, i) => {
          const isOpen = openIndex === i
          const triggerId = `faq-trigger-${i}`
          const contentId = `faq-content-${i}`

          return (
            <Collapsible.Root
              key={i}
              w="full"
              open={isOpen}
              onOpenChange={() => setOpenIndex(isOpen ? null : i)}
            >
              {/* Botão de pergunta */}
              <Collapsible.Trigger asChild>
                <MotionBox
                  as="button"
                  w="full"
                  bg={isOpen ? 'gray.50' : 'gray.100'}
                  p={4}
                  borderRadius="md"
                  boxShadow="sm"
                  cursor="pointer"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  id={triggerId}
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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

              {/* Resposta com aria-labelledby para leitura de tela */}
              <Collapsible.Content>
                <Text
                  mt={3}
                  px={4}
                  fontSize="sm"
                  color="gray.600"
                  id={contentId}
                  aria-labelledby={triggerId}
                  role="region"
                >
                  {item.a}
                </Text>
              </Collapsible.Content>
            </Collapsible.Root>
          )
        })}
      </VStack>

      {/* Botão de suporte via WhatsApp */}
      <Box textAlign="center" mt={12}>
        <a
          href="https://wa.me/5511990191040?text=Quero%20ter%20acesso%20à%20ferramenta%20do%20Investiga%2B?text=Olá! Preciso de ajuda com o Investiga+"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir conversa de suporte com a equipe do Investiga+ no WhatsApp"
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

      {/* Estrutura SEO (rich snippet FAQPage) */}
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
