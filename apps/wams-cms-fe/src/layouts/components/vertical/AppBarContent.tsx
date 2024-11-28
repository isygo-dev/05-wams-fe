// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Type Import
import {Settings} from 'template-shared/@core/context/settingsContext'

// ** Components
import UserDropdown from 'template-shared/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'template-shared/@core/layouts/components/shared-components/LanguageDropdown'
import ShortcutsDropdown, {
  ShortcutsType
} from 'template-shared/@core/layouts/components/shared-components/ShortcutsDropdown'
import {useAuth} from 'template-shared/hooks/useAuth'
import Autocomplete from '../Autocomplete'

// ** Hook Import

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const shortcuts: ShortcutsType[] = []

const AppBarContent = (props: Props) => {
  // ** Props
  const {hidden, settings, saveSettings, toggleNavVisibility} = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ml: -2.75}} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2'/>
          </IconButton>
        ) : null}
        {auth.user && <Autocomplete hidden={hidden} settings={settings}/>}
      </Box>
      <Box className='actions-right' sx={{display: 'flex', alignItems: 'center'}}>
        <LanguageDropdown settings={settings} saveSettings={saveSettings}/>

        {auth.user && (
          <>
            <ShortcutsDropdown settings={settings} shortcuts={shortcuts}/>
            {/*<NotificationDropdown settings={settings} notifications={notifications}/>*/}
            <UserDropdown settings={settings}/>
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
