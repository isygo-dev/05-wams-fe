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
import { useTranslation } from 'react-i18next'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import { MailSenderConfigData } from 'mms-shared/@core/types/mms/mailSenderConfigTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import MailSenderConfigApis from 'mms-shared/@core/api/mms/mail-sender-config'

interface SidebarAddConfigType {
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
  host: yup.string().required(),
  port: yup.number().required().integer().positive(),
  username: yup.string().required(),
  password: yup.string().required(),
  smtpAuth: yup.string().required(),
  transportProtocol: yup.string().required(),
  smtpStarttlsEnable: yup.boolean().required(),
  smtpStarttlsRequired: yup.boolean().required(),
  debug: yup.boolean().required()
})

const SidebarAddConfig = (props: SidebarAddConfigType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const defaultValues = {
    domain: domain,
    host: '',
    port: '',
    smtpAuth: '',
    username: '',
    password: '',
    transportProtocol: '',
    smtpStarttlsEnable: false,
    smtpStarttlsRequired: false,
    debug: false
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

  const { data: domainList } = useQuery(`domains`, () => DomainApis(t).getDomains())
  const mutation = useMutation({
    mutationFn: (data: MailSenderConfigData) => MailSenderConfigApis(t).addMailSenderConfiguration(data),
    onSuccess: (res: MailSenderConfigData) => {
      handleClose()
      const cachedData: MailSenderConfigData[] = queryClient.getQueryData('configs') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('configs', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: MailSenderConfigData) => {
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
        <Typography variant='h6'>{t('Config.Add_Config')}</Typography>
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
              name='host'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Config.host')}
                  onChange={onChange}
                  placeholder='host'
                  error={Boolean(errors.host)}
                />
              )}
            />
            {errors.host && <FormHelperText sx={{ color: 'error.main' }}>{errors.host.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='username'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Config.username')}
                  onChange={onChange}
                  placeholder='username'
                  error={Boolean(errors.username)}
                />
              )}
            />
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
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
                  label={t('Config.password')}
                  onChange={onChange}
                  placeholder='password'
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='port'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Config.port')}
                  onChange={onChange}
                  placeholder='port'
                  error={Boolean(errors.port)}
                  inputProps={{
                    inputMode: 'numeric' // Hints to mobile devices to show a numeric keyboard
                  }}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Remove any non-numeric characters from the input value
                    e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  }}
                />
              )}
            />
            {errors.port && <FormHelperText sx={{ color: 'error.main' }}>{errors.port.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='smtpAuth'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Config.smtpAuth')}
                  onChange={onChange}
                  placeholder='smtpAuth'
                  error={Boolean(errors.smtpAuth)}
                />
              )}
            />
            {errors.smtpAuth && <FormHelperText sx={{ color: 'error.main' }}>{errors.smtpAuth.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='smtpStarttlsEnable'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label={t('Config.smtpStarttlsEnable')}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='smtpStarttlsRequired'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label={t('Config.smtpStarttlsRequired')}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='transportProtocol'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Config.transportProtocol')}
                  onChange={onChange}
                  placeholder='transportProtocol'
                  error={Boolean(errors.transportProtocol)}
                />
              )}
            />
            {errors.transportProtocol && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.transportProtocol.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='debug'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label={t('Config.debug')} />
              )}
            />
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

export default SidebarAddConfig
