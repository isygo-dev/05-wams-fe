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
import {DigestConfigType, DigestConfigTypes} from 'kms-shared/@core/types/kms/DigestConfig'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import {useTranslation} from 'react-i18next'
import {InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useMutation, useQueryClient} from 'react-query'
import DigesterConfigApis from "kms-shared/@core/api/kms/digest-config";

interface SidebarEditPebType {
  open: boolean
  toggle: () => void
  dataDigest: DigestConfigTypes | undefined

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
  algorithm: yup.string().required(),
  iterations: yup.number().required().integer().positive(),
  saltSizeBytes: yup.number().required().integer().positive(),
  saltGenerator: yup.string().required(),
  providerClassName: yup.string().required(),
  providerName: yup.string().required(),
  invertPositionOfSaltInMessageBeforeDigesting: yup.boolean().required(),
  invertPositionOfPlainSaltInEncryptionResults: yup.boolean().required(),
  useLenientSaltSizeCheck: yup.boolean().required(),
  poolSize: yup.number().required().integer().positive(),
  unicodeNormalizationIgnored: yup.boolean().required(),
  stringOutputType: yup.string().required(),
  prefix: yup.string().required(),
  suffix: yup.string().required()
})

const SidebarEditDigest = (props: SidebarEditPebType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient();
  const {open, toggle} = props
  const defaultValues: DigestConfigType = {...props.dataDigest}
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
    mutationFn: (data: DigestConfigType) => DigesterConfigApis(t).updateDigestConfiguration(data),
    onSuccess: (res: DigestConfigTypes) => {
      handleClose()
      const cachedDigests: DigestConfigTypes[] = queryClient.getQueryData('digests') || [];
      const index = cachedDigests.findIndex((obj) => obj.id === res.id);
      if (index !== -1) {
        const updatedDigests = [...cachedDigests];
        updatedDigests[index] = res;
        queryClient.setQueryData('digests', updatedDigests);
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: DigestConfigType) => {
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
        <Typography variant='h6'>{t('Digest.Edit_Digest_Config')}</Typography>
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
            <InputLabel id='demo-simple-select-helper-label'>{t('algorithm')}</InputLabel>

            <Controller
              name='algorithm'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Digest.algorithm')}
                  name='algorithm'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='MD2'>MD2</MenuItem>
                  <MenuItem value='MD5'>MD5</MenuItem>
                  <MenuItem value='SHA'>SHA</MenuItem>
                  <MenuItem value='SHA_256'>SHA-256</MenuItem>
                  <MenuItem value='SHA_384'>SHA-384</MenuItem>
                  <MenuItem value='SHA_512'>SHA-512</MenuItem>
                </Select>
              )}
            />
            {errors.algorithm && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.algorithm.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='iterations'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('iterations')}
                  onChange={onChange}
                  placeholder={t('Digest.iterations') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.iterations)}
                />
              )}
            />
            {errors.iterations && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.iterations.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='saltSizeBytes'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Digest.saltSizeBytes')}
                  onChange={onChange}
                  placeholder={t('saltSizeBytes') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.saltSizeBytes)}
                />
              )}
            />
            {errors.saltSizeBytes && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.saltSizeBytes.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Digest.saltGenerator')}</InputLabel>
            <Controller
              name='saltGenerator'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Digest.saltGenerator')}
                  name='saltGenerator'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='ByteArrayFixedSaltGenerator'>ByteArrayFixedSaltGenerator</MenuItem>
                  <MenuItem value='RandomSaltGenerator'>RandomSaltGenerator</MenuItem>
                  <MenuItem value='StringFixedSaltGenerator'>StringFixedSaltGenerator</MenuItem>
                  <MenuItem value='ZeroSaltGenerator'>ZeroSaltGenerator</MenuItem>
                </Select>
              )}
            />
            {errors.saltGenerator && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.saltGenerator.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='providerClassName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Digest.providerClassName')}
                  onChange={onChange}
                  placeholder={t('Digest.providerClassName') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.providerClassName)}
                />
              )}
            />
            {errors.providerClassName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.providerClassName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='providerName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('Digest.providerName')}
                  onChange={onChange}
                  placeholder={t('Digest.providerName') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.providerName)}
                />
              )}
            />
            {errors.providerName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.providerName.message}</FormHelperText>
            )}
          </FormControl>
          <FormGroup>
            <FormControl fullWidth sx={{mb: 4}}>
              <Controller
                name='invertPositionOfSaltInMessageBeforeDigesting'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={onChange}/>}
                    label={t('Digest.invertPositionOfSaltInMessageBeforeDigesting')}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{mb: 4}}>
              <Controller
                name='invertPositionOfPlainSaltInEncryptionResults'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={onChange}/>}
                    label={t('Digest.invertPositionOfPlainSaltInEncryptionResults')}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{mb: 4}}>
              <Controller
                name='useLenientSaltSizeCheck'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={onChange}/>}
                    label={t('Digest.useLenientSaltSizeCheck')}
                  />
                )}
              />
            </FormControl>
          </FormGroup>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='poolSize'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  type='number'
                  label={t('Digest.Poolsize')}
                  onChange={onChange}
                  placeholder={t('Digest.poolSize') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.poolSize)}
                />
              )}
            />
            {errors.poolSize && <FormHelperText sx={{color: 'error.main'}}>{errors.poolSize.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='unicodeNormalizationIgnored'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange}/>}
                  label={t('Digest.unicodeNormalizationIgnored')}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Digest.stringOutputType')}</InputLabel>

            <Controller
              name='stringOutputType'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Digest.stringOutputType')}
                  name='stringOutputType'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='Base64'>Base64</MenuItem>
                  <MenuItem value='Hexadecimal'>Hexadecimal</MenuItem>
                </Select>
              )}
            />
            {errors.stringOutputType && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.stringOutputType.message}</FormHelperText>
            )}
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
                  label={t('Digest.prefix')}
                  onChange={onChange}
                  placeholder={t('Digest.prefix') as string}
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
                  label={t('Digest.suffix')}
                  onChange={onChange}
                  placeholder={t('Digest.suffix') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.suffix)}
                />
              )}
            />
            {errors.suffix && <FormHelperText sx={{color: 'error.main'}}>{errors.suffix.message}</FormHelperText>}
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

export default SidebarEditDigest
