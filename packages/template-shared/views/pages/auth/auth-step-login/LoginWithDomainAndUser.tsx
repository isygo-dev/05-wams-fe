// ** React Imports
import React, { useState } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Third Party Imports
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useSettings } from 'template-shared/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from '../FooterIllustrationsV2'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { authRequestType } from 'ims-shared/@core/types/ims/auth/authRequestTypes'
import localStorageKeys from '../../../../configs/localeStorage'
import AuthApis from 'ims-shared/@core/api/ims/auth'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  userName: yup.string().required()
})

const LoginPageView = () => {
  const { t } = useTranslation()
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const domainFromLocalStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('domain') : null
  const userNameFromLocalStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null

  const defaultValues = {
    domain: domainFromLocalStorage !== null ? domainFromLocalStorage : '',
    userName: userNameFromLocalStorage !== null ? userNameFromLocalStorage : ''
  }
  console.log(defaultValues)
  const { skin } = settings
  const {
    control,

    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onLoginMutation = useMutation({
    mutationFn: (data: authRequestType) => AuthApis(t).loginByDomainAndUserName(data),
    onSuccess: (res: any, data: authRequestType) => {
      if (res.authTypeMode === 'OTP') {
        localStorage.clear()
        localStorage.setItem(localStorageKeys.domain, data.domain)
        localStorage.setItem(localStorageKeys.userName, data.userName)
        localStorage.setItem(localStorageKeys.authType, 'OTP')
        localStorage.setItem(localStorageKeys.rememberMe, String(rememberMe))
        const redirectURL = '/auth-step-otp-validation/'
        router.replace(redirectURL as string)
      } else if (res.authTypeMode === 'PWD') {
        localStorage.clear()
        localStorage.setItem(localStorageKeys.domain, data.domain)
        localStorage.setItem(localStorageKeys.userName, data.userName)
        localStorage.setItem(localStorageKeys.authType, 'PWD')
        localStorage.setItem(localStorageKeys.rememberMe, String(rememberMe))
        const redirectURL = '/auth-step-password-validation/'
        router.replace(redirectURL as string)
      } else if (res.authTypeMode === 'QRC') {
        localStorage.clear()
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

  function onSubmit(data: authRequestType) {
    onLoginMutation.mutate(data)
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
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
          <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} />
          <FooterIllustrationsV2 />
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
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <img
              src='/images/favicon-vertical-logo.png'
              alt={'favicon-horizontal-logo.png'}
              width={216}
              height={'100%'}
            ></img>
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {`${t('Welcome')}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('Login.sign-in')}</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='domain'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label={t('Domain.Domain')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.domain)}
                    />
                  )}
                />
                {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='userName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label={t('Username')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.userName)}
                    />
                  )}
                />
                {errors.userName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.userName.message}</FormHelperText>
                )}
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
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
              </Box>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                {t('Login.Login')}
              </Button>
              {/*                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{color: 'text.secondary', mr: 2}}>{t('Login.New on our platform')}</Typography>
                                <Typography variant='body2'>
                                    <LinkStyled href='/register' sx={{fontSize: '1rem'}}>
                                        {t('Login.Create an account')}
                                    </LinkStyled>
                                </Typography>
                            </Box>*/}
              {/*<Divider
                                sx={{
                                    fontSize: '0.875rem',
                                    color: 'text.disabled',
                                    '& .MuiDivider-wrapper': {px: 6},
                                    my: theme => `${theme.spacing(6)} !important`
                                }}
                            >
                                or
                            </Divider>*/}
              {/*<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                            </Box>*/}
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

export default LoginPageView
