import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// 🔥 cache global
let isAlreadyAuthed = false

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const isCancelled = useRef(false)

  useEffect(() => {
    if (pathname === '/login') return

    isCancelled.current = false

    const verificar = async () => {
      if (isAlreadyAuthed) {
        console.log('[useAuth] Usando cache: já autenticado.')
        return
      }

      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
        })

        console.log('[useAuth] /api/auth/verify status:', res.status)

        if (res.status === 200 || res.status === 304) {
          console.log('[useAuth] usuario autenticado (status', res.status, ')')
          isAlreadyAuthed = true
          return
        }

        if (!isCancelled.current) {
          console.warn('[useAuth] Não autenticado, redirecionando (status', res.status, ')')
          isAlreadyAuthed = false
          router.replace('/login')
        }
      } catch (err) {
        if (!isCancelled.current) {
          console.error('[useAuth] Erro ao verificar auth:', err)
          isAlreadyAuthed = false
          router.replace('/login')
        }
      }
    }

    verificar()

    return () => {
      isCancelled.current = true
    }
  }, [router, pathname])
}

// 👉 função para resetar o cache (ex: após logout)
export function resetAuthCache() {
  console.log('[useAuth] Resetando cache de autenticação.')
  isAlreadyAuthed = false
}
