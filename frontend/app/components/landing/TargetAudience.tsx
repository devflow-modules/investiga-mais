'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiCreditCard, FiUserCheck, FiBriefcase } from 'react-icons/fi'
import Testimonials from './Testimonials'

const MotionBox = motion.create(Box)

const profiles = [
  {
    icon: FiCreditCard, // Representa bem o ato de comprar online
    label: 'Compradores online',
  },
  {
    icon: FiUserCheck, // Representa bem a verificação de identidade, ideal para autônomos/freelancers
    label: 'Autônomos',
  },
  {
    icon: FiBriefcase, // Mais apropriado para representar empresas
    label: 'Empresas',
  }
]

export default function TargetAudience() {
  return (
    <Box as="section" id="publico-alvo" py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }} bg="white">
      <MotionBox
        textAlign="center"
        maxW="5xl"
        mx="auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Heading fontSize={{ base: '2xl', md: '4xl' }} mb={4} color="textPrimary">
          Quem já usa o Investiga+ para evitar golpes e prejuízos?
        </Heading>

        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 3 }}
          gap={6}
          mt={10}
          alignItems="stretch"
        >
          {profiles.map((p) => (
            <VStack
              key={p.label}
              bg="gray.50"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              textAlign="center"
              gap={3}
              h="100%"
            >
              <Icon as={p.icon} boxSize={6} color="blue.500" aria-hidden />
              <Text fontWeight="bold" fontSize="lg">{p.label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </MotionBox>

      <Box mt={{ base: 6, sm: 8, md: 10, lg: 12 }} maxW="4xl" mx="auto" textAlign="center">
        <Testimonials />
      </Box>

    </Box>
  )
}
