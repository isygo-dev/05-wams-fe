// ** React Imports
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
import {useTranslation} from 'react-i18next'
import {useMutation, useQueryClient} from 'react-query'
import {CodificationTypes} from "ims-shared/@core/types/ims/nextCodeTypes";
import NextCodeApis from "kms-shared/@core/api/kms/next-code";

interface SidebarEditNextCodeType {
  open: boolean
  toggle: () => void
  dataNextCode: CodificationTypes | undefined

}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  code: yup.string().required(),
  domain: yup.string().required(),
  entity: yup.string().required(),
  prefix: yup.string().required(),
  suffix: yup.string().required(),
  value: yup.number().required().integer().positive(),
  valueLength: yup.number().required().integer().positive(),
  increment: yup.number().required().integer().positive(),
})

const SidebarEditNextCode = (props: SidebarEditNextCodeType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient();
  const {open, toggle} = props
  const defaultValues: CodificationTypes = {...props.dataNextCode}

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

  const mutation = useMutation({
    mutationFn: (data: CodificationTypes) => NextCodeApis(t).updateNextCode(data),
    onSuccess: (res: CodificationTypes) => {
      handleClose()
      const cachedCodes: CodificationTypes[] = queryClient.getQueryData('codes') || [];
      const index = cachedCodes.findIndex((obj) => obj.id === res.id);
      if (index !== -1) {
        const updatedCodes = [...cachedCodes];
        updatedCodes[index] = res;
        queryClient.setQueryData('codes', updatedCodes);
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: CodificationTypes) => {
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
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Codification.Edit_Next_Code')}</Typography>
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
              name='code'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('code')}
                  onChange={onChange}
                  placeholder={t('code') as string}
                  disabled={true}
                  error={Boolean(errors.code)}
                />
              )}
            />
            {errors.code && <FormHelperText sx={{color: 'error.main'}}>{errors.code.message}</FormHelperText>}
          </FormControl>
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
                  onChange={onChange}
                  placeholder='domain'
                  disabled={true}
                  error={Boolean(errors.domain)}
                />
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='entity'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Entity')}
                  onChange={onChange}
                  placeholder={t('Codification.Entity') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.entity)}
                />
              )}
            />
            {errors.entity && <FormHelperText sx={{color: 'error.main'}}>{errors.entity.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='attribute'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Attribute')}
                  onChange={onChange}
                  placeholder={t('Codification.Attribute') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.attribute)}
                />
              )}
            />
            {errors.attribute && <FormHelperText sx={{color: 'error.main'}}>{errors.attribute.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='prefix'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Prefix')}
                  onChange={onChange}
                  placeholder={t('Codification.Prefix') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.prefix)}
                />
              )}
            />
            {errors.prefix && <FormHelperText sx={{color: 'error.main'}}>{errors.prefix.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='suffix'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Suffix')}
                  onChange={onChange}
                  placeholder={t('Codification.Suffix') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.suffix)}
                />
              )}
            />
            {errors.suffix && <FormHelperText sx={{color: 'error.main'}}>{errors.suffix.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='value'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Value')}
                  onChange={onChange}
                  placeholder={t('Codification.Value') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.value)}
                />
              )}
            />
            {errors.value && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.value.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='valueLength'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.ValueLength')}
                  onChange={onChange}
                  placeholder={t('Codification.ValueLength') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.valueLength)}
                />
              )}
            />
            {errors.valueLength && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.valueLength.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='increment'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Codification.Increment')}
                  onChange={onChange}
                  placeholder={t('Codification.Increment') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.increment)}
                />
              )}
            />
            {errors.increment && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.increment.message}</FormHelperText>
            )}
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
  )
}

export default SidebarEditNextCode
