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
import {DomainType, DomainTypeRequest} from "ims-shared/@core/types/ims/domainTypes";
import React, {useState} from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import {useTranslation} from 'react-i18next'
import {URL_PATTERN} from 'template-shared/@core/types/helper/patternTypes'
import {Avatar, InputLabel, MenuItem, Select} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {AdminStatus} from "ims-shared/@core/types/ims/accountTypes";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import DomainApis from "ims-shared/@core/api/ims/domain";

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  domain: yup.string(),
  description: yup.string(),
  adminStatus: yup.string(),
  email: yup.string().email().required(),
  phone: yup.string()
})

interface SidebarAddDomainType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddDomain = (props: SidebarAddDomainType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle, domain} = props
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const {data: domainList, isLoading} = useQuery('domains', DomainApis(t).getDomains)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const mutationAdd = useMutation({
    mutationFn: (data: FormData) => DomainApis(t).addDomain(data),
    onSuccess: (res: DomainType) => {
      handleClose()
      const cachedData: DomainType[] = queryClient.getQueryData('domains') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('domains', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: DomainTypeRequest) => {
    console.log(data)
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }
    formData.append('name', data.name)
    formData.append('url', data.url)
    formData.append('description', data.description)
    formData.append('adminStatus', data.adminStatus)
    formData.append('domain', data.domain)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    mutationAdd.mutate(formData)
  }

  let defaultValues: DomainTypeRequest = {
    name: '',
    url: '',
    email: '',
    phone: '',
    description: '',
    domain: domain,
    adminStatus: AdminStatus.ENABLED
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    defaultValues = {
      name: '',
      url: '',
      domain: '',
      description: '',
      adminStatus: AdminStatus.DISABLED,
      email: '',
      phone: ''
    }
    setSelectedFile(undefined)
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
        <Typography variant='h6'>{t('Domain.Add_Domain')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form
          onSubmit={handleSubmit(row => {
            onSubmit(row)
          })}
        >
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
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
                  <MenuItem value=''></MenuItem>
                  {!isLoading &&
                    domainList?.map((domain: DomainType) => (
                      <MenuItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='name'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('Name')}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='description'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  multiline
                  rows={3}
                  InputProps={{readOnly: false}}
                  label={t('Description')}
                  onChange={onChange}
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='email'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <EmailInputMask value={value} onChange={onChange} error={Boolean(errors.email)}/>
              )}
            />
            {errors.email && <FormHelperText sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='phone'
              control={control}
              rules={{required: true}}
              render={({field: {value}}) => (
                <MuiPhoneNumber
                  variant='outlined'
                  fullWidth
                  size='small'
                  defaultCountry={'tn'}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={e => {
                    const updatedValue = e.replace(/\s+/g, '')
                    setValue('phone', updatedValue)
                  }}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{color: 'error.main'}}>{errors.phone.message}</FormHelperText>}
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

          <FormControlLabel
            labelPlacement='top'
            label={t('Status')}
            control={
              <Controller
                name='adminStatus'
                control={control}
                defaultValue={defaultValues.adminStatus}
                render={({field: {value, onChange}}) => (
                  <Switch
                    checked={value == AdminStatus.ENABLED}
                    onChange={e => onChange(e.target.checked ? AdminStatus.ENABLED : AdminStatus.DISABLED)}
                  />
                )}
              />
            }
            sx={{mb: 4, alignItems: 'flex-start', marginLeft: 0}}
          />

          <FormControl fullWidth sx={{mb: 4}}>
            <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
              <Avatar
                src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                sx={{cursor: 'pointer', mr: 2}}
              ></Avatar>

              <Button
                color='primary'
                variant='outlined'
                component='span'
                sx={{width: '100%'}}
                startIcon={<Icon icon='tabler:upload'/>}
              >
                {t('Photo')}
              </Button>
              <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
            </label>
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

export default SidebarAddDomain
