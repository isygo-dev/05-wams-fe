// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Type Import
import { Settings } from 'template-shared/@core/context/settingsContext'

// ** Components
import UserDropdown from 'template-shared/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'template-shared/@core/layouts/components/shared-components/LanguageDropdown'
import { NotificationsType } from 'template-shared/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from 'template-shared/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  notifications?: NotificationsType[]
}

const AppBarContent = (props: Props) => {
  const auth = useAuth()

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility, notifications } = props

  console.log('notifications', notifications)
  const [shortcuts, setShortcuts] = useState(null)

  useEffect(() => {
    console.log(auth.user?.applications)
    const applicationList: any[] = auth.user?.applications?.map(app => {
      return {
        url: app.url,
        icon: app.imagePath,
        title: app.title,
        subtitle: app.name,
        id: app.id,
        token: {
          token: app.token.token,
          type: app.token.type
        }
      }
    })

    setShortcuts(applicationList)
  }, [])

  // ** Hook

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        {/*{auth.user && <Autocomplete hidden={hidden} settings={settings}/>}*/}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageDropdown settings={settings} saveSettings={saveSettings} />.
        {auth.user && (
          <>
            {shortcuts && <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />}
            {/*{notifications && notifications.length > 0 && <NotificationDropdown settings={settings} notifications={notifications} />} */}
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
