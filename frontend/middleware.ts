import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isLockdownEnabled } from './lockdown.flags'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (isLockdownEnabled()) {
    const allowedDuringLockdown =
      path === '/manutencao' ||
      path === '/excluir-dados' ||
      path === '/politica-de-privacidade' ||
      path === '/termos-de-uso' ||
      path.startsWith('/_next') ||
      path === '/favicon.ico'

    if (!allowedDuringLockdown) {
      const url = req.nextUrl.clone()
      url.pathname = '/manutencao'
      url.search = ''
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  const tokenFromCookie = req.cookies.get('token')?.value
  const protectedPaths = ['/dashboard', '/admin', '/painel']
  const isProtected = protectedPaths.some((prefix) => path.startsWith(prefix))

  if (isProtected && !tokenFromCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
}
