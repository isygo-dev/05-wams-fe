// ** React Imports

// ** MUI Imports
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
import { TokenConfigType, TokenConfigTypes } from 'kms-shared/@core/types/kms/tokenConfig'
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import TokenConfigApis from 'kms-shared/@core/api/kms/token-config'

interface SidebarEditTokenType {
  open: boolean
  toggle: () => void
  dataToken: TokenConfigType | undefined
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  code: yup.string().required(),
  domain: yup.string().required(),
  issuer: yup.string().required(),
  audience: yup.string().required(),
  signatureAlgorithm: yup.string().required(),
  secretKey: yup.string().required(),
  tokenType: yup.string().required()
})

const SidebarEditToken = (props: SidebarEditTokenType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle } = props
  const defaultValues: TokenConfigTypes = { ...props.dataToken }
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
    mutationFn: (data: TokenConfigTypes) => TokenConfigApis(t).updateTokenConfiguration(data),
    onSuccess: (res: TokenConfigTypes) => {
      handleClose()
      const cachedTokens: TokenConfigTypes[] = queryClient.getQueryData('tokens') || []
      const index = cachedTokens.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedTokens = [...cachedTokens]
        updatedTokens[index] = res
        queryClient.setQueryData('tokens', updatedTokens)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: TokenConfigTypes) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    defaultValues
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
        <Typography variant='h6'> {t('Edit Token Config')}</Typography>
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
              name='code'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => <TextField size='small' disabled value={value} label={t('code')} />}
            />
            {errors.code && <FormHelperText sx={{ color: 'error.main' }}>{errors.code.message}</FormHelperText>}
          </FormControl>
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
            <Controller
              name='issuer'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  disabled
                  label={t('Token.issuer')}
                  onChange={onChange}
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
                  disabled
                  onChange={onChange}
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
                  label='secretKey'
                  onChange={onChange}
                  error={Boolean(errors.secretKey)}
                />
              )}
            />
            {errors.secretKey && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.secretKey.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Token Type')}</InputLabel>
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
  )
}

export default SidebarEditToken
