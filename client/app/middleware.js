import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  const publicPaths = ['/admin/login', '/admin/register','/admin/forgot-password','/admin/change-password',
    '/viewer/login', '/viewer/register','/viewer/forgot-password','/viewer/change-password'
  ]

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }


  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }


}

export const config = {
  matcher: [
    '/admin/createContent/:path*',
    '/admin/updateContent/:path*',
    '/admin/configure/:path*',
    '/admin/:path*',
    '/admin/contents/:path*',
    '/viewer/profile/:path*',
    '/viewer/favorites/:path*',
    '/viewer/home/:path*',
    '/viewer/specificPage/:path*',
  ],
}