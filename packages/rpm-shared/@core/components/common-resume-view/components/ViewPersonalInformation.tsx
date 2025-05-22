import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import FormControl from '@mui/material/FormControl'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import { MuiChipsInput } from 'mui-chips-input'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import EventIcon from '@mui/icons-material/Event'
import IconButton from '@mui/material/IconButton'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

const ViewPersonalInformation = props => {
  const { editedData, setEditedData, setIsFormValid, tags, setTags } = props
  const { t } = useTranslation()

  const handleInputChange = (field: keyof ResumeTypes, value: any) => {
    if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)) {
      setEditedData(prevData => {
        const updatedData = { ...prevData }
        updatedData[field] = value
        if (field === 'email') {
          const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
          if (!value.match(emailPattern)) {
            updatedData.errors = {
              ...updatedData.errors,
              email: 'Invalid email address'
            }
            setIsFormValid(false)
          } else {
            updatedData.errors = {
              ...updatedData.errors,
              email: undefined
            }
            setIsFormValid(true)
          }
        } else setIsFormValid(true)

        return updatedData
      })
    }
  }
  const handleChange = newValue => {
    const updatedValue = newValue.replace(/\s+/g, '')
    setEditedData(prevData => ({
      ...prevData,
      phone: updatedValue
    }))
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={t('Resume.Personal_Information')} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item sm={12} xs={12} md={6}>
            <TextField
              size='small'
              label={t('FirstName')}
              value={editedData.firstName}
              fullWidth
              variant='outlined'
              onChange={e => handleInputChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={6}>
            <TextField
              size='small'
              label={t('LastName')}
              value={editedData.lastName}
              fullWidth
              variant='outlined'
              onChange={e => handleInputChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={6}>
            <TextField
              size='small'
              label={t('Nationality')}
              value={editedData.nationality || ''}
              fullWidth
              variant='outlined'
              onChange={e => handleInputChange('nationality', e.target.value)}
            />
          </Grid>

          <Grid item sm={12} xs={12} md={6}>
            <DatePickerWrapper className='small-input-data'>
              <DatePicker
                selected={new Date(editedData.birthDate)}
                dateFormat='dd/MM/yyyy'
                onChange={date => handleInputChange('birthDate', date)}
                customInput={
                  <TextField
                    size='small'
                    fullWidth
                    label={t('Birth Date')}
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <EventIcon />
                        </IconButton>
                      )
                    }}
                  />
                }
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item sm={12} xs={12} md={6}>
            <EmailInputMask
              value={editedData.email}
              onChange={value => handleInputChange('email', value)}
              error={!!editedData.errors?.email}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={6}>
            <MuiPhoneNumber
              variant='outlined'
              fullWidth
              size='small'
              defaultCountry={'tn'}
              countryCodeEditable={true}
              label={t('Phone_Number')}
              value={editedData.phone || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            <FormControl fullWidth>
              <MuiChipsInput
                size='small'
                value={tags || ''}
                name={t('tags') as string}
                onChange={newTags => setTags(newTags)}
                placeholder={t('Enter Tags...') as string}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ViewPersonalInformation
