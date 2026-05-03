import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Icon from 'template-shared/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { AuthorType } from '../../../types/author'
import { addAuthor, updateAuthor } from '../../../api/author'
import { Avatar, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { Tenant } from 'ims-shared/@core/types/ims/tenantTypes'
import TenantApis from '../../../../../../packages/ims-shared/@core/api/ims/tenant'
import apiUrls from '../../../config/apiUrl'
import MuiPhoneNumber from 'material-ui-phone-number'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddAuthorDrawer = ({ author, showDialogue, setShowDialogue }) => {
  const { t } = useTranslation()
  const { data: tenantList } = useQuery('tenants', TenantApis(t).getTenants)
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const schema = yup.object().shape({
    firstname: yup.string().required(t('firstname is required')),
    lastname: yup.string().required(t('lastname is required')),
    phone: yup.string().required(t('Phone Number is required')),
    tenant: yup.string().required(t('Tenant is required')),
    email: yup.string().required(t('E-mail is required'))
  })
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('file changed', event)

    const file = event.target.files?.[0]
    setSelectedFile(file)
  }
  const handleClose = () => {
    setShowDialogue(false)
    reset()
  }
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AuthorType>({
    defaultValues: author,
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: AuthorType) => {
    console.log(' Data sent to API:', data)
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }
    formData.append('firstname', data.firstname)
    formData.append('lastname', data.lastname)
    formData.append('phone', data.phone)
    formData.append('tenant', data.tenant)
    formData.append('email', data.email)

    if (author?.id) {
      updateAuthorMutation.mutate({ ...data, id: author.id })
    } else {
      addAuthorMutation.mutate(formData)
    }
  }

  const addAuthorMutation = useMutation({
    mutationFn: (formData: FormData) => addAuthor(formData),
    onSuccess: (res: AuthorType) => {
      if (res) {
        queryClient.invalidateQueries('AuthorType')
        queryClient.setQueryData('authorList', (oldData: AuthorType[] = []) => [...oldData, res])
        toast.success('Author added successfully')
        handleClose()
      }
    }
  })

  const updateAuthorMutation = useMutation({
    mutationFn: (data: AuthorType) => {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })

      return updateAuthor(formData)
    },
    onSuccess: (res: AuthorType) => {
      if (res) {
        queryClient.invalidateQueries('AuthorType')
        const cachedData: AuthorType[] = queryClient.getQueryData('authorList') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedData = [...cachedData]
          updatedData[index] = res
          queryClient.setQueryData('authorList', updatedData)
        }
        toast.success('Author updated successfully')
        handleClose()
      }
    }
  })

  return (
    <Drawer
      open={showDialogue}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t(author?.id ? 'Update' : 'Add')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }} size='small'>
            <InputLabel id='Tenant-select-label'>{t('Tenant.Tenant')}</InputLabel>
            <Controller
              name='tenant'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId='Tenant-select-label'
                  disabled={!checkPermission(PermissionApplication.IMS, PermissionPage.TENANT, PermissionAction.WRITE)}
                  size='small'
                  label={t('Tenant')}
                  name='Tenant'
                  onChange={onChange}
                  value={value || ''}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {tenantList?.map((tenant: Tenant) => (
                    <MenuItem key={tenant.id} value={tenant.name}>
                      {tenant.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.tenant && <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='firstname'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label={t('FirstName')}
                  placeholder={t('Enter firstname')}
                  error={Boolean(errors.firstname)}
                  helperText={errors.firstname?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lastname'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label={t('LastName')}
                  placeholder={t('Enter lastname')}
                  error={Boolean(errors.lastname)}
                  helperText={errors.lastname?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label={t('email')}
                  placeholder={t('Enter email')}
                  error={Boolean(errors.email)}
                  helperText={errors.lastname?.message}
                />
              )}
            />
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

          <FormControl fullWidth sx={{ mb: 4 }}>
            <label htmlFor='file' style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}>
              <Avatar
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${apiUrls.apiUrl_smekit_Author_Image_Endpoint}/${author?.id}`
                }
                sx={{ cursor: 'pointer' }}
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

export default AddAuthorDrawer
