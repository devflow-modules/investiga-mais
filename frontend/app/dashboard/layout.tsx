// frontend/app/dashboard/layout.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.replace('/login')
  }, [])

  const links = [
    { href: '/dashboard', label: 'Início' },
    { href: '/dashboard/consulta', label: 'Consulta CNPJ' },
    { href: '/dashboard/historico', label: 'Histórico' },
    { href: '/dashboard/perfil', label: 'Meu Perfil' }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white p-5 space-y-4">
        <h1 className="text-xl font-bold mb-6">🔍 Investiga+</h1>
        <nav className="space-y-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded ${
                pathname === link.href
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700 transition'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
