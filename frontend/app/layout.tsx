import { Providers } from './chakra-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
