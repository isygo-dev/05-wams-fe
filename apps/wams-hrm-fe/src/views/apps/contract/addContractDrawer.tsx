import React from 'react'
import { styled } from '@mui/system'
import Box, { BoxProps } from '@mui/material/Box'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { ContractType, ContractTypeRequest, IEnumContractType } from 'hrm-shared/@core/types/hrm/contractType'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import FormControl from '@mui/material/FormControl'
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import { EmployeeType } from 'hrm-shared/@core/types/hrm/employeeTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import ContractApis from 'hrm-shared/@core/api/hrm/contract'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required('Domain is required'),
  employee: yup.number().required('employee is required'),
  contract: yup.string().required('Contract type is required')
})

export function AddContractDrawer(props) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: domainList, isLoading: domainLoading } = useQuery('domains', DomainApis(t).getDomainsNameList)
  const defaultValues: ContractTypeRequest = {
    id: null,
    contract: null,
    domain: props.domain,
    employee: null
  }

  const addContractMutation = useMutation({
    mutationFn: (params: ContractTypeRequest) => ContractApis(t).addContract(params),
    onSuccess: (res: ContractType) => {
      const cachedData: ContractType[] = queryClient.getQueryData('contract') || []
      const updatedData = [...cachedData, res]
      queryClient.setQueryData('contract', updatedData)
    },
    onError: () => {}
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    props.toggle()
    reset()
  }

  const onSubmit = async (data: ContractTypeRequest) => {
    console.log(data)
    addContractMutation.mutate(data)
    handleClose()
  }

  return (
    <Drawer
      open={props.open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Contract.Add_Contract')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit((row: ContractTypeRequest) => onSubmit(row))}>
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
                  {!domainLoading && domainList && domainList.length > 0 ? (
                    domainList.map((domain: string) => (
                      <MenuItem key={domain} value={domain}>
                        {domain}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=''>
                      <em>{t('None')}</em>
                    </MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Employee.Employee')}</InputLabel>
            <Controller
              name='employee'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Employee.Employee_Code')}
                  name='employee'
                  defaultValue={null}
                  onChange={onChange}
                  value={value}
                  disabled={props.employeeLoading}
                >
                  {!props.employeeLoading && props.employeeList && props.employeeList.length > 0 ? (
                    props.employeeList.map((employee: EmployeeType) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.firstName + ' ' + employee.lastName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=''>
                      <em>{t('None')}</em>
                    </MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.employee && <FormHelperText sx={{ color: 'error.main' }}>{errors.employee.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='workingMode-label'>{t('Contract.Contract_Type')}</InputLabel>
            <Controller
              name='contract'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  size='small'
                  label={t('Contract.Contract_Type')}
                  name='contract'
                  defaultValue=''
                  onChange={field.onChange}
                  value={field.value}
                >
                  <MenuItem value={IEnumContractType.CDI}>{t('Contract.CDI')}</MenuItem>
                  <MenuItem value={IEnumContractType.CDD}>{t('Contract.CDD')}</MenuItem>
                  <MenuItem value={IEnumContractType.INTERIM}>{t('Contract.Interim')}</MenuItem>
                  <MenuItem value={IEnumContractType.INTERNSHIP}>{t('Contract.Internship')}</MenuItem>
                </Select>
              )}
            />
            {errors.contract && <FormHelperText sx={{ color: 'error.main' }}>{errors.contract.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {'Submit'}
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
