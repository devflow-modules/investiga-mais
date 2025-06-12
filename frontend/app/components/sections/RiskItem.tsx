'use client'

import { HStack, Icon, Text } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

const MotionHStack = motion(HStack)

interface RiskItemProps {
  text: string
  index: number
}

export function RiskItem({ text, index }: RiskItemProps) {
  return (
    <MotionHStack
      align="start"
      gap={3}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Icon
        as={FiCheckCircle}
        color="green.400" // verde mais vibrante para chamar atenção
        boxSize={6}
        mt={1}
        aria-label="Item de verificação"
        role="img"
      />
      <Text fontSize={{ base: 'md', md: 'lg' }} color="textPrimary" fontWeight="medium">
        {text}
      </Text>
    </MotionHStack>
  )
}
