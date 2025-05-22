import React from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Button from '@mui/material/Button'
import AccordionDetails from '@mui/material/AccordionDetails'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

interface LanguageProps {
  editedData: ResumeTypes
  setEditedData: (ResumeTypes) => void
  displayed: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

const ViewLanguage = (props: LanguageProps) => {
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
  const handleAddLanguage = () => {
    setEditedData(prevData => ({
      ...prevData,
      details: {
        ...prevData.details,
        languages: [...(prevData.details?.languages || []), { name: '', level: 'BEGINNER' }]
      }
    }))
  }
  const handleLanguageChange = (index: number, key: string, value: string | Date | boolean | string[]) => {
    if (!checkPermission(permissionApplication, permissionPage, permissionAction)) {
      const newLanguages = [...(editedData?.details?.languages || [])]
      const newLanguageObject = { ...newLanguages[index] }
      newLanguageObject[key] = value
      newLanguages[index] = newLanguageObject
      setEditedData(prevData => ({
        ...prevData,
        details: {
          ...prevData.details,
          languages: newLanguages
        }
      }))
    }
  }

  return (
    <Accordion
      className={'accordion-expanded'}
      onChange={(e, expended) => handleSaveChangeWithName(expended, 'Language')}
      defaultExpanded={displayed}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        id='form-layouts-collapsible-header-1'
        aria-controls='form-layouts-collapsible-content-1'
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          {t('Language')}
        </Typography>
      </AccordionSummary>
      <Divider sx={{ m: '0 !important' }} />

      <AccordionDetails>
        <Grid container>
          {/* ... (other fields and sections) */}
          <Grid item xs={12} sm={12}>
            {editedData.details?.languages?.map((language, index) => (
              <Grid container key={index} spacing={4} sx={{ mt: 1 }}>
                <Grid item>
                  <TextField
                    label='Language'
                    required={true}
                    fullWidth
                    variant='outlined'
                    size='small'
                    value={language.name || ''}
                    onChange={e => handleLanguageChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <FormControl size='small'>
                        <InputLabel>{t('Level')}</InputLabel>
                        <Select
                          disabled={!checkPermission(permissionApplication, permissionPage, permissionAction)}
                          value={language.level || ''}
                          onChange={e => handleLanguageChange(index, 'level', e.target.value)}
                          label='Level'
                        >
                          <MenuItem value='BEGINNER'>{t('Beginner')}</MenuItem>
                          <MenuItem value='INTERMEDIATE'>{t('Intermediate')}</MenuItem>
                          <MenuItem value='GOOD'>Good</MenuItem>
                          <MenuItem value='ALRIGHT'>Alright</MenuItem>
                          <MenuItem value='FLUENT'>Fluent</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {checkPermission(permissionApplication, permissionPage, permissionAction) && (
                      <Grid item>
                        <Grid container>
                          <Grid item>
                            <IconButton onClick={() => handleDeleteEntry('languages', index)}>
                              <Icon icon='tabler:x' fontSize='1.25rem' />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {checkPermission(permissionApplication, permissionPage, permissionAction) && (
          <Grid container style={{ marginTop: '10px' }} spacing={2}>
            <Grid container item md={12} sx={{ justifyContent: 'left', paddingBottom: '20px' }}>
              <Button variant='contained' size={'small'} className={'button-padding-style'} onClick={handleAddLanguage}>
                <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Resume.Add_Language')}
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default ViewLanguage
