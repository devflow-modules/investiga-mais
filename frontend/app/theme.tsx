import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#0E1D36' },
        secondary: { value: '#1E40AF' },
        accent: { value: '#3B82F6' },
        background: { value: '#F1F5F9' },
        textPrimary: { value: '#111827' },
        textSecondary: { value: '#6B7280' },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
      gradients: {
        hero: {
          value: 'linear(to-b, #0E1D36, #134E59)',
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
