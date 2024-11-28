import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import Icon from 'template-shared/@core/components/icon';
import {
  IntegrationOrderType,
  integrationOrderType
} from 'integration-shared/@core/types/integration/IntegrationOrderTypes';
import {InputLabel, MenuItem, Select} from '@mui/material';
import {useMutation, useQueryClient} from "react-query";
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";

interface SidebarEditIntegrationOrderType {
  open: boolean;
  toggle: () => void;
  dataIntegrationOrder: IntegrationOrderType | undefined;
}

const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}));

const schema = yup.object().shape({
  code: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  serviceName: yup.string().required(),
  domain: yup.string().required(),
  mapping: yup.string().required(),
  integrationOrder: yup.string().required(),
  file: yup.mixed()
})

const SidebarEditIntegrationOrder = (props: SidebarEditIntegrationOrderType) => {
  const {open, toggle, dataIntegrationOrder} = props;
  const queryClient = useQueryClient()
  const {t} = useTranslation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const defaultValues: IntegrationOrderType = {
    "id": dataIntegrationOrder?.id,
    "domain": dataIntegrationOrder?.domain,
    "code": dataIntegrationOrder?.code,
    "name": dataIntegrationOrder?.name,
    "description": dataIntegrationOrder?.description,
    "serviceName": dataIntegrationOrder?.serviceName,
    "mapping": dataIntegrationOrder?.mapping,
    "integrationOrder": dataIntegrationOrder?.integrationOrder,
    "file": dataIntegrationOrder?.file as File,
    "fileId": dataIntegrationOrder?.originalFileName,
    "extension": dataIntegrationOrder?.extension,
    "type": dataIntegrationOrder?.type,
    "tags": dataIntegrationOrder?.tags,
    "createDate": dataIntegrationOrder?.createDate,
    "createdBy": dataIntegrationOrder?.createdBy,
    "updateDate": dataIntegrationOrder?.updateDate,
    "updatedBy": dataIntegrationOrder?.updatedBy
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (dataIntegrationOrder) {
      reset(defaultValues)
    }
  }, [dataIntegrationOrder, reset])


  const IntegrationOrderEditMutation = useMutation({
    mutationFn: (data: any) => IntegrationOrderApis(t).updateIntegrationOrder(data),
    onSuccess: (res: IntegrationOrderType) => {
      handleClose()
      const cachedData: IntegrationOrderType[] = queryClient.getQueryData('integrationOrder') || []
      const index = cachedData.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedOrder = [...cachedData]
        updatedOrder[index] = res
        queryClient.setQueryData('integrationOrder', updatedOrder)
      }
    }
  })

  const onSubmit = (data: IntegrationOrderType) => {
    data.file = selectedFile
    IntegrationOrderEditMutation.mutate(data);
  }

  const handleClose = () => {
    toggle();
    reset();
  }

  const handleSelectedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setValue('file', files[0])
    }
    trigger('file')
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
        <Typography variant='h6'>Edit</Typography>
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
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value || ''}
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
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value || ''}
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
              name='name'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value || ''}
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
                  value={value || ''}
                  label={t('Description')}
                  onChange={onChange}
                  placeholder='description'
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
                  value={value || ''}
                  label='serviceName'
                  onChange={onChange}
                  error={Boolean(errors.serviceName)}
                />
              )}
            />
            {errors.serviceName &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.serviceName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='mapping'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value || ''}
                  label='mapping'
                  onChange={onChange}
                  error={Boolean(errors.mapping)}
                />
              )}
            />
            {errors.mapping && <FormHelperText sx={{color: 'error.main'}}>{errors.mapping.message}</FormHelperText>}
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
                  value={value || ''}
                  label='Integration Order'
                  onChange={onChange}
                >
                  <MenuItem value={integrationOrderType.CREATE}>CREATE</MenuItem>
                  <MenuItem value={integrationOrderType.UPDATE}>UPDATE</MenuItem>
                  <MenuItem value={integrationOrderType.DELETE}>DELETE</MenuItem>
                  <MenuItem value={integrationOrderType.EXTRACT}>EXTRACT</MenuItem>
                </Select>
              )}
            />
            {errors.integrationOrder &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.integrationOrder.message}</FormHelperText>}
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
              <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleSelectedFileChange}/>
              <Typography>  {selectedFile ? selectedFile.name : dataIntegrationOrder?.originalFileName} </Typography>
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

export default SidebarEditIntegrationOrder
