// ** React Imports
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
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import { FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import CalendarApis from 'cms-shared/@core/api/cms/calendar'
import { CalendarsType } from 'template-shared/@core/types/helper/calendarTypes'

interface SidebarAddCalendarType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  name: yup.string().required(),
  icsPath: yup.string(),
  description: yup.string(),
  locked: yup.boolean()
})

const defaultValues = {
  icsPath: '',
  domain: '',
  name: '',
  description: '',
  locked: false
}

const SidebarAddCalendar = (props: SidebarAddCalendarType) => {
  const { t } = useTranslation()
  const { open, toggle } = props
  const queryClient = useQueryClient()
  const { data: domains, isLoading: isLoadingDomain } = useQuery(['domains'], () => DomainApis(t).getDomainsNameList())
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

  const mutationAdd = useMutation({
    mutationFn: (data: CalendarsType) => CalendarApis(t).addCalendar(data),
    onSuccess: (res: CalendarsType) => {
      const cachedData: [] = queryClient.getQueryData('calendars') || []
      const updatedData: CalendarsType[] = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('calendars', updatedData)
      handleClose()
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: CalendarsType) => {
    mutationAdd.mutate(data)
  }

  const handleClose = () => {
    // setPlan('basic')
    // setRole('subscriber')
    toggle()
    reset()
  }

  console.log('domains', domains)

  return !isLoadingDomain ? (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Calendar</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={
                    checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)
                      ? false
                      : true
                  }
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {domains?.map(domain => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
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
                <TextField value={value} label={t('Name')} onChange={onChange} error={Boolean(errors.name)} />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
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
  ) : null
}

export default SidebarAddCalendar
