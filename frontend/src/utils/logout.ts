'use client'

import { apiFetchJSON } from './apiFetchJSON'
import { resetAuthCache } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()

  const logout = async () => {
    try {
      // Chama logout na API
      await apiFetchJSON('/api/auth/logout', {
        method: 'POST',
      })

      // Remove token de localStorage (caso algum fluxo use no futuro)
      localStorage.removeItem('token')

      // Reseta cache de autenticação
      resetAuthCache()

      // Redireciona para login
      router.push('/login')
    } catch (err) {
      console.error('[useLogout] Erro ao fazer logout:', err)

      // Mesmo em caso de erro, garante limpeza + redirect
      resetAuthCache()
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  return { logout }
}
