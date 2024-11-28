// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, {Fragment, useEffect, useState} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'
import Card from '@mui/material/Card'
import StepperWrapper from 'template-shared/@core/styles/mui/stepper'
import Stepper from '@mui/material/Stepper'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import Avatar from '@mui/material/Avatar'
import StepLabel from '@mui/material/StepLabel'
import StepperCustomDot from 'template-shared/views/forms/form-wizard/StepperCustomDot'
import Icon from 'template-shared/@core/components/icon'
import Divider from '@mui/material/Divider'
import CardContent, {CardContentProps} from '@mui/material/CardContent'
import {styled} from '@mui/material/styles'
import MuiStep, {StepProps} from '@mui/material/Step'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import * as yup from 'yup'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import imsApiUrls from "ims-shared/configs/ims_apis"
import ButtonGroup from '@mui/material/ButtonGroup'
import {useTranslation} from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import PermissionCard from './PermissionCard'
import {useMutation} from 'react-query'
import {ApplicationType} from "ims-shared/@core/types/ims/applicationTypes";
import {Box} from '@mui/material'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import RolePermissionApis from "ims-shared/@core/api/ims/role-permission";
import {hexToRGBA} from "template-shared/@core/utils/hex-to-rgba";
import {ListCheckBox, RolePermission, RoleTypes} from "ims-shared/@core/types/ims/roleTypes";

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({theme}) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
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
  }
}))
type propsType = {
  roleDetailsData: RoleTypes
  applicationList: ApplicationType[]
}
const RoleView = (props: propsType) => {
  const {t} = useTranslation()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [checkedPermission, setCheckedPermission] = useState<ListCheckBox[]>([])
  const [checked, setChecked] = useState<ApplicationType[]>(props.roleDetailsData.allowedTools)
  const [filtredRole, setFiltredRole] = useState<RolePermission[]>(props.roleDetailsData.rolePermission)
  const [filtredApplication, setFiltredApplication] = useState<ApplicationType[]>(props.applicationList)
  const [serviceList, setServiceList] = useState<string[]>([])
  const togglePermission = (event: boolean, permission: RolePermission, option: string, service: string) => {
    const objectChecked: ListCheckBox = {
      serviceName: service,
      objectName: permission.objectName,
      option: option
    }
    const listArray = checkedPermission
    switch (option) {
      case 'read':
        permission.read = event
        break
      case 'write':
        permission.write = event
        break
      case 'delete':
        permission.delete = event
        break
    }
    const objectExist = checkedPermission.find(
      r =>
        r.serviceName === objectChecked.serviceName && r.objectName === objectChecked.objectName && r.option === option
    )
    const objectIndex = checkedPermission.findIndex(
      r =>
        r.serviceName === objectChecked.serviceName && r.objectName === objectChecked.objectName && r.option === option
    )
    if (objectExist && !event) {
      const newArrayList = listArray.filter((l, index) => index !== objectIndex)
      setCheckedPermission([...newArrayList])
    } else if (event && !objectExist) {
      listArray.push(objectChecked)
      setCheckedPermission([...listArray])
    }
  }

  const handleSelectAllCheckbox = (event: boolean, serviceName: string) => {
    if (event) {
      filtredRole
        .filter(item => item.serviceName === serviceName)
        .forEach(row => {
          togglePermission(event, row, 'read', serviceName)
          togglePermission(event, row, 'write', serviceName)
          togglePermission(event, row, 'delete', serviceName)
        })
    } else {
      filtredRole
        .filter(item => item.serviceName === serviceName)
        .forEach(row => {
          togglePermission(event, row, 'read', serviceName)
          togglePermission(event, row, 'write', serviceName)
          togglePermission(event, row, 'delete', serviceName)
        })

      setCheckedPermission([])
      const newDataList = ([] = checkedPermission.filter(p => p.serviceName !== serviceName))
      setCheckedPermission(newDataList)
    }
  }

  const handleGetServiceList = () => {
    const newList: string[] = []
    filtredRole?.forEach(d => {
      if (!newList.includes(d.serviceName)) {
        newList.push(d.serviceName)
      }
    })
    setServiceList(newList)
  }

  useEffect(() => {
    handleGetServiceList()
    setCheckedPermission([])
    const permissions: ListCheckBox[] = []
    serviceList.map(service => {
      filtredRole?.map(role => {
        if (role.read) {
          const objectChecked: ListCheckBox = {
            serviceName: service,
            objectName: role.objectName,
            option: 'read'
          }
          permissions.push(objectChecked)
        }
        if (role.write) {
          const objectChecked: ListCheckBox = {
            serviceName: service,
            objectName: role.objectName,
            option: 'write'
          }
          permissions.push(objectChecked)
        }
        if (role.delete) {
          const objectChecked: ListCheckBox = {
            serviceName: service,
            objectName: role.objectName,
            option: 'delete'
          }
          permissions.push(objectChecked)
        }
        setCheckedPermission([...permissions])
      })
    })
  }, [])

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const defaultValues: RoleTypes = {
    id: props.roleDetailsData.id,
    code: props.roleDetailsData.code,
    name: props.roleDetailsData.name,
    level: props.roleDetailsData.level,
    domain: props.roleDetailsData.domain,
    description: props.roleDetailsData.description,
    allowedTools: props.roleDetailsData.allowedTools,
    rolePermission: props.roleDetailsData.rolePermission
  }

  const schema = yup.object().shape({
    code: yup.string().required(),
    name: yup.string().required(),
    level: yup.string().required(),
    description: yup.string()
  })

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleToggle = (value: ApplicationType) => () => {
    if (!checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.WRITE)) {
      return
    }
    let newChecked = [...checked]
    const isApplicationSelected = checked.some(application => application.code === value.code)
    if (!isApplicationSelected) {
      newChecked.push(value)
    } else {
      newChecked = newChecked.filter(e => e.code !== value.code)
    }
    setChecked(newChecked)
  }
  const steps = [
    {
      icon: 'tabler:user',
      title: t('Role Details')
    },
    {
      icon: 'tabler:user',
      title: t('Applications')
    },
    {
      icon: 'tabler:link',
      title: t('Permissions')
    }
  ]
  const onSubmit = (data: RoleTypes) => {
    console.log('data', data)
    data.allowedTools = [...checked]
    data.rolePermission = defaultValues.rolePermission
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: (newMutation: RoleTypes) => RolePermissionApis(t).updateRole(newMutation)
  })

  const handleFilterPermission = (value: string) => {
    if (defaultValues.rolePermission) {
      const newArrya = defaultValues.rolePermission.filter(
        e =>
          e.serviceName.toLowerCase().includes(value.toLowerCase()) ||
          e.objectName.toLowerCase().includes(value.toLowerCase())
      )
      setFiltredRole(newArrya)
    }
  }

  const handleFilterApplications = (value: string) => {
    if (props.applicationList) {
      const newArray = props.applicationList.filter(
        e => e.name.toLowerCase().includes(value.toLowerCase()) || e.title.toLowerCase().includes(value.toLowerCase())
      )
      setFiltredApplication(newArray)
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='code'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value}}) => <TextField size='small' disabled value={value} label={t('code')}/>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='name'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('name')}
                      placeholder='name'
                      onChange={
                        checkPermission(
                          PermissionApplication.IMS,
                          PermissionPage.ROLE_INFO,
                          PermissionAction.WRITE
                        ) && onChange
                      }
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='domain'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value}}) => (
                    <TextField disabled size='small' value={value} label={t('Domain.Domain')}/>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{mb: 4}}>

                <Controller
                  name='level'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      label={t('Level')}
                      placeholder='0'
                      onChange={
                        checkPermission(
                          PermissionApplication.IMS,
                          PermissionPage.ROLE_INFO,
                          PermissionAction.WRITE
                        ) && onChange
                      }
                      error={Boolean(errors.level)}
                    />
                  )}
                />
                {errors.level && <FormHelperText sx={{color: 'error.main'}}>{errors.level.message}</FormHelperText>}
              </FormControl>


            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='description'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      rows={4}
                      id={'description'}
                      name={'description'}
                      multiline
                      value={value}
                      label={t('Description')}
                      onChange={
                        checkPermission(
                          PermissionApplication.IMS,
                          PermissionPage.ROLE_INFO,
                          PermissionAction.WRITE
                        ) && onChange
                      }
                      placeholder='description'
                      error={Boolean(errors.description)}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Fragment>
        )

      case 1:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={6}>
              <Box>
                <TextField
                  size='small'
                  fullWidth
                  sx={{mr: 4, mb: 2}}
                  placeholder='Search Application'
                  onChange={e => handleFilterApplications(e.target.value)}
                />
              </Box>
              <List>
                {filtredApplication &&
                  filtredApplication?.map((tool: ApplicationType, index: number) => (
                    <Tooltip title={t(tool?.description ?? '') as string} key={index}>
                      <ListItem key={index} disablePadding>
                        <ListItemButton onClick={handleToggle(tool)}>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                tool.imagePath
                                  ? `${imsApiUrls.apiUrl_IMS_Application_ImageDownload_EndPoint}/${tool.id}`
                                  : '/images/favicon.png'
                              }
                              sx={{cursor: 'pointer'}}
                            ></Avatar>
                          </ListItemAvatar>
                          <ListItemText id={`checkbox-list-label-${index}`} primary={tool.name}/>
                          <ListItemSecondaryAction>
                            <Checkbox
                              id={`checkbox-list-label-check-${index}`}
                              edge='end'
                              tabIndex={-1}
                              disableRipple
                              checked={checked.some(r => r.code === tool.code)}
                              inputProps={{'aria-labelledby': `checkbox-list-label-${index}`}}
                            />
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  ))}
              </List>
            </Grid>
          </Fragment>
        )

      case 2:
        return (
          <Fragment key={step}>
            <PermissionCard
              serviceList={serviceList}
              permissionList={filtredRole}
              handleFilter={handleFilterPermission}
              togglePermission={togglePermission}
              handleSelectAllCheckbox={handleSelectAllCheckbox}
              checkedPermission={checkedPermission}
            />
          </Fragment>
        )

      default:
        return ' '
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  {steps[activeStep].title} : ({defaultValues.name})
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                  size='small'
                  variant='outlined'
                  aria-label='outlined secondary button group'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={'button-padding-style'}
                >
                  {t('Back')}
                </Button>
                <ButtonGroup variant='contained' aria-label='outlined primary button group'>
                  {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.WRITE) && (
                    <Button size='small' type='submit'
                            className={'button-padding-style'}>
                      {t('Save')}
                    </Button>
                  )}
                  {activeStep < steps.length - 1 && (
                    <Button size='small' onClick={handleSubmit(handleNext)}
                            className={'button-padding-style'}>
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

export default RoleView
