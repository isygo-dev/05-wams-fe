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
import { InputLabel } from '@mui/material'
import Icon from 'template-shared/@core/components/icon'
import Select from '@mui/material/Select'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { RoleTypes } from 'ims-shared/@core/types/ims/roleTypes'
import { ApplicationType } from 'ims-shared/@core/types/ims/applicationTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import React from 'react'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import ApplicationApis from 'ims-shared/@core/api/ims/application'
import RolePermissionApis from 'ims-shared/@core/api/ims/role-permission'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'

interface SidebarAddRoleType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  templateCode: yup.string()
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

const SidebarAddRole = (props: SidebarAddRoleType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { open, toggle, domain } = props
  const defaultValues = {
    name: '',
    description: '',
    domain: domain,
    templateCode: '',
    level: 0,
    allowedTools: [],
    rolePermission: []
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

  const { data: domainList, isLoading: isLoadingDomain } = useQuery('domains', DomainApis(t).getDomains)
  const { data: applicationList, isLoading } = useQuery(`applications`, () =>
    ApplicationApis(t).getApplicationsOfDefaultDomain()
  )
  const { data: rolesByDefaultDomain, isLoading: isLoadingRole } = useQuery(
    'dd',
    RolePermissionApis(t).getRolesByDomainDefault
  )

  const mutation = useMutation({
    mutationFn: (data: RoleTypes) => RolePermissionApis(t).addRole(data),
    onSuccess: (res: RoleTypes) => {
      handleClose()
      const cachedData: RoleTypes[] = queryClient.getQueryData('roles') || []
      const updatedData = [...cachedData]
      updatedData.push(res)

      queryClient.setQueryData('roles', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = (data: RoleTypes) => {
    console.log('data', data)
    mutation.mutate(data)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return !isLoading ? (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Role.Add_New_Role')}</Typography>
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
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={
                    checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)
                      ? false
                      : true
                  }
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {!isLoadingDomain && domainList?.length > 0
                    ? domainList?.map((domain: DomainType) => (
                        <MenuItem key={domain.id} value={domain.name}>
                          {domain.name}
                        </MenuItem>
                      ))
                    : null}
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
                  placeholder={t('Name') as string}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='level'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  type='number'
                  label={t('Level')}
                  onChange={onChange}
                  placeholder={t('Level') as string}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.level && <FormHelperText sx={{ color: 'error.main' }}>{errors.level.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Template.Template')}</InputLabel>
            <Controller
              name='templateCode'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Template.Template')}
                  name='templateCode'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {!isLoadingRole && rolesByDefaultDomain?.length > 0
                    ? rolesByDefaultDomain?.map((name: any) => (
                        <MenuItem key={name.code} value={name.code}>
                          {name.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              )}
            />
            {errors.templateCode && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.templateCode.message}</FormHelperText>
            )}
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
                  label={t('Description')}
                  onChange={onChange}
                  placeholder={t('Description') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          {applicationList && applicationList.length > 0 && (
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id='demo-multiple-chip-label'>{t('Application.Application')}</InputLabel>
              <Controller
                name='allowedTools'
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  const value: ApplicationType[] | undefined = field.value

                  return (
                    <Select
                      size='small'
                      multiple
                      label={t('Role.Roles')}
                      value={value}
                      MenuProps={MenuProps}
                      id='demo-multiple-chip'
                      onChange={event => {
                        const selectedApplications = event.target.value as ApplicationType[]
                        const lastSelectedApplications = selectedApplications[selectedApplications.length - 1]
                        const isApplicationSelected = value.some(
                          application => application.code === lastSelectedApplications.code
                        )

                        if (!isApplicationSelected) {
                          // Role is not selected, add it
                          field.onChange(selectedApplications)
                        } else {
                          // Role is already selected, remove it
                          const updatedApplications = value.filter(
                            application => application.code !== lastSelectedApplications.code
                          )
                          field.onChange(updatedApplications)
                        }
                      }}
                      labelId='demo-multiple-chip-label'
                      renderValue={selected => selected.map(application => application.name).join(', ')}
                    >
                      {applicationList?.map((application: any) => (
                        <MenuItem key={application.code} value={application}>
                          <Checkbox checked={value.some(r => r.code === application.code)} />
                          <ListItemText primary={application.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  )
                }}
              />
            </FormControl>
          )}
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
  ) : null
}

export default SidebarAddRole
