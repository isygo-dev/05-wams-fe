// ** React Imports
import React, { ReactNode } from 'react'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles'
import themeConfig from '../../configs/themeConfig'
import ThemeDirection from '../../layouts/components/ThemeDirection'

// ** Type Imports
// ** Theme Config
import { Settings } from '../context/settingsContext'

// ** Direction component for LTR or RTL
// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

interface Props {
  settings: Settings
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { settings, children } = props

  // ** Pass merged ThemeOptions (of core and user) to createTheme function
  let theme = createTheme(themeOptions(settings, 'light'))

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={theme}>
      <ThemeDirection direction={settings.direction}>
        <CssBaseline />
        <GlobalStyles styles={() => GlobalStyling(theme) as any} />
        {children}
      </ThemeDirection>
    </ThemeProvider>
  )
}

export default ThemeComponent
