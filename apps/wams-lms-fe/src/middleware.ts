import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

import localStorageKeys from 'template-shared/configs/localeStorage'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  if (typeof window !== 'undefined') {
    console.log('window is loaded')
    const token = window?.localStorage?.getItem(localStorageKeys.accessToken)
    if (token) {
      requestHeaders.append('Authorization', token)
      console.log('Request header is set')
    }
  }

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
