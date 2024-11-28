import React, {useState} from 'react'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useTranslation} from 'react-i18next'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {useMutation, useQuery} from 'react-query'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import 'react-datepicker/dist/react-datepicker.css'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FileHandler from '../../../../pages/apps/flow/componenets/FileHandler'
import XmlViewer from '../../../../pages/apps/flow/componenets/XmlViewer'
import JsonViewer from '../../../../pages/apps/flow/componenets/JsonViewer'
import TextViewer from '../../../../pages/apps/flow/componenets/TextViewer'
import IconButton from '@mui/material/IconButton'
import EventIcon from '@mui/icons-material/Event'
import InputLabel from '@mui/material/InputLabel'
import {MenuItem, Select} from '@mui/material'
import {IntegrationFlowType} from 'integration-shared/@core/types/integration/IntegrationFlowTypes'
import DatePicker from 'react-datepicker'
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";
import IntegrationFlowApis from "integration-shared/@core/api/integration/flow";

const schema = yup.object().shape({
  domain: yup.string().required('Domain is required'),
  code: yup.string().required('Order Name is required'),
  integrationDate: yup.date().nullable(),
  originalFileName: yup.string().required('Original File Name is required'),
  orderName: yup.string().required('orderName is required'),
  extension: yup.string().required('Extension is required'),
  type: yup.string().required('Type is required')
})

type PropsType = {
  flowData: IntegrationFlowType
}

const FlowView = ({flowData}: PropsType) => {
  const [fileContent, setFileContent] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const {t} = useTranslation()

  const {reset, control, handleSubmit} = useForm({
    defaultValues: {
      id: flowData.id,
      domain: flowData?.domain || '',
      code: flowData?.code || '',
      orderName: flowData?.orderName || '',
      integrationDate: flowData?.integrationDate ? new Date(flowData.integrationDate) : null,
      originalFileName: flowData?.originalFileName || '',
      extension: flowData?.extension || '',
      type: flowData?.type || ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [integrationDate, setIntegrationDate] = useState<Date | null>(new Date())
  const {data: integrationOrder, isLoading} = useQuery('integrationOrder', IntegrationOrderApis(t).getIntegrationOrders)

  const mutationEdit = useMutation({
    mutationFn: (data: { formData: FormData, id: number }) => IntegrationFlowApis(t).updateIntegrationFlow(data),
    onSuccess: res => {
      console.log('Update successful:', res)
    },
    onError: err => {
      console.error('Update failed:', err)
    }
  })

  const onSubmit = async (data: IntegrationFlowType) => {
    const formData = new FormData()

    // Append non-file data
    formData.append('id', data.id.toString())
    formData.append('domain', data.domain)
    formData.append('code', data.code)
    formData.append('integrationDate', data.integrationDate ? data.integrationDate.toISOString() : '')
    formData.append('originalFileName', data.originalFileName)
    formData.append('extension', data.extension)
    formData.append('type', data.type)
    formData.append('orderName', data.orderName)

    // Append the updated file if available
    if (fileContent && fileType && data.originalFileName) {
      const fileBlob = new Blob([fileContent], {type: fileType})
      formData.append('file', fileBlob, data.originalFileName)
    }

    mutationEdit.mutate({formData, id: data.id})
  }

  const handleReset = () => {
    reset()
  }

  const handleFileLoad = (file: File, fileType: string) => {
    console.log('File loaded:', file)
    console.log('File type:', fileType)
    setFileType(fileType)
    const reader = new FileReader()
    reader.onload = event => {
      if (event.target?.result) {
        setFileContent(event.target.result as string)
      }
    }
    reader.readAsText(file)
  }

  const renderFileViewer = () => {
    switch (fileType) {
      case 'application/json':
        return <JsonViewer data={fileContent}/>
      case 'application/xml':
      case 'text/xml':
        return <XmlViewer data={fileContent}/>
      case 'text/plain':
        return <TextViewer data={fileContent}/>
      default:
        return <Typography>No viewer available for this file type.</Typography>
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Integration Flow Details')}/>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent style={{padding: '5px !important'}}>
              <Grid container spacing={3}>
                {/* Domain Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='domain'
                      control={control}
                      render={({field: {value}}) => (
                        <TextField disabled size='small' value={value} label={t('Domain')}/>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Code Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='code'
                      control={control}
                      render={({field: {value}}) => (
                        <TextField disabled size='small' value={value} label={t('Code')}/>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Order Name Field */}

                {/* Order Name Field */}
                <Grid item xs={12} sm={6}>
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
                  </FormControl>
                </Grid>
                {/* Integration Date Field */}
                <Grid item xs={12} sm={6}>
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
                </Grid>

                {/* Document Viewer */}
                <Grid item xs={12} sm={12}>
                  <Box>
                    <FileHandler onFileLoad={handleFileLoad}/>
                    <Box mt={2}>{renderFileViewer()}</Box>
                  </Box>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{pt: theme => `${theme.spacing(6.5)} !important`}}>
                <Button type='submit' variant='contained' sx={{mr: 3}}>
                  {t('Save Changes')}
                </Button>
                <Button type='reset' variant='outlined' color='secondary' onClick={handleReset}>
                  {t('Reset')}
                </Button>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FlowView
