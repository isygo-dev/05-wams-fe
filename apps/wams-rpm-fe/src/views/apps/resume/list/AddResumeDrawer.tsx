import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {Controller, useForm} from 'react-hook-form'
import {MuiChipsInput} from 'mui-chips-input'
import Icon from 'template-shared/@core/components/icon'
import {useTranslation} from 'react-i18next'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Checkbox, FormControlLabel, InputLabel, MenuItem, Select} from '@mui/material'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import EmailInputMask from "template-shared/views/forms/form-elements/input-mask/EmailInputMask";
import MuiPhoneNumber from "material-ui-phone-number";
import DomainApis from "ims-shared/@core/api/ims/domain";
import ResumeApis from "rpm-shared/@core/api/rpm/resume";
import {ResumeTypes} from "rpm-shared/@core/types/rpm/ResumeTypes";


interface SidebarAddResumeType {
  open: boolean
  toggle: () => void
  domain: string
}

interface ResumeData {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  domain: string
  tags: string[]
  file: File | null
  originalFileName: string | undefined
  isLinkedToUser: boolean
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddResume = (props: SidebarAddResumeType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {data: domainList, isFetched: isFetchedDomains} = useQuery('domains', DomainApis(t).getDomains)
  const [linkedUser, setLinkedUser] = useState<boolean>(true)
  const [file, setFile] = useState<File | null>(null)
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    title: yup.string().required(),
    domain: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required(),
    tags: yup.array().min(1),
    file: yup.mixed().required()
  })
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      setValue('file', files[0])
    }
    trigger('file')
  }

  // ** Props
  const {open, toggle} = props

  const {
    reset,
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: {errors}
  } = useForm<ResumeData>({
    defaultValues: {
      email: '',
      firstName: '',
      title: '',
      lastName: '',
      domain: props.domain,
      phone: '',
      tags: [],
      file: null,
      originalFileName: '',
      isLinkedToUser: true
    },
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const handleLinkedUser = event => {
    setLinkedUser(event.target.checked)
  }

  const onSubmit = (data: ResumeData) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', data.email)
    formData.append('title', data.title)
    formData.append('lastName', data.lastName)
    formData.append('phone', data.phone)
    formData.append('domain', data.domain)
    formData.append('firstName', data.firstName)
    formData.append('tags', data?.tags?.toString())
    formData.append('filename', file.name)
    formData.append('isLinkedToUser', linkedUser ? 'true' : 'false')

    console.log('data', data)

    addResumeMutation.mutate(formData)
  }

  const addResumeMutation = useMutation({
    mutationFn: (data: FormData) => ResumeApis(t).addResume(data),
    onSuccess: (res: ResumeTypes) => {
      handleClose()
      if (res) {
        const cachedData = (queryClient.getQueryData('resumes') as any[]) || []
        const updatedData = [...cachedData]
        updatedData.push(res)
        queryClient.setQueryData('resumes', updatedData)
      }
    }
  })

  const handleClose = () => {
    toggle()
    reset()
    setFile(null)
  }

  return (
    <>
      {isFetchedDomains ? (
        <Drawer
          open={open}
          anchor='right'
          variant='temporary'
          onClose={handleClose}
          ModalProps={{keepMounted: true}}
          sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
        >
          <Header>
            <Typography variant='h6'>{t('Action.Add') as string}</Typography>
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
                <Controller
                  name='title'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('Title')}
                      onChange={onChange}
                      placeholder='John Doe'
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && <FormHelperText sx={{color: 'error.main'}}>{errors.title.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('FirstName')}
                      onChange={onChange}
                      placeholder='John Doe'
                      error={Boolean(errors.firstName)}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{color: 'error.main'}}>{errors.firstName.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('LastName') as string}
                      onChange={onChange}
                      placeholder='johndoe'
                      error={Boolean(errors.lastName)}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{color: 'error.main'}}>{errors.lastName.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='email'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <EmailInputMask
                      value={value}
                      onChange={onChange}
                      error={!!errors.email}
                    />
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
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultCountry={"tn"}
                      countryCodeEditable={true}
                      label={t('Phone_Number')}
                      value={value}
                      onChange={(e) => {
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
                  name='tags'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <MuiChipsInput size='small' value={value} label='Tags' onChange={onChange}/>
                  )}
                />
                {errors.tags && <FormHelperText sx={{color: 'error.main'}}>{errors.tags.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer'}}>
                  <Button
                    color='primary'
                    variant='outlined'
                    component='span'
                    sx={{width: '100%'}}
                    startIcon={<Icon icon='tabler:upload'/>}
                  >
                    {t('Resume.Resume')}
                  </Button>
                  <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
                  <a>{file ? file.name : ''}</a>
                </label>
                {errors.file && <FormHelperText sx={{color: 'error.main'}}>{errors.file.message}</FormHelperText>}
              </FormControl>

              <FormControlLabel
                control={<Checkbox checked={linkedUser} onChange={handleLinkedUser}/>}
                label={t('Is Linked to User')}
              />

              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Button type='submit' variant='contained' sx={{mr: 3}}>
                  {t('Submit') as string}
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleClose}>
                  {t('Cancel') as string}
                </Button>
              </Box>
            </form>
          </Box>
        </Drawer>
      ) : null}
    </>
  )
}

export default SidebarAddResume
