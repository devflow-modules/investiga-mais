'use client'

import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function TermosDeUso() {
  return (
    <Box
      p={8}
      maxW="4xl"
      mx="auto"
      bg="background"
      border="1px solid"
      borderColor="primary"
      borderRadius="2xl"
      boxShadow="md"
    >
      <VStack gap={6} align="start">
        <Heading size="lg" color="primary">
          Termos de Uso
        </Heading>

        <Text fontSize="md" color="textPrimary">
          Ao utilizar a plataforma <strong>Investiga+</strong>, você concorda com os seguintes termos:
        </Text>

        <Box pl={4}>
          <Text fontSize="md" color="textPrimary">
            1. Você se compromete a utilizar os dados disponíveis apenas para fins legais e éticos.
          </Text>
          <Text fontSize="md" color="textPrimary">
            2. É proibido revender, redistribuir, automatizar ou compartilhar acessos sem autorização expressa da equipe responsável.
          </Text>
          <Text fontSize="md" color="textPrimary">
            3. O usuário é totalmente responsável por todas as ações realizadas com sua conta na plataforma.
          </Text>
          <Text fontSize="md" color="textPrimary">
            4. Reservamos o direito de suspender ou cancelar contas que violem estes termos, a qualquer momento e sem aviso prévio.
          </Text>
          <Text fontSize="md" color="textPrimary">
            5. Ao utilizar o sistema, você adquire uma licença limitada, pessoal, intransferível e revogável. Nenhum direito de propriedade intelectual é transferido.
          </Text>
          <Text fontSize="md" color="textPrimary">
            6. A Investiga+ não garante a veracidade, atualização ou completude das informações obtidas a partir de fontes públicas e externas.
          </Text>
          <Text fontSize="md" color="textPrimary">
            7. Não nos responsabilizamos por decisões, ações ou prejuízos decorrentes do uso das informações fornecidas.
          </Text>
          <Text fontSize="md" color="textPrimary">
            8. Reembolsos não serão concedidos em casos de cancelamento por violação dos termos. Solicitações legítimas serão avaliadas caso a caso.
          </Text>
          <Text fontSize="md" color="textPrimary">
            9. Estes termos poderão ser modificados a qualquer momento. É responsabilidade do usuário revisá-los periodicamente.
          </Text>
        </Box>

        <Text fontSize="sm" color="textSecondary">
          Última atualização: Junho de 2025.
        </Text>
      </VStack>
    </Box>
  )
}
