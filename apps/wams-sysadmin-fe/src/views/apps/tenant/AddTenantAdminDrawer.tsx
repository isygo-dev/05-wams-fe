import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { AdminTenantRequest, Tenant } from 'ims-shared/@core/types/ims/tenantTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TenantApis from '../../../../../../packages/ims-shared/@core/api/ims/tenant'

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string()
})

interface SidebarAddTenantType {
  open: boolean
  toggle: () => void
  dataTenant: Tenant | undefined
}

const AddTenantAdminDrawer = (props: SidebarAddTenantType) => {
  const { open, toggle, dataTenant } = props

  const { t } = useTranslation()

  const mutationAddAdminTenant = useMutation({
    mutationFn: (newMutation: AdminTenantRequest) => TenantApis(t).addTenantAdmin(newMutation, dataTenant?.tenant),
    onSuccess: () => {
      handleClose()
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: AdminTenantRequest) => {
    console.log(data)
    mutationAddAdminTenant.mutate(data)
  }

  let defaultValues: AdminTenantRequest = {
    firstName: '',
    lastName: '',
    email: dataTenant?.email,
    phone: dataTenant?.phone
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    defaultValues = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
    toggle()
    reset()
  }

  return (
    <Dialog open={open} maxWidth={'xs'} fullWidth onClose={handleClose} aria-labelledby='max-width-dialog-title'>
      <DialogTitle id='max-width-dialog-title'>{t('Tenant.Add_Admin')}</DialogTitle>
      <form
        onSubmit={handleSubmit(row => {
          onSubmit(row)
        })}
      >
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField disabled size='small' value={dataTenant?.tenant} label={t('Tenant.Tenant')} />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{ readOnly: false }}
                  label={t('First_Name')}
                  onChange={onChange}
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{ readOnly: false }}
                  label={t('Last_Name')}
                  onChange={onChange}
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <EmailInputMask value={value} onChange={onChange} error={Boolean(errors.email)} />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => (
                <MuiPhoneNumber
                  variant='outlined'
                  fullWidth
                  size='small'
                  defaultCountry={'tn'}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={e => {
                    const updatedValue = e.replace(/\s+/g, '')
                    setValue('phone', updatedValue)
                  }}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddTenantAdminDrawer
