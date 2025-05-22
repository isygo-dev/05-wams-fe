import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { Option, QuizDetailType } from 'quiz-shared/@core/types/quiz/quizTypes'
import { useTranslation } from 'react-i18next'
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Repeater from 'template-shared/@core/components/repeater'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'

interface QuestionQuizProps {
  countOptions: number
  control: Control<QuizDetailType>
  indexSection: number
  indexQuestion: number
  getValues: UseFormGetValues<QuizDetailType>
  setValue: UseFormSetValue<QuizDetailType>
}

const MCQMA = (props: QuestionQuizProps) => {
  const { control, countOptions, setValue, getValues, indexSection, indexQuestion } = props
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(null)
  const { t } = useTranslation()

  const [count, setCount] = useState<number>(countOptions)

  const handleOpenDeleteDialog = (index: number) => {
    setDeleteDialogOpen(true)
    setIndex(index)
  }

  const handelDeleteOption = (x: number) => {
    const options: Option[] = getValues().sections?.[indexSection].questions?.[indexQuestion].options.filter(
      (e, i) => i !== x
    ) as Option[]
    setValue(`sections.${indexSection}.questions.${indexQuestion}.options`, options)
    setCount(count - 1)
    control._reset(getValues())
  }

  const handleAddOptions = () => {
    control._defaultValues.sections?.[indexSection].questions?.[indexQuestion].options.push({
      option: '',
      checked: false
    })
    setCount(count + 1)
  }

  const handleChangeChek = (checked: boolean, ind: number) => {
    const newList = getValues()
    newList.sections?.[indexSection].questions?.[indexQuestion].options?.forEach((o, i) => {
      if (i === ind) {
        o.checked = checked
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
      <Grid container>
        <Grid container item md={12} sx={{ mt: 2 }}>
          <Repeater count={count} key={`sections.${indexSection}.questions.${indexQuestion}.id`}>
            {(x: number) => {
              return (
                <div key={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.id`}>
                  <Grid container spacing={3} sx={{ mt: 1, mb: 6 }}>
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
                      <FormControl sx={{ mt: 3 }} fullWidth>
                        <Controller
                          name={`sections.${indexSection}.questions.${indexQuestion}.textAnswer`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              size='small'
                              multiline
                              rows={3}
                              value={value}
                              label={t('Quiz.Answer')}
                              onChange={onChange}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <FormControl sx={{ width: 'fit-content !important' }}>
                          <Checkbox
                            checked={
                              control._defaultValues.sections?.[indexSection].questions?.[indexQuestion].options?.[x]
                                .checked
                            }
                            onChange={e => handleChangeChek(e.target.checked, x)}
                            name={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.option`}
                            value={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.checked`}
                          />
                        </FormControl>
                        <Tooltip title={t('Action.Delete') as string}>
                          <IconButton size='large' onClick={() => handleOpenDeleteDialog(x)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
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
      </Grid>
    </>
  )
}

export default MCQMA
