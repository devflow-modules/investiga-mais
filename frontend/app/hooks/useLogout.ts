'use client'

import { useUser } from '../context/UserContext'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()
  const { logout: userLogout } = useUser()

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch (err) {
      console.error('[useLogout] Erro ao fazer logout:', err)
    } finally {
      userLogout() // seta user=null no contexto
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  return { logout }
}
