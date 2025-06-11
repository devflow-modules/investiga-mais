'use client'

import { Box, Heading, Stack } from '@chakra-ui/react'
import IpCheck from '@/components/dashboard/seguranca/IpCheck'
import EmailCheck from '@/components/dashboard/seguranca/EmailCheck'
import UrlCheck from '@/components/dashboard/seguranca/UrlCheck'

export default function SegurancaPage() {
  return (
    <Box minH="100vh" bg="gray.50" py={10} px={6}>
      <Box maxW="6xl" mx="auto" bg="white" p={8} rounded="lg" shadow="md">
        <Heading size="lg" mb={6}>Segurança e Riscos</Heading>

        <Stack gap={6}>
          <IpCheck />
          <EmailCheck />
          <UrlCheck />
        </Stack>
      </Box>
    </Box>
  )
}
