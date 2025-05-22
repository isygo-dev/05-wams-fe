import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { Tooltip } from '@mui/material'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

interface SkillFormProps {
  onSkillsData: (skills: { hardSkills: Skill[]; softSkills: Skill[] }) => void
  existingSkills: any
}

interface Skill {
  id?: number
  name: string
  level: string
  isMandatory?: boolean
}

const SkillForm: React.FC<SkillFormProps> = ({ onSkillsData, existingSkills }) => {
  const { control } = useForm()
  const { t } = useTranslation()

  const [skills, setSkills] = useState<{ hardSkills: Skill[]; softSkills: Skill[] }>({
    hardSkills: existingSkills?.hardSkills || [],
    softSkills: existingSkills?.softSkills || []
  })
  console.log(skills)
  const addSkill = (type: string) => {
    const newSkill: Skill = { name: '', level: 'BEGINNER', isMandatory: true }
    setSkills((prevSkills: any) => ({
      ...prevSkills,
      [type]: [...prevSkills[type], newSkill]
    }))
  }

  const deleteSkill = (type: string, itemIndex: number) => {
    const newSkills = { ...skills }
    if (type === 'softSkills') {
      newSkills.softSkills = newSkills.softSkills.filter((_, index) => index !== itemIndex)
    } else {
      newSkills.hardSkills = newSkills.hardSkills.filter((_, index) => index !== itemIndex)
    }
    setSkills(newSkills)
    onSkillsData(newSkills)
  }

  const handleSkillChange = (type: string, itemIndex: number, field: string, value: any) => {
    if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)) {
      const newSkills = { ...skills }
      newSkills[type][itemIndex][field] = value
      setSkills(newSkills)
      onSkillsData(newSkills)
    }
  }

  const renderSkill = (skill: Skill, index: number, type: string) => (
    <Grid container spacing={2} key={`${type}[${index}]`} sx={{ mt: 2 }}>
      <Grid item md={1} xs={12} sm={12}>
        <Tooltip title='Does This skill mandatory ?' placement='top'>
          <FormControlLabel
            labelPlacement='top'
            label=''
            control={
              <Controller
                name={`${type}[${index}].isMandatory`}
                control={control}
                defaultValue={skill.isMandatory}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value}
                    onChange={e => {
                      checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                        onChange(e)
                      checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                        handleSkillChange(type, index, 'isMandatory', e.target.checked)
                    }}
                  />
                )}
              />
            }
            sx={{ mb: 4, alignItems: 'flex-start', marginLeft: 0 }}
          />
        </Tooltip>
      </Grid>
      <Grid item md={6} xs={12} sm={12}>
        <Controller
          name={`${type}[${index}].name`}
          control={control}
          defaultValue={skill.name}
          render={({ field: { onChange, value } }) => (
            <TextField
              size='small'
              label={t('Skill Name')}
              value={value}
              onChange={e => {
                checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                  onChange(e)
                checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                  handleSkillChange(type, index, 'name', e.target.value)
              }}
              fullWidth
              variant='outlined'
            />
          )}
        />
      </Grid>
      <Grid item md={4} xs={12} sm={12}>
        <Controller
          name={`${type}[${index}].level`}
          control={control}
          defaultValue={skill.level}
          render={({ field: { onChange, value } }) => (
            <FormControl size='small' sx={{ width: '90%' }}>
              <InputLabel>{t('Job.Level')}</InputLabel>
              <Select
                disabled={!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                value={value}
                onChange={e => {
                  checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                    onChange(e)
                  checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                    handleSkillChange(type, index, 'level', e.target.value)
                }}
                fullWidth
                variant='outlined'
                label='Level'
              >
                <MenuItem value='BEGINNER'>{t('Beginner')}</MenuItem>
                <MenuItem value='INTERMEDIATE'>{t('Intermediate')}</MenuItem>
                <MenuItem value='CONFIRMED'>{t('Confirmed')}</MenuItem>
                <MenuItem value='EXPERT'>{t('Expert')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && (
          <IconButton size='small' onClick={() => deleteSkill(type, index)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        )}
      </Grid>
    </Grid>
  )

  return (
    <>
      <Grid container>
        <Typography>{t('Job.Hard_Skills')}</Typography>
        <Grid item xs={12} sm={12} md={12}>
          {skills.hardSkills.map((skill, index) => renderSkill(skill, index, 'hardSkills'))}
        </Grid>
      </Grid>

      {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && (
        <Grid>
          <Button
            variant='contained'
            size={'small'}
            className={'button-padding-style'}
            color='primary'
            sx={{ mt: 2 }}
            onClick={() => addSkill('hardSkills')}
          >
            <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Job.Add_Hard_Skills')}
          </Button>
        </Grid>
      )}

      <Grid sx={{ mt: 3 }}>
        <Typography>{t('Job.Soft_Skills')}</Typography>
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          {skills.softSkills.map((skill, index) => renderSkill(skill, index, 'softSkills'))}
        </Grid>
      </Grid>
      {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && (
        <Grid>
          <Button
            variant='contained'
            size={'small'}
            color='primary'
            className={'button-padding-style'}
            sx={{ mt: 2 }}
            onClick={() => addSkill('softSkills')}
          >
            <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Job.Add_Soft_Skills')}
          </Button>
        </Grid>
      )}
    </>
  )
}

export default SkillForm
