// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

import themeConfig from '../../../../configs/themeConfig'

import BlankLayout from 'template-shared/@core/layouts/BlankLayout'

import AuthIllustrationV1Wrapper from '../AuthIllustrationV1Wrapper'
import QRCode from 'react-qr-code'

import 'cleave.js/dist/addons/cleave-phone.us'
import localStorageKeys from '../../../../configs/localeStorage'
import { t } from 'i18next'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))
const QrcStepView = () => {
  const theme = useTheme()
  const [token, setToken] = useState<string | null | any>('')

  useEffect(() => {
    if (window) {
      setToken(sessionStorage?.getItem(localStorageKeys.token))
    }
  }, [])

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={34} height={23.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                />
              </svg>
              <Typography sx={{ ml: 2.5, fontWeight: 600, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {t(`${themeConfig.templateName}`)}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5 }} style={{ textAlign: 'center' }}>
                QRCode Verification
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }} style={{ textAlign: 'center' }}>
                Scanne QRC Code
              </Typography>
            </Box>
            <QRCode
              size={256}
              style={{
                height: 'auto',
                maxWidth: '100%',
                width: '40%',
                marginLeft: '30%',
                marginBottom: '20%'
              }}
              value={token}
              viewBox={`0 0 256 256`}
            />
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

QrcStepView.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default QrcStepView
