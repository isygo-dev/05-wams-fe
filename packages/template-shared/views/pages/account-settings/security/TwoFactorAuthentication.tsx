import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Icon from 'template-shared/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'
import localStorageKeys from '../../../../configs/localeStorage'
import { AccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import AccountApis from 'ims-shared/@core/api/ims/account'

interface SetUpdateAuthTypeProps {
  setUpdateAuthType: (val: string) => void
  user: AccountDto
  myProfile: boolean
  authType: string
}

const TwoFactorAuthenticationCard = ({ setUpdateAuthType, user, myProfile, authType }: SetUpdateAuthTypeProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [openDialog1, setOpenDialog1] = useState<boolean>(false)
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues: { phoneNumber: '' } })
  const toggle2FADialog = () => setOpen(!open)
  const openDialog = () => setOpenDialog1(!openDialog1)
  const close2FADialog = () => {
    toggle2FADialog()
    setOpenDialog1(false)
    clearErrors('phoneNumber')
    setValue('phoneNumber', '')
  }
  const handleCloseDialog1 = () => {
    openDialog()
  }
  const updateAuthType = async () => {
    const result = AccountApis(t).updateAuthType({ domain: user.domain, userName: user.code })
    setOpen(false)
    setOpenDialog1(false)
    if (result) {
      if (myProfile) {
        if (authType == 'OTP') {
          authType = 'PWD'
          setUpdateAuthType('PWD')
          sessionStorage.removeItem(localStorageKeys.authType)
          sessionStorage.setItem(localStorageKeys.authType, 'PWD')
        } else {
          authType = 'OTP'
          setUpdateAuthType('OTP')
          sessionStorage.removeItem(localStorageKeys.authType)
          sessionStorage.setItem(localStorageKeys.authType, 'OTP')
        }
      } else {
        if (authType == 'OTP') {
          authType = 'PWD'
          setUpdateAuthType('PWD')
        } else {
          authType = 'OTP'
          setUpdateAuthType('OTP')
        }
      }
    } else {
      toast.error('Error !!')
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={t('Account.Two_Steps_Verification')} />
        <CardContent>
          <Typography sx={{ mb: 4, fontWeight: 500 }}>{t('Account.Tow_Factor_Not_Enabled')}</Typography>
          <Typography sx={{ mb: 6, width: ['100%', '100%', '75%'], color: 'text.secondary' }}>
            {t('Account.Description_Two_Factor_Authentication')}
            <Box
              href='/'
              component={'a'}
              onClick={e => e.preventDefault()}
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              {t('Learn_More')}.
            </Box>
          </Typography>
          <Button variant='contained' onClick={handleCloseDialog1}>
            {authType !== 'OTP' ? (
              <span>{t('Account.Enable_Fwo_Factor_Authentication')} </span>
            ) : (
              <span> {t('Account.Disable_Fwo_Factor_Authentication')}</span>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog
        fullWidth
        open={openDialog1}
        onClose={handleCloseDialog1}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              {t('Are you sure')}
            </Typography>
            <Typography> {t('Account.Update_the_Factor_Authentication')}</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant='contained'
            sx={{ mr: 2 }}
            onClick={() => {
              authType !== 'OTP' ? toggle2FADialog() : updateAuthType()
            }}
          >
            {t('Update')}
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleCloseDialog1()}>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={open} onClose={toggle2FADialog}>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ mb: 12, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h5' sx={{ fontSize: '1.625rem' }}>
              {t('Account.Enable_One_Time_Password')}
            </Typography>
          </Box>

          <IconButton size='small' onClick={close2FADialog} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='tabler:x' />
          </IconButton>

          <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>{t('Account.Verify_Mobile_Number')}</Typography>
          <Typography sx={{ mt: 4, mb: 6 }}>{t('Account.Description_Verify_Mobile_Number')}</Typography>

          <form>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel htmlFor='opt-phone-number' error={Boolean(errors.phoneNumber)}>
                {t('Phone_Number')}
              </InputLabel>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    type='number'
                    value={value}
                    onChange={onChange}
                    label='Phone Number'
                    id='opt-phone-number'
                    placeholder='202 555 0111'
                    error={Boolean(errors.phoneNumber)}
                    startAdornment={<InputAdornment position='start'>+1</InputAdornment>}
                  />
                )}
              />
              {errors.phoneNumber && (
                <FormHelperText sx={{ color: 'error.main' }}>{t('Account.Error_Phone_Number')}</FormHelperText>
              )}
            </FormControl>
            <div>
              <Button variant='contained' sx={{ mr: 3.5 }} onClick={updateAuthType}>
                {t('Submit')}
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={close2FADialog}>
                {t('Cancel')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TwoFactorAuthenticationCard
