// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {URL_PATTERN} from 'template-shared/@core/types/helper/patternTypes'
import {StorageConfigType, StorageConfigTypeRequest} from 'sms-shared/@core/types/sms/storageTypes'
import {InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import DomainApis from "ims-shared/@core/api/ims/domain";
import StorageConfigApis from "sms-shared/@core/api/sms/storage-config";

const Header = styled(Box)<BoxProps>(({theme}) => ({
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

interface SidebarAddStorageConfigType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddStorageConfig = (props: SidebarAddStorageConfigType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle, domain} = props
  const {data: domainList, isLoading} = useQuery(`domains`, () => DomainApis(t).getDomains())
  const mutation = useMutation({
    mutationFn: (data: StorageConfigTypeRequest) => StorageConfigApis(t).addStorageConfiguration(data),
    onSuccess: (res: StorageConfigType) => {
      handleClose()
      const cachedData: StorageConfigType[] = queryClient.getQueryData('storageConfigs') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('storageConfigs', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: StorageConfigTypeRequest) => {
    mutation.mutate(data)
  }

  let defaultValues: StorageConfigTypeRequest = {
    domain: domain,
    url: '',
    type: '',
    userName: '',
    password: ''
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    defaultValues = {
      domain: '',
      url: '',
      type: '',
      userName: '',
      password: ''
    }
    toggle()
    reset()
  }

  return !isLoading ? (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Storage.Add_Storage_Configuration')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domainList?.map((domain: DomainType) => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Type')}</InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Storage.Type')}
                  name='type'
                  defaultValue=''
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
            {errors.type && <FormHelperText sx={{color: 'error.main'}}>{errors.type.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='url'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Url')}
                  onChange={onChange}
                  error={Boolean(errors.url)}
                />
              )}
            />
            {errors.url && <FormHelperText sx={{color: 'error.main'}}>{errors.url.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='userName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('User_Name')}
                  onChange={onChange}
                  error={Boolean(errors.userName)}
                />
              )}
            />
            {errors.userName && <FormHelperText sx={{color: 'error.main'}}>{errors.userName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='password'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Password.Password')}
                  onChange={onChange}
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{color: 'error.main'}}>{errors.password.message}</FormHelperText>}
          </FormControl>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  ) : null
}

export default SidebarAddStorageConfig
