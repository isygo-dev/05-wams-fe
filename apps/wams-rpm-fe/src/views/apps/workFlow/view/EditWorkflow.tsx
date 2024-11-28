// ** React Imports
import React, {Fragment, useEffect, useState} from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import {styled, useTheme} from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent, {CardContentProps} from '@mui/material/CardContent'
import Icon from 'template-shared/@core/components/icon'
import FormControl from '@mui/material/FormControl'
import * as yup from 'yup'
import {WorkflowsType} from 'rpm-shared/@core/types/rpm/workflowTypes'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import {useTranslation} from 'react-i18next'
import StepperWrapper from 'template-shared/@core/styles/mui/stepper'
import Stepper from '@mui/material/Stepper'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import Avatar from '@mui/material/Avatar'
import StepLabel from '@mui/material/StepLabel'
import StepperCustomDot from 'template-shared/views/forms/form-wizard/StepperCustomDot'
import {hexToRGBA} from 'template-shared/@core/utils/hex-to-rgba'
import Step from '@mui/material/Step'
import ButtonGroup from '@mui/material/ButtonGroup'
import {WorkflowStateSwitch} from 'rpm-shared/@core/types/rpm/stateTypes'
import StateWorkflow from './stateWorkflow'
import TransitionWorkflow from './transitionWorkflow'
import {useMutation, useQuery} from 'react-query'
import AccountApis from "ims-shared/@core/api/ims/account";
import WorkflowBoardApis from "rpm-shared/@core/api/rpm/workflow-board";
import WorkflowApis from "rpm-shared/@core/api/rpm/workflow";

interface WorkflowProps {
  workFlowDetailsData: WorkflowsType
}

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({theme}) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({theme}) => ({
  padding: theme.spacing(6, 8, 6),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(5)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))
const RepeaterTransition = styled(CardContent)<CardContentProps>(({theme}) => ({
  padding: theme.spacing(6, 8, 6),
  '& .repeater-transition + .repeater-transition': {
    marginTop: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(5)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  category: yup.string().required(),
  type: yup.string().required(),
  workflowStates: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      sequence: yup.number(),
      positionType: yup.string().oneOf(Object.values(WorkflowStateSwitch))
    })
  ),
  workflowTransitions: yup.array().of(
    yup.object().shape({
      fromCode: yup.string().required(),
      toCode: yup.string().required(),
      transitionService: yup.string().required(),
      notify: yup.boolean(),
      watchers: yup.array().of(yup.string())
    })
  )
})

