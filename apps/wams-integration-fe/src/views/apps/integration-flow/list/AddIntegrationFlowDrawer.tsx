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
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {InputLabel, MenuItem, Select} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import DatePicker from 'react-datepicker'
import {IntegrationFlowData} from 'integration-shared/@core/types/integration/IntegrationFlowTypes'
import EventIcon from '@mui/icons-material/Event'
import 'react-datepicker/dist/react-datepicker.css'
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";
import DomainApis from "ims-shared/@core/api/ims/domain";
import IntegrationFlowApis from "integration-shared/@core/api/integration/flow";

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required('Domain is required'),
  orderName: yup.string().required('Order Name is required'),
  integrationDate: yup.date().nullable()
})

interface SidebarAddCustomerType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddFlow = (props: SidebarAddCustomerType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle, domain} = props
  const [file, setFile] = useState<File | null>(null)
  const {data: integrationOrder, isLoading} = useQuery('integrationOrder', IntegrationOrderApis(t).getIntegrationOrders)
  const {data: domainList, isLoading: isLoadingDomain} = useQuery('domains', DomainApis(t).getDomains)
  const getExtension = fileName => {
    if (!fileName || typeof fileName !== 'string') {
      return ''
    }
    const parts = fileName.split('.')

    return parts.length > 1 ? parts.pop().toLowerCase() : ''
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      setValue('file', files[0])
    }
    trigger('file')
  }

  const onSubmit = (data: IntegrationFlowData) => {
    console.log('Form submitted:', data)
    const formData = new FormData()
    formData.append('domain', domain)
    formData.append('integrationDate', data.integrationDate ? data.integrationDate.toLocaleString() : '')
    formData.append('orderName', data.orderName)
    if (file) {
      formData.append('file', file)
      formData.append('originalFileName', file.name)
      formData.append('extension', getExtension(file.name))
      formData.append('type', file.type)
    }

    createNewIntegrationFlow.mutate(formData)
  }

  const createNewIntegrationFlow = useMutation({
    mutationFn: (params: FormData) => IntegrationFlowApis(t).createIntegrationFlow(params),
    onSuccess: (res: any) => {
      handleClose()
      const cachedData: any[] = queryClient.getQueryData('flow') || []
      const updatedData = [...cachedData, res]
      queryClient.setQueryData('flow', updatedData)
    },
    onError: () => {
    }
  })

  const {
    reset,
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: {errors}
  } = useForm<IntegrationFlowData>({
    defaultValues: {
      domain: props.domain,
      integrationDate: null,
      file: null,
      orderName: ''
    },
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const [integrationDate, setIntegrationDate] = useState<Date | null>(new Date())

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
        <Typography variant='h6'>{t('Add Flow')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form onSubmit={handleSubmit(row => onSubmit(row))}>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {!isLoadingDomain && domainList?.length > 0
                    ? domainList?.map((domain: DomainType) => (
                      <MenuItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          {/* Order Name Field */}
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='order-name-select-label'>{t('Order Name')}</InputLabel>
            <Controller
              name='orderName'
              control={control}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  labelId='order-name-select-label'
                  label={t('Order Name')}
                  onChange={onChange}
                  value={value}
                  defaultValue=''
                  disabled={isLoading} // Disable dropdown while loading
                >
                  <MenuItem value=''>
                    <em>{t('Select an order')}</em>
                  </MenuItem>
                  {!isLoading &&
                    integrationOrder?.map((option: { id: string; name: string }) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
            {errors.orderName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.orderName.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='integrationDate'
              control={control}
              render={({field: {value, onChange}}) => (
                <DatePicker
                  selected={value || integrationDate}
                  onChange={(date: Date | null) => {
                    setIntegrationDate(date)
                    onChange(date)
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat='dd/MM/yyyy h:mm aa'
                  timeFormat='HH:mm'
                  customInput={
                    <TextField
                      size='small'
                      fullWidth
                      label='Select Date & Time'
                      InputProps={{
                        endAdornment: (
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        )
                      }}
                    />
                  }
                />
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
                {t('Select file')}
              </Button>
              <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
              <Typography>{file ? file.name : ''}</Typography>
            </label>
            {errors.file && <FormHelperText sx={{color: 'error.main'}}>{errors.file.message}</FormHelperText>}
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

export default SidebarAddFlow
