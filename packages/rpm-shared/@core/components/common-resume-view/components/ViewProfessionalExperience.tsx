import React from 'react'
import { ResumeProfExperience } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import AccordionDetails from '@mui/material/AccordionDetails'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import { MuiChipsInput } from 'mui-chips-input'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Autocomplete from '@mui/material/Autocomplete'
import { countries } from 'template-shared/public/countries'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

interface ProfessionalExperienceProps {
  editedData: ResumeTypes
  setEditedData: (ResumeTypes) => void
  displayed: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

const ViewProfessionalExperience = (props: ProfessionalExperienceProps) => {
  const { editedData, setEditedData, displayed, permissionApplication, permissionPage, permissionAction } = props
  const { t } = useTranslation()
  const { handleSaveChangeWithName } = useUpdateProperty({ guiName: 'ResumeDetails' })
  const handleAddProfExperience = () => {
    setEditedData(prevData => ({
      ...prevData,
      details: {
        ...prevData.details,
        profExperiences: [
          ...(prevData.details?.profExperiences || []),
          {
            jobTitle: '',
            employer: '',
            city: '',
            country: '',
            startDate: new Date(),
            endDate: new Date(),
            workhere: false,
            description: '',
            technology: []
          }
        ]
      }
    }))
  }
  const handleDeleteEntry = (field: string, index: number) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData }
      if (updatedData.details && updatedData.details[field]) {
        updatedData.details[field].splice(index, 1)
      }

      return updatedData
    })
  }

  const handleProfExperienceChange = (
    index: number,
    field: keyof ResumeProfExperience,
    value: string | Date | boolean | string[]
  ) => {
    if (!checkPermission(permissionApplication, permissionPage, permissionAction)) {
      setEditedData(prevData => {
        const updatedData = { ...prevData }

        // Ensure profExperiences array exists
        if (!updatedData.details.profExperiences) {
          updatedData.details.profExperiences = []
        }
        if (!updatedData.details.profExperiences[index]) {
          updatedData.details.profExperiences[index] = {
            jobTitle: '',
            employer: '',
            city: '',
            country: '',
            startDate: new Date(),
            endDate: new Date(),
            workhere: false,
            description: '',
            technology: []
          }
        }
        if (field === 'workhere' && updatedData.details) {
          updatedData.details.profExperiences[index][field] = value
        }
        if (field === 'workhere' && value) {
          updatedData.details.profExperiences.forEach((f, i) => {
            if (i !== index) {
              f.disabledWorkhere = true
              f.workhere = false
            }
          })
          updatedData.details.profExperiences[index].disabledWorkhere = false

          updatedData.details.profExperiences[index].endDate = null
        }
        if (field === 'workhere' && !value) {
          updatedData.details.profExperiences.forEach(f => {
            f.disabledWorkhere = false
            f.workhere = false
          })
        }

        const newValue =
          field === 'startDate' || field === 'endDate' ? (value ? new Date(value.toString()) : null) : value

        updatedData.details.profExperiences[index][field] = newValue

        return updatedData
      })
    }
  }

  return (
    <Accordion
      sx={{ mt: '0.5rem !important' }}
      onChange={(e, expended) => handleSaveChangeWithName(expended, 'ProfessionalExperience')}
      defaultExpanded={displayed}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        id='form-layouts-collapsible-header-1'
        aria-controls='form-layouts-collapsible-content-1'
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          {t('Resume.Professional_Experience')}
        </Typography>
      </AccordionSummary>
      <Divider sx={{ m: '0 !important' }} />

      <AccordionDetails>
        {/* Resume Details: Professional Experience */}
        {editedData.details?.profExperiences?.map((exp, index) => (
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
                onClick={() => handleDeleteEntry('profExperiences', index)}
              >
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </IconButton>
            )}

            <Grid container spacing={2} key={index}>
              <Grid item sm={6}>
                <TextField
                  size='small'
                  label={t('Resume.Job_Title')}
                  fullWidth
                  variant='outlined'
                  value={exp.jobTitle || ''}
                  required={true}
                  onChange={e => handleProfExperienceChange(index, 'jobTitle', e.target.value)}
                />
                {/* Add more fields for Professional Experience */}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  size='small'
                  label={t('Resume.Employer')}
                  fullWidth
                  variant='outlined'
                  required={true}
                  value={exp.employer || ''}
                  onChange={e => handleProfExperienceChange(index, 'employer', e.target.value)}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  size='small'
                  label={t('Address.City')}
                  fullWidth
                  variant='outlined'
                  value={exp.city || ''}
                  onChange={e => handleProfExperienceChange(index, 'city', e.target.value)}
                />
              </Grid>
              <Grid item sm={6}>
                <Autocomplete
                  size='small'
                  value={exp.country || ''}
                  fullWidth
                  options={countries}
                  sx={{ minWidth: 577 }}
                  onChange={(event, newValue) => {
                    handleProfExperienceChange(index, 'country', newValue)
                  }}
                  renderInput={params => (
                    <TextField fullWidth sx={{ minWidth: 577 }} {...params} label={t('Address.Country')} />
                  )}
                />
              </Grid>

              <Grid item sm={12} md={6}>
                <DatePickerWrapper className='small-input-data'>
                  <DatePicker
                    selected={new Date(exp.startDate)}
                    dateFormat='dd/MM/yyyy'
                    onChange={e => handleProfExperienceChange(index, 'startDate', e)}
                    customInput={<TextField size='small' fullWidth label={t('start_date')} />}
                  />
                </DatePickerWrapper>
              </Grid>

              <Grid item sm={12} md={6}>
                {!exp.workhere && (
                  <DatePickerWrapper className='small-input-data'>
                    <DatePicker
                      disabled={exp.workhere}
                      selected={new Date(exp.endDate)}
                      dateFormat='dd/MM/yyyy'
                      onChange={e => handleProfExperienceChange(index, 'endDate', e)}
                      customInput={<TextField size='small' fullWidth label={t('end_date')} />}
                    />
                  </DatePickerWrapper>
                )}
              </Grid>
              <Grid item sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={exp.disabledWorkhere}
                      checked={exp.workhere || false}
                      onChange={() => handleProfExperienceChange(index, 'workhere', !exp.workhere)}
                      name='workhere'
                      color='primary'
                    />
                  }
                  label={t('Resume.Currently_Working_Here')}
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  size='small'
                  multiline
                  maxRows={10}
                  minRows={4}
                  label={t('Description')}
                  fullWidth
                  variant='outlined'
                  value={exp.description || ''}
                  onChange={e => handleProfExperienceChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item sm={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <MuiChipsInput
                    size='small'
                    value={exp.technology || []}
                    name={t('Resume.Add_Technology') as string}
                    onChange={e =>
                      checkPermission(permissionApplication, permissionPage, permissionAction) &&
                      handleProfExperienceChange(index, 'technology', e)
                    }
                    placeholder={t('Resume.Add_Technology') as string}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        ))}

        {checkPermission(permissionApplication, permissionPage, permissionAction) && (
          <Grid container style={{ marginTop: '10px' }} spacing={2}>
            <Grid container item md={12} sx={{ justifyContent: 'left', paddingBottom: '20px' }}>
              <Button
                variant='contained'
                className={'button-padding-style'}
                size={'small'}
                onClick={handleAddProfExperience}
              >
                <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Resume.Add_Professional_Experience')}
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default ViewProfessionalExperience
