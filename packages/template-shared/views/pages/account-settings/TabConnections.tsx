// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'
import {useTranslation} from 'react-i18next'

interface ConnectedAccountsType {
    title: string
    logo: string
    checked: boolean
    subtitle: string
}

interface SocialAccountsType {
    title: string
    logo: string
    username?: string
    isConnected: boolean
}

const TabConnections = () => {
    const {t} = useTranslation()

    const socialAccountsArr: SocialAccountsType[] = [
        {
            title: t('Connections.Facebook'),
            isConnected: false,
            logo: '/images/logos/facebook.png'
        },
        {
            title: t('Connections.Twitter'),
            isConnected: true,
            username: '@Novobit Gmbh',
            logo: '/images/logos/twitter.png'
        },
        {
            title: t('Connections.Instagram'),
            isConnected: true,
            username: '@Novobit Gmbh',
            logo: '/images/logos/instagram.png'
        },
        {
            title: t('Connections.Dribbble'),
            isConnected: false,
            logo: '/images/logos/dribbble.png'
        },
        {
            title: t('Connections.Behance'),
            isConnected: false,
            logo: '/images/logos/behance.png'
        }
    ]

    const connectedAccountsArr: ConnectedAccountsType[] = [
        {
            checked: true,
            title: t('Connections.Google'),
            logo: '/images/logos/google.png',
            subtitle: t('Connections.Calendar_and_Contacts')
        },
        {
            checked: false,
            title: t('Connections.Slack'),
            logo: '/images/logos/slack.png',
            subtitle: t('Connections.Communications')
        },
        {
            checked: true,
            title: t('Connections.Github'),
            logo: '/images/logos/github.png',
            subtitle: t('Connections.Manage_your_Git_repositories')
        },
        {
            checked: true,
            title: t('Connections.Mailchimp'),
            subtitle: t('Connections.Email_marketing_service'),
            logo: '/images/logos/mail-chimp.png'
        },
        {
            title: t('Connections.Asana'),
            checked: false,
            subtitle: t('Connections.Communication'),
            logo: '/images/logos/asana.png'
        }
    ]

    return (
        <Grid container spacing={6}>
            {/* Connected Accounts Cards */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title={t('Connections.Connected_Accounts')}
                        titleTypographyProps={{sx: {mb: 1}}}
                        subheader={
                            <Typography sx={{color: 'text.secondary'}}>
                                {t('Connections.Description_Display_Connected_Account')}
                            </Typography>
                        }
                    />
                    <CardContent>
                        {connectedAccountsArr.map(account => {
                            return (
                                <Box
                                    key={account.title}
                                    sx={{
                                        gap: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        '&:not(:last-of-type)': {mb: 4}
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Box sx={{mr: 4, display: 'flex', justifyContent: 'center'}}>
                                            <img src={account.logo} alt={account.title} height='30' width='30'/>
                                        </Box>
                                        <div>
                                            <Typography sx={{fontWeight: 500}}>{account.title}</Typography>
                                            <Typography variant='body2' sx={{color: 'text.disabled'}}>
                                                {account.subtitle}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Switch defaultChecked={account.checked}/>
                                </Box>
                            )
                        })}
                    </CardContent>
                </Card>
            </Grid>
            {/* Social Accounts Cards */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title={t('Connections.Social_Accounts')}
                        titleTypographyProps={{sx: {mb: 1}}}
                        subheader={
                            <Typography
                                sx={{color: 'text.secondary'}}>{t('Connections.Display_Social_Account')}</Typography>
                        }
                    />
                    <CardContent>
                        {socialAccountsArr.map(account => {
                            return (
                                <Box
                                    key={account.title}
                                    sx={{
                                        gap: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        '&:not(:last-of-type)': {mb: 4}
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Box sx={{mr: 4, minWidth: 45, display: 'flex', justifyContent: 'center'}}>
                                            <img src={account.logo} alt={account.title} height='30'/>
                                        </Box>
                                        <div>
                                            <Typography sx={{fontWeight: 500}}>{account.title}</Typography>
                                            {account.isConnected ? (
                                                <Typography
                                                    href='/'
                                                    component={Link}
                                                    onClick={e => e.preventDefault()}
                                                    sx={{color: 'primary.main', textDecoration: 'none'}}
                                                >
                                                    {account.username}
                                                </Typography>
                                            ) : (
                                                <Typography variant='body2' sx={{color: 'text.disabled'}}>
                                                    {t('Not_Connected')}
                                                </Typography>
                                            )}
                                        </div>
                                    </Box>
                                    <Button
                                        variant='outlined'
                                        sx={{p: 1.5, minWidth: 38}}
                                        color={account.isConnected ? 'error' : 'secondary'}
                                    >
                                        <Icon icon={account.isConnected ? 'tabler:trash' : 'tabler:link'}/>
                                    </Button>
                                </Box>
                            )
                        })}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default TabConnections
