import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {Controller, useForm} from 'react-hook-form'

import 'react-datepicker/dist/react-datepicker.css' // Import the styles
import Icon from 'template-shared/@core/components/icon'
import React, {useState} from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useTranslation} from 'react-i18next'
import {WorkflowsBoardData, WorkflowsBoardType} from 'rpm-shared/@core/types/rpm/workflowBoardTypes'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import localStorageKeys from 'template-shared/configs/localeStorage'
import WorkflowBoardItemApis from "rpm-shared/@core/api/rpm/workflow-board/item";
import WorkflowApis from "rpm-shared/@core/api/rpm/workflow";
import DomainApis from "ims-shared/@core/api/ims/domain";
import AccountApis from "ims-shared/@core/api/ims/account";
import WorkflowBoardApis from "rpm-shared/@core/api/rpm/workflow-board";


interface SidebarAddWorkflowBoardType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  name: yup.string().required().min(3),
  description: yup.string(),
  item: yup.string().required(),
  workflow: yup.string().required()
})
const defaultValues: WorkflowsBoardData = {
  domain: '',
  name: '',
  description: '',
  item: '',
  workflow: null,
  watchers: []
}
const SidebarAddWorkflowBoard = (props: SidebarAddWorkflowBoardType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle} = props
  const {data: itemTypes} = useQuery(`itemTypes`, () => WorkflowBoardItemApis(t).getWorkflowBoardItemTypes())
  const {data: workflowList} = useQuery(`workflowList`, () => WorkflowApis(t).getWorkflows())
  const {data: domains} = useQuery(`domains`, () => DomainApis(t).getDomainsNameList())
  const [selectedDomain, setSelectedDomain] = useState('')
  const {data: emails} = useQuery(['emails', selectedDomain], () => AccountApis(t).getAccountEmailsByDomain(), {
    enabled: !!selectedDomain
  })

  const handleChangeDomain = event => {
    setSelectedDomain(event.target.value)
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const addWorkflowBoardMutation = useMutation({
    mutationFn: (newMutation: WorkflowsBoardData) => WorkflowBoardApis(t).addWorkflowBoard(newMutation),
    onSuccess: (res: WorkflowsBoardType) => {
      handleClose()
      const cachedData = (queryClient.getQueryData('workflowBoards') as any[]) || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('workflowBoards', updatedData)
      localStorage.removeItem(localStorageKeys.dashboardLink)
      localStorage.setItem(localStorageKeys.dashboardLink, JSON.stringify(updatedData))
    }
  })

  const onSubmit = (data: WorkflowsBoardData) => {
    const updatedFormData = {...data}
    if (typeof data.workflow === 'string') {
      updatedFormData.workflow = JSON.parse(data.workflow)
    }
    addWorkflowBoardMutation.mutate(updatedFormData)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Add_workflow_Board')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={e => {
                    onChange(e)
                    handleChangeDomain(e)
                  }}
                  value={value || ''}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domains?.map((domain, index) => (
                    <MenuItem key={index} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
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
            {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='description'
              control={control}
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
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel
              id='validation-category-select'
              error={Boolean(errors.item)}
              htmlFor='validation-category-select'
            >
              {t('item')}
            </InputLabel>
            <Controller
              name='item'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  value={value}
                  label={t('Item')}
                  onChange={onChange}
                  error={Boolean(errors.item)}
                  labelId='validation-item-select'
                  aria-describedby='validation-item-select'
                >
                  {itemTypes?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            {errors.item && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-item-select'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel
              id='validation-workflow-select'
              error={Boolean(errors.workflow)}
              htmlFor='validation-workflow-select'
            >
              {t('Workflow.Workflow')}
            </InputLabel>
            <Controller
              name='workflow'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  size='small'
                  value={value}
                  label={t('workflow.Workflow')}
                  onChange={onChange}
                  error={Boolean(errors.workflow)}
                  labelId='validation-workflow-select'
                  aria-describedby='validation-workflow-select'
                >
                  {workflowList?.map((item, index) => (
                    <MenuItem key={index} value={JSON.stringify(item)}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.workflow && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-workflow-select'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel>{t('Watchers')}</InputLabel>

            <Controller
              name='watchers'
              control={control}
              rules={{required: true}}
              render={({field}) => {
                const value: string[] = field.value

                return (
                  <Select
                    size='small'
                    multiple
                    label={t('Watchers')}
                    value={value}
                    MenuProps={MenuProps}
                    onChange={event => {
                      const currentSelected = event.target.value
                      const lastSelectedEmail = currentSelected[currentSelected.length]
                      const isEmailSelected = value.some(email => email === lastSelectedEmail)

                      if (!isEmailSelected) {
                        field.onChange(currentSelected)
                      } else {
                        const updatedEmails = value.filter(email => email !== lastSelectedEmail)
                        field.onChange(updatedEmails)
                      }
                    }}
                    renderValue={selected => selected.map(email => email).join(', ')}
                  >
                    {selectedDomain &&
                      emails?.map((email, index) => (
                        <MenuItem key={index} value={email}>
                          <Checkbox checked={value.some(e => e === email)}/>
                          <ListItemText primary={email}/>
                        </MenuItem>
                      ))}
                  </Select>
                )
              }}
            />
            {errors.watchers && <FormHelperText sx={{color: 'error.main'}}>{errors.watchers.message}</FormHelperText>}
          </FormControl>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}} id={'btn-change-workflow-board'}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose} id={'btn-change-workflow-board'}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddWorkflowBoard
