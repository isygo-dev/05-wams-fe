import React, {useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useMutation, useQuery} from 'react-query';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import 'react-datepicker/dist/react-datepicker.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import XmlViewer from '../../../../pages/apps/flow/componenets/XmlViewer';
import JsonViewer from '../../../../pages/apps/flow/componenets/JsonViewer';
import TextViewer from '../../../../pages/apps/flow/componenets/TextViewer';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event';
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, Select} from '@mui/material';
import {IntegrationFlowType} from 'integration-shared/@core/types/integration/IntegrationFlowTypes';
import DatePicker from 'react-datepicker';
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";
import IntegrationFlowApis from "integration-shared/@core/api/integration/flow";
import Icon from "template-shared/@core/components/icon";

const schema = yup.object().shape({
  domain: yup.string().required('Domain is required'),
  code: yup.string().required('Order Name is required'),
  integrationDate: yup.date().nullable(),
  originalFileName: yup.string().required('Original File Name is required'),
  orderName: yup.string().required('Order Name is required'),
  extension: yup.string().required('Extension is required'),
  type: yup.string().required('Type is required')
});

type PropsType = {
  flowData: IntegrationFlowType
}

const FlowView = ({flowData}: PropsType) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('application/json');
  const {t} = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {reset, control, handleSubmit, trigger, setValue} = useForm({
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
  });

  const {
    data: integrationOrder,
    isLoading
  } = useQuery('integrationOrder', IntegrationOrderApis(t).getIntegrationOrders);
  const mutationEdit = useMutation({
    mutationFn: (data: { formData: FormData, id: number }) => IntegrationFlowApis(t).updateIntegrationFlow(data),
    onSuccess: res => {
      console.log('Update successful:', res);
    },
    onError: err => {
      console.error('Update failed:', err);
    }
  });

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const onSubmit = async (data: IntegrationFlowType) => {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('domain', data.domain);
    formData.append('code', data.code);

    const integrationDate = new Date(data.integrationDate);
    const formattedDate = formatDate(integrationDate);
    formData.append('integrationDate', formattedDate);
    formData.append('originalFileName', data.originalFileName);
    formData.append('extension', data.extension);
    formData.append('type', data.type);
    formData.append('orderName', data.orderName);

    // Append the updated file if available
    if (fileContent && fileType && data.originalFileName) {
      const fileBlob = new Blob([fileContent], {type: fileType});
      formData.append('file', fileBlob, data.originalFileName);
    }

    mutationEdit.mutate({formData, id: data.id});
  };

  const handleReset = () => {
    reset();
  };

  const handleFileLoad = (file: File) => {
    const fileType = file.type;
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        console.log('File Content:', content); // Debugging line
        setFileType(fileType);
        setFileContent(content);

        // Handle JSON file
        if (fileType === 'application/json' || fileType === 'text/json') {
          try {
            const jsonData = JSON.parse(content);
            setFileContent(JSON.stringify(jsonData, null, 2)); // Beautify for display
          } catch (error) {
            console.error('JSON Parsing Error:', error); // Log error
            setFileContent('Invalid JSON format. Please upload a valid JSON file.');
          }
        }
      }
    };

    reader.readAsText(file); // Read the file as text
  };


  const handleSelectedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setValue('originalFileName', file.name); // Update the form value
      handleFileLoad(file); // Load the file content
    }
    trigger('originalFileName'); // Trigger validation for originalFileName
  };

  const renderFileViewer = () => {
    if (fileType === 'application/json' || fileType === 'text/json') {
      if (fileContent.startsWith('Invalid JSON')) {
        return <Typography color="error">{fileContent}</Typography>;
      }

      return <JsonViewer data={fileContent}/>;
    }

    switch (fileType) {
      case 'application/xml':
      case 'text/xml':
        return <XmlViewer data={fileContent}/>;
      case 'text/plain':
        return <TextViewer data={fileContent}/>;
      default:
        return <Typography>No viewer available for this file type.</Typography>;
    }
  };

  const handleStartDateChange = (e: Date | null) => {
    if (e != null) {
      setValue('integrationDate', e);
    }
  };

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
                          disabled={isLoading}
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
                    render={({field: {value}}) => (
                      <DatePicker
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        selected={new Date(value) || new Date()}
                        dateFormat='dd/MM/yyyy h:mm aa'
                        onChange={handleStartDateChange}
                        customInput={<TextField
                          size='small'
                          fullWidth
                          label='Select Date & Time'
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <EventIcon/>
                              </IconButton>
                            ),
                          }}
                        />}
                      />
                    )}
                  />
                </Grid>

                {/* File Selection Field */}
                <Grid item xs={12} sm={12}>
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
                      <input
                        type='file'
                        name='file'
                        id='file'
                        style={{display: 'none'}}
                        onChange={handleSelectedFileChange}
                      />
                      <Typography>
                        {selectedFile ? selectedFile.name : flowData?.originalFileName}
                      </Typography>
                    </label>

                  </FormControl>

                  {/* Document Viewer */}
                  <Box mt={2}>{renderFileViewer()}</Box>
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
  );
}

export default FlowView;
