'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Hamburger from './Hamburger'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.replace('/login')
  }, [])

  const toggleMenu = () => setOpen(!open)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar pathname={pathname} open={open} onClose={() => setOpen(false)} />

      {/* Conteúdo */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto w-full">
        {/* Cabeçalho com botão mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <Hamburger isOpen={open} toggle={toggleMenu} />
        </div>

        {children}
      </main>
    </div>
  )
}
