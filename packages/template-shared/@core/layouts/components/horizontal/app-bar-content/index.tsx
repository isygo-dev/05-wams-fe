// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {styled} from '@mui/material/styles'

// ** Type Import
import {LayoutProps} from '../../../../layouts/types'

// ** Theme Config Import
import themeConfig from '../../../../../configs/themeConfig'
import {Avatar} from '@mui/material'
import React from 'react'
import localStorageKeys from '../../../../../configs/localeStorage'
import {t} from 'i18next'
import imsApiUrls from "ims-shared/configs/ims_apis"

interface Props {
    hidden: LayoutProps['hidden']
    settings: LayoutProps['settings']
    saveSettings: LayoutProps['saveSettings']
    appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
    appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
}

const LinkStyled = styled(Link)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginRight: theme.spacing(8)
}))

/*const titleStyles = {
    ml: 2.5,
    fontWeight: 600,
    lineHeight: '24px',
    fontSize: '1.375rem !important'
};*/
const AppBarContent = (props: Props) => {
    let domainId
    let userData

    // ** Props

    const {appBarContent: userAppBarContent, appBarBranding: userAppBarBranding} = props
    if (typeof localStorage != 'undefined') {
        if (localStorage.getItem(localStorageKeys.userData)) {
            userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
            if (userData?.domainId) {
                domainId = userData.domainId
            }
        }
    }

    return (
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {userAppBarBranding ? (
                userAppBarBranding(props)
            ) : (
                <LinkStyled href='/'>
                    <Avatar src={`${imsApiUrls.apiUrl_IMS_Domain_ImageDownload_EndPoint}/${domainId}`} alt='logo'/>
                    <Typography
                        variant='h6'
                        sx={{
                            ml: 2.5,
                            fontWeight: 600,
                            lineHeight: '24px',
                            fontSize: '1.375rem !important'
                        }}
                    >
                        {t(`${themeConfig.templateName}`)}
                    </Typography>
                </LinkStyled>
            )}
            {userAppBarContent ? userAppBarContent(props) : null}
        </Box>
    )
}

export default AppBarContent
