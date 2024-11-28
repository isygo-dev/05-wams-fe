import React, {useContext, useEffect, useState} from 'react'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import {
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import {Controller, useFormContext} from 'react-hook-form'
import {IEnumAbsenceType, IEnumStatusType} from 'hrm-shared/@core/types/hrm/leaveStatusType'
import {LeaveStatusContext} from '../../../../pages/apps/leaveStatus/view/[id]'
import {useTranslation} from 'react-i18next'
import TextField from '@mui/material/TextField'

const MyCalendar = ({SubmitError}) => {
  const {t} = useTranslation()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [beginHalfDay, setBeginHalfDay] = useState(false)
  const [endHalfDay, setEndHalfDay] = useState(false)
  const [absenceType, setAbsenceType] = useState<IEnumAbsenceType>()
  const [error, setError] = useState('')
  const leaveData = useContext(LeaveStatusContext)
  const leave = leaveData.LeaveStatusData || {}

  const {
    control,
    setValue,
    formState: {errors}
  } = useFormContext()
  const [highlightedRange, setHighlightedRange] = useState([])
  const [rangeLength, setRangeLength] = useState(0)

  useEffect(() => {
    handleStartDateChange(startDate)
    handleEndDateChange(endDate)
  }, [beginHalfDay, endHalfDay])

  useEffect(() => {
    const range = calculateDateRange(startDate, endDate)
    setHighlightedRange(range.dates)
    setRangeLength(range.range)
  }, [startDate, endDate, beginHalfDay, endHalfDay, error, SubmitError])

  const handleStartDateChange = date => {
    let formattedDate = formatDate(date, false)
    if (beginHalfDay) {
      date.setHours(8, 0, 0, 0)
      formattedDate = formatDate(date, true)
    }
    if (beginHalfDay && startDate.toDateString() !== endDate.toDateString()) {
      date.setHours(12, 0, 0, 0)
      formattedDate = formatDate(date, true)
    }
    if (endHalfDay && startDate.toDateString() === endDate.toDateString()) {
      date.setHours(12, 0, 0, 0)
      formattedDate = formatDate(date, false)
    }
    setValue('vacation.startDate', formattedDate)
  }

  const handleStart = date => {
    setStartDate(date)
    handleStartDateChange(date)
  }

  const handleEndDateChange = date => {
    let formattedDate = formatDate(date, false)

    if (startDate.toDateString() !== endDate.toDateString() && endHalfDay) {
      date.setHours(12, 0, 0, 0)
      formattedDate = formatDate(date, true)
    }
    if (beginHalfDay && startDate.toDateString() === endDate.toDateString()) {
      endDate.setHours(12, 0, 0, 0)
      formattedDate = formatDate(endDate, true)
    }
    if (endHalfDay && startDate.toDateString() === endDate.toDateString()) {
      endDate.setHours(17, 0, 0, 0)
      formattedDate = formatDate(endDate, false)
    }
    setEndDate(date)
    setValue('vacation.endDate', formattedDate)
  }

  const calculateDateRange = (start, end) => {
    const dates = []
    let range = 0
    const currentDate = new Date(start)
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(currentDate))
    }

    currentDate.setDate(currentDate.getDate() + 1)

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (startDate.toDateString() === endDate.toDateString() && (beginHalfDay || endHalfDay)) {
      range = 0.5
    } else if (startDate.toDateString() !== endDate.toDateString() && (beginHalfDay || endHalfDay)) {
      if (beginHalfDay && !endHalfDay) {
        range = dates.length - 0.5
      } else if (endHalfDay && !beginHalfDay) {
        range = dates.length - 0.5
      } else {
        range = dates.length - 1
      }
    } else {
      range = dates.length
    }

    if (
      absenceType === IEnumAbsenceType.RECOVERY_HOLIDAY &&
      leave.recoveryLeaveCount - leave.recoveryLeaveTaken < range
    ) {
      setError('Number of days exceeds recovery leave count')
      SubmitError(true)
    } else if (
      absenceType === IEnumAbsenceType.RECOVERY_HOLIDAY &&
      leave.recoveryLeaveCount - leave.recoveryLeaveTaken >= range
    ) {
      SubmitError(false)
      setValue('vacation.recoveryLeaveTaken', range)
      setError('')
    } else {
      setValue('vacation.leaveTaken', range)
    }

    setValue('vacation.status', IEnumStatusType.CREATED)

    return {dates, range}
  }

  const handleChangeAbsenceType = event => {
    console.log(event.target.value)
    if (event.target.value != undefined) {
      setAbsenceType(event.target.value)
    }
  }

  const handleBeginHalfDayChange = event => {
    setBeginHalfDay(event.target.checked)
    if (event.target.checked && startDate.toDateString() === endDate.toDateString()) {
      setEndHalfDay(false)
    }
    handleStartDateChange(startDate)
  }

  const handleEndHalfDayChange = event => {
    setEndHalfDay(event.target.checked)
    console.log(event.target.checked)
    console.log(endHalfDay)
    if (event.target.checked && startDate.toDateString() === endDate.toDateString()) {
      setBeginHalfDay(false)
    }
    handleEndDateChange(endDate)
  }

  const formatDate = (date, isHalfDay) => {
    const formattedDate = new Date(date)
    const day = formattedDate.getDate()
    const month = formattedDate.getMonth() + 1
    const year = formattedDate.getFullYear()
    let formattedTime = ''

    if (endHalfDay) {
      const hours = formattedDate.getHours().toString().padStart(2, '0')
      const minutes = formattedDate.getMinutes().toString().padStart(2, '0')
      formattedTime = ` ${hours}:${minutes}`
    }
    if (isHalfDay) {
      const hours = formattedDate.getHours().toString().padStart(2, '0')
      const minutes = formattedDate.getMinutes().toString().padStart(2, '0')
      formattedTime = ` ${hours}:${minutes}`
    }

    return `${day}/${month}/${year}${formattedTime}`
  }

  return (
    <Card>
      <CardHeader title='Select Dates and Absence Type'/>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <DatePickerWrapper
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '& .react-datepicker': {
                  boxShadow: 'none !important',
                  border: 'none !important'
                }
              }}
            >
              <DatePicker
                selectsStart
                inline
                selected={startDate}
                dateFormat='dd/MM/yyyy'
                onChange={handleStart}
                highlightDates={highlightedRange}
                required={true}
              />
            </DatePickerWrapper>
            {errors['vacation.startDate'] && <p style={{color: 'red'}}>{errors['vacation.startDate'].message}</p>}
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePickerWrapper
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '& .react-datepicker': {
                  boxShadow: 'none !important',
                  border: 'none !important'
                }
              }}
            >
              <DatePicker
                selectsEnd
                inline
                minDate={startDate}
                endDate={endDate}
                startDate={startDate}
                selected={endDate}
                required={true}
                dateFormat='dd/MM/yyyy'
                onChange={handleEndDateChange}
                highlightDates={highlightedRange}
              />
            </DatePickerWrapper>
            {errors['vacation.endDate'] && <p style={{color: 'red'}}>{errors['vacation.endDate'].message}</p>}
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Checkbox checked={beginHalfDay} onChange={handleBeginHalfDayChange}/>}
              label='Begin with half a day'
            />
            <FormControlLabel
              control={<Checkbox checked={endHalfDay} onChange={handleEndHalfDayChange}/>}
              label='End with half a day'
            />
            <p>
              {t('LeaveStatus.Number_of_days')} : {rangeLength}
            </p>
            <FormControl size='small' style={{width: '100%', marginRight: '10px'}}>
              <InputLabel>{t('Absence Type')}</InputLabel>
              <Controller
                name={`vacation.absence`}
                control={control}
                rules={{required: true}}
                render={({field}) => (
                  <Select
                    {...field}
                    variant='outlined'
                    label='Absence Type'
                    value={field.value || ''}
                    onChange={e => {
                      field.onChange(e)
                      handleChangeAbsenceType(e)
                    }}
                  >
                    {Object.values(IEnumAbsenceType).map(value => (
                      <MenuItem key={value} value={value}>
                        {t(value)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {error && <p style={{color: 'red'}}>{error}</p>}
            </FormControl>
            <div style={{marginBottom: 16}}></div>

            <FormControl fullWidth>
              <Controller
                name='vacation.comment'
                control={control}
                render={({field: {value, onChange}}) => (
                  <TextField
                    size='small'
                    rows={4}
                    multiline
                    value={value}
                    label={t('Comment')}
                    onChange={onChange}
                    placeholder='comment'
                    id='textarea-standard-static'
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MyCalendar
