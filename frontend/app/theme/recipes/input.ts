import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  className: 'input',

  base: {
    borderColor: 'gray300',
    borderRadius: 'md',
    borderWidth: '1px',
    _focus: {
      borderColor: 'accent',
      boxShadow: '0 0 0 1px var(--colors-accent)',
    },
    _invalid: {
      borderColor: 'error',
      boxShadow: '0 0 0 1px var(--colors-error)',
    },
  },

  variants: {
    size: {
      md: {},
    },
    variant: {
      outline: {},
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
})
