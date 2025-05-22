import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AccordionSummary, Card, CardContent, Grid } from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { LeaveStatusContext } from '../../../../pages/apps/leaveStatus/view/[id]'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

export function VacationAbsenceInformation({ refetch }) {
  const { t } = useTranslation()
  const LeaveStatus = useContext(LeaveStatusContext)
  const [updatedLeaveData, setUpdatedLeaveData] = useState(LeaveStatus.LeaveStatusData)

  useEffect(() => {
    refetch()
    setUpdatedLeaveData(LeaveStatus.LeaveStatusData)
  }, [LeaveStatus.LeaveStatusData])

  const { control } = useFormContext()
  const total =
    updatedLeaveData.leaveCount +
    updatedLeaveData.recoveryLeaveCount -
    (updatedLeaveData.leaveTakenCount + updatedLeaveData.recoveryLeaveTaken)

  return (
    <Grid container direction='column' spacing={2}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          title={
            <Grid container alignItems='center' justifyContent='space-between'>
              <Grid item>{t('LeaveStatus.Vacation')}</Grid>
              <Grid item>{total}</Grid>
            </Grid>
          }
        />

        <Divider sx={{ mt: 2, mb: 2 }} />
        <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
          <Typography variant='h6'>{t('LeaveStatus.Available_Budget')}</Typography>
        </AccordionSummary>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`leaveCount`}
                control={control}
                defaultValue={updatedLeaveData.leaveCount || 0}
                render={({ field }) => (
                  <TextField
                    size='small'
                    disabled
                    type='number'
                    fullWidth
                    label={t('LeaveStatus.leave_Taken_Count')}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`recoveryLeaveCount`}
                control={control}
                defaultValue={updatedLeaveData.recoveryLeaveCount || 0}
                render={({ field }) => (
                  <TextField
                    size='small'
                    disabled
                    type='number'
                    fullWidth
                    label={t('LeaveStatus.Recovery_Leave_Budget')}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                value={updatedLeaveData.leaveTakenCount || 0}
                type='number'
                disabled
                size='small'
                fullWidth
                label={t('LeaveStatus.leave_Taken_Count')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                defaultValue={updatedLeaveData.recoveryLeaveTaken || 0}
                value={updatedLeaveData.recoveryLeaveTaken || 0}
                size='small'
                disabled
                type='number'
                fullWidth
                label={t('LeaveStatus.recovery_Leave_Taken')}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name={`remainingLeaveCount`}
                control={control}
                defaultValue={updatedLeaveData.remainingLeaveCount || total}
                render={({ field }) => (
                  <TextField
                    size='small'
                    value={updatedLeaveData.remainingLeaveCount || 0}
                    disabled
                    type='number'
                    fullWidth
                    label={t('LeaveStatus.remaining_Leave_Count')}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
