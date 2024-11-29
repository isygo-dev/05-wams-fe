import React, {useEffect, useState} from 'react'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Taq from './Taq'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import Mcq from './Mcq'
import Grid from '@mui/material/Grid'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import Mctaq from './Mctaq'
import LinearProgress from '@mui/material/LinearProgress'
import Mcqm from './Mcqm'
import Mcqa from './Mcqa'
import StepperWrapper from 'template-shared/@core/styles/mui/stepper'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import Avatar from '@mui/material/Avatar'
import StepLabel from '@mui/material/StepLabel'
import {hexToRGBA} from 'template-shared/@core/utils/hex-to-rgba'
import Icon from 'template-shared/@core/components/icon'
import {styled} from '@mui/material/styles'
import MuiStepper, {StepperProps} from '@mui/material/Stepper'
import CardContent, {CardContentProps} from '@mui/material/CardContent'
import MuiStep, {StepProps} from '@mui/material/Step'
import {QuizAnswerType} from 'quiz-shared/@core/types/quiz/quizCandidateType'
import localStorageKeys from 'template-shared/configs/localeStorage'
import Summary from './Summary'
import quizApiUrls from "quiz-shared/configs/quiz_apis";
import Card from '@mui/material/Card'
import CodeEditorView from 'template-shared/views/pages/code-editor/CodeEditorView'
import {languageOptions} from "template-shared/views/pages/code-editor/constants/languageOptions";
import QuizCandidateApis from "quiz-shared/@core/api/quiz/candidate";
import {useTranslation} from "react-i18next";

interface DialogPlayQuizProps {
    open: boolean
    setOpen: (val: boolean) => void
    quizCode: string
    resetActiveSection?: boolean
    setResetActiveSection?: (val: boolean) => void
}

const Stepper = styled(MuiStepper)<StepperProps>(({theme}) => ({
    height: '100%',
    minWidth: '15rem',
    '& .MuiStep-root:not(:last-of-type) .MuiStepLabel-root': {
        paddingBottom: theme.spacing(5)
    },
    [theme.breakpoints.down('md')]: {
        minWidth: 0
    }
}))

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        borderRight: 0,
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}))

