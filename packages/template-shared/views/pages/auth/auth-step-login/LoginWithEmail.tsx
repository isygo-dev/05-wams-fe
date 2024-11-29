import React, {MouseEvent, useState} from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import {styled, useTheme} from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import MuiFormControlLabel, {FormControlLabelProps} from '@mui/material/FormControlLabel'
import Icon from 'template-shared/@core/components/icon'
import * as yup from 'yup'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {useMutation, useQueryClient} from 'react-query'
import localStorageKeys from '../../../../configs/localeStorage'
import {authRequestType} from 'ims-shared/@core/types/ims/auth/authRequestTypes'
import AuthApis from 'ims-shared/@core/api/ims/auth'
import Grid from '@mui/material/Grid'
import ContentLoginRegister from '../../../../@core/components/contentLoginRegister'

const RightWrapper = styled(Box)<BoxProps>(({theme}) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 450
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: 600
    },
    [theme.breakpoints.up('xl')]: {
        maxWidth: 750
    }
}))

const LinkStyled = styled(Link)(({theme}) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({theme}) => ({
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const schema = yup.object().shape({
    email: yup.string().email().required('Email is required')
})

const LoginPageViewByEmail = () => {
    const {t} = useTranslation()
    const [rememberMe, setRememberMe] = useState<boolean>(true)
    const router = useRouter()
    const theme = useTheme()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const queryClient = useQueryClient()
    const emailValue: string = typeof localStorage !== 'undefined' ? localStorage.getItem('email') : ''

    const defaultValues = {
        email: emailValue
    }

    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onLoginEmailMutation = useMutation(AuthApis(t).loginByEmail, {
        onSuccess: (res: any) => {
            console.log(res)
            const paginationSize = localStorage.getItem(localStorageKeys.paginationSize)
            if (!paginationSize || Number(paginationSize) < 9) {
                localStorage.setItem(localStorageKeys.paginationSize, '20')
            }
            if (res.length === 1) {
                const data: authRequestType = {
                    userName: res[0].code,
                    domain: res[0].domain
                }

                localStorage.setItem(localStorageKeys.domain, data.domain)
                localStorage.setItem(localStorageKeys.userName, data.userName)
                onLoginMutation.mutate(data)
            } else if (res.length > 1) {
                queryClient.setQueryData('account-domain', res)
                const serializedList = JSON.stringify(res)
                router.push({
                    pathname: '/auth-step-account-domain/',
                    query: {list: serializedList}
                })
            }
        },
        onError: (error: any) => {
            console.error('Login error: ', error)
        }
    })

    const onLoginMutation = useMutation({
        mutationFn: (data: authRequestType) => AuthApis(t).loginByDomainAndUserName(data),
        onSuccess: (res: any, data: authRequestType) => {
            if (res.authTypeMode === 'OTP') {
                sessionStorage.setItem(localStorageKeys.domain, data.domain)
                sessionStorage.setItem(localStorageKeys.otpLength, res.otpLength)
                sessionStorage.setItem(localStorageKeys.userName, data.userName)
                sessionStorage.setItem(localStorageKeys.authType, 'OTP')
                sessionStorage.setItem(localStorageKeys.rememberMe, String(rememberMe))
                const redirectURL = '/auth-step-otp-validation/'
                router.replace(redirectURL as string)
            } else if (res.authTypeMode === 'PWD') {
                sessionStorage.setItem(localStorageKeys.domain, data.domain)
                sessionStorage.setItem(localStorageKeys.userName, data.userName)
                sessionStorage.setItem(localStorageKeys.authType, 'PWD')
                sessionStorage.setItem(localStorageKeys.rememberMe, String(rememberMe))
                const redirectURL = '/auth-step-password-validation/'
                router.replace(redirectURL as string)
            } else if (res.authTypeMode === 'QRC') {
                sessionStorage.setItem(localStorageKeys.domain, data.domain)
                sessionStorage.setItem(localStorageKeys.userName, data.userName)
                sessionStorage.setItem(localStorageKeys.authType, 'QRC')
                sessionStorage.setItem(localStorageKeys.rememberMe, String(rememberMe))
                sessionStorage.setItem(localStorageKeys.token, res.qrCodeToken)
                const redirectURL = '/auth-step-qrc-validation/'
                router.replace(redirectURL as string)
            }
        }
    })

    const onSubmit = (data: { email: string }) => {
        if (rememberMe) {
            localStorage.removeItem(localStorageKeys.email)
            localStorage.setItem(localStorageKeys.email, data.email)
        }
        onLoginEmailMutation.mutate(data.email)
    }

    return (
        <Grid container spacing={3} minHeight={'100vh'} mt={0}>
            <Grid
                item
                md={6}
                sm={6}
                xs={12}
                xl={7}
                sx={{backgroundColor: 'background.paper', minHeight: '100vh', height: '100%'}}
            >
                <ContentLoginRegister hidden={hidden}/>
            </Grid>
            <Grid
                item
                md={hidden ? 12 : 6}
                sm={hidden ? 12 : 6}
                xs={hidden ? 12 : 12}
                xl={hidden ? 12 : 5}
                sx={{background: 'white'}}
            >
                <RightWrapper sx={{margin: 'auto', height: '100%'}}>
                    <Box
                        sx={{
                            p: [6, 12],
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box sx={{width: '100%', maxWidth: 400}}>
                            <img src='/images/favicon-horizontal-logo.png' alt='favicon-horizontal-logo.png' width={216}
                                 height={'100%'}/>
                            <Box sx={{my: 6}}>
                                <Typography sx={{mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385}}>
                                    {`${t('Welcome')}! 👋🏻`}
                                </Typography>
                                <Typography sx={{color: 'text.secondary'}}>{t('Login.sign-in')}</Typography>
                            </Box>
                            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                <FormControl fullWidth sx={{mb: 4}}>
                                    <Controller
                                        name='email'
                                        control={control}
                                        rules={{required: true}}
                                        render={({field: {value, onChange, onBlur}}) => (
                                            <TextField
                                                label={t('Email')}
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                id='form-props-read-only-input'
                                                error={Boolean(errors.email)}
                                            />
                                        )}
                                    />
                                    {errors.email && <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>}
                                </FormControl>
                                <Box
                                    sx={{
                                        mb: 1.75,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <FormControlLabel
                                        label={t('Login.Remember Me')}
                                        control={<Checkbox checked={rememberMe}
                                                           onChange={e => setRememberMe(e.target.checked)}/>}
                                    />
                                </Box>
                                <Button fullWidth size='large' type='submit' variant='contained' sx={{mb: 4}}>
                                    {t('Login.Login')}
                                </Button>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography sx={{
                                        color: 'text.secondary',
                                        mr: 2
                                    }}>{t('Login.New on our platform')}</Typography>
                                    <Typography variant='body2'>
                                        <LinkStyled href='/register' sx={{fontSize: '1rem'}}>
                                            {t('Login.Create an account')}
                                        </LinkStyled>
                                    </Typography>
                                </Box>
                                <Divider
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: 'text.disabled',
                                        '& .MuiDivider-wrapper': {px: 6},
                                        my: theme => `${theme.spacing(6)} !important`
                                    }}
                                >
                                    or
                                </Divider>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{color: '#497ce2'}}
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:facebook'/>
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{color: '#1da1f2'}}
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:twitter'/>
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                        sx={{color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300')}}
                                    >
                                        <Icon icon='mdi:github'/>
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{color: '#db4437'}}
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:google'/>
                                    </IconButton>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </RightWrapper>
            </Grid>
        </Grid>
    )
}

export default LoginPageViewByEmail
