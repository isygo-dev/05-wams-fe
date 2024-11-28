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
import {InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {PebConfigData, PebConfigType} from 'kms-shared/@core/types/kms/pebConfig'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import DomainApis from "ims-shared/@core/api/ims/domain";
import PebConfigApis from "kms-shared/@core/api/kms/peb-config";

interface SidebarAddPebType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  algorithm: yup.string().required(),
  keyObtentionIterations: yup.number().required().integer().positive(),
  saltGenerator: yup.string().required(),
  ivGenerator: yup.string().required(),
  providerClassName: yup.string().required(),
  providerName: yup.string().required(),
  poolSize: yup.number().required().integer().positive(),
  stringOutputType: yup.string().required()
})


const SidebarAddPeb = (props: SidebarAddPebType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()

  const {open, toggle, domain} = props

  const defaultValues = {
    domain: domain,
    algorithm: '',
    keyObtentionIterations: 0,
    saltGenerator: '',
    ivGenerator: '',
    providerClassName: '',
    providerName: '',
    poolSize: 0,
    stringOutputType: ''
  }

  const {data: domainList, isLoading} = useQuery(`domains`, () => DomainApis(t).getDomains())
  const mutation = useMutation({
    mutationFn: (data: PebConfigData) => PebConfigApis(t).addPebConfiguration(data),
    onSuccess: (res: PebConfigType) => {
      handleClose()
      const cachedData: PebConfigType[] = queryClient.getQueryData('PEB') || []
      const updatedData = [...cachedData]
      updatedData.push(res)

      queryClient.setQueryData('PEB', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: PebConfigData) => {
    mutation.mutate(data)
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
        <Typography variant='h6'>{t('PEB.Add_New_PEB_Config')}</Typography>
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
                  disabled={checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
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
            <InputLabel id='demo-simple-select-helper-label'>{t('algorithm')}</InputLabel>

            <Controller
              name='algorithm'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('PEB.algorithm')}
                  name='algorithm'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='PBEWITHMD5ANDDES'>PBEWITHMD5ANDDES</MenuItem>
                  <MenuItem value='PBEWITHMD5ANDTRIPLEDES'>PBEWITHMD5ANDTRIPLEDES</MenuItem>
                  <MenuItem value='PBEWITHSHA1ANDDESEDE'>PBEWITHSHA1ANDDESEDE</MenuItem>
                  <MenuItem value='PBEWITHSHA1ANDRC2_40'>PBEWITHSHA1ANDRC2_40</MenuItem>
                </Select>
              )}
            />
            {errors.algorithm && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.algorithm.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='keyObtentionIterations'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  value={value}
                  label={t('PEB.keyObtentionIterations')}
                  onChange={onChange}
                  placeholder={t('keyObtentionIterations') as string}
                  type='number'
                  id='textarea-standard-static'
                  error={Boolean(errors.keyObtentionIterations)}
                />
              )}
            />
            {errors.keyObtentionIterations && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.keyObtentionIterations.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('saltGenerator')}</InputLabel>
            <Controller
              name='saltGenerator'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('PEB.saltGenerator')}
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
            <InputLabel id='demo-simple-select-helper-label'>{t('ivGenerator')}</InputLabel>

            <Controller
              name='ivGenerator'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('PEB.ivGenerator')}
                  name='ivGenerator'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value='ByteArrayFixedIvGenerator'>ByteArrayFixedIvGenerator</MenuItem>
                  <MenuItem value='NoIvGenerator'>NoIvGenerator</MenuItem>
                  <MenuItem value='RandomIvGenerator'>RandomIvGenerator</MenuItem>
                  <MenuItem value='StringFixedIvGenerator'>StringFixedIvGenerator</MenuItem>
                </Select>
              )}
            />
            {errors.ivGenerator && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.ivGenerator.message}</FormHelperText>
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
                  label={t('PEB.providerClassName')}
                  onChange={onChange}
                  placeholder={t('providerClassName') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.ivGenerator)}
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
                  label={t('providerName')}
                  onChange={onChange}
                  placeholder={t('PEB.providerName') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.providerName)}
                />
              )}
            />
            {errors.providerName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.providerName.message}</FormHelperText>
            )}
          </FormControl>
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
                  label={t('poolSize')}
                  onChange={onChange}
                  placeholder={t('PEB.poolSize') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.poolSize)}
                />
              )}
            />
            {errors.poolSize && <FormHelperText sx={{color: 'error.main'}}>{errors.poolSize.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('stringOutputType')}</InputLabel>

            <Controller
              name='stringOutputType'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('PEB.stringOutputType')}
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

export default SidebarAddPeb
