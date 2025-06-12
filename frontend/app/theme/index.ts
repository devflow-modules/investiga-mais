import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
    cssVarsRoot: ':where(:root, :host)',
    theme: {

        tokens: {
            colors: {
                primary: { value: '#0E1D36' },
                secondary: { value: '#1E40AF' },
                accent: { value: '#3B82F6' },
                background: { value: '#F1F5F9' },
                textPrimary: { value: '#111827' },
                textSecondary: { value: '#6B7280' },

                // CTA
                ctaGreen: { value: '#4ADE80' },
                ctaBlue: { value: '#3B82F6' },

                // Feedbacks
                success: { value: '#22C55E' },
                error: { value: '#EF4444' },
                warning: { value: '#FACC15' },

                // Neutros
                gray50: { value: '#F9FAFB' },
                gray100: { value: '#F3F4F6' },
                gray200: { value: '#E5E7EB' },
                gray300: { value: '#D1D5DB' },
                gray400: { value: '#9CA3AF' },
                gray500: { value: '#6B7280' },
                gray600: { value: '#4B5563' },
                gray700: { value: '#374151' },
                gray800: { value: '#1F2937' },
                gray900: { value: '#111827' },
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

        semanticTokens: {
            colors: {
                ctaGreen: { default: { value: '{colors.ctaGreen}' } },
                ctaBlue: { default: { value: '{colors.ctaBlue}' } },
                success: { default: { value: '{colors.success}' } },
                error: { default: { value: '{colors.error}' } },
                warning: { default: { value: '{colors.warning}' } },
            },
        },
        
    },
})

export const system = createSystem(defaultConfig, customConfig)
