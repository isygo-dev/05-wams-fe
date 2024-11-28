// ** React Imports
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, {useState} from 'react'

// ** MUI Imports
import Box, {BoxProps} from '@mui/material/Box'

// ** Third Party Imports
import * as yup from 'yup'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {styled, useTheme} from '@mui/material/styles'
import {LoginParams} from '../../../../context/types'
import FooterIllustrationsV2 from '../FooterIllustrationsV2'
import {useAuth} from '../../../../hooks/useAuth'
import Link from 'next/link'
import {useTranslation} from 'react-i18next'
import localStorageKeys from '../../../../configs/localeStorage'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const defaultValues = {
    password: ''
}
const ForgotPasswordIllustration = styled('img')(({theme}) => ({
    zIndex: 2,
    maxHeight: 650,
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
    [theme.breakpoints.down(1540)]: {
        maxHeight: 550
    },
    [theme.breakpoints.down('lg')]: {
        maxHeight: 500
    }
}))
const LinkStyled = styled(Link)(({theme}) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'end'
}))
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
const schema = yup.object().shape({
    password: yup
        .string()
        .min(6)

        /*  .matches(
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                        'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character'
                                    )*/

        .required()
})
const PasswordStepView = () => {
    const {t} = useTranslation()
    const theme = useTheme()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    // ** States
    const [values, setValues] = useState<boolean>()
    const auth = useAuth()

    // ** Hooks
    const {
        setError,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues, resolver: yupResolver(schema)})
    const handleClickShowNewPassword = () => {
        setValues(!values)
    }

    const onSubmit = (data: any) => {
        const request: LoginParams = {
            domain: sessionStorage.getItem(localStorageKeys.domain) || localStorage.getItem(localStorageKeys.domain) || '',
            application: process.env.NEXT_PUBLIC_APP_NAME || '',
            userName:
                sessionStorage.getItem(localStorageKeys.userName) || localStorage.getItem(localStorageKeys.userName) || '',
            password: data.password,
            authType: 'PWD',
            rememberMe: localStorage.getItem(localStorageKeys.rememberMe) == 'true'
        }
        console.log(request)
        auth.login(request, () => {
            setError('password', {
                type: 'manual',
                message: 'Domain or Username or Password is invalid'
            })
        })
    }

    return (
        <Box className='content-right' sx={{backgroundColor: 'background.paper'}}>
            {!hidden ? (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        borderRadius: '20px',
                        justifyContent: 'center',
                        backgroundColor: 'customColors.bodyBg',
                        margin: theme => theme.spacing(8, 0, 8, 8)
                    }}
                >
                    <ForgotPasswordIllustration
                        alt='forgot-password-illustration'
                        src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
                    />
                    <FooterIllustrationsV2/>
                </Box>
            ) : null}
            <RightWrapper>
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
                        <img src='/images/favicon-logo.png' alt={'favicon-logo.png'} width={216} height={'100%'}></img>
                        <Box sx={{my: 6}}>
                            <Typography sx={{mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385}}>
                                Login with password
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{mb: 4}}>
                                <InputLabel htmlFor='input-new-password' error={Boolean(errors.password)}>
                                    Enter your Password
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <OutlinedInput
                                            value={value}
                                            label='Password'
                                            onChange={onChange}
                                            id='input-new-password'
                                            error={Boolean(errors.password)}
                                            type={values ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={e => e.preventDefault()}
                                                    >
                                                        {values ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.password.message}</FormHelperText>
                                )}
                            </FormControl>
                            <LinkStyled href='/forgot-password'>{t('Forgot Password.Forgot Password')}?</LinkStyled>
                            <Grid item xs={12}>
                                <Button variant='contained' type='submit' sx={{mr: 4}}>
                                    Login
                                </Button>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </RightWrapper>
        </Box>
    )
}

export default PasswordStepView
