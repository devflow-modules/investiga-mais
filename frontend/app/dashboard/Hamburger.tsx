'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Hamburger({
  isOpen,
  toggle
}: {
  isOpen: boolean
  toggle: () => void
}) {
  return (
    <button
      onClick={toggle}
      className="md:hidden p-2 rounded hover:bg-gray-100 transition"
      aria-label="Abrir menu"
    >
      <span className="sr-only">Abrir menu</span>
      <div className="relative w-6 h-6">
        {/* Ícone Hambúrguer (Menu) */}
        <Menu
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* Ícone X (Fechar) */}
        <X
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </button>
  )
}
