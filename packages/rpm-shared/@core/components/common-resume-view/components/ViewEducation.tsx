import React from 'react'
import { useTranslation } from 'react-i18next'
import AccordionDetails from '@mui/material/AccordionDetails'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Button from '@mui/material/Button'
import { Accordion } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import Autocomplete from '@mui/material/Autocomplete'
import { countries } from 'template-shared/public/countries'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

interface EducationProps {
  editedData: ResumeTypes
  setEditedData: (ResumeTypes) => void
  displayed: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

const ViewEducation = (props: EducationProps) => {
  const { editedData, setEditedData, displayed, permissionApplication, permissionPage, permissionAction } = props
  const { t } = useTranslation()
  const { handleSaveChangeWithName } = useUpdateProperty({ guiName: 'ResumeDetails' })
  const handleDeleteEntry = (field: string, index: number) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData }
      if (updatedData.details && updatedData.details[field]) {
        updatedData.details[field].splice(index, 1)
      }

      return updatedData
    })
  }

  const handleAddEducation = () => {
    setEditedData(prevData => ({
      ...prevData,
      details: {
        ...prevData.details,
        educations: [
          ...(prevData.details?.educations || []),
          {
            institution: '',
            city: '',
            qualification: '',
            fieldOfStudy: '',
            yearOfGraduation: new Date()
          }
        ]
      }
    }))
  }
  const handleEducationChange = (index: number, key: string, value: string | Date | boolean | string[]) => {
    if (!checkPermission(permissionApplication, permissionPage, permissionAction)) {
      const newEducations = [...(editedData?.details?.educations || [])]
      const newEducationObject = { ...newEducations[index] }

      newEducationObject[key] = value

      newEducations[index] = newEducationObject
      setEditedData(prevData => ({
        ...prevData,
        details: {
          ...prevData.details,
          educations: newEducations
        }
      }))
    }
  }

  return (
    <Accordion
      className={'accordion-expanded'}
      onChange={(e, expended) => handleSaveChangeWithName(expended, 'Education')}
      defaultExpanded={displayed}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        id='form-layouts-collapsible-header-1'
        aria-controls='form-layouts-collapsible-content-1'
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          {t('Education')}
        </Typography>
      </AccordionSummary>
      <Divider sx={{ m: '0 !important' }} />

      <AccordionDetails>
        {/* ... (other code) */}
        {editedData.details?.educations?.map((edu, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '20px'
            }}
          >
            {checkPermission(permissionApplication, permissionPage, permissionAction) && (
              <IconButton
                style={{ marginLeft: '98%' }}
                size='small'
                onClick={() => handleDeleteEntry('educations', index)}
              >
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </IconButton>
            )}
            <Grid container spacing={2} key={index}>
              <Grid item sm={12} md={6}>
                <TextField
                  size='small'
                  label={t('Resume.Institution')}
                  fullWidth
                  required={true}
                  variant='outlined'
                  value={edu.institution || ''}
                  onChange={e => handleEducationChange(index, 'institution', e.target.value)}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  size='small'
                  label={t('Resume.Field_of_Study')}
                  fullWidth
                  variant='outlined'
                  value={edu.fieldOfStudy || ''}
                  onChange={e => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <TextField
                  size='small'
                  label={t('Resume.Qualification')}
                  fullWidth
                  variant='outlined'
                  value={edu.qualification || ''}
                  onChange={e => handleEducationChange(index, 'qualification', e.target.value)}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <DatePickerWrapper className='small-input-data'>
                  <DatePicker
                    selected={new Date(edu.yearOfGraduation)}
                    dateFormat='MM/yyyy'
                    onChange={e => handleEducationChange(index, 'yearOfGraduation', e)}
                    customInput={<TextField size='small' fullWidth label={t('Resume.year_Of_Graduation')} />}
                  />
                </DatePickerWrapper>
              </Grid>

              <Grid item sm={12} md={6}>
                <TextField
                  size='small'
                  label={t('Address.City')}
                  fullWidth
                  variant='outlined'
                  value={edu.city || ''}
                  onChange={e => handleEducationChange(index, 'city', e.target.value)}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <Autocomplete
                  size='small'
                  value={edu?.country || ''}
                  fullWidth
                  options={countries}
                  sx={{ minWidth: 577 }}
                  onChange={(event, newValue) => {
                    handleEducationChange(index, 'country', newValue)
                  }}
                  renderInput={params => (
                    <TextField fullWidth sx={{ minWidth: 577 }} {...params} label={t('Address.Country')} />
                  )}
                />
              </Grid>
            </Grid>
          </div>
        ))}
        {checkPermission(permissionApplication, permissionPage, permissionAction) && (
          <Grid container style={{ marginTop: '10px' }} spacing={2}>
            <Grid container item md={12} sx={{ justifyContent: 'left', paddingBottom: '20px' }}>
              <Button
                variant='contained'
                size={'small'}
                className={'button-padding-style'}
                onClick={handleAddEducation}
              >
                <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Resume.Add_Education')}
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default ViewEducation
