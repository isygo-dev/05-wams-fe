// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import localStorageKeys from '../../../../../configs/localeStorage'
import { SystemInfo } from 'ims-shared/@core/types/ims/systemInfoTypes'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const systemInfoStorage = window.localStorage.getItem(localStorageKeys.systemInfo)
  let systemInfo: SystemInfo | null = null

  if (systemInfoStorage) {
    try {
      systemInfo = JSON.parse(systemInfoStorage)
    } catch (error) {
      console.error('Error while parsing systemInfo JSON:', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }} style={{ whiteSpace: 'pre-wrap' }}>
        {`© ${new Date().getFullYear()} ${systemInfo ? 'v' + systemInfo.version : ''}`}
        {`  -  `}
        <LinkStyled target='_blank' href='https://isygoit.eu'>
          `${process.env.NEXT_PUBLIC_COMPANY_NAME}`
        </LinkStyled>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled target='_blank' href='https://themeforest.net/licenses/standard'>
            License
          </LinkStyled>

          <LinkStyled target='_blank' href='https://demos.isygoit.eu/vuexy-nextjs-admin-template/documentation'>
            Documentation
          </LinkStyled>
          <LinkStyled target='_blank' href='https://isygoit.ticksy.com'>
            Support
          </LinkStyled>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
