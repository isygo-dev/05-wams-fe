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
import {useTranslation} from 'react-i18next'
import React from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {LeaveStatusType} from 'hrm-shared/@core/types/hrm/leaveStatusType'
import LeaveStatusApis from "hrm-shared/@core/api/hrm/leaveStatus";

interface UpdateLeaveStatusType {
  open?: boolean
  toggle?: () => void
  dataParameter?: LeaveStatusType | undefined
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  leaveCount: yup.number().min(0).required(),
  remainingLeaveCount: yup.number().required(),
  leaveTakenCount: yup
    .number()
    .max(yup.ref('remainingLeaveCount'), 'Leave taken count cannot be greater than remaining leave count')
    .min(0.5)
    .required(),
  recoveryLeaveCount: yup.number().min(0).required(),
  recoveryLeaveTaken: yup
    .number()
    .max(yup.ref('recoveryLeaveCount'), 'Recovery Leave taken count cannot be greater than Recovery leave count')
    .min(0.5)
})

const SideBarUpdateLeaveSummary = (props?: UpdateLeaveStatusType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle, dataParameter} = props
  const defaultValues = {...dataParameter}
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: LeaveStatusType) => {
    updateParametreMutation.mutate(data)
    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const updateParametreMutation = useMutation({
    mutationFn: (params: LeaveStatusType) => LeaveStatusApis(t).updateLeaveStatus(params, params.id),
    onSuccess: (res: LeaveStatusType) => {
      handleClose()
      const cachedLeaveStatus: LeaveStatusType[] = queryClient.getQueryData('leaveStatus') || []
      const index = cachedLeaveStatus.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedLeaveStatus = [...cachedLeaveStatus]
        updatedLeaveStatus[index] = res
        queryClient.setQueryData('leaveStatus', updatedLeaveStatus)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const calculateRemainingLeaveCount = (data: LeaveStatusType) => {
    if (data.leaveCount != null && data.leaveTakenCount != null && data.recoveryLeaveCount != null) {
      return data.leaveCount + data.recoveryLeaveCount - data.leaveTakenCount
    } else {
      return null
    }
  }

  const handleLeaveTakenCountChange = (value: number) => {
    const remainingLeaveCount = calculateRemainingLeaveCount({...defaultValues, leaveTakenCount: value})
    if (remainingLeaveCount != null) {
      setValue('remainingLeaveCount', remainingLeaveCount)
    }
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
        <Typography variant='h6'> {t('LeaveStatus.Update_LeaveStatus')}</Typography>
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
              name='leaveCount'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  type='number'
                  label={t('LeaveStatus.leave_Count')}
                  onChange={onChange}
                  error={Boolean(errors.leaveCount)}
                />
              )}
            />
            {errors.leaveCount && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.leaveCount.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='recoveryLeaveCount'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  type='number'
                  label={t('LeaveStatus.recovery_Leave_Count')}
                  onChange={onChange}
                />
              )}
            />
            {errors.recoveryLeaveCount && (
              <FormHelperText
                sx={{color: 'error.main'}}>{errors.recoveryLeaveCount.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='recoveryLeaveTaken'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='number'
                  value={value}
                  label={t('LeaveStatus.recovery_Leave_Taken')}
                  onChange={onChange}
                  error={Boolean(errors.recoveryLeaveTaken)}
                />
              )}
            />
            {errors.recoveryLeaveTaken && (
              <FormHelperText
                sx={{color: 'error.main'}}>{errors.recoveryLeaveTaken.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='leaveTakenCount'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='number'
                  value={value}
                  label={t('LeaveStatus.leave_Taken_Count')}
                  onChange={e => {
                    onChange(e)
                    handleLeaveTakenCountChange(parseFloat(e.target.value))
                  }}
                  error={Boolean(errors.leaveTakenCount)}
                />
              )}
            />
            {errors.leaveTakenCount && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.leaveTakenCount.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='remainingLeaveCount'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value ?? ''}
                  id='form-props-read-only-input'
                  type='number'
                  label={t('LeaveStatus.remaining_Leave_Count')}
                  onChange={onChange}
                  error={Boolean(errors.remainingLeaveCount)}
                  InputProps={{
                    readOnly: true
                  }}
                />
              )}
            />
            {errors.remainingLeaveCount && (
              <FormHelperText
                sx={{color: 'error.main'}}>{errors.remainingLeaveCount.message}</FormHelperText>
            )}
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

export default SideBarUpdateLeaveSummary
