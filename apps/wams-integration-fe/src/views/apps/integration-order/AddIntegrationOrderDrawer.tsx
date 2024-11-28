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


// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'
import {useTranslation} from 'react-i18next'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {InputLabel, MenuItem, Select} from '@mui/material'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import DomainApis from 'ims-shared/@core/api/ims/domain'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  IntegrationOrderData,
  integrationOrderType
} from "integration-shared/@core/types/integration/IntegrationOrderTypes";
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";


interface SidebarAddResumeType {
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

const SidebarAddIntegrationOrder = (props: SidebarAddResumeType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {data: domainList, isFetched: isFetchedDomains} = useQuery('domains', DomainApis(t).getDomains)
  const [file, setFile] = useState<File | null>(null)
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    serviceName: yup.string().required(),
    domain: yup.string().required(),
    mapping: yup.string().required(),
    integrationOrder: yup.string().required(),
    file: yup.mixed().required()
  })
  const {open, toggle} = props
  const {
    reset,
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: {errors}
  } = useForm<IntegrationOrderData>({
    defaultValues: {
      name: '',
      description: '',
      serviceName: '',
      mapping: '',
      domain: props.domain,
      integrationOrder: '',
      file: null,
      fileId: '',
      extension: ''
    },
    mode: 'all',
    resolver: yupResolver(schema)
  })


  const onSubmit = (data: IntegrationOrderData) => {

    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('serviceName', data.serviceName)
    formData.append('mapping', data.mapping)
    formData.append('domain', data.domain)
    formData.append('integrationOrder', data.integrationOrder)
    formData.append('file', file)
    formData.append('originalFileName', file.name)
    formData.append('extension', file.name.split('.').pop() || 'unknown')
    formData.append('type', file.type)
    createIntegrationOrderMutation.mutate(formData)
  }

  const createIntegrationOrderMutation = useMutation({
    mutationFn: (data: FormData) => IntegrationOrderApis(t).addIntegrationOrder(data),
    onSuccess: (res: any) => {
      handleClose()
      if (res) {
        const cachedData = (queryClient.getQueryData('integrationOrder') as any[]) || []
        const updatedData = [...cachedData]
        updatedData.push(res)
        queryClient.setQueryData('integrationOrder', updatedData)
      }
    }
  })

  const handleClose = () => {
    toggle()
    reset()
    setFile(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      setValue('file', files[0])
    }
    trigger('file')
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
            <Typography variant='h6'>{t('IntegrationOrder.Add_Integration_Order') as string}</Typography>
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
                  name='name'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
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
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      rows={4}
                      multiline
                      value={value}
                      label={t('Description')}
                      onChange={onChange}
                      placeholder='descrption'
                      id='textarea-standard-static'
                      error={Boolean(errors.description)}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='serviceName'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('IntegrationOrder.serviceName')}
                      onChange={onChange}
                      error={Boolean(errors.serviceName)}
                    />
                  )}
                />
                {errors.serviceName && (
                  <FormHelperText sx={{color: 'error.main'}}>{errors.serviceName.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='mapping'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('IntegrationOrder.mapping')}
                      onChange={onChange}
                      error={Boolean(errors.mapping)}
                    />
                  )}
                />
                {errors.mapping && (
                  <FormHelperText sx={{color: 'error.main'}}>{errors.mapping.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{mb: 4}}>
                <InputLabel>Integration order</InputLabel>
                <Controller
                  name='integrationOrder'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <Select
                      name='integrationOrder'
                      size='small'
                      value={value}
                      label={t('IntegrationOrder.integrationOrder')}
                      onChange={onChange}
                    >
                      <MenuItem value={integrationOrderType.CREATE}>CREATE</MenuItem>
                      <MenuItem value={integrationOrderType.UPDATE}>UPDATE</MenuItem>
                      <MenuItem value={integrationOrderType.DELETE}>DELETE</MenuItem>
                      <MenuItem value={integrationOrderType.EXTRACT}>EXTRACT</MenuItem>

                    </Select>
                  )}
                />
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
                    Select File
                  </Button>
                  <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
                  <a>{file ? file.name : ''}</a>
                </label>
                {errors.file && <FormHelperText sx={{color: 'error.main'}}>{errors.file.message}</FormHelperText>}
              </FormControl>


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

export default SidebarAddIntegrationOrder
