import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

const publicPaths = ['/auth/signin', '/auth/signup', '/']
const protectedPaths = ['/favorites', '/submit', '/profile']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow admin routes to pass through
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Get auth token
  const token = request.cookies.get('auth_token')?.value
  
  // Verify token
  let isAuthenticated = false
  if (token) {
    const user = await verifyToken(token)
    isAuthenticated = !!user
  }

  // Redirect logic
  if (!isAuthenticated && protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    // User is not authenticated and trying to access protected route
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    // User is authenticated and trying to access auth pages - redirect to home
    const redirect = request.nextUrl.searchParams.get('redirect')
    return NextResponse.redirect(new URL(redirect || '/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
