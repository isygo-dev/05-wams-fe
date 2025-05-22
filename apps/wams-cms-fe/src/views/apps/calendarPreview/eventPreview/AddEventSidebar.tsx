import React, { forwardRef, Fragment, useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import { useMutation } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { useTranslation } from 'react-i18next'
import EventApis from 'cms-shared/@core/api/cms/events'
import {
  AddEventSidebarType,
  AddEventType,
  EventDateType,
  EventType
} from 'template-shared/@core/types/helper/calendarTypes'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
  guests: string[] | string | undefined
}

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'INTERVIEW',
  startDate: new Date()
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  const { t } = useTranslation()
  const { store, refetch, drawerWidth, calendarApi, addEventSidebarOpen, handleAddEventSidebarToggle, domain, name } =
    props
  const [values, setValues] = useState<DefaultStateType>(defaultState)
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    handleAddEventSidebarToggle()
  }

  const mutationDelete = useMutation({
    mutationFn: (id: number) => EventApis(t).deleteEvent(id),
    onSuccess: (id: number) => {
      setDeleteDialogOpen(false)
      calendarApi.getEventById(id)?.remove()
      handleSidebarClose()
      refetch()
    },
    onError: err => {
      console.log(err)
    }
  })

  const mutationAdd = useMutation({
    mutationFn: (data: AddEventType) => EventApis(t).addEvent(data),
    onSuccess: () => {
      handleSidebarClose()
      refetch()
    },
    onError: err => {
      console.log(err)
    }
  })

  const mutationUpdate = useMutation({
    mutationFn: (data: EventType) => EventApis(t).updateEvent(data),
    onSuccess: () => {
      handleSidebarClose()
      refetch()
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: { title: string }) => {
    const addEventDetail: AddEventType = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      domain: domain,
      calendarName: name,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined
      }
    }
    if (store?.selectedEvent === null || (store?.selectedEvent !== null && !store?.selectedEvent?.title?.length)) {
      mutationAdd.mutate(addEventDetail)
    } else {
      const modifiedEvent: EventType = {
        id: store?.selectedEvent?.id,
        url: values.url,
        title: data.title,
        end: values.endDate,
        allDay: values.allDay,
        start: values.startDate,

        domain: domain,
        calendarName: name,

        extendedProps: {
          calendar: capitalize(values.calendar)
        }
      }
      mutationUpdate.mutate(modifiedEvent)
    }
    calendarApi.refetchEvents()
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleOpenDeleteEventDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const handleStartDate = (date: Date) => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store?.selectedEvent !== null) {
      const event = store?.selectedEvent
      setValue('title', event?.title || '')
      if (store?.selectedEvent?.id) {
        setValues({
          url: event?.url || '',
          title: event?.title || '',
          allDay: false,
          guests: event?.extendedProps?.guests || [],
          description: event?.extendedProps?.description || '',
          calendar: event?.extendedProps?.calendar || 'INTERVIEW',
          endDate: event?.end !== null ? event?.end : event?.start,
          startDate: event?.start !== null ? event?.start : new Date()
        })
      } else {
        setValues({
          url: event?.url || '',
          title: event?.title || '',
          allDay: false,
          guests: event?.extendedProps?.guests || [],
          description: event?.extendedProps?.description || '',
          calendar: event?.extendedProps?.calendar || 'INTERVIEW',
          endDate: event?.endDate !== null ? event?.endDate : event?.startDate,
          startDate: event?.startDate !== null ? event?.startDate : new Date()
        })
      }
    }
  }, [setValue, store?.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store?.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store?.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if (store?.selectedEvent === null || (store?.selectedEvent !== null && !store?.selectedEvent?.title?.length)) {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button variant='outlined' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Update
          </Button>
          <Button variant='outlined' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h6'>
          {store?.selectedEvent !== null && store?.selectedEvent?.title?.length ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store?.selectedEvent !== null && store?.selectedEvent?.title?.length ? (
            <IconButton
              size='small'
              onClick={() => handleOpenDeleteEventDialog(store?.selectedEvent.id)}
              sx={{ color: 'text.primary', mr: store?.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='tabler:trash' fontSize='1.25rem' />
            </IconButton>
          ) : null}
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Title' value={value} onChange={onChange} error={Boolean(errors.title)} />
                )}
              />
              {errors.title && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-title-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id='event-calendar'>Calendar</InputLabel>
              <Select
                label='Calendar'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
              >
                <MenuItem value='INTERVIEW'>Interview</MenuItem>
                <MenuItem value='Personal'>Personal</MenuItem>
                <MenuItem value='Business'>Business</MenuItem>
                <MenuItem value='Family'> Family</MenuItem>
                <MenuItem value='Holiday'>Holiday</MenuItem>
                <MenuItem value='ETC' disabled={true}>
                  ETC
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate as EventDateType}
                selected={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={(date: Date) => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate as EventDateType}
                selected={values.endDate as EventDateType}
                minDate={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={(date: Date) => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box>
            <FormControl sx={{ mb: 4 }}>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>
            {/*<TextField*/}
            {/*  fullWidth*/}
            {/*  type='url'*/}
            {/*  id='event-url'*/}
            {/*  sx={{ mb: 4 }}*/}
            {/*  label='Event URL'*/}
            {/*  value={values.url}*/}
            {/*  onChange={e => setValues({ ...values, url: e.target.value })}*/}
            {/*/>*/}
            {/*<FormControl fullWidth sx={{ mb: 4 }}>*/}
            {/*  <InputLabel id='event-guests'>Guests</InputLabel>*/}
            {/*  <Select*/}
            {/*    multiple*/}
            {/*    label='Guests'*/}
            {/*    value={values.guests}*/}
            {/*    labelId='event-guests'*/}
            {/*    id='event-guests-select'*/}
            {/*    onChange={e => setValues({ ...values, guests: e.target.value })}*/}
            {/*  >*/}
            {/*    <MenuItem value='bruce'>Bruce</MenuItem>*/}
            {/*    <MenuItem value='clark'>Clark</MenuItem>*/}
            {/*    <MenuItem value='diana'>Diana</MenuItem>*/}
            {/*    <MenuItem value='john'>John</MenuItem>*/}
            {/*    <MenuItem value='barry'>Barry</MenuItem>*/}
            {/*  </Select>*/}
            {/*</FormControl>*/}
            {/*<TextField*/}
            {/*  rows={4}*/}
            {/*  multiline*/}
            {/*  fullWidth*/}
            {/*  sx={{ mb: 6.5 }}*/}
            {/*  label='Description'*/}
            {/*  id='event-description'*/}
            {/*  value={values.description}*/}
            {/*  onChange={e => setValues({ ...values, description: e.target.value })}*/}
            {/*/>*/}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
        {deleteDialogOpen && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Event'
            onDelete={onDelete}
          />
        )}
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
