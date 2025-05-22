// ** React Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import { WorkflowsBoardType } from 'rpm-shared/@core/types/rpm/workflowBoardTypes'
import React, { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import localStorageKeys from 'template-shared/configs/localeStorage'
import WorkflowBoardItemApis from 'rpm-shared/@core/api/rpm/workflow-board/item'
import WorkflowApis from 'rpm-shared/@core/api/rpm/workflow'
import AccountApis from 'ims-shared/@core/api/ims/account'
import WorkflowBoardApis from 'rpm-shared/@core/api/rpm/workflow-board'

interface SidebarEditWorkflowBoardType {
  open: boolean
  toggle: () => void
  dataWorkflowBoard: WorkflowsBoardType | undefined
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string(),
  name: yup.string().required().min(3),
  description: yup.string(),
  item: yup.string().required(),
  workflow: yup.object().required()
})

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
const SidebarEditWorkflowBoard = (props: SidebarEditWorkflowBoardType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle } = props
  console.log(props.dataWorkflowBoard)
  const { data: itemTypes } = useQuery(`itemTypes`, () => WorkflowBoardItemApis(t).getWorkflowBoardItemTypes())
  const { data: workflowList } = useQuery(`workflowList`, () => WorkflowApis(t).getWorkflows())
  console.log('workflowList', workflowList)
  const [selectedWorkflow, setSelectedWorkflow] = useState(props.dataWorkflowBoard?.workflow)
  console.log('selectedWorkflow', selectedWorkflow)
  const [selectedDomain] = useState(props?.dataWorkflowBoard?.domain)
  const { data: emails } = useQuery(['emails', selectedDomain], () => AccountApis(t).getAccountEmailsByDomain(), {
    enabled: !!selectedDomain
  })

  const defaultValues: WorkflowsBoardType = { ...props.dataWorkflowBoard }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleWorkflowChange = e => {
    const selectedChangeWorkflow = workflowList?.find(workflow => workflow.code === e.target.value)
    setSelectedWorkflow(selectedChangeWorkflow)
  }

  const updateWorkflowBoardMutation = useMutation({
    mutationFn: (data: WorkflowsBoardType) => WorkflowBoardApis(t).updateWorkflowBoard(data),
    onSuccess: (res: WorkflowsBoardType) => {
      handleClose()
      const cachedData = (queryClient.getQueryData('workflowBoards') as any[]) || []
      const index = cachedData.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedData = [...cachedData]
        updatedData[index] = res
        queryClient.setQueryData('workflowBoards', updatedData)
        localStorage.removeItem(localStorageKeys.dashboardLink)
        localStorage.setItem(localStorageKeys.dashboardLink, JSON.stringify(updatedData))
      }
    }
  })

  const onSubmit = (data: WorkflowsBoardType) => {
    const updatedData = { ...data, workflow: selectedWorkflow }
    updateWorkflowBoardMutation.mutate(updatedData)
  }

  const handleClose = () => {
    defaultValues
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Edit Workflow Board')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='code'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => <TextField size='small' disabled value={value} label='code' />}
            />
            {errors.code && <FormHelperText sx={{ color: 'error.main' }}>{errors.code.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='domain'
              control={control}
              render={({ field }) => (
                <TextField
                  label={t('Domain.Domain')}
                  fullWidth
                  {...field}
                  variant='outlined'
                  size='small'
                  disabled={true}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField size='small' value={value} label='Name' onChange={onChange} error={Boolean(errors.name)} />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  rows={4}
                  multiline
                  value={value}
                  label='description'
                  onChange={onChange}
                  id='textarea-standard-static'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel
              id='validation-category-select'
              error={Boolean(errors.item)}
              htmlFor='validation-category-select'
            >
              {t('Item')}
            </InputLabel>
            <Controller
              name='item'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  value={value}
                  label='Item'
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
              <FormHelperText sx={{ color: 'error.main' }} id='validation-item-select'>
                {t('This field is require')}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
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
              rules={{ required: true }}
              render={({ field: {} }) => (
                <Select
                  size='small'
                  value={selectedWorkflow.code as ''}
                  onChange={handleWorkflowChange}
                  error={Boolean(errors.workflow)}
                  label={t('workflow.Workflow')}
                  labelId='validation-workflow-select'
                  aria-describedby='validation-workflow-select'
                  defaultValue={defaultValues.workflow}
                >
                  {workflowList?.map((item, index) => (
                    <MenuItem key={index} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.workflow && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-workflow-select'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>{t('Watchers')}</InputLabel>

            <Controller
              name='watchers'
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                const value: string[] = field.value

                return (
                  <Select
                    size='small'
                    multiple
                    label={t('Watchers')}
                    value={value}
                    MenuProps={MenuProps}
                    onChange={event => {
                      const selectedEmails = event.target.value
                      const lastSelectedEmail = selectedEmails[selectedEmails.length]
                      const isEmailSelected = value.some(email => email === lastSelectedEmail)

                      if (!isEmailSelected) {
                        field.onChange(selectedEmails)
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
                          <Checkbox checked={value.some(e => e === email)} />
                          <ListItemText primary={email} />
                        </MenuItem>
                      ))}
                  </Select>
                )
              }}
            />
            {errors.watchers && <FormHelperText sx={{ color: 'error.main' }}>{errors.watchers.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarEditWorkflowBoard
