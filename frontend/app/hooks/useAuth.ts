'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()

  useEffect(() => {
    if (pathname === '/login') return

    if (!user) {
      console.warn('[useAuth] Não autenticado, redirecionando.')
      router.replace('/login')
    } else {
      console.log('[useAuth] Usuario OK:', user.role)
    }
  }, [user, pathname, router])
}
