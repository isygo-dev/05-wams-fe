import {ReactElement, SyntheticEvent, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import {styled, Theme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, {TabListProps} from '@mui/lab/TabList'
import TabAccount from './TabAccount'
import TabBilling from './TabBilling'
import TabSecurity from './TabSecurity'
import TabConnections from './TabConnections'
import TabNotifications from './TabNotifications'
import {useTranslation} from 'react-i18next'
import {useQuery} from 'react-query'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import AccountApis from "ims-shared/@core/api/ims/account";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import Icon from "../../../@core/components/icon";
import imsApiUrls from "ims-shared/configs/ims_apis"

const TabList = styled(MuiTabList)<TabListProps>(({theme}) => ({
    border: '0 !important',
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
        minWidth: 65,
        minHeight: 38,
        lineHeight: 1,
        borderRadius: theme.shape.borderRadius,
        [theme.breakpoints.up('md')]: {
            minWidth: 130
        }
    }
}))

const AccountSettings = ({tab, id}: { tab: string; id: number | null }) => {
    // ** State
    const [photo, setPhoto] = useState<string>('')

    const [activeTab, setActiveTab] = useState<string>(tab)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // ** Hooks
    const router = useRouter()
    const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const {t} = useTranslation()
    const handleChange = (event: SyntheticEvent, value: string) => {
        setIsLoading(true)
        setActiveTab(value)
        if (!id) {
            router.push(`/pages/account-settings/${value.toLowerCase()}`).then(() => setIsLoading(false))
        } else {
            router.push(`/apps/ims-account/view/${value.toLowerCase()}/${id}`).then(() => setIsLoading(false))
        }
    }

    const {data: user, isLoading: isLoadingUser} = useQuery(
        `profile`,
        () => (!id ? AccountApis(t).getAccountProfile() : AccountApis(t).getAccountById(id)),
        {
            onSuccess: data => {
                if (data?.id) {
                    setPhoto(`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${data?.id}?` + new Date().getTime())
                }
            }
        }
    )

    const [myProfile, setMyProfile] = useState(false)

    useEffect(() => {
        if (!id) {
            setMyProfile(true)
        }
        if (tab && tab !== activeTab) {
            setActiveTab(tab)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    const tabContentList: { [key: string]: ReactElement } = {
        account: <TabAccount id={id} user={user} photo={photo} setPhoto={setPhoto} myProfile={myProfile}/>,
        security: <TabSecurity user={user} myProfile={myProfile}/>,
        connections: <TabConnections/>,
        notifications: <TabNotifications/>,
        billing: <TabBilling apiPricingPlanData={null}/>
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <TabContext value={activeTab}>
                    {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.READ) && (
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <TabList
                                    variant='scrollable'
                                    scrollButtons='auto'
                                    onChange={(event, value) => handleChange(event, value)}
                                    aria-label='customized tabs example'
                                >
                                    <Tab
                                        value='account'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:users'/>
                                                {!hideText && t('Tabs.Account')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='security'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:lock'/>
                                                {!hideText && t('Tabs.Security')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='billing'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:file-text'/>
                                                {!hideText && t('Tabs.Billing')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='notifications'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:bell'/>
                                                {!hideText && t('Tabs.Notifications')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='connections'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:link'/>
                                                {!hideText && t('Tabs.Connections')}
                                            </Box>
                                        }
                                    />
                                </TabList>
                            </Grid>
                            <Grid item xs={12}>
                                {!isLoading && !isLoadingUser && user ? (
                                    <TabPanel sx={{p: 0}} value={activeTab}>
                                        {tabContentList[activeTab]}
                                    </TabPanel>
                                ) : (
                                    <Typography> Error loading account data</Typography>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </TabContext>
            </Grid>
        </Grid>
    )
}

export default AccountSettings
