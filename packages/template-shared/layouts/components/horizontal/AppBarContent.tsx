// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'template-shared/@core/context/settingsContext'

// ** Components
import Autocomplete from '../../../layouts/components/Autocomplete'
import UserDropdown from 'template-shared/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'template-shared/@core/layouts/components/shared-components/LanguageDropdown'
import ShortcutsDropdown, {
  ShortcutsType
} from 'template-shared/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import
import { useAuth } from '../../../hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const shortcuts: ShortcutsType[] = [
  {
    title: 'Calendar',
    url: '/apps/calendar',
    icon: 'tabler:calendar',
    subtitle: 'Appointments'
  },
  {
    title: 'Invoice App',
    url: '/apps/invoice/list',
    icon: 'tabler:file-invoice',
    subtitle: 'Manage Accounts'
  },
  {
    title: 'User App',
    icon: 'tabler:users',
    url: '/apps/user/list',
    subtitle: 'Manage Users'
  },
  {
    url: '/apps/roles',
    icon: 'tabler:lock',
    subtitle: 'Permissions',
    title: 'Role Management'
  },
  {
    subtitle: 'CRM',
    title: 'Dashboard',
    url: '/dashboards/crm',
    icon: 'tabler:device-analytics'
  },
  {
    title: 'Settings',
    icon: 'tabler:settings',
    subtitle: 'Account Settings',
    url: '/apps/ims-account/account-settings/account'
  },
  {
    icon: 'tabler:help',
    title: 'Help Center',
    url: '/pages/help-center',
    subtitle: 'FAQs & Articles'
  },
  {
    title: 'Dialogs',
    icon: 'tabler:square',
    subtitle: 'Useful Popups',
    url: '/pages/dialog-examples'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />

      {auth.user && (
        <>
          {hidden ? <ShortcutsDropdown settings={settings} shortcuts={shortcuts} /> : null}
          {/*<NotificationDropdown settings={settings} notifications={notifications}/>*/}
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
