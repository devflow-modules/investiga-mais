import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const tokenFromCookie = req.cookies.get('token')?.value

  const protectedPaths = ['/dashboard', '/admin', '/painel']
  const path = req.nextUrl.pathname
  const isProtected = protectedPaths.some((prefix) => path.startsWith(prefix))

  console.log('[MIDDLEWARE] token encontrado:', tokenFromCookie)

  if (isProtected && !tokenFromCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/painel/:path*'],
}
