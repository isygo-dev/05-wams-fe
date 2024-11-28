import {yupResolver} from '@hookform/resolvers/yup'
import {
  Box,
  BoxProps,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Switch,
  TextField,
  Typography
} from '@mui/material'

import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import Icon from 'template-shared/@core/components/icon'
import * as yup from 'yup'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import AnnexApis from "ims-shared/@core/api/ims/annex";
import Tooltip from "@mui/material/Tooltip";
import DomainApis from "ims-shared/@core/api/ims/domain";
import RolePermissionApis from "ims-shared/@core/api/ims/role-permission";
import AccountApis from "ims-shared/@core/api/ims/account";
import {AccountDto} from "ims-shared/@core/types/ims/accountTypes";
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import {RoleTypes} from "ims-shared/@core/types/ims/roleTypes";
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";

interface SidebarAddAccountType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  domain: yup.string().required(),
  adminStatus: yup.string().required(),
  phoneNumber: yup.string().required(),
  functionRole: yup.string().required(),
  roleInfo: yup.array().min(1),
  accountDetails: yup.object().shape({
    firstName: yup.string().required('First Name field is required'),
    lastName: yup.string().required('Last Name field is required')
  })
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
const SidebarAddAccount = (props: SidebarAddAccountType) => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const {open, toggle, domain} = props
  const {data: domainList, isFetched: isFetchedDomains} = useQuery('domains', DomainApis(t).getDomains)
  const {data: rolesList, isFetched: isFetchedRoles} = useQuery('roles', RolePermissionApis(t).getRoles)
  const {data: functionsRole, isLoading: isLoadingFunctionRole} = useQuery('functionsRole', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.FUNCTION_ROL)
  )

  const addMutation = useMutation({
    mutationFn: (data: AccountDto) => AccountApis(t).addAccount(data),
    onSuccess: (res: AccountDto) => {
      handleClose()
      const cachedData: AccountDto[] = queryClient.getQueryData('accounts') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('accounts', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  const defaultValues: AccountDto = {
    email: '',
    domain: domain,
    adminStatus: 'ENABLED',
    isAdmin: false,
    roleInfo: [],
    phoneNumber: '',
    functionRole: '',
    accountDetails: {
      firstName: '',
      lastName: ''
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: AccountDto) => {
    const mappeAdminStatus = data.adminStatus ? 'ENABLED' : 'DISABLED'
    const dataForm = {...data, adminStatus: mappeAdminStatus}
    console.log(dataForm)
    addMutation.mutate(dataForm)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return isFetchedDomains && isFetchedRoles ? (
    <Drawer
      open={open}
      anchor='right'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Account.Add_New_Account')} </Typography>
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
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  disabled={checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domainList?.map((domain: DomainType) => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='accountDetails.firstName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='text'
                  label={t('First_Name')}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.accountDetails?.firstName)}
                />
              )}
            />
            {errors.accountDetails?.firstName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.accountDetails?.firstName.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='accountDetails.lastName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  type='text'
                  label={t('Last_Name')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.accountDetails?.lastName)}
                />
              )}
            />
            {errors.accountDetails?.lastName && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.accountDetails?.lastName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='phoneNumber'
              control={control}
              rules={{required: true}}
              render={({field: {value}}) => (
                <MuiPhoneNumber
                  variant='outlined'
                  fullWidth
                  size='small'
                  defaultCountry={'tn'}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={e => {
                    const updatedValue = e.replace(/\s+/g, '')
                    setValue('phoneNumber', updatedValue)
                  }}
                  error={Boolean(errors.phoneNumber)}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.phoneNumber.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='email'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <EmailInputMask value={value} onChange={onChange} error={Boolean(errors.email)}/>
              )}
            />
            {errors.email && <FormHelperText sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Role.Functional_Role')}</InputLabel>
            <Controller
              name='functionRole'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Tooltip title="ANNEX / JOBFUN">
                  <Select
                    size='small'
                    label={t('Role.Functional_Role')}
                    name='functionRole'
                    onChange={onChange}
                    value={value}
                  >
                    {!isLoadingFunctionRole
                      ? functionsRole?.map(res => (
                        <MenuItem key={res.id} value={res.value}>
                          {res.value}
                        </MenuItem>
                      ))
                      : null}
                  </Select>
                </Tooltip>
              )}
            />
            {errors.functionRole &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.functionRole.message}</FormHelperText>}
          </FormControl>


          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-multiple-chip-label'>{t('Roles')}</InputLabel>

            <Controller
              name='roleInfo'
              control={control}
              rules={{required: true}}
              render={({field}) => {
                return (
                  <Select
                    size='small'
                    multiple
                    label={t('Roles')}
                    value={field.value}
                    MenuProps={MenuProps}
                    id='multiple-role'
                    onChange={event => {
                      const selectedRoles = event.target.value as RoleTypes[]
                      const lastSelectedRole = selectedRoles[selectedRoles.length - 1]
                      const isRoleSelected = field.value?.some(role => role.code === lastSelectedRole.code)

                      if (!isRoleSelected) {
                        field.onChange(selectedRoles)
                      } else {
                        const updatedRoles = field.value?.filter(role => role.code !== lastSelectedRole.code)
                        field.onChange(updatedRoles)
                      }
                    }}
                    labelId='multiple-role-label'
                    renderValue={selected => selected.map(role => role.name).join(', ')}
                  >
                    {rolesList?.map((role: any) => (
                      <MenuItem key={role.code} value={role}>
                        <Checkbox checked={field.value?.some(r => r.code === role.code)}/>
                        <ListItemText primary={role.name}/>
                      </MenuItem>
                    ))}
                  </Select>
                )
              }}
            />
            {errors.roleInfo && <FormHelperText sx={{color: 'error.main'}}>{errors.roleInfo.message}</FormHelperText>}
          </FormControl>
          <FormControlLabel
            labelPlacement='top'
            label={t('IsAdmin')}
            control={
              <Controller
                name='isAdmin'
                control={control}
                defaultValue={defaultValues.isAdmin}
                render={({field: {value, onChange}}) => (
                  <Switch checked={value} onChange={e => onChange(e.target.checked)}/>
                )}
              />
            }
            sx={{mb: 4, alignItems: 'flex-start', marginLeft: 0}}
          />
          <br/>
          <FormControlLabel
            labelPlacement='top'
            label={t('Admin_Status')}
            control={
              <Controller
                name='adminStatus'
                control={control}
                defaultValue={defaultValues.adminStatus}
                render={({field: {value, onChange}}) => (
                  <Switch checked={value == 'ENABLED' ? true : false} onChange={e => onChange(e.target.checked)}/>
                )}
              />
            }
            sx={{mb: 4, alignItems: 'flex-start', marginLeft: 0}}
          />

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
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

export default SidebarAddAccount
