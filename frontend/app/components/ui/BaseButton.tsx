'use client'

import { Button, Icon, chakra, type ButtonProps } from '@chakra-ui/react'
import { FiArrowRight } from 'react-icons/fi'
import type { ElementType, ReactNode } from 'react'

type CTAButtonProps = {
  children: ReactNode
  variant?: 'cta' | 'ghostLink' | 'solid' | 'whatsapp'
  withArrow?: boolean
  href?: string
  target?: string
  rel?: string
  as?: ElementType
} & Omit<ButtonProps, 'variant'> // <-- só para o caso de Button!

export function CTAButton({
  children,
  variant = 'cta',
  withArrow = true,
  href,
  target,
  rel = 'noopener noreferrer',
  onClick,
  disabled = false,
  size = 'lg',
  px = 6,
  py = 4,
  borderRadius = 'xl',
  ...rest
}: CTAButtonProps) {
  const variantStyles = {
    cta: {
      bg: '#22C55E',
      color: 'black',
      _hover: { bg: '#16A34A' },
      _active: { bg: '#15803D' },
    },
    ghostLink: {
      bg: 'transparent',
      color: '#4ADE80',
      _hover: { textDecoration: 'underline' },
      _active: {},
    },
    solid: {
      bg: '#3B82F6',
      color: 'white',
      _hover: { bg: '#1E40AF' },
      _active: { bg: '#1E40AF' },
    },
    whatsapp: {
      bg: '#25D366', // cor oficial do botão WhatsApp
      color: 'black',
      _hover: { bg: '#1ebe5d' },
      _active: { bg: '#1aa44c' },
    },
  } as const

  const styles = variantStyles[variant]

  // ✅ Evite reutilizar ButtonProps aqui
  if (href) {
    return (
      <chakra.a
        href={href}
        {...(target ? { target } : {})}
        {...(rel ? { rel } : {})}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        px={px}
        py={py}
        borderRadius={borderRadius}
        {...styles}
        // 🔴 NÃO passe onClick, disabled, etc. aqui — só o necessário
        {...(variant === 'cta' ? { 'aria-label': 'Botão CTA com link' } : {})}
      >
        {children}
        {withArrow && variant === 'cta' && (
          <Icon
            as={FiArrowRight}
            ml="2"
            aria-hidden="true"
            boxSize="1.25em"
          />
        )}
      </chakra.a>
    )
  }

  // ✅ Se não tiver href, renderiza como Button
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      px={px}
      py={py}
      borderRadius={borderRadius}
      fontWeight="bold"
      {...styles}
      {...rest}
    >
      {children}
      {withArrow && variant === 'cta' && (
        <Icon
          as={FiArrowRight}
          ml="2"
          aria-hidden="true"
          boxSize="1.25em"
        />
      )}
    </Button>
  )
}