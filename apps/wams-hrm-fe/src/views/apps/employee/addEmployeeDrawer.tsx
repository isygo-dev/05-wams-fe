import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer' // Add this import
import {styled} from '@mui/system'
import Box, {BoxProps} from '@mui/material/Box'
import * as yup from 'yup'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useTranslation} from 'react-i18next'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Button from '@mui/material/Button'
import {EmployeeType, EmployeeTypeRequest} from 'hrm-shared/@core/types/hrm/employeeTypes'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import {Avatar, Checkbox, FormControlLabel, InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import DomainApis from 'ims-shared/@core/api/ims/domain'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import MuiPhoneNumber from "material-ui-phone-number";
import EmailInputMask from "template-shared/views/forms/form-elements/input-mask/EmailInputMask";
import EmployeeApis from "hrm-shared/@core/api/hrm/employee";

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  domain: yup.string().required()
})

interface SidebarAddEmployeeType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddEmployee = (props: SidebarAddEmployeeType) => {
  const {t} = useTranslation()
  const {open, toggle, domain} = props
  const queryClient = useQueryClient()
  const {data: domainList, isLoading} = useQuery('domains', DomainApis(t).getDomainsNameList)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [linkedUser, setLinkedUser] = useState<boolean>(true)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('file changed', event)

    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const handleLinkedUser = event => {
    console.log(event.target.checked)
    setLinkedUser(event.target.checked)
  }

  const onSubmit = async (data: EmployeeTypeRequest) => {
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('domain', data.domain)
    formData.append('isLinkedToUser', linkedUser ? 'true' : 'false')
    addEmployeMutation.mutate(formData)
    handleClose()
  }

  const addEmployeMutation = useMutation({
    mutationFn: (params: FormData) => EmployeeApis(t).addEmployee(params),
    onSuccess: (res: EmployeeType) => {
      const cachedData: EmployeeType[] = queryClient.getQueryData('employee') || []
      const updatedData = [...cachedData, res]
      queryClient.setQueryData('employee', updatedData)
    },
    onError: () => {
    }
  })

  const defaultValues: EmployeeTypeRequest = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    domain: domain,
    imagePath: '',
    isLinkedToUser: false // Default value for checkbox
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
        <Typography variant='h6'>{t('Employee.Add_Employee')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form onSubmit={handleSubmit((row: EmployeeTypeRequest) => onSubmit(row))}>
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
                  {!isLoading && domainList && domainList.length > 0 ? (
                    domainList.map((domain: string) => (
                      <MenuItem key={domain} value={domain}>
                        {domain}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=''>
                      <em>{t('None')}</em>
                    </MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
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
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('firstName')}
                  onChange={onChange}
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
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('lastName')}
                  onChange={onChange}
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{color: 'error.main'}}>{errors.lastName.message}</FormHelperText>}
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
                  error={Boolean(errors.email)}
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
            <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
              <Avatar
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${defaultValues?.id}`
                }
                sx={{cursor: 'pointer'}}
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

          <FormControlLabel
            control={<Checkbox checked={linkedUser} onChange={handleLinkedUser}/>}
            label={t('Is Linked to User')}
          />

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              {'Submit'}
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

export default SidebarAddEmployee