const Step = styled(MuiStep)<StepProps>(({theme}) => ({
    '& .MuiStepLabel-root': {
        paddingTop: 0
    },
    '&:not(:last-of-type) .MuiStepLabel-root': {
        paddingBottom: theme.spacing(6)
    },
    '&:last-of-type .MuiStepLabel-root': {
        paddingBottom: 0
    },
    '& .MuiStepLabel-iconContainer': {
        display: 'none'
    },
    '& .step-subtitle': {
        color: `${theme.palette.text.disabled} !important`
    },
    '& + svg': {
        color: theme.palette.text.disabled
    },
    '&.Mui-completed .step-title': {
        color: theme.palette.text.disabled
    },
    '& .MuiStepLabel-label': {
        cursor: 'pointer'
    }
}))
const Linear = styled(LinearProgress)(({}) => ({
    '& .MuiLinearProgress-bar': {
        borderRadius: '4px'
    }
}))
const schema = yup.object().shape({
    question: yup.number(),
    option: yup.number(),
    answerText: yup.string()
})

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
const PlayQuizDialog = (props: DialogPlayQuizProps) => {
    const {t} = useTranslation()
    const {open, setOpen, quizCode, resetActiveSection, setResetActiveSection} = props
    const userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
    const userAccount = userData.userName
    const queryClient = useQueryClient()
    const {data: quizDataDetails} = useQuery(
        ['quizDetails', {quizCode, userAccount}],
        () => (open ? QuizCandidateApis(t).getQuizCandidate(quizCode, userAccount) : null),
        {}
    )

    const codeQuiz = quizDataDetails?.code
    const name = quizDataDetails?.name

    const handleClose = () => {
        setOpen(false)
        setResetActiveSection(false)
    }

    const [activeSection, setActiveSection] = useState<number>(0)
    const [activeQuestion, setActiveQuestion] = useState<number>(0)
    const [initialDataDetails, setInitialDataDetails] = useState(false)
    const totalQuestions = quizDataDetails?.sections?.reduce((count, section) => count + section.questions.length, 0)

    const countPassedQuestion = quizDataDetails?.sections
        ?.slice(0, activeSection)
        .reduce((count, section) => count + section.questions.length, 0)
    const progress = ((countPassedQuestion + activeQuestion) / (totalQuestions - 1)) * 100
    const currentSection = quizDataDetails?.sections[activeSection]

    const [selectedOptionId, setSelectedOptionId] = useState(null)

    const currentQuestion = currentSection?.questions?.[activeQuestion]

    const preventDefault = e => e.preventDefault()
    const [checkedOptions, setCheckedOptions] = useState({})
    const [currentRemainTime, setCurrentRemainTime] = useState<number>(currentQuestion?.remainInSec ?? 0)
    const handleCheckboxChange = (optionId, isChecked) => {
        setCheckedOptions(prevOption => ({
            ...prevOption,
            [optionId]: isChecked
        }))
    }

    const mutationStartAnswer = useMutation({
        mutationFn: (data: any) => QuizCandidateApis(t).startQuizCandidateAnswer(codeQuiz, userAccount, data),
        onError: err => {
            console.log(err)
        }
    })

    useEffect(() => {
        if (open && resetActiveSection) {
            setActiveSection(0)
            setActiveQuestion(0)
            setCheckedOptions({})
            setInitialDataDetails(false)
        }
    }, [open, resetActiveSection, setResetActiveSection])

    useEffect(() => {
        if (
            open &&
            !initialDataDetails &&
            quizDataDetails &&
            quizDataDetails.sections &&
            quizDataDetails.sections.length > 0
        ) {
            const firstSectionWithQuestion = quizDataDetails?.sections.findIndex(section => section.questions.length > 0)

            if (firstSectionWithQuestion === -1) {
                setActiveSection(quizDataDetails.sections.length)
            } else {
                setActiveSection(firstSectionWithQuestion)
            }
            const firstQuestionId = quizDataDetails?.sections[firstSectionWithQuestion]?.questions[0]?.id

            console.log('firstQuestionId', firstQuestionId)
            if (firstQuestionId) {
                const data = {
                    question: firstQuestionId
                }
                mutationStartAnswer.mutate(data)
            }

            setInitialDataDetails(true)
        }
    }, [open, initialDataDetails, quizDataDetails, setActiveSection, mutationStartAnswer, resetActiveSection])

    useEffect(() => {
        setCurrentRemainTime(currentQuestion?.remainInSec ?? 0)
    }, [currentQuestion])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentRemainTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [currentRemainTime])

    useEffect(() => {
        if (quizDataDetails && activeSection < quizDataDetails?.sections.length) {
            const currentQuestionType = quizDataDetails.sections[activeSection].questions[activeQuestion].type
            if (currentQuestionType === 'CODE') {
                setCode('')
            }
        }
    }, [activeSection, activeQuestion, quizDataDetails])
    const handleNext = () => {
        let nextActiveSection = activeSection
        let nextActiveQuestion = activeQuestion + 1

        if (nextActiveQuestion >= quizDataDetails?.sections[nextActiveSection].questions?.length) {
            nextActiveQuestion = 0
            nextActiveSection++
        }

        if (nextActiveSection >= quizDataDetails?.sections.length) {
            setActiveSection(activeSection + 1)
        }

        setActiveSection(nextActiveSection)
        setActiveQuestion(nextActiveQuestion)

        if (nextActiveQuestion < quizDataDetails?.sections[nextActiveSection]?.questions.length) {
            const currentQuestionId = quizDataDetails?.sections[nextActiveSection]?.questions[nextActiveQuestion]?.id
            if (currentQuestionId) {
                const data = {question: currentQuestionId}
                mutationStartAnswer.mutate(data)
                setCurrentRemainTime(currentRemainTime)
            }
        }
    }

    useEffect(() => {
        if (currentRemainTime === 0) {
            handleSubmit(onSubmit)()

            setCurrentRemainTime(currentQuestion?.remainInSec ?? 0)
        }
    }, [currentRemainTime])

    const defaultValues: QuizAnswerType = {
        question: 0,
        option: 0,
        answerText: ''
    }


    const {
        reset,
        control,
        handleSubmit,
        formState: {}
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const [code, setCode] = useState('')

    const handleCodeChange = (newCode) => {
        setCode(newCode)
    }

    const renderContent = () => {
        const questionName = currentQuestion?.question

        const commonQuestionName = (
            <Box sx={{mb: 4}}>
                <Typography variant='h6' sx={{color: '#656565', fontSize: '18px'}}>{`${
                    countPassedQuestion + activeQuestion + 1
                }.${questionName}`}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    {currentQuestion?.imagePath ? (
                        <Avatar
                            src={`${quizApiUrls.apiUrl_QUIZ_Question_ImageDownload_EndPoint}/${currentQuestion?.id}`}
                            sx={{
                                cursor: 'pointer',
                                mt: 2,
                                width: '100%',
                                height: 'auto',
                                borderRadius: '0'
                            }}
                        />
                    ) : null}
                </Box>
            </Box>
        )

        if (activeSection === quizDataDetails?.sections.length) {
            return (
                <div>
                    <Summary quizCode={codeQuiz} accountCode={userData?.userName}></Summary>
                </div>
            )
        }
        const styleContent = {color: '#656565', fontSize: '18px'}
        switch (currentQuestion?.type) {
            case 'TAQ':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}
                        <Taq control={control}/>
                    </div>
                )
            case 'MCQ':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}
                        <Mcq
                            control={control}
                            options={quizDataDetails?.sections[activeSection].questions[activeQuestion].options}
                        />
                    </div>
                )
            case 'MCQA':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}
                        <Mcqa
                            selectedOptionId={selectedOptionId}
                            setSelectedOptionId={setSelectedOptionId}
                            control={control}
                            options={quizDataDetails.sections[activeSection].questions[activeQuestion].options}
                        />
                    </div>
                )
            case 'MCTAQ':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}
                        <Mctaq
                            control={control}
                            options={quizDataDetails.sections[activeSection].questions[activeQuestion].options}
                            checkedOptions={checkedOptions}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    </div>
                )
            case 'MCQM':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}
                        <Mcqm
                            control={control}
                            options={quizDataDetails?.sections[activeSection].questions[activeQuestion].options}
                            onCheckboxChange={handleCheckboxChange}
                            checkedOptions={checkedOptions}
                        />
                    </div>
                )
            case 'CODE':
                return (
                    <div style={styleContent}>
                        {commonQuestionName}

                        <CodeEditorView code={code} onChangeCode={handleCodeChange}
                                        language={languageOptions.filter(el => el.value == quizDataDetails.sections[activeSection].questions[activeQuestion].language)}/>
                    </div>
                )

            default:
                return null
        }
    }

    const mutationAddAnswer = useMutation({
        mutationFn: (data: QuizAnswerType) => QuizCandidateApis(t).addQuizCandidateAnswer(codeQuiz, userAccount, data),
        onSuccess: (res: any) => {
            handleNext()

            const cachedData: [] = queryClient.getQueryData('answerQuizCandidate') || []
            const updatedData: any = [...cachedData]
            updatedData.push(res)
            queryClient.setQueryData('answerQuizCandidate', updatedData)
        },
        onError: err => {
            console.log(err)
        }
    })

    const mutationEdit = useMutation({
        mutationFn: () => QuizCandidateApis(t).updateQuizCandidate(codeQuiz, userAccount),

        onError: err => {
            console.log(err)
        }
    })
    const onSubmit = (data: QuizAnswerType) => {
        const filterData = {...data}
        for (const item in filterData) {
            if (item.startsWith('option_') || item.startsWith('answerText_')) {
                delete filterData[item]
            }
        }

        let updatedData = {
            ...filterData,
            question: currentQuestion?.id
        }
        const optionsData = []
        let checkedOption = false
        switch (currentQuestion?.type) {
            case 'TAQ':
                updatedData.option = defaultValues.option
                mutationAddAnswer.mutate(updatedData)
                break
            case 'MCQA':
                updatedData = {
                    ...updatedData,
                    option: selectedOptionId
                }
                mutationAddAnswer.mutate(updatedData)
                break
            case 'MCQM':
                quizDataDetails?.sections[activeSection].questions[activeQuestion].options.forEach((option, index) => {
                    if (data[`option_${index}`]) {
                        optionsData.push({
                            option: option.id,
                            answerText: '',
                            question: currentQuestion?.id
                        })
                        checkedOption = true
                    }
                })

                if (!checkedOption) {
                    optionsData.push({
                        option: null,
                        answerText: '',
                        question: currentQuestion?.id
                    })
                }

                optionsData.forEach(data => {
                    mutationAddAnswer.mutate(data)
                })
                break
            case 'MCTAQ':
                quizDataDetails?.sections[activeSection].questions[activeQuestion].options.forEach(option => {
                    const optionKey = `option_${option.id}`
                    const answerTextKey = `answerText_${option.id}`
                    if (data[optionKey]) {
                        optionsData.push({
                            option: option.id,
                            answerText: data[answerTextKey] || '',
                            question: currentQuestion?.id
                        })
                        checkedOption = true
                    }
                })

                if (!checkedOption) {
                    optionsData.push({
                        option: null,
                        answerText: '',
                        question: currentQuestion?.id
                    })
                }

                optionsData.forEach(data => {
                    mutationAddAnswer.mutate(data)
                })

                break
            case 'MCQ':
                const optionSelected = Object.keys(data).some(key => key.startsWith('option') && data[key])

                const submittedData = optionSelected
                    ? updatedData
                    : {
                        option: null,
                        answerText: '',
                        question: currentQuestion?.id
                    }

                mutationAddAnswer.mutate(submittedData)

                break
            case 'CODE':
                updatedData = {
                    ...updatedData,
                    option: defaultValues.option,
                    answerText: code
                }
                console.log('updatedData', updatedData)
                mutationAddAnswer.mutate(updatedData)

                break
            default:
                return null
        }

        reset()

        if (
            activeSection === quizDataDetails?.sections.length - 1 &&
            activeQuestion === quizDataDetails?.sections[activeSection].questions.length - 1
        ) {
            mutationEdit.mutate()
        }
    }

    const renderFooter = () => {
        return (
            <Box sx={{mt: 6, display: 'flex', justifyContent: 'end'}}>
                <Button color='primary' variant='outlined' onClick={handleClose} sx={{mr: 2, width: '130px'}}>
                    Postpone
                </Button>
                {activeSection !== undefined && activeSection === quizDataDetails?.sections.length && (
                    <Button variant='contained' color='primary' sx={{width: '130px'}} onClick={handleClose}>
                        Done
                    </Button>
                )}
                {activeSection < quizDataDetails?.sections.length && (
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{width: '130px'}}
                        type='button'
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Next
                    </Button>
                )}
            </Box>
        )
    }

    return (
        <form>
            <Dialog
                onCopy={preventDefault}
                onCut={preventDefault}
                onPaste={preventDefault}
                style={{userSelect: 'none'}}
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar
                    sx={{
                        position: 'relative',
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        boxShadow: '0px 1px 3px #00000029'
                    }}
                >
                    <Toolbar>
                        <Typography sx={{ml: 14, flex: 1, color: '#454849', fontSize: '18px'}} component='div'>
                            {codeQuiz} : {name}
                        </Typography>
                        {activeSection !== quizDataDetails?.sections.length && (
                            <Button variant='contained' color='primary' sx={{opacity: 1, mr: 6, width: '130px'}}>
                                {formatTime(currentRemainTime)}
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
                <Grid container justifyContent='center' spacing={2} sx={{pt: 4, background: 'white', height: '100%'}}>
                    <StepperHeaderContainer>
                        <StepperWrapper sx={{height: '100%'}}>
                            <Stepper
                                connector={<></>}
                                orientation='vertical'
                                activeStep={activeSection}
                                sx={{height: '100%', minWidth: '15rem'}}
                            >
                                {quizDataDetails?.sections.map((section, index) => {
                                    const sectionWithQuestions = section.questions.length > 0

                                    if (activeSection === null && sectionWithQuestions) {
                                        setActiveSection(index)
                                    }

                                    const RenderAvatar = index === activeSection ? CustomAvatar : Avatar

                                    return (
                                        <Step key={index}>
                                            <StepLabel>
                                                <div className='step-label'>
                                                    <RenderAvatar
                                                        variant='rounded'
                                                        {...(activeSection >= index && {skin: 'light'})}
                                                        {...(activeSection === index && {skin: 'filled'})}
                                                        {...(activeSection >= index && {color: 'primary'})}
                                                        sx={{
                                                            ...(activeSection === index && {boxShadow: theme => theme.shadows[3]}),
                                                            ...(activeSection > index && {
                                                                color: theme => hexToRGBA(theme.palette.primary.main, 0.4)
                                                            })
                                                        }}
                                                    >
                                                        <Icon icon='ant-design:appstore-twotone'/>
                                                    </RenderAvatar>
                                                    <div>
                                                        <Typography className='step-title'>{section.name}</Typography>
                                                    </div>
                                                </div>
                                            </StepLabel>
                                        </Step>
                                    )
                                })}
                                <Step>
                                    <StepLabel>
                                        <div className='step-label'>
                                            <CustomAvatar variant='rounded' skin='light' color='primary'
                                                          sx={{marginRight: 1}}>
                                                <Icon icon='ant-design:appstore-twotone'/>
                                            </CustomAvatar>
                                            <div>
                                                <Typography className='step-title'>Summary</Typography>
                                            </div>
                                        </div>
                                    </StepLabel>
                                </Step>
                            </Stepper>
                        </StepperWrapper>
                    </StepperHeaderContainer>
                    <Grid item xs={12} md={6}>
                        <Box sx={{p: 3}}>
                            <Grid container>
                                <Grid item xs={12} md={12}>
                                    <Box>
                                        {activeSection < quizDataDetails?.sections.length ? (
                                            <Box position='relative' sx={{height: '16px'}}>
                                                <Linear
                                                    variant='determinate'
                                                    sx={{
                                                        height: 16,
                                                        width: '100%',
                                                        backgroundColor: '#D7DCE0',
                                                        borderRadius: '4px'
                                                    }}
                                                    value={progress}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        right: '0',
                                                        top: '0',
                                                        pr: 5,
                                                        lineHeight: 1.4
                                                    }}
                                                >
                                                    <Typography color={progress === 100 ? 'white' : '#464849'}
                                                                sx={{fontSize: '12px'}}>
                                                        {`${countPassedQuestion + activeQuestion + 1} / ${totalQuestions}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ) : null}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: {xs: 'column', lg: 'row'},
                                    boxShadow: '0px 2px 9px #00000014',
                                    borderRadius: '4px',
                                    width: '100%',
                                    padding: '2rem'
                                }}
                            >
                                <CardContent sx={{pt: theme => `${theme.spacing(6)} !important`, width: '100%'}}>
                                    {renderContent()}
                                    {renderFooter()}
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>
        </form>
    )
}

export default PlayQuizDialog