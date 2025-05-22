import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import { CardContent, Checkbox, FormHelperText } from '@mui/material'
import Card from '@mui/material/Card'
import { useMutation } from 'react-query'
import { EmployeeStatus, RequestEmployeeStatus } from 'hrm-shared/@core/types/hrm/employeeTypes'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'

interface LockEmployeeButtonProps {
  status: EmployeeStatus
  employeeId: number
  refetch: () => void
}

const LockEmployeeButton: React.FC<LockEmployeeButtonProps> = ({ status, employeeId, refetch }) => {
  const { t } = useTranslation()
  const [newStatus, setNewStatus] = useState<boolean>(status === 'ENABLED')
  const {
    control: controlCheck,
    handleSubmit: handleSubmitCheck,
    formState: { errors: errorsCheck }
  } = useForm({ defaultValues: { checkbox: false } })

  const mutation = useMutation(EmployeeApis(t).updateEmployeeStatus)

  const onSubmitCheck = async () => {
    try {
      const data: RequestEmployeeStatus = {
        id: employeeId,
        newStatus: status == EmployeeStatus.ENABLED ? EmployeeStatus.DISABLED : EmployeeStatus.ENABLED
      }
      await mutation.mutateAsync(data)
      setNewStatus(!newStatus)
      refetch()
    } catch (error) {}
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmitCheck(onSubmitCheck)}>
            <Box sx={{ mb: 4 }}>
              <FormControl>
                <Controller
                  name='checkbox'
                  control={controlCheck}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      label={`${t('Employee.I_confirm_my_employee')} ${
                        status === 'ENABLED' ? t('deactivation') : t('activation')
                      }`}
                      sx={errorsCheck.checkbox ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                      control={
                        <Checkbox
                          {...field}
                          size='small'
                          name='validation-basic-checkbox'
                          sx={errorsCheck.checkbox ? { color: 'error.main' } : null}
                        />
                      }
                    />
                  )}
                />
                {errorsCheck.checkbox && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                    Please confirm you want to {status == 'DISABLED' ? t('activate') : t('deactivate')} customer
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Button variant='contained' color='error' type='submit' disabled={errorsCheck.checkbox !== undefined}>
              {status == 'DISABLED' ? 'Activate' : 'Deactivate'} Employee
            </Button>
          </form>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default LockEmployeeButton
