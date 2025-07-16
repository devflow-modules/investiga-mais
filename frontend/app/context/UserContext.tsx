'use client'

import type { ApiResponse, UserRole, UsuarioResponse } from '@types'
import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface User {
  id: number
  email: string
  role: UserRole
  nome?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()

  const isPublicPage = ['/', '/login', '/politica-de-privacidade', '/termos-de-uso'].includes(pathname)

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' })
        const json: ApiResponse<UsuarioResponse> = await res.json()

        if (json.success && json.data?.usuario) {
          setUser({
            id: json.data.usuario.id,
            email: json.data.usuario.email,
            role: json.data.usuario.role,
            nome: json.data.usuario.nome || '',
          })
          console.log('[UserContext] Usuario autenticado:', json.data.usuario)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('[UserContext] Erro ao verificar usuario:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [pathname])

  const logout = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
