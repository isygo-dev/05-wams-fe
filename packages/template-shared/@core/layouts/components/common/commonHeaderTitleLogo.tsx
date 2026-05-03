// ** MUI Imports
import Box from '@mui/material/Box'

// ** Icon Imports
import React from 'react'
import { styled } from '@mui/material/styles'
import { Avatar } from '@mui/material'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import themeConfig from '../../../../configs/themeConfig'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { SxProps } from '@mui/system'
import localStorageKeys from '../../../../configs/localeStorage'
import { t } from 'i18next'

interface CommonHeaderTitleLogoProps {
  showHeaderTitle: boolean
  titleStyles: SxProps
}

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: '24px',
  fontSize: '1rem !important',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))
const CommonHeaderTitleLogo = (props: CommonHeaderTitleLogoProps) => {
  const { showHeaderTitle, titleStyles } = props
  let tenantId, userData
  if (typeof localStorage != 'undefined') {
    if (localStorage.getItem(localStorageKeys.userData)) {
      userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
      if (userData?.tenantId) {
        tenantId = userData.tenantId
      }
    }
  }

  return (
    <Box sx={{ display: 'contents' }}>
      <Avatar
        src={`${imsApiUrls.apiUrl_IMS_Tenant_ImageDownload_EndPoint}/${tenantId}`}
        alt='logo'
        sx={{ width: '40px', height: '40px' }}
      />
      {showHeaderTitle ? (
        <HeaderTitle sx={titleStyles}>{t(`${themeConfig.templateName}`)}</HeaderTitle>
      ) : (
        <Typography variant='subtitle2' sx={titleStyles}>
          {t(`${themeConfig.templateName}`)}
        </Typography>
      )}
    </Box>
  )
}

export default CommonHeaderTitleLogo
