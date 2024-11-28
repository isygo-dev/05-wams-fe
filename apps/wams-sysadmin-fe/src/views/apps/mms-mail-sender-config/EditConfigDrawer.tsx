// ** React Imports
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
import {MailSenderConfigData, MailSenderConfigTypes} from 'mms-shared/@core/types/mms/mailSenderConfigTypes'
import {useTranslation} from 'react-i18next'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import {useMutation, useQueryClient} from 'react-query'
import React from 'react'
import MailSenderConfigApis from "mms-shared/@core/api/mms/mail-sender-config";

interface SidebarEditConfigType {
  open: boolean
  toggle: () => void
  dataConfig: MailSenderConfigTypes | undefined
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string(),
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

const SidebarEditConfig = (props: SidebarEditConfigType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle} = props
  let defaultValues: MailSenderConfigTypes = {
    id: 0,
    domain: '',
    host: '',
    port: '',
    username: '',
    smtpAuth: '',
    password: '',
    transportProtocol: '',
    smtpStarttlsEnable: false,
    smtpStarttlsRequired: false,
    debug: false
  }

  if (open && props.dataConfig !== undefined) {
    defaultValues = {
      id: props.dataConfig.id,
      domain: props.dataConfig.domain,
      host: props.dataConfig.host,
      port: props.dataConfig.port,
      username: props.dataConfig.username,
      smtpAuth: props.dataConfig.smtpAuth,
      password: props.dataConfig.password,
      transportProtocol: props.dataConfig.transportProtocol,
      smtpStarttlsEnable: props.dataConfig.smtpStarttlsEnable,
      smtpStarttlsRequired: props.dataConfig.smtpStarttlsRequired,
      debug: props.dataConfig.debug
    }
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
    defaultValues
    toggle()
    reset()
  }

  const mutation = useMutation({
    mutationFn: (data: MailSenderConfigData) => MailSenderConfigApis(t).updateMailSenderConfiguration(data),
    onSuccess: (res: MailSenderConfigTypes) => {
      handleClose()
      const cachedConfigs: MailSenderConfigTypes[] = queryClient.getQueryData('configs') || []
      const index = cachedConfigs.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedConfigs = [...cachedConfigs]
        updatedConfigs[index] = res
        queryClient.setQueryData('configs', updatedConfigs)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: MailSenderConfigData) => {
    mutation.mutate(data)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Edit  Config')}</Typography>
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
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field}) => (
                <TextField
                  label={t('Domain.Domain')}
                  fullWidth
                  {...field}
                  variant='outlined'
                  size='small'
                  disabled={true}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='host'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
            {errors.host && <FormHelperText sx={{color: 'error.main'}}>{errors.host.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='username'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
            {errors.username && <FormHelperText sx={{color: 'error.main'}}>{errors.username.message}</FormHelperText>}
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
                  label={t('Config.password')}
                  onChange={onChange}
                  placeholder='password'
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{color: 'error.main'}}>{errors.password.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='port'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
                    e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  }}
                />
              )}
            />
            {errors.port && <FormHelperText sx={{color: 'error.main'}}>{errors.port.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='smtpAuth'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
            {errors.smtpAuth && <FormHelperText sx={{color: 'error.main'}}>{errors.smtpAuth.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='smtpStarttlsEnable'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange}/>}
                  label={t('Config.smtpStarttlsEnable')}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='smtpStarttlsRequired'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange}/>}
                  label={t('Config.smtpStarttlsRequired')}
                />
              )}
            />
            {errors.smtpStarttlsRequired && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.smtpStarttlsRequired.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='transportProtocol'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
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
              <FormHelperText sx={{color: 'error.main'}}>{errors.transportProtocol.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='debug'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <FormControlLabel control={<Switch checked={value} onChange={onChange}/>} label={t('Config.debug')}/>
              )}
            />
            {errors.debug && <FormHelperText sx={{color: 'error.main'}}>{errors.debug.message}</FormHelperText>}
          </FormControl>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarEditConfig
