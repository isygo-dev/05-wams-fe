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
import {PasswordConfigType} from 'kms-shared/@core/types/kms/passwordConfigTypes'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useTranslation} from 'react-i18next'
import {useMutation, useQueryClient} from 'react-query'
import PasswordConfigApis from "kms-shared/@core/api/kms/password-config";

interface SidebarEditPwdConfigType {
  open: boolean
  toggle: () => void
  dataPwdConfig: PasswordConfigType | undefined
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  type: yup.string().required(),
  pattern: yup.string().required(),
  charSetType: yup.string().required(),
  initial: yup.string().required(),
  minLength: yup.number().required(),
  maxLength: yup.number().required(),
  lifeTime: yup.number().required()
})

const SidebarEditPwdConfig = (props: SidebarEditPwdConfigType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle} = props
  const defaultValues = props.dataPwdConfig
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

  const onSubmit = (data: PasswordConfigType) => {
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: (data: PasswordConfigType) => PasswordConfigApis(t).updatePasswordConfiguration(data),
    onSuccess: res => {
      handleClose()
      const cachedPasswordConfigs: PasswordConfigType[] = queryClient.getQueryData('passwordConfigs') || []
      const index = cachedPasswordConfigs.findIndex((obj: PasswordConfigType) => obj.id === res.id)
      if (index !== -1) {
        const updatedPasswordConfigs = [...cachedPasswordConfigs]
        updatedPasswordConfigs[index] = res
        queryClient.setQueryData('passwordConfigs', updatedPasswordConfigs)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

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
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Password.Edit_Password_Config')}</Typography>
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
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  disabled
                  error={Boolean(errors.domain)}
                />
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel
              id='validation-type-select'
              error={Boolean(errors.type)}
              htmlFor='validation-type-select'
            >
              {t('Password.Type')}
            </InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  value={value}
                  label='type'
                  onChange={e => {
                    onChange(e)
                  }}
                  error={Boolean(errors.type)}
                  labelId='validation-type-select'
                  aria-describedby='validation-type-select'
                >
                  <MenuItem value='PWD'>PWD</MenuItem>
                  <MenuItem value='OTP'>OTP</MenuItem>
                  <MenuItem value='QRC'>QRC</MenuItem>
                  <MenuItem value='TOKEN'>TOKEN</MenuItem>
                </Select>
              )}
            />
            {errors.type && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-type-select'>
                This type is required
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='pattern'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Password.Pattern')}
                  onChange={onChange}
                  placeholder='enter pattern'
                  error={Boolean(errors.pattern)}
                />
              )}
            />
            {errors.pattern && <FormHelperText sx={{color: 'error.main'}}>{errors.pattern.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel
              id='validation-type-select'
              error={Boolean(errors.charSetType)}
              htmlFor='validation-type-select'
            >
              {t('Password.CharSetType')}
            </InputLabel>
            <Controller
              name='charSetType'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  value={value}
                  label='charSetType'
                  onChange={e => {
                    onChange(e)
                  }}
                  error={Boolean(errors.charSetType)}
                  labelId='validation-type-select'
                  aria-describedby='validation-type-select'
                >
                  <MenuItem value='ALL'>ALL</MenuItem>
                  <MenuItem value='NUMERIC'>NUMERIC</MenuItem>
                  <MenuItem value='ALPHA'>ALPHA</MenuItem>
                  <MenuItem value='ALPHANUM'>ALPHANUM</MenuItem>
                </Select>
              )}
            />
            {errors.charSetType && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-type-select'>
                This type is required
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='initial'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='text'
                  value={value}
                  label={t('Password.Initial')}
                  onChange={onChange}
                  placeholder='enter initial password'
                  error={Boolean(errors.initial)}
                />
              )}
            />
            {errors.initial && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.initial.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='minLength'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='number'
                  value={value}
                  label={t('Password.MinLength')}
                  onChange={onChange}
                  placeholder='enter minLength'
                  error={Boolean(errors.minLength)}
                />
              )}
            />
            {errors.minLength && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.minLength.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='maxLength'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='number'
                  value={value}
                  label={t('Password.MaxLength')}
                  onChange={onChange}
                  placeholder='enter maxLength'
                  error={Boolean(errors.maxLength)}
                />
              )}
            />
            {errors.maxLength && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.maxLength.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='lifeTime'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='number'
                  value={value}
                  label={t('Password.LifeTime')}
                  onChange={onChange}
                  placeholder='enter lifeTime'
                  error={Boolean(errors.lifeTime)}
                />
              )}
            />
            {errors.lifeTime && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.lifeTime.message}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              Submit
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

export default SidebarEditPwdConfig
