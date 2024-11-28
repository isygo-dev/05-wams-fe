// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import {styled, useTheme} from '@mui/material/styles'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Layout Import
import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import {ResetPaswordParams, ResetPaswordRequest} from '../../../../context/types'

// ** Demo Imports
import FooterIllustrationsV2 from '../FooterIllustrationsV2'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {AccountDto} from "ims-shared/@core/types/ims/accountTypes";
import process from 'process'
import toast from 'react-hot-toast'
import localStorageKeys from '../../../../configs/localeStorage'
import imsApiUrls from "ims-shared/configs/ims_apis"

// Styled Components
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
    display: 'flex',
    fontSize: '1rem',
    alignItems: 'center',
    textDecoration: 'none',
    justifyContent: 'center',
    color: theme.palette.primary.main
}))

const schema = yup.object().shape({
    domain: yup.string().required(),
    userName: yup.string().required()
})

const defaultValues = {
    domain: typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(localStorageKeys.domain) : '',
    userName: typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(localStorageKeys.userName) : ''
}

const ForgotPasswordView = () => {
    // ** Hooks
    const theme = useTheme()
    const {t} = useTranslation()
    const router = useRouter()

    // ** Vars
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    const {
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: ResetPaswordParams) => {
        const restPasswordRequest: ResetPaswordRequest = {
            domain: data.domain,
            userName: data.userName,
            fullName: 'USER',
            application: process.env.NEXT_PUBLIC_APP_NAME || ''
        }
        sendForgetPWDRequest(restPasswordRequest)
            .then(() => {
                const redirectURL = '/info'
                toast.success(t('Forgot Password.send_successfully'))
                router.replace(redirectURL)
            })
            .catch(() => {
                setError('domain', {
                    type: 'manual',
                    message: 'Domain or Username or Password is invalid'
                })
            })
    }

    async function sendForgetPWDRequest(data: ResetPaswordRequest): Promise<AccountDto> {
        const response = await AppQuery(imsApiUrls.apiUrl_IMS_PasswordForgotten_EndPoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Request failed')
        }
        const result = await response.json()

        return result
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
                        <img src='/images/favicon-logo.png' alt='apple-touch-icon.png' width={216} height={'100%'}/>
                        <Box sx={{my: 6}}>
                            <Typography sx={{mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385}}>
                                {t('Forgot Password.Forgot Password')}? 🔒
                            </Typography>
                            <Typography sx={{color: 'text.secondary'}}>
                                {t('Forgot Password.Forgot Password Instructions')}
                            </Typography>
                        </Box>
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{mb: 4}}>
                                <Controller
                                    name='domain'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <TextField
                                            value={value}
                                            label={t('Domain.Domain')}
                                            onChange={onChange}
                                            placeholder={t('Domain.Domain') as string}
                                            error={Boolean(errors.domain)}
                                        />
                                    )}
                                />
                                {errors.domain &&
                                    <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth sx={{mb: 4}}>
                                <Controller
                                    name='userName'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <TextField
                                            value={value}
                                            label={t('Username')}
                                            onChange={onChange}
                                            placeholder={t('Username') as string}
                                            error={Boolean(errors.userName)}
                                        />
                                    )}
                                />
                                {errors.userName && (
                                    <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.userName.message}</FormHelperText>
                                )}
                            </FormControl>
                            <Button fullWidth size='large' type='submit' variant='contained' sx={{mb: 4}}>
                                {t('Forgot Password.Send Request Link')}
                            </Button>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '& svg': {mr: 1}
                                }}
                            >
                                <LinkStyled href='/login'>
                                    <Icon fontSize='1.25rem' icon='tabler:chevron-left'/>
                                    <span>{t('Forgot Password.Back to login')}</span>
                                </LinkStyled>
                            </Typography>
                        </form>
                    </Box>
                </Box>
            </RightWrapper>
        </Box>
    )
}

export default ForgotPasswordView
