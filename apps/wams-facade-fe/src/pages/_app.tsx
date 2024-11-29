import React from 'react'
import Head from 'next/head'
import {Router} from 'next/router'
import type {NextPage} from 'next'
import type {AppProps} from 'next/app'
import NProgress from 'nprogress'
import type {EmotionCache} from '@emotion/cache'
import 'template-shared/configs/i18n'
import themeConfig from 'template-shared/configs/themeConfig'
import 'template-shared/@fake-db'
import ThemeComponent from 'template-shared/@core/theme/ThemeComponent'
import {SettingsConsumer, SettingsProvider} from 'template-shared/@core/context/settingsContext'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'template-shared/iconify-bundle/icons-bundle-react'
import '../../styles/globals.css'
import {t} from "i18next";

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

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

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const {Component, pageProps} = props
  const setConfig = Component.setConfig ?? undefined
  const title = 'WAMS - ' + t(`${themeConfig.templateName}`)

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – WAMS Template`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template'/>
        <meta name='viewport' content='initial-scale=1, width=device-width'/>
      </Head>

      <SettingsProvider {...(setConfig ? {pageSettings: setConfig()} : {})}>
        <SettingsConsumer>
          {({settings}) => {
            return (
              <ThemeComponent settings={settings}>
                <Component {...pageProps} />
              </ThemeComponent>
            )
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </div>

  )
}

export default App
