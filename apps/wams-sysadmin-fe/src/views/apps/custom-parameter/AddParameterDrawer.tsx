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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppParameter, AppParameterRequest } from 'ims-shared/@core/types/ims/appParameterTypes'
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import CustomParameterApis from 'ims-shared/@core/api/ims/custom-parametre'
import DomainApis from 'ims-shared/@core/api/ims/domain'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  value: yup.string().required(),
  domain: yup.string().required(),
  description: yup.string().required()
})

interface SidebarAddParamType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddParam = (props: SidebarAddParamType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const onSubmit = async (data: AppParameterRequest) => {
    addParameterMutation.mutate(data)
    handleClose()
  }

  const addParameterMutation = useMutation({
    mutationFn: (params: AppParameterRequest) => CustomParameterApis(t).addCustomParameter(params),
    onSuccess: (res: AppParameter) => {
      handleClose()
      const cachedData: AppParameter[] = queryClient.getQueryData('parametres') || []
      const updatedData = [...cachedData, res]
      queryClient.setQueryData('parametres', updatedData)
    },
    onError: err => {
      console.error(err)
    }
  })

  const defaultValues: AppParameterRequest = {
    name: '',
    value: '',
    domain: domain,
    description: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    toggle()
    reset()
  }

  const { data: domainList, isLoading } = useQuery('domains', DomainApis(t).getDomains)

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
        <Typography variant='h6'>{t('Parameter.Add_Parameter')}</Typography>
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
                  {!isLoading && domainList && domainList.length > 0 ? (
                    domainList.map((domain: DomainType) => (
                      <MenuItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=''>
                      <em>{t('None')}</em>
                    </MenuItem>
                  )}
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
              name='value'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  multiline
                  InputProps={{ readOnly: false }}
                  label={t('Parameter.Value')}
                  onChange={onChange}
                  error={Boolean(errors.value)}
                />
              )}
            />
            {errors.value && <FormHelperText sx={{ color: 'error.main' }}>{errors.value.message}</FormHelperText>}
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

export default SidebarAddParam
