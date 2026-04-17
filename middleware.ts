import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const realm = 'Admin'

const unauthorized = () => {
  const res = new NextResponse('Authentication required', { status: 401 })
  res.headers.set('WWW-Authenticate', `Basic realm="${realm}", charset="UTF-8"`)
  return res
}

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    return unauthorized()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Basic ')) {
    return unauthorized()
  }

  const encoded = authHeader.slice('Basic '.length)
  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return unauthorized()
  }

  const separatorIndex = decoded.indexOf(':')
  if (separatorIndex === -1) {
    return unauthorized()
  }

  const user = decoded.slice(0, separatorIndex)
  const pass = decoded.slice(separatorIndex + 1)

  if (user !== username || pass !== password) {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
