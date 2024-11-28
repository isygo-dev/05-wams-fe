import React, {useContext, useState} from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {Controller, useFormContext} from 'react-hook-form'
import {EmployeeContext} from '../../../../pages/apps/employee/view/[id]'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import {useTranslation} from 'react-i18next'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import {IEnumLanguageLevelType} from 'hrm-shared/@core/types/hrm/employeeTypes'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import {useQuery} from 'react-query'
import {AccordionDetails, AccordionSummary} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import {AppQuery} from "template-shared/@core/utils/fetchWrapper";

export default function LanguageChipsInput({checkPermissionUpdate}) {
  const {t} = useTranslation()
  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData || {}

  const [languagesEmployee, setLanguagesEmployee] = useState(
    employeeData.details?.languages || [
      {
        languageName: '',
        level: null
      }
    ]
  )

  const {register, control} = useFormContext()

  const fetchLanguages = async () => {
    const response = await AppQuery('https://restcountries.com/v3/all')
    const data = await response.json()
    const uniqueLanguages = new Set()
    data.forEach(country => {
      const languages = country.languages
      if (typeof languages === 'object' && languages !== null) {
        Object.values(languages).forEach(language => {
          uniqueLanguages.add(language)
        })
      }
    })

    return Array.from(uniqueLanguages)
  }

  const {data: languages} = useQuery('languages', fetchLanguages)

  const handleAddLanguage = () => {
    setLanguagesEmployee([...languagesEmployee, {languageName: '', level: ''}])
  }

  const handleInputChange = (index, newInputValue) => {
    setLanguagesEmployee(prevLanguagesEmployee => {
      const updatedLanguagesEmployee = [...prevLanguagesEmployee]
      updatedLanguagesEmployee[index].languageName = newInputValue

      return updatedLanguagesEmployee
    })
  }

  const handleDeleteLanguage = index => {
    setLanguagesEmployee(prevLanguagesEmployee => prevLanguagesEmployee.filter((_, i) => i !== index))
  }

  return (
    <Accordion defaultExpanded={false} style={{marginTop: 16}}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down'/>}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Employee.Languages')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {languagesEmployee.map((languageEmployee, index) => (
          <div key={index}>
            <Grid container spacing={3} sx={{mt: 1}}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id={`language-input-${index}`}
                  freeSolo
                  options={languages}
                  inputValue={languageEmployee.languageName}
                  onInputChange={(event, newInputValue) => handleInputChange(index, newInputValue)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      size='small'
                      label={t('Employee.Language_Name')}
                      fullWidth
                      variant='outlined'
                      {...checkPermissionUpdate && register(`details.languages[${index}].languageName`)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl size='small' style={{width: '100%', marginRight: '10px'}}>
                  <InputLabel>{t('Employee.Level')}</InputLabel>
                  <Controller
                    name={`details.languages[${index}].level`}
                    control={control}
                    defaultValue={languageEmployee.level}
                    render={({field: {value, onChange}}) => (
                      <Select
                        value={value || ''}
                        fullWidth
                        onChange={checkPermissionUpdate && onChange}
                        variant='outlined'
                        label={t('Employee.Level')}
                        disabled={!checkPermissionUpdate}
                      >
                        <MenuItem value={IEnumLanguageLevelType.BEGINNER}>{t('Employee.Beginner')}</MenuItem>
                        <MenuItem value={IEnumLanguageLevelType.GOOD}>{t('Employee.Good')}</MenuItem>
                        <MenuItem value={IEnumLanguageLevelType.ALRIGHT}>{t('Employee.Alright')}</MenuItem>
                        <MenuItem value={IEnumLanguageLevelType.FLUENT}>{t('Employee.Fluent')}</MenuItem>
                        <MenuItem value={IEnumLanguageLevelType.INTERMEDIATE}>{t('Employee.Intermediate')}</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item>
                    {checkPermissionUpdate &&
                      <IconButton onClick={() => handleDeleteLanguage(index)}>
                        <Icon icon='tabler:x' fontSize='1.25rem'/>
                      </IconButton>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{mt: 2, mb: 2}}/>
          </div>
        ))}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {checkPermissionUpdate &&

              <Button variant='contained'
                      size={'small'}
                      color='primary'
                      sx={{marginTop: '20px'}}
                      className={'button-padding-style'}
                      onClick={handleAddLanguage}>
                <Icon icon='tabler:plus'
                      style={{marginRight: '6px'}}/> {t('Employee.Add_language')}
              </Button>
            }
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
