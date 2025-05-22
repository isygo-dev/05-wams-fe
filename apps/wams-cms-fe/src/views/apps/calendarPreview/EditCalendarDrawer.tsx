import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import CalendarApis from 'cms-shared/@core/api/cms/calendar'
import { CalendarsType } from 'template-shared/@core/types/helper/calendarTypes'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required('domain is required'),
  name: yup.string().required(),
  icsPath: yup.string(),
  description: yup.string(),
  locked: yup.boolean()
})

interface SidebarEditCalendarType {
  open: boolean
  dataCalendar: CalendarsType | undefined
  toggle: () => void
}

const SidebarEditCalendar = (props: SidebarEditCalendarType) => {
  const { t } = useTranslation()
  const { open, toggle } = props
  const queryClient = useQueryClient()

  let defaultValues: CalendarsType
  if (open && props.dataCalendar !== undefined) {
    defaultValues = {
      id: props.dataCalendar.id,
      domain: props.dataCalendar.domain,
      icsPath: props.dataCalendar.icsPath,
      name: props.dataCalendar.name,
      description: props.dataCalendar.description,
      locked: props.dataCalendar.locked
    }
  } else {
    defaultValues = {
      id: 0,
      domain: '',
      icsPath: '',
      name: '',
      description: '',
      locked: false
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const mutationUpdate = useMutation({
    mutationFn: (data: CalendarsType) => CalendarApis(t).updateCalendar(data),
    onSuccess: (res: CalendarsType) => {
      handleClose()
      const cachedCalendars: CalendarsType[] = queryClient.getQueryData('calendars') || []
      const index = cachedCalendars.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedCalendars = [...cachedCalendars]
        updatedCalendars[index] = res
        queryClient.setQueryData('calendars', updatedCalendars)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: CalendarsType) => {
    mutationUpdate.mutate(data)
  }

  const handleClose = () => {
    defaultValues = {
      domain: '',
      icsPath: '',
      id: 0,
      name: ''
    }
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Edit Calendar</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{ readOnly: false }}
                  label={t('Domain.Domain')}
                  onChange={onChange}
                  placeholder='domain'
                  error={Boolean(errors.domain)}
                />
              )}
            />
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Name'
                  onChange={onChange}
                  placeholder='name'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='icsPath'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField disabled value={value} label='Path' onChange={onChange} placeholder='ICS path' />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
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
          <FormControlLabel
            labelPlacement='top'
            label={t('Locked')}
            control={
              <Controller
                name='locked'
                control={control}
                defaultValue={defaultValues.locked}
                render={({ field: { value, onChange } }) => (
                  <Switch checked={value} onChange={e => onChange(e.target.checked)} />
                )}
              />
            }
            sx={{ mb: 4, alignItems: 'flex-start', marginLeft: 0 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarEditCalendar
