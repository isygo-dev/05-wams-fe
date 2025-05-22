import { useTranslation } from 'react-i18next'
import React, { useContext } from 'react'
import { EmployeeContext } from '../../../../pages/apps/employee/view/[id]'
import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import Icon from 'template-shared/@core/components/icon'
import { useQuery } from 'react-query'
import { EmployeeType } from 'hrm-shared/@core/types/hrm/employeeTypes'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'

export function AdministrativeInformation({ checkPermissionUpdate }) {
  const { t } = useTranslation()
  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData || {}

  const { register, control } = useFormContext()
  const { data: employeeList, isLoading: employeeLoading } = useQuery<EmployeeType[]>(
    ['employeeList', employeeData?.domain],
    () => EmployeeApis(t).getEmployeesByDomain(employeeData.domain)
  )
  const filteredEmployeeList = employeeList?.filter(employee => employee.id !== employeeData.id)

  return (
    <Accordion defaultExpanded={false} style={{ marginTop: 16 }}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Employee.Administrative_Information')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id='demo-simple-select-helper-label'>{t('Employee.supervisor')}</InputLabel>
                <Controller
                  name='details.reportTo'
                  rules={{ required: true }}
                  control={control}
                  defaultValue={employeeData?.details?.reportTo}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      size='small'
                      label={t('Employee.supervisor')}
                      onChange={checkPermissionUpdate && onChange}
                      value={value}
                      disabled={employeeLoading || !checkPermissionUpdate}
                    >
                      {!employeeLoading && filteredEmployeeList.length > 0 ? (
                        filteredEmployeeList?.map(employee => (
                          <MenuItem key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                            {`${employee.firstName} ${employee.lastName}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value=''>
                          <em>{t('None')}</em>
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label={t('Employee.location')}
                defaultValue={employeeData?.details?.location || ''}
                fullWidth
                variant='outlined'
                disabled={!checkPermissionUpdate}
                {...(checkPermissionUpdate && register(`details.location`))}
              />
            </Grid>
          </Grid>
        </CardContent>
      </AccordionDetails>
    </Accordion>
  )
}
