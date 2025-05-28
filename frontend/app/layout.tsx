export const metadata = {
  title: 'Investiga Mais',
  description: 'Solução digital para investigações de fraudes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
