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
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { ChangePasswordRequest } from '../../../../context/types'
import FooterIllustrationsV2 from '../FooterIllustrationsV2'
import * as process from 'process'
import { useMutation } from 'react-query'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AuthApis from 'ims-shared/@core/api/ims/auth'

interface State {
  showNewPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues = {
  newPassword: '',
  confirmNewPassword: ''
}

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
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

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6)

    /*.matches(
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character'
                            )*/

    .required(),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ResetPasswordPageView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showConfirmNewPassword: false
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  useEffect(() => {
    localStorage.clear()
    sessionStorage.clear()
  }, [])
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onPasswordFormSubmit = (data: any) => {
    const tokenParam = router.query.token || ''
    const resetPasswordRequestParam: ChangePasswordRequest = {
      token: tokenParam,
      password: data.newPassword,
      application: process.env.NEXT_PUBLIC_APP_NAME || ''
    }

    mutationResetPassword.mutate(resetPasswordRequestParam)
  }

  const mutationResetPassword = useMutation({
    mutationFn: (resetPasswordRequestParam: ChangePasswordRequest) =>
      AuthApis(t).resetPassword(resetPasswordRequestParam),
    onSuccess: () => {
      console.log('onSuccess')
      const redirectURL = '/login'
      router.replace(redirectURL)
    }
  })

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
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
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
            <svg width={34} height={23.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {t('Reset Password.Reset Password')}
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='input-new-password' error={Boolean(errors.newPassword)}>
                  {t('Reset Password.New Password')}
                </InputLabel>
                <Controller
                  name='newPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label={t('Reset Password.New Password')}
                      onChange={onChange}
                      id='input-new-password'
                      error={Boolean(errors.newPassword)}
                      type={values.showNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            {values ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.newPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='input-confirm-new-password' error={Boolean(errors.confirmNewPassword)}>
                  {t('Reset Password.Confirm New Password')}
                </InputLabel>
                <Controller
                  name='confirmNewPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label={t('Reset Password.Confirm New Password')}
                      onChange={onChange}
                      id='input-confirm-new-password'
                      error={Boolean(errors.confirmNewPassword)}
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleClickShowConfirmNewPassword}
                          >
                            {values ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmNewPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmNewPassword.message}</FormHelperText>
                )}
              </FormControl>

              {/* <Grid item xs={12}>
                                <Typography
                                    sx={{fontWeight: 500}}>{t('Reset Password.Password Requirements')}:</Typography>
                                <Box component='ul' sx={{pl: 6, mb: 0, '& li': {mb: 1.5, color: 'text.secondary'}}}>
                                    <li>{t('Reset Password.Requirement1')}</li>
                                    <li>{t('Reset Password.Requirement2')}</li>
                                    <li>{t('Reset Password.Requirement3')}</li>
                                </Box>
                            </Grid>*/}
              <Grid item xs={12}>
                <Button variant='contained' type='submit' sx={{ mr: 4 }}>
                  {t('Reset Password.Save Changes')}
                </Button>
                <Button type='reset' variant='outlined' color='secondary' onClick={() => reset()}>
                  {t('Reset Password.Reset')}
                </Button>
              </Grid>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

export default ResetPasswordPageView
