import { Providers } from './chakra-provider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investiga+ | Verificação de CNPJs, golpes e fraudes em segundos',
  description: 'Use o Investiga+ para consultar CNPJs, verificar fraudes, e detectar golpes em poucos segundos. Ideal para e-commerces, afiliados e consumidores atentos.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Investiga+ | Detecte Fraudes e Golpes',
    description: 'Proteja-se de sites e empresas falsas com nossa ferramenta de verificação inteligente.',
    url: 'https://investigamais.com',
    siteName: 'Investiga+',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Investiga+ - Segurança Digital',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investiga+ | Verificação de Golpes',
    description: 'Descubra se um site ou empresa é confiável em poucos segundos.',
    images: ['/og-image.png'],
  }
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning style={{ scrollBehavior: 'smooth' }}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
