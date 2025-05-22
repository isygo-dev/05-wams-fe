// ** React Imports
import React, { ReactNode, useEffect } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'template-shared/configs/i18n'
import { defaultACLObj } from 'template-shared/configs/acl'
import themeConfig from 'template-shared/configs/themeConfig'

// ** Fake-DB Import
import 'template-shared/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'template-shared/layouts/UserLayout'
import AclGuard from 'template-shared/@core/components/auth/AclGuard'
import ThemeComponent from 'template-shared/@core/theme/ThemeComponent'
import AuthGuard from 'template-shared/@core/components/auth/AuthGuard'
import GuestGuard from 'template-shared/@core/components/auth/GuestGuard'
import HorizontalNavItems from '../../src/navigation/horizontal'
import VerticalNavItems from '../../src/navigation/vertical'

// ** Spinner Import
import Spinner from 'template-shared/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'template-shared/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'template-shared/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'template-shared/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'template-shared/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'template-shared/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import getHomeRoute from '../navigation/getHomeRoute'
import CustomQueryClientProvider from 'template-shared/@core/components/CustomQueryClientProvider'
import { t } from 'i18next'
import { NotificationsType } from 'template-shared/@core/layouts/components/shared-components/NotificationDropdown'
import localStorageKeys from 'template-shared/configs/localeStorage'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const notifications: NotificationsType[] = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ??
    (page => (
      <UserLayout
        contentHeightFixed={contentHeightFixed}
        menuItemHorizontal={HorizontalNavItems()}
        menuItemVertical={VerticalNavItems()}
        notifications={notifications}
      >
        {page}
      </UserLayout>
    ))

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const title = 'WAMS - ' + t(`${themeConfig.templateName}`)

  useEffect(() => {
    const getPaginationSize = localStorage.getItem(localStorageKeys.paginationSize)
    if (!getPaginationSize && Number(getPaginationSize) < 9) {
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, '20')
    }
  }, [])

  return (
    <AuthProvider>
      <CustomQueryClientProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{title}</title>
            <meta name='description' content={`${themeConfig.templateName} – WAMS Template`} />
            <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>

          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard
                        aclAbilities={aclAbilities}
                        guestGuard={guestGuard}
                        authGuard={authGuard}
                        homeRoute={getHomeRoute()}
                      >
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </CacheProvider>
      </CustomQueryClientProvider>
    </AuthProvider>
  )
}

export default App
