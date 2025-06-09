import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/login') return

    const verificar = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
        })

        console.log('[useAuth] /api/auth/verify status:', res.status)

        if (!res.ok) {
          throw new Error('Token inválido')
        }

        const json = await res.json()
        console.log('[useAuth] usuario autenticado:', json.usuario)

      } catch (err) {
        console.warn('[useAuth] Redirecionando para login...')
        router.replace('/login')
      }
    }

    verificar()
  }, [router])
}