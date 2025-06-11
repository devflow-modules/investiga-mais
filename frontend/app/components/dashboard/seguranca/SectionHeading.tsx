'use client'

import { Box, Heading, Text } from '@chakra-ui/react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  icon?: string // opcional - ex: '🔍' / '🔒' / '📧'
}

export default function SectionHeading({ title, subtitle, icon }: SectionHeadingProps) {
  return (
    <Box mb={4}>
      <Heading size="md">
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="sm" color="gray.500" mt={1}>
          {subtitle}
        </Text>
      )}
    </Box>
  )
}
