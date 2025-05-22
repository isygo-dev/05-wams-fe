import React, { useContext } from 'react'
import { EmployeeContext } from '../../../../pages/apps/employee/view/[id]'
import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { IEnumCivility, IEnumGender } from 'hrm-shared/@core/types/hrm/employeeTypes'
import Typography from '@mui/material/Typography'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import FormControl from '@mui/material/FormControl'
import { Accordion, AccordionDetails, AccordionSummary, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export function FamilyInformation({ checkPermissionUpdate }) {
  const { t } = useTranslation()
  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData || {}

  const { register, control } = useFormContext()
  const familyInformation = employeeData.details.familyInformation
  const emptyChildrenInfo = Array.from({ length: familyInformation?.numberOfChildren || 0 }, () => ({
    fullName: '',
    gender: null,
    birthDate: '',
    educationalLevel: ''
  }))

  console.log(familyInformation)

  return (
    <Accordion defaultExpanded={false} style={{ marginTop: 16 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
        <Typography>{t('Employee.Family_Information')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {employeeData?.details?.civility === IEnumCivility.M && (
            <Grid item xs={12} sm={12}>
              <TextField
                disabled={!checkPermissionUpdate}
                size='small'
                label='Partner Name'
                defaultValue={familyInformation?.spouseName || ''}
                fullWidth
                variant='outlined'
                {...(checkPermissionUpdate && register('details.familyInformation.spouseName'))}
              />
            </Grid>
          )}
          <div style={{ marginBottom: 16 }}></div>
          {emptyChildrenInfo.map((child, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  position: 'relative'
                }}
              >
                <Typography variant='h6' gutterBottom>
                  Child Information {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      size='small'
                      label='Full Name'
                      defaultValue={familyInformation.childrenInformations?.[index]?.fullName || ''}
                      fullWidth
                      disabled={!checkPermissionUpdate}
                      variant='outlined'
                      {...(checkPermissionUpdate &&
                        register(`details.familyInformation.childrenInformations[${index}].fullName`))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePickerWrapper className='small-input-data'>
                      <Controller
                        name={`details.familyInformation.childrenInformations[${index}].birthDate`}
                        control={control}
                        defaultValue={familyInformation.childrenInformations?.[index]?.birthDate || ''}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            disabled={!checkPermissionUpdate}
                            selected={value ? new Date(value) : null}
                            dateFormat='dd/MM/yyyy'
                            onChange={date => checkPermissionUpdate && onChange(date)}
                            customInput={<TextField size='small' fullWidth label='Birth Date' variant='outlined' />}
                          />
                        )}
                      />
                    </DatePickerWrapper>
                  </Grid>
                </Grid>
                <div style={{ marginBottom: 16 }}></div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl size='small' style={{ width: '100%', marginRight: '10px' }}>
                      <InputLabel>{t('Employee.Gender')}</InputLabel>
                      <Controller
                        name={`details.familyInformation.childrenInformations[${index}].gender`}
                        control={control}
                        defaultValue={familyInformation.childrenInformations?.[index]?.gender}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={value}
                            fullWidth
                            onChange={checkPermissionUpdate && onChange}
                            variant='outlined'
                            label='Gender'
                            disabled={!checkPermissionUpdate}
                          >
                            <MenuItem value={IEnumGender.MALE}>{t('Employee.Male')}</MenuItem>
                            <MenuItem value={IEnumGender.FEMALE}>{t('Employee.Female')}</MenuItem>
                            <MenuItem value={IEnumGender.OTHER}>{t('Employee.Other')}</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl size='small' style={{ width: '100%', marginRight: '10px' }}>
                      <InputLabel>{t('Employee.Educational_Level')}</InputLabel>
                      <Controller
                        name={`details.familyInformation.childrenInformations[${index}].educationalLevel`}
                        control={control}
                        defaultValue={familyInformation.childrenInformations?.[index]?.educationalLevel || null}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={value}
                            fullWidth
                            disabled={!checkPermissionUpdate}
                            onChange={checkPermissionUpdate && onChange}
                            variant='outlined'
                            label={t('Employee.Educational_Level')}
                          >
                            <MenuItem value={null}>{t('None')}</MenuItem>
                            <MenuItem value={'HIGH_SCHOOL'}>{t('Employee.High_School')}</MenuItem>
                            <MenuItem value={'BACHELOR'}>{t('Employee.Bachelor')}</MenuItem>
                            <MenuItem value={'MASTER'}>{t('Employee.Master')}</MenuItem>
                            <MenuItem value={'DOCTORATE'}>{t('Employee.Doctorate')}</MenuItem>
                            <MenuItem value={'PRIMARY_SCHOOL'}>{t('Employee.Primary_School')}</MenuItem>
                            <MenuItem value={'MIDDLE_SCHOOL'}>{t('Employee.Middle_School')}</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
