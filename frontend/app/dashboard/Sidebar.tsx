'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Início' },
  { href: '/dashboard/consulta', label: 'Consulta CNPJ' },
  { href: '/dashboard/historico', label: 'Histórico' },
  { href: '/dashboard/perfil', label: 'Meu Perfil' }
]

export default function Sidebar({
  pathname,
  open,
  onClose
}: {
  pathname: string
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-60 bg-gray-900 text-white p-5 space-y-4 transform transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-lg font-bold">🔍 Investiga+</h1>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <h1 className="text-xl font-bold mb-6 hidden md:block">🔍 Investiga+</h1>

        <nav className="space-y-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
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
    </>
  )
}
