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
import {useTranslation} from "react-i18next";
import {AppParameter, AppParameterType} from "ims-shared/@core/types/ims/appParameterTypes";
import React from "react";
import {useMutation, useQueryClient} from "react-query";
import CustomParameterApis from "ims-shared/@core/api/ims/custom-parametre";

interface EditParameterType {
  open: boolean
  toggle: () => void
  dataParameter: AppParameter | undefined
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  value: yup.string().required(),
  domain: yup.string().required(),

})

const SidebarEditParameter = (props: EditParameterType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient();
  const {open, toggle, dataParameter} = props
  const defaultValues = {...dataParameter}
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: AppParameterType) => {
    updateParametreMutation.mutate(data)
    toggle()
    reset()
  }

  const handleClose = () => {
    //defaultValues
    toggle()
    reset()
  }

  const updateParametreMutation = useMutation({
    mutationFn: (data: AppParameterType) => CustomParameterApis(t).updateCustomParameter(data),
    onSuccess: (res: AppParameter) => {
      handleClose()
      const cachedAppPrametres: AppParameter[] = queryClient.getQueryData('parametres') || [];
      const index = cachedAppPrametres.findIndex((obj) => obj.id === res.id);
      if (index !== -1) {
        const updatedParametres = [...cachedAppPrametres];
        updatedParametres[index] = res;
        queryClient.setQueryData('parametres', updatedParametres);
      }
    },
    onError: err => {
      console.log(err)
    }
  })

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
        <Typography variant='h6'> {t('Parameter.Update_Parameter')}</Typography>
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
              name='value'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Parameter.Value')}
                  onChange={onChange}
                  error={Boolean(errors.value)}
                />
              )}
            />
            {errors.value && <FormHelperText sx={{color: 'error.main'}}>{errors.value.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='description'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField size='small'
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
            {errors.description &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>}
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


export default SidebarEditParameter
