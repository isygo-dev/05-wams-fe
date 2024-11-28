// ** React Imports
import React, {Fragment, SyntheticEvent, useState} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem, {MenuItemProps} from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from '../../../components/icon'

// ** Context
import {useAuth} from '../../../../hooks/useAuth'

// ** Type Imports
import {Settings} from '../../../context/settingsContext'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import {useQuery, useQueryClient} from 'react-query'
import {UserDataType} from '../../../../context/types'
import localStorageKeys from '../../../../configs/localeStorage'

interface Props {
    settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({theme}) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({theme}) => ({
    '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
        color: theme.palette.primary.main
    }
}))

const UserDropdown = (props: Props) => {
    const queryClient = useQueryClient()
    const userData: UserDataType = queryClient.getQueryData('user')

    // ** Props
    const {settings} = props
    const [photo, setPhoto] = useState<string>(``)

    // ** States
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    // ** Hooks
    const router = useRouter()
    const {logout} = useAuth()

    const auth = useAuth()

    // ** Vars
    const {direction} = settings
    useQuery(
        'avatar',
        () =>
            auth.user?.id
                ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${auth.user?.id}?` + new Date().getTime()
                : null,
        {
            enabled: !!auth.user?.id, // Enable the query only when 'user.id' is available
            onSuccess: () => {
                setPhoto(`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${auth.user?.id}?` + new Date().getTime())
            }
        }
    )

    const handleDropdownOpen = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDropdownClose = (url?: string) => {
        if (url) {
            router.push(url)
        }
        setAnchorEl(null)
    }

    const styles = {
        px: 4,
        py: 1.75,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        textDecoration: 'none',
        '& svg': {
            mr: 2.5,
            color: 'text.primary'
        }
    }

    const handleLogout = () => {
        const getEmail = localStorage.getItem(localStorageKeys.email)
        logout()
        localStorage.setItem(localStorageKeys.email, getEmail)
        handleDropdownClose()
    }

    return (
        <Fragment>
            <Badge
                overlap='circular'
                onClick={handleDropdownOpen}
                sx={{ml: 2, cursor: 'pointer'}}
                badgeContent={<BadgeContentSpan/>}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Avatar
                    alt={useAuth().user?.firstName}
                    onClick={handleDropdownOpen}
                    sx={{width: 30, height: 30}}
                    src={photo}
                />
            </Badge>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleDropdownClose()}
                sx={
                    settings.navHidden
                        ? {'& .MuiMenu-paper': {width: 230, mt: 4.5, transform: 'translateX(19px) !important'}}
                        : {'& .MuiMenu-paper': {width: 230, transform: 'translate(25px, 4px) !important'}}
                }
                anchorOrigin={{vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left'}}
                transformOrigin={{vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left'}}
            >
                <Box sx={{py: 1.75, px: 6}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Badge
                            overlap='circular'
                            badgeContent={<BadgeContentSpan/>}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                        >
                            <Avatar alt={useAuth().user?.firstName} src={photo}
                                    sx={{width: '2.5rem', height: '2.5rem'}}/>
                        </Badge>
                        <Box sx={{display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column'}}>
                            <Typography sx={{fontWeight: 500}}>
                                {useAuth().user?.firstName} {useAuth().user?.lastName}
                            </Typography>
                            <Typography variant='body2'>{userData?.functionRole}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{my: theme => `${theme.spacing(2)} !important`}}/>
                <MenuItemStyled sx={{p: 0}}
                                onClick={() => handleDropdownClose('/apps/ims-account/account-settings/account')}>
                    <Box sx={styles}>
                        <Icon icon='tabler:user-check'/>
                        My Profile
                    </Box>
                </MenuItemStyled>

                {/*

                    <MenuItemStyled sx={{p: 0}} onClick={() => handleDropdownClose('/apps/email')}>
                    <Box sx={styles}>
                      <Icon icon='tabler:mail'/>
                      Inbox
                    </Box>
                  </MenuItemStyled>
                  <MenuItemStyled sx={{p: 0}} onClick={() => handleDropdownClose('/apps/chat')}>
                    <Box sx={styles}>
                      <Icon icon='tabler:message-2'/>
                      Chat
                    </Box>
                  </MenuItemStyled>
                  <Divider sx={{my: theme => `${theme.spacing(2)} !important`}}/>
                  <MenuItemStyled sx={{p: 0}} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
                    <Box sx={styles}>
                      <Icon icon='tabler:settings'/>
                      Settings
                    </Box>
                  </MenuItemStyled>

                  */}

                <Divider sx={{my: theme => `${theme.spacing(2)} !important`}}/>
                <MenuItemStyled onClick={handleLogout} sx={{py: 2, '& svg': {mr: 2, fontSize: '1.375rem'}}}>
                    <Icon icon='tabler:logout'/>
                    Logout
                </MenuItemStyled>
            </Menu>
        </Fragment>
    )
}

export default UserDropdown
