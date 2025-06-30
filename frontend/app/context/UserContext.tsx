'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserRole, ApiResponse, UsuarioResponse } from '../../types'

interface User {
  id: number
  email: string
  role: UserRole
  nome?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

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

          if (process.env.NODE_ENV !== 'production') {
            console.log('[UserContext] Usuario autenticado:', json.data.usuario)
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('[UserContext] Erro ao verificar usuario:', err)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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
