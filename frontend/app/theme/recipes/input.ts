import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  className: 'input',

  base: {
    borderColor: 'gray300',
    borderRadius: 'md',
    borderWidth: '1px',
    bg: 'white',
    color: 'textPrimary',
    _placeholder: {
      color: 'gray500',
    },
    _focus: {
      borderColor: 'accent',
      boxShadow: '0 0 0 1px var(--colors-accent)',
      bg: 'white',
    },
    _invalid: {
      borderColor: 'error',
      boxShadow: '0 0 0 1px var(--colors-error)',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      bg: 'gray100',
    },
    _readOnly: {
      bg: 'gray50',
      opacity: 0.8,
    },
    transition: 'all 0.2s ease-in-out',
  },

  variants: {
    size: {
      md: {
        fontSize: 'md',
        px: 4,
        py: 3,
      },
      sm: {
        fontSize: 'sm',
        px: 3,
        py: 2,
      },
    },
    variant: {
      outline: {},
      flushed: {
        border: 'none',
        borderBottomWidth: '1px',
        borderColor: 'gray300',
        borderRadius: 0,
        _focus: {
          borderColor: 'accent',
          boxShadow: '0 1px 0 0 var(--colors-accent)',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
})
