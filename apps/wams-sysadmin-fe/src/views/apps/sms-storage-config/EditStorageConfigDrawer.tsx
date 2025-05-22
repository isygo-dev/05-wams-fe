import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { URL_PATTERN } from 'template-shared/@core/types/helper/patternTypes'
import { StorageConfigType, StorageConfigTypes } from 'sms-shared/@core/types/sms/storageTypes'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useMutation, useQueryClient } from 'react-query'
import StorageConfigApis from 'sms-shared/@core/api/sms/storage-config'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  type: yup.string().required(),
  userName: yup.string().required(),
  password: yup.string().required()
})

interface SidebarEditDomainType {
  open: boolean
  dataStorageConfig: StorageConfigType | undefined
  toggle: () => void
}

const SidebarEditStorageConfig = (props: SidebarEditDomainType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, dataStorageConfig } = props
  const defaultValues: StorageConfigTypes | undefined = { ...dataStorageConfig }
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const mutation = useMutation({
    mutationFn: (data: StorageConfigTypes) => StorageConfigApis(t).updateStorageConfiguration(data),
    onSuccess: (res: StorageConfigTypes) => {
      handleClose()
      const cachedStorages: StorageConfigTypes[] = queryClient.getQueryData('storageConfigs') || []
      const index = cachedStorages.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedStorages = [...cachedStorages]
        updatedStorages[index] = res
        queryClient.setQueryData('storageConfigs', updatedStorages)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: StorageConfigTypes) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
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
        <Typography variant='h6'>{t('Storage.Edit_StorageConfiguration')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Domain.Domain')}
                  disabled
                  onChange={onChange}
                  error={Boolean(errors.domain)}
                />
              )}
            />
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Type')}</InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Type')}
                  name='type'
                  defaultValue='MINIO_STORAGE'
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem key='MINIO_STORAGE' value='MINIO_STORAGE'>
                    MinIO Storage
                  </MenuItem>
                  <MenuItem key='LAKEFS_STORAGE' value='LAKEFS_STORAGE' disabled>
                    LakeFS Storage
                  </MenuItem>
                  <MenuItem key='CEPH_STORAGE' value='CEPH_STORAGE' disabled>
                    Ceph Storage
                  </MenuItem>
                  <MenuItem key='OPENIO_STORAGE' value='OPENIO_STORAGE' disabled>
                    OpenIO Storage
                  </MenuItem>
                </Select>
              )}
            />
            {errors.type && <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>}
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
              name='userName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('User_Name')}
                  onChange={onChange}
                  error={Boolean(errors.userName)}
                />
              )}
            />
            {errors.userName && <FormHelperText sx={{ color: 'error.main' }}>{errors.userName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Password.Password')}
                  onChange={onChange}
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
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

export default SidebarEditStorageConfig
