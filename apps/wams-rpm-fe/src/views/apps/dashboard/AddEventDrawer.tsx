import { Avatar, ListItem } from '@mui/material'
import AvatarGroup from '@mui/material/AvatarGroup'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import Icon from 'template-shared/@core/components/icon'
import React, { useEffect, useState } from 'react'
import rpmApiUrls from 'rpm-shared/configs/rpm_apis'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import { useTranslation } from 'react-i18next'
import { ItemType, MiniBoardEvent } from 'rpm-shared/@core/types/rpm/itemTypes'
import { useMutation, useQuery } from 'react-query'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import AnswerList from './AnswerList'
import IconButton from '@mui/material/IconButton'
import EventIcon from '@mui/icons-material/Event'
import AccountApis from 'ims-shared/@core/api/ims/account'
import QuizApis from 'quiz-shared/@core/api/quiz/quiz'
import QuizCandidateApis from 'quiz-shared/@core/api/quiz/candidate'
import { MinAccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import { InterviewEventType } from 'rpm-shared/@core/types/rpm/jobApplicationType'
import { AnswerType, QuestionDetailsType } from 'quiz-shared/@core/types/quiz/quizCandidateType'
import WorkflowBoardItemApis from 'rpm-shared/@core/api/rpm/workflow-board/item'

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  margin: 0,
  borderRadius: 0,
  boxShadow: 'none !important',
  border:
    theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,

  '&:not(:last-of-type), &:last-child .MuiAccordionSummary-root:not(.Mui-expanded)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: 'auto'
  },
  '&:first-of-type': {
    '& .MuiButtonBase-root': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    }
  },
  '&:last-of-type': {
    '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    }
  }
}))

// Styled component for AccordionSummary component
const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  marginBottom: -1,
  padding: theme.spacing(0, 4),
  minHeight: theme.spacing(12),
  transition: 'min-height 0.15s ease-in-out',
  backgroundColor: theme.palette.action[theme.palette.mode === 'light' ? 'hover' : 'selected'],
  borderBottom:
    theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,
  '&.Mui-expanded': {
    minHeight: theme.spacing(12)
  },
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    '&.Mui-expanded': {
      margin: '12px 0'
    }
  },
  '& .MuiTypography-root': {
    fontWeight: 400
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.text.secondary
  }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: `${theme.spacing(4)} !important`
}))

const Item = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

interface Props {
  open: boolean
  setClose: () => void
  event: MiniBoardEvent | undefined
  item: ItemType
  boardCode: string

  // accounts:MiniAccount[]
}

