import { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import Icon from 'template-shared/@core/components/icon'
import { Settings, Theme } from '../../context/settingsContext'
import { useSettings } from '../../hooks/useSettings'
import Button from '@mui/material/Button'
import { useMutation } from 'react-query'
import ThemeApis from 'ims-shared/@core/api/ims/theme'
import { useTranslation } from 'react-i18next'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

interface AccountDomainCode {
  domainCode: string
  accountCode: string
}

type ThemeType = 'dark' | 'semi-dark' | 'light'

const themeRecord: Record<ThemeType, string> = {
  dark: 'dark',
  'semi-dark': 'semi-dark',
  light: 'light'
}
const recordTheme: Record<string, ThemeType> = {
  dark: 'dark',
  'semi-dark': 'semi-dark',
  light: 'light'
}

const Customizer = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { settings, saveSettings } = useSettings()
  const [accountDomainCode] = useState<AccountDomainCode>({ domainCode: '', accountCode: '' })
  const {
    mode,
    skin,
    appBar,
    footer,
    layout,
    navHidden,
    direction,
    appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth,
    verticalNavToggleType
  } = settings

  const updateThemeMutation = useMutation({
    mutationFn: (accountDomainCode: AccountDomainCode) =>
      ThemeApis(t).updateThemeByCode({
        themeColor: settings.themeColor,
        skin: settings.skin.toUpperCase() as typeof skin,
        mode: recordTheme[settings.mode] as typeof mode,
        contentWidth: settings.contentWidth.toUpperCase() as typeof contentWidth,
        appBar: (settings.appBar?.toUpperCase() || 'default') as typeof appBar,
        footer: (settings.footer?.toUpperCase() || 'default') as typeof footer,
        layout: settings.layout?.toUpperCase() as typeof layout,
        verticalNavToggleType: settings.verticalNavToggleType.toUpperCase() as typeof verticalNavToggleType,
        direction: settings.direction.toUpperCase() as typeof direction,
        appBarBlur: settings.appBarBlur,
        navCollapsed: settings.navCollapsed,
        accountCode: accountDomainCode.accountCode,
        domainCode: accountDomainCode.domainCode
      }),

    onSuccess: (res: Theme) => {
      saveSettings({
        themeColor: res.themeColor || themeColor,
        skin: res.skin?.toLowerCase() as typeof skin,
        mode: res.mode && themeRecord[res.mode] ? (themeRecord[res.mode] as typeof mode) : (mode as typeof mode),
        contentWidth: res.contentWidth?.toLowerCase() as typeof contentWidth,
        appBar: res.appBar?.toLowerCase() as typeof appBar,
        footer: res.footer?.toLowerCase() as typeof footer,
        layout: res.layout?.toLowerCase() as typeof layout,
        verticalNavToggleType: res.verticalNavToggleType?.toLowerCase() as typeof verticalNavToggleType,
        direction: res.direction?.toLowerCase() as typeof direction,
        appBarBlur: res.appBarBlur ? true : false,
        navCollapsed: res.navCollapsed ? true : false
      })
      handleClose()
    },
    onError: err => {
      console.log(err)
    }
  })
  const handleClose = () => {
    console.log('test')
  }
  const handleClick = async () => {
    try {
      await updateThemeMutation.mutateAsync(accountDomainCode)

      handleClose()
    } catch (error) {
      console.error(error)
    }
  }
  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='tabler:settings' />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            Theme Customizer
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Customize & Preview in Real Time</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Theming
            </Typography>

            {/* Skin */}
            <Box sx={{ mb: 5 }}>
              <Typography>Skin</Typography>
              <RadioGroup
                row
                value={skin}
                onChange={e => handleChange('skin', e.target.value as Settings['skin'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='default' label='Default' control={<Radio />} />
                <FormControlLabel value='bordered' label='Bordered' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Mode */}
            <Box sx={{ mb: 5 }}>
              <Typography>Mode</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label='Light' control={<Radio />} />
                <FormControlLabel value='dark' label='Dark' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label='Semi Dark' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Color Picker */}
            <div>
              <Typography>Primary Color</Typography>
              <Box sx={{ display: 'flex' }}>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    backgroundColor: '#7367F0',
                    ...(themeColor === 'primary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'secondary')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    ...(themeColor === 'secondary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'success')}
                  sx={{
                    backgroundColor: 'success.main',
                    ...(themeColor === 'success'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'error')}
                  sx={{
                    backgroundColor: 'error.main',
                    ...(themeColor === 'error'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'warning')}
                  sx={{
                    backgroundColor: 'warning.main',
                    ...(themeColor === 'warning'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'info')}
                  sx={{
                    backgroundColor: 'info.main',
                    ...(themeColor === 'info'
                      ? {
                          width: 53,
                          height: 53,
                          m: theme => theme.spacing(1.5, 0.75, 0)
                        }
                      : {})
                  }}
                />
              </Box>
            </div>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Layout
            </Typography>

            {/* Content Width */}
            <Box sx={{ mb: 5 }}>
              <Typography>Content Width</Typography>
              <RadioGroup
                row
                value={contentWidth}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='full' label='Full' control={<Radio />} />
                <FormControlLabel value='boxed' label='Boxed' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar */}
            <Box sx={{ mb: 5 }}>
              <Typography>AppBar Type</Typography>
              <RadioGroup
                row
                value={appBar}
                onChange={e => handleChange('appBar', e.target.value as Settings['appBar'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='fixed' label='Fixed' control={<Radio />} />
                <FormControlLabel value='static' label='Static' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='hidden' label='Hidden' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Footer */}
            <Box sx={{ mb: 5 }}>
              <Typography>Footer Type</Typography>
              <RadioGroup
                row
                value={footer}
                onChange={e => handleChange('footer', e.target.value as Settings['footer'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='fixed' label='Fixed' control={<Radio />} />
                <FormControlLabel value='static' label='Static' control={<Radio />} />
                <FormControlLabel value='hidden' label='Hidden' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar Blur */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>AppBar Blur</Typography>
              <Switch
                name='appBarBlur'
                checked={appBarBlur}
                onChange={e => handleChange('appBarBlur', e.target.checked)}
              />
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Menu
            </Typography>

            {/* Menu Layout */}
            <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 5 }}>
              <Typography>Menu Layout</Typography>
              <RadioGroup
                row
                value={layout}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value as Settings['layout'],
                    lastLayout: e.target.value as Settings['lastLayout']
                  })
                }}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='vertical' label='Vertical' control={<Radio />} />
                <FormControlLabel value='horizontal' label='Horizontal' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Menu Toggle */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 5 }}>
                <Typography>Menu Toggle</Typography>
                <RadioGroup
                  row
                  value={verticalNavToggleType}
                  onChange={e =>
                    handleChange('verticalNavToggleType', e.target.value as Settings['verticalNavToggleType'])
                  }
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '.875rem',
                      color: 'text.secondary'
                    }
                  }}
                >
                  <FormControlLabel value='accordion' label='Accordion' control={<Radio />} />
                  <FormControlLabel value='collapse' label='Collapse' control={<Radio />} />
                </RadioGroup>
              </Box>
            )}

            {/* Menu Collapsed */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                <Typography>Menu Collapsed</Typography>
                <Switch
                  name='navCollapsed'
                  checked={navCollapsed}
                  onChange={e => handleChange('navCollapsed', e.target.checked)}
                />
              </Box>
            )}

            {/* Menu Hidden */}
            {layout === 'horizontal' && appBar === 'hidden' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Menu Hidden</Typography>
                <Switch
                  name='navHidden'
                  checked={navHidden}
                  onChange={e => handleChange('navHidden', e.target.checked)}
                />
              </Box>
            )}
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Misc
            </Typography>

            {/* RTL */}
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>RTL</Typography>
              <Switch
                name='direction'
                checked={direction === 'rtl'}
                onChange={e => handleChange('direction', e.target.checked ? 'rtl' : 'ltr')}
              />
            </Box>
          </CustomizerSpacing>
          <Button onClick={handleClick} type='submit' variant='contained' sx={{ mr: 2 }}>
            Update
          </Button>
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
