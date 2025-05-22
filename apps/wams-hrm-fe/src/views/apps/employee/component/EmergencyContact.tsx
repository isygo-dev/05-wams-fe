import { useTranslation } from 'react-i18next'
import React, { useContext, useState } from 'react'
import { EmployeeContext } from '../../../../pages/apps/employee/view/[id]'
import { useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Accordion, AccordionDetails, AccordionSummary, CardContent, IconButton, Typography } from '@mui/material'
import Icon from 'template-shared/@core/components/icon'

export function EmergencyContact({ checkPermissionUpdate }) {
  const { t } = useTranslation()
  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData || {}

  const { register } = useFormContext()
  const [emergencyContacts, setEmergencyContacts] = useState(employeeData.details?.emergencyContact || [{}])

  const handleAddContact = () => {
    if (!checkPermissionUpdate) {
      return
    }
    setEmergencyContacts([...emergencyContacts, {}])
  }

  const handleDeleteEmergency = index => {
    setEmergencyContacts(prevEmergencyContacts => {
      const updatedEmergencyContacts = [...prevEmergencyContacts]
      updatedEmergencyContacts.splice(index, 1)

      return updatedEmergencyContacts
    })
  }

  return (
    <Accordion defaultExpanded={false} style={{ marginTop: 16 }}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Employee.Emergency_Contact')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CardContent>
          <Grid container spacing={3}>
            {emergencyContacts.map((emergencyContact, index) => (
              <Grid item xs={12} key={index}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      size='small'
                      label={t('Employee.Name')}
                      defaultValue={emergencyContact.name || ''}
                      fullWidth
                      variant='outlined'
                      disabled={!checkPermissionUpdate}
                      {...(checkPermissionUpdate && register(`details.emergencyContact[${index}].name`))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      size='small'
                      label={t('Employee.Relation')}
                      defaultValue={emergencyContact.relation || ''}
                      fullWidth
                      variant='outlined'
                      disabled={!checkPermissionUpdate}
                      {...(checkPermissionUpdate && register(`details.emergencyContact[${index}].relation`))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      size='small'
                      label={t('Employee.Phone_Number')}
                      defaultValue={emergencyContact.phoneNumber || ''}
                      fullWidth
                      variant='outlined'
                      disabled={!checkPermissionUpdate}
                      {...(checkPermissionUpdate && register(`details.emergencyContact[${index}].phoneNumber`))}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        {checkPermissionUpdate && (
                          <IconButton onClick={() => handleDeleteEmergency(index)}>
                            <Icon icon='tabler:x' fontSize='1.25rem' />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          {checkPermissionUpdate && (
            <Button
              variant='contained'
              size={'small'}
              color='primary'
              style={{ marginTop: '20px' }}
              className={'button-padding-style'}
              onClick={handleAddContact}
            >
              <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Employee.Add_Contact')}
            </Button>
          )}
        </CardContent>
      </AccordionDetails>
    </Accordion>
  )
}
