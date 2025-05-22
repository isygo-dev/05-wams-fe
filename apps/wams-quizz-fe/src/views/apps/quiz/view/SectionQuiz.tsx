// ** MUI Imports
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Repeater from 'template-shared/@core/components/repeater'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Divider from '@mui/material/Divider'
import QuestionQuiz from './QuestionQuiz'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { QuizDetailType } from 'quiz-shared/@core/types/quiz/quizTypes'

interface SectionQuizProps {
  sectionsCount: number
  toggleAdd: () => void
  toggleDelete: (index: number) => void
  control: Control<QuizDetailType>
  errors: FieldErrors<QuizDetailType>
  getValues: UseFormGetValues<QuizDetailType>
  setValue: UseFormSetValue<QuizDetailType>
  setImages: any
}

const SectionsView = (props: SectionQuizProps) => {
  const { control, sectionsCount, toggleAdd, toggleDelete, errors, setValue, getValues, setImages } = props
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(null)

  const { t } = useTranslation()

  const handleOpenDeleteDialog = (index: number) => {
    setDeleteDialogOpen(true)
    setIndex(index)
  }

  const getLink = (i: number) => {
    const id: number | string = control._defaultValues.sections?.[i].id

    return `${id}`
  }

  return (
    <>
      <Grid container sx={{ mt: 4 }}>
        <Grid item md={12}>
          <Card sx={{ boxShadow: 'none' }}>
            {control._defaultValues.sections?.length === 0 ? (
              <Grid container item md={12} sx={{ paddingLeft: '20px', paddingBottom: '20px' }}>
                <Typography variant={'h6'}>{t('Quiz.No_Section_Existe')}</Typography>
              </Grid>
            ) : (
              <Repeater count={sectionsCount}>
                {(i: number) => {
                  return (
                    <Accordion
                      defaultExpanded={i === 0}
                      className={'pl-4-rem'}
                      key={i}
                      sx={{
                        margin: '20px !important',
                        paddingRight: '0px !important',
                        paddingTop: '0px !important',
                        paddingBottom: '0px !important',
                        boxShadow:
                          '0px 3px 9px 1px rgb(51 48 60 / 21%), 0px 8px 9px 0px rgba(51, 48, 60, 0.02), 0px 1px 6px 4px rgba(51, 48, 60, 0.01) !important'
                      }}
                    >
                      <AccordionSummary
                        id={`panel-header-1${i}`}
                        aria-controls='panel-content-1'
                        expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
                      >
                        <Controller
                          name={`sections.${i}.name`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value } }) => (
                            <Typography variant={'h6'}>
                              <strong>
                                {value?.length > 0 ? (
                                  <>
                                    {i}- {value}
                                  </>
                                ) : (
                                  <>
                                    {t('Quiz.Section')}-{i}
                                  </>
                                )}
                              </strong>
                            </Typography>
                          )}
                        />
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          paddingLeft: '0px !important',
                          paddingRight: '0px !important'
                        }}
                      >
                        <div id={getLink(i)}>
                          <Card
                            sx={{
                              boxShadow: 'none',
                              margin: '0px !important',
                              padding: '0px !important'
                            }}
                            key={i}
                          >
                            <CardHeader
                              sx={{
                                paddingBottom: '0px !important',
                                paddingTop: '0px !important'
                              }}
                              action={
                                <Tooltip title={t('Action.Delete') as string}>
                                  <IconButton size='small' onClick={() => handleOpenDeleteDialog(i)}>
                                    <Icon icon='tabler:trash' fontSize='1.25rem' />
                                  </IconButton>
                                </Tooltip>
                              }
                            />
                            {deleteDialogOpen && (
                              <DeleteCommonDialog
                                open={deleteDialogOpen}
                                setOpen={setDeleteDialogOpen}
                                selectedRowId={index}
                                onDelete={toggleDelete}
                                item='Sections'
                              />
                            )}
                            <CardContent key={i}>
                              <Grid container item md={12} spacing={3}>
                                <Grid item md={6}>
                                  <FormControl fullWidth>
                                    <Controller
                                      name={`sections.${i}.name`}
                                      control={control}
                                      rules={{ required: true }}
                                      render={({ field: { value, onChange } }) => (
                                        <TextField
                                          size='small'
                                          value={value}
                                          label={t('Name')}
                                          onChange={onChange}
                                          error={Boolean(errors?.sections?.[i]?.name)}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={6}>
                                  <FormControl>
                                    <Controller
                                      name={`sections.${i}.order`}
                                      control={control}
                                      rules={{ required: true }}
                                      render={({ field: { onChange } }) => (
                                        <TextField
                                          size='small'
                                          value={i + 1}
                                          label={t('Order')}
                                          disabled
                                          onChange={onChange}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>

                              <Grid container sx={{ mt: 4 }}>
                                <FormControl fullWidth>
                                  <Controller
                                    name={`sections.${i}.description`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                      <TextField
                                        size='small'
                                        value={value}
                                        label={t('Description')}
                                        multiline
                                        rows={3}
                                        onChange={onChange}
                                      />
                                    )}
                                  />
                                </FormControl>

                                <FormControl fullWidth>
                                  <Controller
                                    name={`sections.${i}.questions`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value } }) => (
                                      <>
                                        <Divider
                                          sx={{
                                            fontSize: '0.875rem',
                                            color: 'text.disabled',
                                            '& .MuiDivider-wrapper': { px: 6 },
                                            my: theme => `${theme.spacing(6)} !important`
                                          }}
                                        />
                                        <QuestionQuiz
                                          questionCount={value?.length}
                                          i={i}
                                          control={control}
                                          getValues={getValues}
                                          setValue={setValue}
                                          setImages={setImages}
                                        />
                                      </>
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                            </CardContent>
                          </Card>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )
                }}
              </Repeater>
            )}
            <CardHeader
              action={
                <Button variant='contained' className={'button-padding-style'} onClick={() => toggleAdd()}>
                  {t('Quiz.Add_Section')} <Icon icon='tabler:plus' style={{ marginLeft: '10px' }} />
                </Button>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default SectionsView
