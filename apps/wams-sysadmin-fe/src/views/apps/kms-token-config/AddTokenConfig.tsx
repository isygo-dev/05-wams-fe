// ** React Imports
import React from 'react'
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
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { TokenConfigType, TokenData } from 'kms-shared/@core/types/kms/tokenConfig'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import TokenConfigApis from 'kms-shared/@core/api/kms/token-config'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'

interface SidebarAddTokenConfigType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  issuer: yup.string().required(),
  audience: yup.string().required(),
  signatureAlgorithm: yup.string().required(),
  secretKey: yup.string().required(),
  tokenType: yup.string().required()
})

const SidebarAddToken = (props: SidebarAddTokenConfigType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const defaultValues: TokenData = {
    domain: domain,
    issuer: '',
    audience: '',
    signatureAlgorithm: '',
    secretKey: '',
    tokenType: ''
  }

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

  const { data: domainList, isLoading } = useQuery(`domains`, () => DomainApis(t).getDomains())
  const mutation = useMutation({
    mutationFn: (data: TokenData) => TokenConfigApis(t).addTokenConfiguration(data),
    onSuccess: (res: TokenConfigType) => {
      handleClose()
      const cachedData: TokenConfigType[] = queryClient.getQueryData('tokens') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('tokens', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: TokenData) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return !isLoading ? (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Token.Add_Token')}</Typography>
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
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='issuer'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Token.issuer')}
                  onChange={onChange}
                  placeholder={t('Token.issuer') as string}
                  error={Boolean(errors.issuer)}
                />
              )}
            />
            {errors.issuer && <FormHelperText sx={{ color: 'error.main' }}>{errors.issuer.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='audience'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Token.audience')}
                  onChange={onChange}
                  placeholder={t('Token.audience') as string}
                  error={Boolean(errors.audience)}
                />
              )}
            />
            {errors.audience && <FormHelperText sx={{ color: 'error.main' }}>{errors.audience.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Token.signatureAlgorithm')}</InputLabel>
            <Controller
              name='signatureAlgorithm'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Token.signatureAlgorithm')}
                  name='signatureAlgorithm'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='HS256'>HS256</MenuItem>
                  <MenuItem value='HS384'>HS384</MenuItem>
                  <MenuItem value='HS512'>HS512</MenuItem>
                  <MenuItem value='RS256'>RS256</MenuItem>
                  <MenuItem value='RS384'>RS384</MenuItem>
                  <MenuItem value='RS512'>RS512</MenuItem>
                  <MenuItem value='ES256'>ES256</MenuItem>
                  <MenuItem value='ES384'>ES384</MenuItem>
                  <MenuItem value='ES512'>ES512</MenuItem>
                  <MenuItem value='PS256'>PS256</MenuItem>
                  <MenuItem value='PS384'>PS384</MenuItem>
                  <MenuItem value='PS512'>PS512</MenuItem>
                </Select>
              )}
            />
            {errors.signatureAlgorithm && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.signatureAlgorithm.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='secretKey'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Token.secretKey')}
                  onChange={onChange}
                  placeholder={t('Token.secretKey') as string}
                  error={Boolean(errors.secretKey)}
                />
              )}
            />
            {errors.secretKey && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.secretKey.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Token.Token_Type')}</InputLabel>
            <Controller
              name='tokenType'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Token.Token_Type')}
                  name='tokenType'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value='JWT'>JWT</MenuItem>
                  <MenuItem value='RSTPWD'>RSTPWD</MenuItem>
                  <MenuItem value='TPSW'>TPSW</MenuItem>
                </Select>
              )}
            />
            {errors.tokenType && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tokenType.message}</FormHelperText>
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
  ) : null
}

export default SidebarAddToken
