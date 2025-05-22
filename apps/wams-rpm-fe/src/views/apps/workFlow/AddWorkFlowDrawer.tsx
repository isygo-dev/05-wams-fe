import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Controller, useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css' // Import the styles
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { WorkflowsType } from 'rpm-shared/@core/types/rpm/workflowTypes'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import WorkflowApis from 'rpm-shared/@core/api/rpm/workflow'
import DomainApis from 'ims-shared/@core/api/ims/domain'

interface SidebarAddWorkflowType {
  open: boolean
  toggle: () => void
  domain: string
}

interface WorkFlowData {
  domain: string
  name: string
  description: string
  category: string
  type: string
  watchers: string[]
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  name: yup.string().required().min(3),
  description: yup.string(),
  category: yup.string().required(),
  type: yup.string().required()
})

const SidebarAddWorkFlow = (props: SidebarAddWorkflowType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const defaultValues = {
    domain: domain,
    name: '',
    description: '',
    category: '',
    type: '',
    watchers: []
  }

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

  const addWorkflowMutation = useMutation({
    mutationFn: (data: WorkFlowData) => WorkflowApis(t).addWorkflow(data),
    onSuccess: (res: WorkflowsType) => {
      handleClose()
      const cachedData = (queryClient.getQueryData('workflows') as any[]) || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('workflows', updatedData)
      console.log('updatedItems', updatedData)
    }
  })

  const onSubmit = (data: WorkFlowData) => {
    addWorkflowMutation.mutate(data)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const { data: domains } = useQuery(`domains`, () => DomainApis(t).getDomainsNameList())

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
        <Typography variant='h6'>{t('Add_workflow')}</Typography>
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
            <InputLabel>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  disabled={
                    checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)
                      ? false
                      : true
                  }
                  onChange={e => {
                    onChange(e)
                  }}
                  value={value}
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
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Name')}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
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

          <FormControl fullWidth sx={{ mb: 4 }}>
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
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  value={value}
                  label={t('Category')}
                  onChange={onChange}
                  error={Boolean(errors.category)}
                  labelId='validation-category-select'
                  aria-describedby='validation-category-select'
                >
                  <MenuItem value='SEQUENTIAL'>Sequential</MenuItem>
                  <MenuItem value='PARALLEL'>Parellel</MenuItem>
                  <MenuItem value='RULES_DRIVEN'>Rules driven</MenuItem>
                  <MenuItem value='STATE_MACHINE'>State machine</MenuItem>
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                </Select>
              )}
            />
            {errors.category && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-category-select'>
                {t('This field is required')}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='validation-type-select' error={Boolean(errors.type)} htmlFor='validation-type-select'>
              {t('Type')}
            </InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  value={value}
                  label={t('Type')}
                  onChange={onChange}
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
              <FormHelperText sx={{ color: 'error.main' }} id='validation-type-select'>
                {t('This field is required')}
              </FormHelperText>
            )}
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

export default SidebarAddWorkFlow
