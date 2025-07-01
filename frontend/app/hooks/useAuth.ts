'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useUser()

  useEffect(() => {
    if (pathname === '/login') return

    if (loading) return // ainda está verificando

    if (!user) {
      console.warn('[useAuth] Não autenticado, redirecionando.')
      router.replace('/login')
    } else {
      console.log('[useAuth] Usuario OK:', user.role)
    }
  }, [user, loading, pathname, router])
}
