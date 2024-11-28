import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders
    }
  })

  //console.log("in middle were with request",request.url);
  return response
}
