import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React, { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useTranslation } from 'react-i18next'
import { Avatar, InputLabel, MenuItem, Select } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CustomerDetailType } from 'ims-shared/@core/types/ims/customerTypes'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import { URL_PATTERN } from 'template-shared/@core/types/helper/patternTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import CustomerApis from 'ims-shared/@core/api/ims/customer'
import { AdminStatus } from 'ims-shared/@core/types/ims/accountTypes'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required(),
  description: yup.string(),
  adminStatus: yup.string(),
  domain: yup.string().required()
})

interface SidebarAddCustomerType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddCustomer = (props: SidebarAddCustomerType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }
  const { data: domainList, isLoading: isLoadingDomain } = useQuery('domains', DomainApis(t).getDomains)
  const mutationAdd = useMutation({
    mutationFn: (data: FormData) => CustomerApis(t).addCustomer(data),
    onSuccess: (res: CustomerDetailType) => {
      handleClose()
      const cachedData: CustomerDetailType[] = queryClient.getQueryData('customers') || []
      const updatedData = [...cachedData]
      updatedData.push(res)

      queryClient.setQueryData('customers', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: CustomerDetailType) => {
    const formData = new FormData()

    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('url', data.url)
    formData.append('description', data.description)
    formData.append('adminStatus', data.adminStatus)
    formData.append('domain', data.domain)

    mutationAdd.mutate(formData)
  }

  let defaultValues: CustomerDetailType = {
    name: '',
    url: '',
    description: '',
    adminStatus: AdminStatus.ENABLED,
    imagePath: '',
    email: '',
    phoneNumber: '',
    domain: domain
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
      name: '',
      url: '',
      description: '',
      adminStatus: AdminStatus.DISABLED,
      imagePath: '',
      domain: '',
      email: '',
      phoneNumber: ''
    }
    setSelectedFile(undefined)
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Customer.Add_Customer')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form
          onSubmit={handleSubmit(row => {
            onSubmit(row)
          })}
        >
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={
                    checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)
                      ? false
                      : true
                  }
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {!isLoadingDomain && domainList?.length > 0
                    ? domainList?.map((domain: DomainType) => (
                        <MenuItem key={domain.id} value={domain.name}>
                          {domain.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{ readOnly: false }}
                  label={t('Name')}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
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
              name='phoneNumber'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => (
                <MuiPhoneNumber
                  variant='outlined'
                  size='small'
                  defaultCountry={'tn'}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={e => {
                    const updatedValue = e.replace(/\s+/g, '')
                    setValue('phoneNumber', updatedValue)
                  }}
                  error={Boolean(errors.phoneNumber)}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='url'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Url')}
                  onChange={onChange}
                  error={Boolean(errors.url)}
                />
              )}
            />
            {errors.url && <FormHelperText sx={{ color: 'error.main' }}>{errors.url.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  multiline
                  rows={3}
                  InputProps={{ readOnly: false }}
                  label={t('Description')}
                  onChange={onChange}
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControlLabel
            labelPlacement='top'
            label={t('Status')}
            control={
              <Controller
                name='adminStatus'
                control={control}
                defaultValue={defaultValues.adminStatus}
                render={({ field: { value, onChange } }) => (
                  <Switch
                    checked={value == AdminStatus.ENABLED}
                    onChange={e => onChange(e.target.checked ? AdminStatus.ENABLED : AdminStatus.DISABLED)}
                  />
                )}
              />
            }
            sx={{ mb: 4, alignItems: 'flex-start', marginLeft: 0 }}
          />
          <FormControl fullWidth sx={{ mb: 4 }}>
            <label htmlFor='file' style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}>
              <Avatar
                src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                sx={{ cursor: 'pointer', mr: 2 }}
              ></Avatar>

              <Button
                color='primary'
                variant='outlined'
                component='span'
                sx={{ width: '100%' }}
                startIcon={<Icon icon='tabler:upload' />}
              >
                {t('Photo')}
              </Button>
              <input type='file' name='file' id='file' style={{ display: 'none' }} onChange={handleFileChange} />
            </label>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddCustomer
