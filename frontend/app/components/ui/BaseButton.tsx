'use client'

import { Button, Icon, chakra, type ButtonProps } from '@chakra-ui/react'
import { FiArrowRight } from 'react-icons/fi'
import type { ElementType, ReactNode } from 'react'

type CTAButtonProps = {
  children: ReactNode
  variant?: 'cta' | 'ghostLink' | 'solid'
  withArrow?: boolean
  href?: string
  target?: string
  rel?: string
  as?: ElementType
} & Omit<ButtonProps, 'variant'> // ← isso aqui resolve tudo

export function CTAButton({
  children,
  variant = 'cta',
  withArrow = true,
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
  disabled = false,
  size = 'lg',
  px = 6,
  py = 4,
  borderRadius = 'xl',
  ...rest // ← captura w, maxW, etc
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
  } as const

  const styles = variantStyles[variant]

  const baseButtonProps = {
    fontWeight: 'bold',
    size,
    borderRadius,
    px,
    py,
    disabled,
    onClick,
    ...styles,
    ...rest,
  }

  const baseLinkCss = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    px,
    py,
    borderRadius,
    textDecoration: 'none',
    ...styles,
    ...rest,
  }

  if (href) {
    const ChakraLink = chakra.a
    return (
      <ChakraLink
        href={href}
        target={target}
        rel={rel}
        css={baseLinkCss}
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
      </ChakraLink>
    )
  }

  return (
    <Button {...baseButtonProps}>
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
