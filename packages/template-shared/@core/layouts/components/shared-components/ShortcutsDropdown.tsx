// ** React Imports
import React, {Fragment, ReactNode, SyntheticEvent, useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {styled, Theme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, {MenuProps} from '@mui/material/Menu'
import MuiMenuItem, {MenuItemProps} from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from '../../../components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import {Settings} from '../../../context/settingsContext'
import imsApiUrls from "ims-shared/configs/ims_apis"
import {useTranslation} from 'react-i18next'

export type ShortcutsType = {
    url: string
    icon: string
    title: string
    subtitle: string
}

interface Props {
    settings: Settings
    shortcuts: any[]
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({theme}) => ({
    '& .MuiMenu-paper': {
        width: 350,
        overflow: 'hidden',
        marginTop: theme.spacing(4.5),
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    '& .MuiMenu-list': {
        padding: 0
    }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({theme}) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    maxHeight: '30rem'
})

const ScrollWrapper = ({children, hidden}: { children: ReactNode; hidden: boolean }) => {
    if (hidden) {
        return <Box sx={{maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden'}}>{children}</Box>
    } else {
        return <PerfectScrollbar
            options={{wheelPropagation: false, suppressScrollX: true}}>{children}</PerfectScrollbar>
    }
}

const ShortcutsDropdown = (props: Props) => {
    // ** Props

    const {shortcuts, settings} = props
    const {t} = useTranslation()

    // ** States
    const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

    // ** Hook
    const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

    // ** Vars
    const {direction} = settings

    const handleDropdownOpen = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDropdownClose = () => {
        setAnchorEl(null)
    }

    return (
        <Fragment>
            <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen}
                        aria-controls='customized-menu'>
                <Icon fontSize='1.3rem' icon='tabler:layout-grid-add'/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
                anchorOrigin={{vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left'}}
                transformOrigin={{vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left'}}
            >
                <MenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{
                        m: 0,
                        cursor: 'default',
                        userSelect: 'auto',
                        p: theme => theme.spacing(4, 6),
                        backgroundColor: 'transparent !important'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            '& svg': {color: 'text.secondary'}
                        }}
                    >
                        <Typography variant='h6'>{t('Allowed Tools')}</Typography>
                    </Box>
                </MenuItem>
                <Divider sx={{my: '0 !important'}}/>
                <ScrollWrapper hidden={hidden}>
                    <Grid
                        container
                        spacing={0}
                        sx={{
                            '& .MuiGrid-root': {
                                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                                '&:nth-of-type(odd)': {borderRight: theme => `1px solid ${theme.palette.divider}`}
                            }
                        }}
                    >
                        {shortcuts.length > 0 ? (
                            shortcuts.map((shortcut, index) => (
                                <Grid
                                    item
                                    xs={shortcuts.length === 1 ? 12 : shortcuts.length === 2 ? 6 : 4}
                                    key={index}
                                    onClick={handleDropdownClose}
                                    sx={{cursor: 'pointer', '&:hover': {backgroundColor: 'action.hover'}}}
                                >
                                    <Tooltip title={t(shortcut.title)}>
                                        <Box
                                            component={Link}
                                            href={`${shortcut.url}?accessToken=${shortcut?.token?.type}_${shortcut?.token?.token}`}
                                            sx={{
                                                p: 6,
                                                display: 'flex',
                                                textAlign: 'center',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <img
                                                height='58'
                                                src={
                                                    shortcut.icon
                                                        ? `${imsApiUrls.apiUrl_IMS_Application_ImageDownload_EndPoint}/${shortcut.id}`
                                                        : '/images/favicon_vertical.png'
                                                }
                                                alt='icon'
                                            />
                                        </Box>
                                    </Tooltip>
                                </Grid>
                            ))
                        ) : (
                            <>{t('No_Applications_Found')}</>
                        )}
                    </Grid>
                </ScrollWrapper>
            </Menu>
        </Fragment>
    )
}

export default ShortcutsDropdown
