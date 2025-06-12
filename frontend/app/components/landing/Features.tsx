'use client'

import {
  Box,
  Grid,
  Heading,
  Image,
  Stack,
  HStack,
  Icon,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiShield, FiUsers, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { CTAButton } from '../ui/BaseButton'

const MotionBox = motion(Box)

const features = [
  {
    icon: FiAlertTriangle,
    label: 'Segurança do site',
    text: 'Verifique se o site possui <strong>malware</strong>, <strong>phishing</strong> ou tentativa de <strong>roubo de dados</strong>.'
  },
  {
    icon: FiUsers,
    label: 'Informações da empresa',
    text: 'Veja o <strong>nome real</strong>, <strong>sócios</strong>, <strong>endereço</strong> e <strong>atividade econômica</strong> registrada.'
  },
  {
    icon: FiCheckCircle,
    label: 'Tempo de existência',
    text: 'Avalie há quanto tempo o site existe e evite <strong>golpes novos</strong> com aparência profissional.'
  },
  {
    icon: FiShield,
    label: 'Denúncias e reputação',
    text: 'Consulte <strong>listas negras mundiais</strong>, histórico de denúncias e <strong>recomendações de outros clientes</strong>.'
  }
]

export default function Features() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box py={20} px={{ base: 4, md: 6 }} bg="white">
      <MotionBox
        maxW="6xl"
        mx="auto"
        as={Grid}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={{ base: 10, md: 16 }}
        alignItems="center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Image
          src="/imagem1.jpg"
          alt="Tela do sistema de verificação de empresa"
          borderRadius="md"
          boxShadow="lg"
          loading="lazy"
          display={{ base: 'none', md: 'block' }} // <== ESSA LINHA
        />

        <Box>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={4} color="textPrimary" id="feature-heading" textAlign={{ base: 'center', md: 'left' }}>
            Verifique a credibilidade do site antes de correr riscos
          </Heading>

          <Text fontSize="md" mb={6} color="gray.600" id="feature-sub" textAlign={{ base: 'center', md: 'left' }}>
            Veja se a empresa é legítima e se o site merece sua confiança.
          </Text>

          <Stack color="gray.700" gap={6} role="list" aria-labelledby="feature-heading" aria-describedby="feature-sub">
            {features.map((item, index) => (
              <Box key={index}>
                <HStack align="start" gap={4}>
                  <Box
                    bg="blue.50"
                    p={2}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={item.icon} boxSize={5} color="blue.500" mt={1} />
                  </Box>
                  <Text dangerouslySetInnerHTML={{ __html: item.text }} />
                </HStack>
                {isMobile && index < features.length - 1 && <Box as="hr" borderColor="gray.200" my={4} />}
              </Box>
            ))}
          </Stack>

          <MotionBox
            mt={6}
            bg="gray.50"
            px={4}
            py={2}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Text fontSize="sm" color="gray.600">
              ✅ Mais de <strong>100.000 verificações</strong> realizadas por quem busca segurança online
            </Text>
          </MotionBox>

          {/* Botão personalizado */}
          <MotionBox
            mt={8}
            mx="auto"
            display="flex"
            justifyContent={{ base: 'center', md: 'flex-start' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <CTAButton
              href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Comece a Verificar Agora
            </CTAButton>
          </MotionBox>
        </Box>
      </MotionBox>
    </Box>
  )
}
