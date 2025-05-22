import React, { useContext } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material'
import { ContractContext } from '../../../../pages/apps/contract/view/[id]'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { GridExpandMoreIcon } from '@mui/x-data-grid'

export default function HolidayInformation({ checkPermissionUpdate }) {
  const { t } = useTranslation()
  const contractData = useContext(ContractContext)
  const contract = contractData.contractData || {}

  const { control: formContextControl } = useFormContext()

  return (
    <Accordion sx={{ height: '100%', mt: 2 }}>
      <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
        <Typography className={'title-card'}>{t('Contract.Holiday')}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography>{t('Contract.Legal_Holiday')}</Typography>

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item sm={12} md={6}>
            <Controller
              name={`holidayInformation.legalLeaveCount`}
              control={formContextControl}
              defaultValue={
                contract.holidayInformation && contract.holidayInformation
                  ? contract.holidayInformation.legalLeaveCount
                  : ''
              }
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='number'
                  fullWidth
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  label={t('Legal Leave Count')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <Controller
              name={`holidayInformation.feedingFrequency`}
              control={formContextControl}
              defaultValue={
                contract.holidayInformation && contract.holidayInformation
                  ? contract.holidayInformation.feedingFrequency
                  : ''
              }
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='number'
                  fullWidth
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  label={t('Feeding Frequency')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 3 }}>{t('Contract.recovery_Holiday')}</Typography>

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item sm={12} md={6}>
            <Controller
              name={`holidayInformation.recoveryLeaveCount`}
              control={formContextControl}
              defaultValue={
                contract.holidayInformation && contract.holidayInformation
                  ? contract.holidayInformation.recoveryLeaveCount
                  : ''
              }
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='number'
                  fullWidth
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  label={t('Recovery Leave Count')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <Controller
              name={`holidayInformation.recoveryFeedingFrequency`}
              control={formContextControl}
              defaultValue={
                contract.holidayInformation && contract.holidayInformation
                  ? contract.holidayInformation.recoveryFeedingFrequency
                  : ''
              }
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='number'
                  fullWidth
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  label={t('Recovery Feeding Frequency')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