const AddEventDrawer = (props: Props) => {
  const { t } = useTranslation()
  const { open, setClose, event, item } = props
  const [defaultValues, setDefaultValues] = useState<InterviewEventType>({
    title: '',
    type: 'INTERVIEW',
    startDateTime: new Date(),
    endDateTime: new Date(),
    location: '',
    quizCode: '',
    participants: [],
    skills: [],
    comment: '',
    candidate: {
      code: '',
      email: '',
      fullName: '',
      accountCode: ''
    }
  })

  const { data: accounts, isLoading: isLoadingAccount } = useQuery([`accounts`], () =>
    AccountApis(t).getAccountDetails()
  )

  const { reset, control, handleSubmit, setValue, getValues } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const [checked, setChecked] = useState<MinAccountDto[]>([])

  const [allQuestions, setAllQuestions] = useState<QuestionDetailsType[]>([])
  const { data: quizByCategory } = useQuery('quizByCateory', () => QuizApis(t).getQuizByCategory('interview'))

  const { data: quizDataDetails } = useQuery(
    ['quizDataDetails', defaultValues?.quizCode, defaultValues?.candidate.code],
    () => {
      if (defaultValues?.quizCode) {
        return QuizApis(t).getQuizByCode(defaultValues.quizCode)
      }
    }
  )

  const { data: quizDataDetailsComplete } = useQuery(
    ['quizDataDetailsComplete', defaultValues?.quizCode, defaultValues?.candidate.code],
    () => {
      if (defaultValues?.quizCode && defaultValues?.candidate.code) {
        return QuizCandidateApis(t).getQuizCandidateAnswersCompleteAndClean(
          defaultValues?.quizCode,
          defaultValues?.candidate.code
        )
      }
    }
  )

  useEffect(() => {
    if (event != null) {
      WorkflowBoardItemApis(t)
        .getWorkflowBoardItemEvent(item.code, event.id)
        .then(res => {
          reset(res)
          setDefaultValues({ ...res })
        })
    } else {
      WorkflowBoardItemApis(t)
        .getWorkflowBoardItemEvents(item.code)
        .then(res => {
          reset({ ...defaultValues, candidate: res })
          setDefaultValues({ ...defaultValues, candidate: res })
        })
    }
  }, [])
  const [answers, setAnswers] = useState([])

  const handleAnswerChange = (index, answerData) => {
    const newAnswers = [...answers]
    newAnswers[index] = answerData
    setAnswers(newAnswers)
  }

  const onSubmit = (data: InterviewEventType) => {
    data.participants = checked.map(account => account.email)
    const updatedAnswers = answers.filter(answer => answer !== null && answer !== undefined)
    if (event != null) {
      jobMutationEdit.mutate(data)
    } else {
      jobMutationAdd.mutate(data)
    }
    if (updatedAnswers.length > 0) {
      AnswerListMutationAdd.mutate(updatedAnswers)
    }
  }

  const jobMutationAdd = useMutation({
    mutationFn: (newMutation: InterviewEventType) =>
      WorkflowBoardItemApis(t).addWorkflowBoardItemEvent(newMutation, item.code),
    onSuccess: (res: InterviewEventType) => {
      console.log('hello item ', res)
      handleClose()
    },
    onError: err => {
      console.log(err)
      handleClose()
    }
  })

  const jobMutationEdit = useMutation({
    mutationFn: (newMutation: InterviewEventType) =>
      WorkflowBoardItemApis(t).updateWorkflowBoardItemEvent(newMutation, item.code),
    onSuccess: () => {
      handleClose()
    },
    onError: err => {
      console.log(err)
      handleClose()
    }
  })

  const AnswerListMutationAdd = useMutation({
    mutationFn: (newMutation: AnswerType[]) =>
      QuizCandidateApis(t).addQuizCandidateAnswers(defaultValues?.quizCode, defaultValues?.candidate.code, newMutation)
  })

  const handleToggle = (value: MinAccountDto) => () => {
    let newChecked = [...checked]
    const isApplicationSelected = checked.some(acc => acc.code === value.code)
    if (!isApplicationSelected) {
      newChecked.push(value)
    } else {
      newChecked = newChecked.filter(e => e.code !== value.code)
    }
    setChecked(newChecked)
  }

  const isChecked = (account: MinAccountDto): boolean => {
    return checked.some(acc => acc.code === account.code)
  }

  const accountImage = (account: MinAccountDto): string => {
    return accounts.indexOf(account) > -1
      ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${account.id}?${new Date()}`
      : `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${defaultValues.candidate.id}?${new Date()}`
  }

  useEffect(() => {
    if (!isLoadingAccount && event != null) {
      WorkflowBoardItemApis(t)
        .getWorkflowBoardItemEvent(item.code, event.id)
        .then(res => {
          reset(res)
          setDefaultValues({ ...res })
          const allAccounts = [accounts, res.candidate]
          const accountCheck: MinAccountDto[] = []
          accountCheck.push(res.candidate)
          const filterAccount = accounts.filter(acc => res.participants.includes(acc.email))
          if (allAccounts != null) {
            accountCheck.push(...filterAccount)
            setChecked(accountCheck)
          }
        })
    }
  }, [isLoadingAccount])

  const handleClose = () => {
    setClose()
    if (event == null) {
    }
    reset()
  }

  const handleStartDateChange = (e: Date | null) => {
    if (e != null) {
      setValue('startDateTime', e)
      if (getValues('endDateTime') == null || e > getValues('endDateTime')) {
        setValue('endDateTime', new Date(e.setHours(e.getHours() + 1)))
      }
    }
  }

  useEffect(() => {
    const dataDetailsAnswer = quizDataDetailsComplete ? quizDataDetailsComplete : quizDataDetails
    if (dataDetailsAnswer) {
      const questions = dataDetailsAnswer?.sections.flatMap(section => section.questions)
      setAllQuestions(questions)
    }
  }, [quizDataDetails, quizDataDetailsComplete])

  return (
    <Dialog maxWidth='lg' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{event != null ? 'Edit' : 'Add'} Event</DialogTitle>
      <DialogContent>
        <>
          <Accordion>
            <AccordionSummary
              id='customized-panel-header-2'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              aria-controls='customized-panel-content-2'
            >
              <Typography sx={{ ml: 2 }}>Event</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DatePickerWrapper>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 4, sm: 8, md: 12 }}>
                  <Item item xs={12} sm={6}>
                    <Controller
                      name='title'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          size='small'
                          id='outlined-basic'
                          value={value || ''}
                          onChange={onChange}
                          fullWidth
                          label='Title'
                        />
                      )}
                    />
                  </Item>
                  <Item item xs={12} sm={6}>
                    <Controller
                      name='type'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <>
                          {event != null ? (
                            <TextField size='small' value={value || ''} fullWidth label='Type' disabled />
                          ) : (
                            <Select size='small' label='Type' value={value || ''} onChange={onChange} fullWidth>
                              <MenuItem value='INTERVIEW'>INTERVIEW</MenuItem>
                              <MenuItem value='MEETING'>MEETING</MenuItem>
                              <MenuItem value='CONTRACT'>CONTRACT</MenuItem>
                            </Select>
                          )}
                        </>
                      )}
                    />
                  </Item>
                  <Item item xs={12} sm={6}>
                    <div>
                      <Controller
                        name='startDateTime'
                        control={control}
                        render={({ field: { value } }) => (
                          <DatePicker
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            selected={new Date(value) || new Date()}
                            dateFormat='dd/MM/yyyy h:mm aa'
                            onChange={e => {
                              handleStartDateChange(e)
                            }}
                            customInput={
                              <TextField
                                size='small'
                                fullWidth
                                label='Start Date & Time'
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
                        )}
                      />
                    </div>
                  </Item>
                  <Item item xs={12} sm={6}>
                    <div>
                      <Controller
                        name='endDateTime'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            selected={new Date(value) || new Date()}
                            dateFormat='dd/MM/yyyy h:mm aa'
                            onChange={onChange}
                            minDate={getValues('startDateTime')}
                            customInput={
                              <TextField
                                size='small'
                                fullWidth
                                label='End Date & Time'
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
                        )}
                      />
                    </div>
                  </Item>
                  <Item item xs={12} sm={6}>
                    <Controller
                      name={`location`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField size='small' value={value || ''} onChange={onChange} fullWidth label='Location' />
                      )}
                    />
                  </Item>
                  <Item item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Interview question</InputLabel>
                      <Controller
                        name='quizCode'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            label='Interview question'
                            value={value}
                            onChange={onChange}
                            size='small'
                            sx={{ textAlign: 'left' }}
                          >
                            {quizByCategory &&
                              quizByCategory?.map(res => (
                                <MenuItem key={res.id} value={res.code}>
                                  {res.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Item>
                </Grid>
              </DatePickerWrapper>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              id='customized-panel-header-1'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              aria-controls='customized-panel-content-1'
            >
              {checked.length > 0 ? (
                <AvatarGroup className='pull-up' max={4}>
                  {checked.map((account: MinAccountDto, index) => (
                    <Tooltip key={index} title={account.fullName}>
                      <Avatar src={accountImage(account)} alt={account.fullName} sx={{ height: 32, width: 32 }} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              ) : (
                <Typography sx={{ ml: 2 }}>{t('Participants')}</Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem disablePadding>
                  <ListItemButton sx={{ padding: 0 }} onClick={handleToggle(defaultValues?.candidate)}>
                    <ListItemAvatar>
                      <Avatar
                        src={`${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${defaultValues?.candidate?.id}`}
                        alt={defaultValues?.candidate?.fullName}
                        sx={{ height: 32, width: 32 }}
                      />
                    </ListItemAvatar>
                    <div>
                      <ListItemText
                        primary={defaultValues?.candidate?.fullName}
                        secondary={`${defaultValues?.candidate?.email} (Candidate)`}
                      />
                    </div>
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge='end'
                        tabIndex={-1}
                        disableRipple
                        defaultChecked={true}
                        inputProps={{ 'aria-labelledby': 'checkbox-list-label-0' }}
                      />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
                <Divider />
                {accounts?.map((account: MinAccountDto) => (
                  <ListItem key={account.code} disablePadding>
                    <ListItemButton sx={{ padding: 0 }} onClick={handleToggle(account)}>
                      <ListItemAvatar>
                        <Avatar
                          src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${account.id}`}
                          alt={account.fullName}
                          sx={{ height: 32, width: 32 }}
                        />
                      </ListItemAvatar>
                      <ListItemText id='checkbox-list-label-0' primary={account.fullName} secondary={account.email} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge='end'
                          tabIndex={-1}
                          disableRipple
                          checked={isChecked(account)}
                          inputProps={{ 'aria-labelledby': 'checkbox-list-label-0' }}
                        />
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {event != null && allQuestions ? (
            <>
              <Accordion>
                <AccordionSummary
                  id='customized-panel-header-3'
                  expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
                  aria-controls='customized-panel-content-3'
                >
                  <Typography sx={{ ml: 2 }}>Questions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AnswerList
                    allQuestions={allQuestions}
                    onAnswerChange={(index, answerData: AnswerType) => handleAnswerChange(index, answerData)}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  id='customized-panel-header-3'
                  expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
                  aria-controls='customized-panel-content-3'
                >
                  <Typography sx={{ ml: 2 }}>Skills</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={8}>
                    <Grid item md={6} xs={12}>
                      <Typography variant='h6'>Job Skills</Typography>
                      {defaultValues?.skills?.map((skill, index) =>
                        skill.type == 'JOB' ? (
                          <Grid container spacing={2} key={skill.id} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={5}>
                              <Typography variant='body1'>{skill.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Controller
                                name={`skills.${index}.level`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Select size='small' label='Type' value={value || ''} onChange={onChange} fullWidth>
                                    <MenuItem value='BEGINNER'>{t('Beginner')}</MenuItem>
                                    <MenuItem value='INTERMEDIATE'>{t('Intermediate')}</MenuItem>
                                    <MenuItem value='CONFIRMED'>{t('Confirmed')}</MenuItem>
                                    <MenuItem value='EXPERT'>{t('Expert')}</MenuItem>
                                  </Select>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Controller
                                name={`skills.${index}.score`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Rating value={value || 0} onChange={onChange} />
                                )}
                              />
                            </Grid>
                          </Grid>
                        ) : null
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Typography variant='h6'>Resume Skills</Typography>
                      {defaultValues?.skills?.map((skill, index) =>
                        skill.type == 'RESUME' ? (
                          <Grid container spacing={2} key={skill.id} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={5}>
                              <Typography variant='body1'>{skill.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Controller
                                name={`skills.${index}.level`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Select size='small' label='Type' value={value || ''} onChange={onChange} fullWidth>
                                    <MenuItem value='BEGINNER'>{t('Beginner')}</MenuItem>
                                    <MenuItem value='INTERMEDIATE'>{t('Intermediate')}</MenuItem>
                                    <MenuItem value='CONFIRMED'>{t('Confirmed')}</MenuItem>
                                    <MenuItem value='EXPERT'>{t('Expert')}</MenuItem>
                                  </Select>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Controller
                                name={`skills.${index}.score`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Rating value={value || 0} onChange={onChange} />
                                )}
                              />
                            </Grid>
                          </Grid>
                        ) : null
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </>
          ) : null}

          <Accordion>
            <AccordionSummary
              id='customized-panel-header-3'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              aria-controls='customized-panel-content-3'
            >
              <Typography sx={{ ml: 2 }}>Comment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Controller
                name={`comment`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField size='small' rows={8} value={value || ''} onChange={onChange} fullWidth multiline />
                )}
              />
            </AccordionDetails>
          </Accordion>
        </>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose} variant='outlined' color='primary'>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color='primary' variant='contained'>
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventDrawer
