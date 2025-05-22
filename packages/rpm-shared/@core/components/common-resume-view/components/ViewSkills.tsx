import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Accordion } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import ViewResumePDF from './ViewResumePDF'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import PlayQuizDialog from '../../../../../quiz-shared/views/apps/quiz/play-quiz/PlayQuizDialog'
import process from 'process'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import QuizCandidateApis from 'quiz-shared/@core/api/quiz/candidate'

interface SkillsProps {
  editedData: ResumeTypes
  setEditedData: (ResumeTypes) => void
  displayed: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

const getFabBgColor = score => {
  if (score < 25) {
    return 'red'
  } else if (score >= 25 && score < 50) {
    return 'orange'
  } else if (score >= 50 && score < 75) {
    return 'yellow'
  } else {
    return 'green'
  }
}

const getFabColor = score => {
  if (score >= 50 && score < 75) {
    return 'black'
  } else {
    return 'white'
  }
}

const ViewSkills = (props: SkillsProps) => {
  const queryClient = useQueryClient()
  const { editedData, setEditedData, displayed, permissionApplication, permissionPage, permissionAction } = props
  const { t } = useTranslation()
  const { handleSaveChangeWithName } = useUpdateProperty({ guiName: 'ResumeDetails' })
  const [showGeneratePPF, setShowGeneratePPF] = useState<boolean>(false)
  const [quizCode, setQuizCode] = useState<string>('')

  const accountCode = editedData?.accountCode
  const { data: quizAnswerData } = useQuery(
    ['quizAnswerData', { quizCode, accountCode }],
    () => (open && accountCode ? QuizCandidateApis(t).getQuizCandidateComplete(quizCode, accountCode) : null),
    {}
  )
  const [playQuizOpen, setPlayQuizOpen] = useState(false)
  const [resetActiveSection, setResetActiveSection] = useState<boolean>(false)
  const [appName] = useState<string>(process.env.NEXT_PUBLIC_APP_NAME)
  const handleDeleteEntry = (field: string, index: number) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData }
      if (updatedData.details && updatedData.details[field]) {
        updatedData.details[field].splice(index, 1)
      }

      return updatedData
    })
  }

  const handleAddSkills = () => {
    setEditedData(prevData => ({
      ...prevData,
      details: {
        ...prevData.details,
        skills: [...(prevData.details?.skills || []), { name: '', level: 'BEGINNER' }]
      }
    }))
  }
  const handleSkillsChange = (index: number, key: string, value: string | Date | boolean | string[]) => {
    if (!checkPermission(permissionApplication, permissionPage, permissionAction)) {
      const newSkills = [...(editedData?.details?.skills || [])]
      const newSkillObject = { ...newSkills[index] }
      newSkillObject[key] = value
      newSkills[index] = newSkillObject
      setEditedData(prevData => ({
        ...prevData,
        details: {
          ...prevData.details,
          skills: newSkills
        }
      }))
    }
  }
  const handlePdfAnswer = (code: string) => {
    setQuizCode(code)
    setShowGeneratePPF(true)
  }

  const skills = editedData.details?.skills?.map(skill => skill.name)
  const { data: quizByTags } = useQuery(
    ['quizBySTag', { accountCode, skills }],
    () => (skills && accountCode ? QuizCandidateApis(t).getQuizCandidatesByTags(accountCode, skills) : null),
    {}
  )

  useEffect(() => {
    if (!playQuizOpen) {
      queryClient.invalidateQueries('quizBySTag')
    }
  }, [playQuizOpen, queryClient])

  const mutationStartQuizCandidate = useMutation({
    mutationFn: (data: { code: string; accountCode: string }) =>
      QuizCandidateApis(t).quizCandidateStart(data.code, data.accountCode),
    onSuccess: (res: any) => {
      if (res) {
        queryClient.invalidateQueries('quizCandidate')
      }
    }
  })

  //const {data: quizCandidate} = useQuery(['quizCandidate'], () => getAllCandidateQuiz())
  const handlePlayQuiz = (code: string) => {
    const quizExist = quizByTags?.find(candidate => candidate.quizCode === code && candidate.startDate !== null)

    if (quizExist === undefined) {
      mutationStartQuizCandidate.mutate({ code: code, accountCode: accountCode })
      setPlayQuizOpen(true)
      setQuizCode(code)
    } else {
      setPlayQuizOpen(true)
      setQuizCode(code)
    }
  }

  const handleClick = (code: string) => {
    appName === 'wams-cfo' ? handlePlayQuiz(code) : handlePdfAnswer(code)
  }

  return (
    <Accordion
      className={'accordion-expanded'}
      onChange={(e, expended) => handleSaveChangeWithName(expended, 'Skills')}
      defaultExpanded={displayed}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        id='form-layouts-collapsible-header-1'
        aria-controls='form-layouts-collapsible-content-1'
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          {t('Skills')}
        </Typography>
      </AccordionSummary>
      <Divider sx={{ m: '0 !important' }} />
      <AccordionDetails>
        <Grid container>
          {/* ... (other fields and sections) */}
          <Grid item xs={12} sm={12}>
            {editedData.details?.skills?.map((skill, index) => {
              return (
                <Grid container key={index} spacing={4} sx={{ mt: 1 }}>
                  <Grid item>
                    <TextField
                      size='small'
                      label={t('Skill Name')}
                      required={true}
                      fullWidth
                      variant='outlined'
                      value={skill.name || ''}
                      onChange={e => handleSkillsChange(index, 'name', e.target.value)}
                    />
                  </Grid>

                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <FormControl size='small'>
                          <InputLabel>{t('Level')}</InputLabel>
                          <Select
                            size='small'
                            value={skill.level || ''}
                            onChange={e => handleSkillsChange(index, 'level', e.target.value)}
                            label='Level'
                            disabled={!checkPermission(permissionApplication, permissionPage, permissionAction)}
                          >
                            <MenuItem value='BEGINNER'>{t('Beginner')}</MenuItem>
                            <MenuItem value='INTERMEDIATE'>{t('Intermediate')}</MenuItem>
                            <MenuItem value='CONFIRMED'>{t('Confirmed')}</MenuItem>
                            <MenuItem value='EXPERT'>{t('Expert')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Grid container>
                          {checkPermission(permissionApplication, permissionPage, permissionAction) && (
                            <Grid item>
                              <IconButton onClick={() => handleDeleteEntry('skills', index)}>
                                <Icon icon='tabler:x' fontSize='1.25rem' />
                              </IconButton>
                            </Grid>
                          )}
                          {quizByTags &&
                            quizByTags.map((quiz, quizIndex) => {
                              const score = quiz.scale !== 0 ? Math.floor((quiz.score / quiz.scale) * 100) : null

                              return (
                                <div className='flex gap-4 mbe-6' key={quizIndex}>
                                  {quiz?.tags?.some(tag => tag === skill.name) && (
                                    <Tooltip title={t(quiz.name)}>
                                      <Fab
                                        variant='extended'
                                        size='medium'
                                        onClick={
                                          !quiz.submitDate && appName === 'prm-rpm'
                                            ? undefined
                                            : () =>
                                                checkPermission(
                                                  permissionApplication,
                                                  permissionPage,
                                                  permissionAction
                                                ) && handleClick(quiz.quizCode)
                                        }
                                        sx={{
                                          marginRight: 2,
                                          backgroundColor: score ? getFabBgColor(score) : 'grey',
                                          color: getFabColor(score),
                                          '&:hover': {
                                            opacity: 0.7,
                                            backgroundColor: score ? getFabBgColor(score) : 'grey'
                                          }
                                        }}
                                      >
                                        <Icon icon='material-symbols:quiz-outline' style={{ marginRight: 5 }} />
                                        {quiz.submitDate ? <span>{score}%</span> : <span></span>}
                                      </Fab>
                                    </Tooltip>
                                  )}
                                </div>
                              )
                            })}

                          <Grid></Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        {checkPermission(permissionApplication, permissionPage, permissionAction) && (
          <Grid container style={{ marginTop: '10px' }} spacing={2}>
            <Grid container item md={12} sx={{ justifyContent: 'left', paddingBottom: '20px' }}>
              <Button variant='contained' size={'small'} className={'button-padding-style'} onClick={handleAddSkills}>
                <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Resume.Add_Skill')}
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
      {showGeneratePPF && (
        <ViewResumePDF
          open={showGeneratePPF}
          setOpen={setShowGeneratePPF}
          item='QuizAnswer'
          dataQuiz={quizAnswerData}
          dataResume={null}
        />
      )}
      <PlayQuizDialog
        open={playQuizOpen}
        setOpen={setPlayQuizOpen}
        quizCode={quizCode}
        resetActiveSection={resetActiveSection}
        setResetActiveSection={setResetActiveSection}
      />
    </Accordion>
  )
}

export default ViewSkills