const EditWorkflow = (props: WorkflowProps) => {
  const {t} = useTranslation()
  const {workFlowDetailsData} = props
  const updatedWorkflowDetails = workFlowDetailsData
  const workFlowDetails: WorkflowsType = updatedWorkflowDetails
  const [defaultValues, setDefaultValues] = useState<WorkflowsType>({
    id: workFlowDetails.id,
    domain: workFlowDetails.domain,
    code: workFlowDetails.code,
    name: workFlowDetails.name,
    description: workFlowDetails.description,
    category: workFlowDetails.category,
    type: workFlowDetails.type,
    workflowStates: workFlowDetails?.workflowStates,
    workflowTransitions: workFlowDetails?.workflowTransitions
  })

  const steps = [
    {
      icon: 'ep:data-board',
      title: t('Workflow.Workflow')
    },
    {
      icon: 'mi:board',
      title: t('State list')
    },
    {
      icon: 'mdi:arrow',
      title: t('Transitions')
    }
  ]

  const theme = useTheme()

  const [count, setCount] = useState<number>(
    defaultValues.workflowStates.length === 0 ? 1 : defaultValues.workflowStates.length
  )
  const [countTransition, setCountTransition] = useState<number>(
    defaultValues.workflowTransitions.length === 0 ? 1 : defaultValues.workflowTransitions.length
  )

  const {data: emails} = useQuery([`emails`, defaultValues.domain], () => AccountApis(t).getAccountEmailsByDomain())

  const {data: workFlowEmails} = useQuery([`workFlowEmails`, defaultValues.domain, defaultValues.code], () =>
    WorkflowBoardApis(t).getWorkflowBoardWatcherEmails({domain: defaultValues.domain, wfCode: defaultValues.code})
  )

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: {errors}
  } = useForm<WorkflowsType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const deleteState = (index: number) => {
    console.log('after deletes')
    const newWorkflowStates = getValues('workflowStates').filter((e, i) => index != i)
    setValue('workflowStates', newWorkflowStates)
    setCount(count => Math.max(count - 1, 1))
    if (count === 1) {
      setValue('workflowStates', [
        ...getValues('workflowStates'),
        {
          code: '',
          wbCode: '',
          name: '',
          description: '',
          color: 'rgb(0, 0, 0)',
          positionType: WorkflowStateSwitch.INIT,
          sequence: 1
        }
      ])
    }
  }

  const deleteTransition = (index: number) => {
    const newWorkflowTransition = getValues('workflowTransitions').filter((e, i) => index != i)
    setValue('workflowTransitions', newWorkflowTransition)
    setCountTransition(countTransition => Math.max(countTransition - 1, 1))
    if (countTransition === 1) {
      setValue('workflowTransitions', [
        ...getValues('workflowTransitions'),
        {
          fromCode: '',
          toCode: '',
          transitionService: '',
          notify: false,
          bidirectional: false,
          watchers: []
        }
      ])
    }
  }

  const handleAddState = () => {
    setValue('workflowStates', [
      ...getValues('workflowStates'),
      {
        code: '',
        wbCode: '',
        name: '',
        description: '',
        color: 'rgb(0, 0, 0)',
        positionType: WorkflowStateSwitch.INIT,
        sequence: count + 1
      }
    ])

    setCount(count + 1)
  }

  const handleAddTransition = () => {
    setValue('workflowTransitions', [
      ...getValues('workflowTransitions'),
      {
        fromCode: '',
        toCode: '',
        transitionService: '',
        notify: false,
        bidirectional: false,
        watchers: []
      }
    ])
    setCountTransition(countTransition + 1)
  }

  const [activeStep, setActiveStep] = useState<number>(0)

  const updateWorkflowMutation = useMutation({
    mutationFn: (data: WorkflowsType) => WorkflowApis(t).updateWorkFlow(data),
    onSuccess: (res: WorkflowsType) => {
      setDefaultValues(res)
      setValue('workflowStates', [...res.workflowStates])
    }
  })

  const onSubmit = (data: WorkflowsType) => {
    const updatedData = {
      ...data,
      workflowStates: data.workflowStates.filter(state => state.name || state.description || state.sequence),
      workflowTransitions: data.workflowTransitions.filter(
        transition => transition.fromCode || transition.toCode || transition.transitionService
      )
    }

    updateWorkflowMutation.mutate(updatedData)
  }

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fragment key={step}>
            <CardContent sx={{p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`]}}>
              <Grid container>
                <Grid item xs={12} sm={6} sx={{mb: {xl: 0, xs: 4}}}>
                  <Box sx={{mb: 3, display: 'flex', alignItems: 'center'}}>
                    <Typography
                      variant='h6'
                      sx={{
                        ml: 2.5,
                        fontWeight: 600,
                        lineHeight: '24px',
                        fontSize: '1.375rem !important'
                      }}
                    >
                      {t('Workflow.Workflow')}
                    </Typography>
                  </Box>
                </Grid>

                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='code'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value}}) => (
                            <TextField size='small' disabled value={value} label={t('Code')}/>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='name'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              value={value}
                              label={t('Name')}
                              onChange={onChange}
                              error={Boolean(errors.name)}
                            />
                          )}
                        />
                        {errors.name && (
                          <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{mt: 3}}>
                        <InputLabel
                          id='validation-category-select'
                          error={Boolean(errors.category)}
                          htmlFor='validation-category-select'
                        >
                          {t('Category')}
                        </InputLabel>
                        <Controller
                          name='category'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <Select
                              size='small'
                              value={value}
                              label={t('Category')}
                              onChange={e => {
                                onChange(e)
                              }}
                              error={Boolean(errors.category)}
                              labelId='validation-category-select'
                              aria-describedby='validation-category-select'
                            >
                              <MenuItem value='SEQUENTIAL'>Sequential</MenuItem>
                              <MenuItem value='PARALLEL'>Parellel</MenuItem>
                              <MenuItem value='RULES_DRIVEN'>Rules driven</MenuItem>
                              <MenuItem value='STATE_MACHINE'>State machine</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.category && (
                          <FormHelperText sx={{color: 'error.main'}} id='validation-category-select'>
                            {t('This type is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{mt: 3}}>
                        <InputLabel
                          id='validation-type-select'
                          error={Boolean(errors.type)}
                          htmlFor='validation-type-select'
                        >
                          {t('Type')}
                        </InputLabel>
                        <Controller
                          name='type'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <Select
                              size='small'
                              value={value}
                              label={t('Type')}
                              onChange={e => {
                                onChange(e)
                              }}
                              error={Boolean(errors.type)}
                              labelId='validation-type-select'
                              aria-describedby='validation-type-select'
                            >
                              <MenuItem value='PROJECT'>Project</MenuItem>
                              <MenuItem value='PROCESS'>Process</MenuItem>
                              <MenuItem value='CASE'>Case</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.type && (
                          <FormHelperText sx={{color: 'error.main'}} id='validation-type-select'>
                            {t('This type is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth sx={{mt: 3}}>
                        <Controller
                          name='description'
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              rows={4}
                              multiline
                              value={value}
                              label={t('Description')}
                              onChange={onChange}
                              placeholder='descrption'
                              id='textarea-standard-static'
                              error={Boolean(errors.description)}
                            />
                          )}
                        />
                        {errors.description && (
                          <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
            </CardContent>
          </Fragment>
        )
      case 1:
        return (
          <Fragment key={step}>
            <RepeaterWrapper>
              <Grid item xs={12} sm={6} sx={{mb: {xl: 0, xs: 4, sm: 3}}}>
                <Box sx={{mb: 6, display: 'flex', alignItems: 'center'}}>
                  <Typography
                    variant='h6'
                    sx={{
                      ml: 2.5,
                      fontWeight: 600,
                      lineHeight: '24px',
                      fontSize: '1.375rem !important'
                    }}
                  >
                    {t('State list')}
                  </Typography>
                </Box>
              </Grid>

              <StateWorkflow
                count={count}
                control={control}
                toggle={handleAddState}
                toggleDelete={deleteState}
                errors={errors}
              />
            </RepeaterWrapper>
          </Fragment>
        )
      case 2:
        return (
          <Fragment key={step}>
            {defaultValues.workflowStates.length > 1 ? (
              <RepeaterTransition>
                <Grid item xs={12} sm={6} sx={{mb: {xl: 0, xs: 4, sm: 3}}}>
                  <Box sx={{mb: 6, display: 'flex', alignItems: 'center'}}>
                    <Typography
                      variant='h6'
                      sx={{
                        ml: 2.5,
                        fontWeight: 600,
                        lineHeight: '24px',
                        fontSize: '1.375rem !important'
                      }}
                    >
                      {t('Transitions')}
                    </Typography>
                  </Box>
                </Grid>
                <TransitionWorkflow
                  count={countTransition}
                  control={control}
                  toggle={handleAddTransition}
                  toggleDelete={deleteTransition}
                  errors={errors}
                  getValues={getValues}
                  defaultValues={defaultValues}
                  watch={watch}
                  workFlowEmails={workFlowEmails}
                  emails={emails}
                  setValue={setValue}
                />
              </RepeaterTransition>
            ) : (
              <></>
            )}
          </Fragment>
        )
      default:
        return 'Unknown Step'
    }
  }

  const [state, setState] = useState('white')

  const listenScrollEvent = () => {
    if (window.scrollY > 50) {
      setState(
        '0px 3px 9px 1px rgba(51, 48, 60, 0.03), 0px 8px 9px 0px rgba(51, 48, 60, 0.02), 0px 1px 6px 4px rgba(51, 48, 60, 0.01)'
      )
    } else {
      setState('none')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
  }, [state])

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <>
          <Typography>All steps are completed!</Typography>
        </>
      )
    } else {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Box
              sx={{
                position: 'sticky',
                top: '56px',
                zIndex: 1000,
                background: 'white',
                width: '100%',
                padding: '10px',
                boxShadow: state
              }}
            >
              <Grid item xs={12}>
                <Typography variant='body2' sx={{fontWeight: 600, color: 'text.primary'}}>
                  {steps[activeStep].title}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                  size='small'
                  className={'button-padding-style'}
                  variant='outlined'
                  aria-label='outlined secondary button group'
                  disabled={activeStep === 0}
                  onClick={handleSubmit(handleBack)}
                >
                  {t('Back')}
                </Button>
                <ButtonGroup variant='contained' aria-label='outlined primary button group'>
                  <Button size='small' onClick={handleSubmit(onSubmit)} className={'button-padding-style'}>
                    {t('Save')}
                  </Button>
                  {activeStep < steps.length - 1 && (
                    <Button size='small' variant='contained'
                            onClick={handleSubmit(handleNext)} className={'button-padding-style'}>
                      {t('Next')}
                    </Button>
                  )}
                </ButtonGroup>
              </Grid>
            </Box>
            {getStepContent(activeStep)}
          </Grid>
        </form>
      )
    }
  }

  return (
    <Grid container>
      <Grid item md={12}>
        <Card sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, overflow: 'initial'}}>
          <StepperHeaderContainer>
            <StepperWrapper sx={{height: '100%'}}>
              <Stepper
                activeStep={activeStep}
                orientation='vertical'
                connector={<></>}
                sx={{height: '100%', minWidth: '15rem'}}
              >
                {steps.map((step, index) => {
                  const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                  return (
                    <Step key={index}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <RenderAvatar
                            variant='rounded'
                            {...(activeStep >= index && {skin: 'light'})}
                            {...(activeStep === index && {skin: 'filled'})}
                            {...(activeStep >= index && {color: 'primary'})}
                            sx={{
                              ...(activeStep === index && {boxShadow: theme => theme.shadows[3]}),
                              ...(activeStep > index && {color: theme => hexToRGBA(theme.palette.primary.main, 0.4)})
                            }}
                          >
                            <Icon icon={step.icon}/>
                          </RenderAvatar>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </StepperHeaderContainer>
          <Divider sx={{m: '0 !important'}}/>

          <CardContent sx={{width: '100%'}}>{renderContent()}</CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EditWorkflow
