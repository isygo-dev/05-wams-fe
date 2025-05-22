// ** MUI Imports
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Repeater from 'template-shared/@core/components/repeater'
import { Radio } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Option, QuizDetailType } from 'quiz-shared/@core/types/quiz/quizTypes'

interface QuestionQuizProps {
  countOptions: number
  control: Control<QuizDetailType>
  indexSection: number
  indexQuestion: number
  getValues: UseFormGetValues<QuizDetailType>
  setValue: UseFormSetValue<QuizDetailType>
}

const MCQ = (props: QuestionQuizProps) => {
  const { t } = useTranslation()
  const { control, countOptions, setValue, getValues, indexSection, indexQuestion } = props
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(null)
  const [count, setCount] = useState<number>(countOptions)
  const handleOpenDeleteDialog = (index: number) => {
    setDeleteDialogOpen(true)
    setIndex(index)
  }

  const handelDeleteOption = (indexOption: number) => {
    console.log('indexOption', indexOption)
    const options: Option[] = getValues().sections?.[indexSection].questions?.[indexQuestion].options?.filter(
      (e, i) => i !== indexOption
    ) as Option[]
    setValue(`sections.${indexSection}.questions.${indexQuestion}.options`, options)
    setCount(count - 1)
    control._reset(getValues())
  }

  const handleAddOptions = () => {
    const newOption: Option = {
      option: '',
      checked: false
    }
    getValues().sections?.[indexSection].questions?.[indexQuestion].options.push(newOption)
    setCount(count + 1)
    console.log('get value', getValues().sections?.[indexSection].questions?.[indexQuestion].options)
  }

  const handleChangeChek = (ind: number) => {
    const newList = getValues()
    newList.sections?.[indexSection].questions?.[indexQuestion].options?.forEach((res, index) => {
      if (ind === index) {
        res.checked = true
      } else {
        res.checked = false
      }
    })

    setValue(
      `sections.${indexSection}.questions.${indexQuestion}.options`,
      newList.sections?.[indexSection].questions?.[indexQuestion].options as Option[]
    )
    control._reset(newList)
  }

  return (
    <>
      <Grid>
        <Repeater count={count} key={`sections.${indexSection}.questions.${indexQuestion}.id`}>
          {(x: number) => {
            return (
              <Grid
                container
                key={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.id`}
                sx={{ mb: 3 }}
              >
                <Grid item md={10}>
                  <FormControl fullWidth>
                    <Controller
                      name={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.option`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField size='small' value={value} label={t('Quiz.Option_Name')} onChange={onChange} />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sx={{ display: 'flex', justifyContent: 'end' }}>
                  <FormControl sx={{ width: 'fit-content !important' }}>
                    <Controller
                      name={`sections.${indexSection}.questions.${indexQuestion}.options`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value } }) => (
                        <RadioGroup
                          value={value[x]?.option}
                          name='controller'
                          sx={{ ml: 0.8 }}
                          onChange={() => handleChangeChek(x)}
                        >
                          <div>
                            <FormControlLabel
                              value={value}
                              label=''
                              control={
                                <Radio
                                  checked={
                                    control._defaultValues.sections?.[indexSection].questions?.[indexQuestion]
                                      .options?.[x]?.checked
                                  }
                                />
                              }
                            />
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <Tooltip title={t('Quiz.Delete_Option') as string}>
                    <IconButton size='small' onClick={() => handleOpenDeleteDialog(x)}>
                      <Icon icon='tabler:trash' fontSize='1.25rem' />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            )
          }}
        </Repeater>
        <Button
          variant='outlined'
          color='primary'
          sx={{ mb: 3, mt: 2 }}
          className={'button-padding-style'}
          onClick={() => handleAddOptions()}
        >
          {t('Quiz.Add_Options')} <Icon icon='tabler:plus' style={{ marginLeft: '10px' }} />
        </Button>
      </Grid>

      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={index}
          onDelete={handelDeleteOption}
          item='Option'
        />
      )}
    </>
  )
}

export default MCQ
