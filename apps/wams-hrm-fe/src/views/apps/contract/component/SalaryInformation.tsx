import React, { useContext } from 'react'
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import Icon from 'template-shared/@core/components/icon'
import { ContractContext } from '../../../../pages/apps/contract/view/[id]'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PaymentSchedule from './PaymentSchedule'
import { useQuery } from 'react-query'
import Box from '@mui/material/Box'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import TableEditablePaymentBonus from './PaymentBonusSchedule'
import Tooltip from '@mui/material/Tooltip'
import AnnexApis from 'ims-shared/@core/api/ims/annex'
import { IEnumAnnex } from 'ims-shared/@core/types/ims/annexTypes'
import { IEnumPrime, IEnumSalaryType } from 'hrm-shared/@core/types/hrm/contractType'

export default function SalaryInformation({ checkPermissionUpdate }) {
  const { t } = useTranslation()
  const contractData = useContext(ContractContext)
  const contract = contractData.contractData || {}

  const { control: formControl } = useForm({
    defaultValues: contract.salaryInformation?.primes ? { salaryInformation: contract.salaryInformation.primes } : {}
  })

  const { data: CurrencyAmount, isLoading: isLoadingCurrency } = useQuery('CurrencyAmount', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.CURRENCY_AMOOUNT)
  )
  console.log('CurrencyAmount', CurrencyAmount)

  const { control: formContextControl } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: 'salaryInformation'
  })

  return (
    <Accordion style={{ marginTop: 16 }}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Contract.Gross_Salary')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={2.5}>
            <Controller
              name='salaryInformation.currency'
              control={formContextControl}
              defaultValue={contract?.salaryInformation?.currency || null}
              render={({ field: { value, onChange } }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('Currency')}</InputLabel>
                  <Tooltip title='ANNEX / CURNCY'>
                    <Select
                      size='small'
                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                      disabled={!checkPermissionUpdate}
                      label='Currency'
                    >
                      {!isLoadingCurrency
                        ? CurrencyAmount?.map(res => (
                            <MenuItem key={res.id} value={res.value}>
                              {res.value}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                  </Tooltip>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={2.5}>
            <Controller
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  fullWidth
                  label={t('Contract.base_Salary')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
              name={`salaryInformation.grossSalary`}
              control={formContextControl}
              defaultValue={contract.salaryInformation?.grossSalary || ''}
            />
          </Grid>
          <Grid item xs={2.5}>
            <Controller
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  fullWidth
                  label={t('Contract.net_Salary')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
              name={`salaryInformation.netSalary`}
              control={formContextControl}
              defaultValue={contract.salaryInformation?.netSalary || ''}
            />
          </Grid>
          <Grid item xs={2.5}>
            <FormControl size='small' style={{ width: '100%', marginRight: '10px' }}>
              <InputLabel>{t('Contract.Salary_Type')}</InputLabel>
              <Controller
                name={`salaryInformation.salaryType`}
                defaultValue={contract.salaryInformation?.salaryType || null}
                render={({ field: { value, onChange } }) => (
                  <Select
                    disabled={contract.isLocked || !checkPermissionUpdate}
                    value={value}
                    onChange={checkPermissionUpdate && onChange}
                    variant='outlined'
                    label={t('Contract.Salary_Type')}
                  >
                    {Object.values(IEnumSalaryType).map(value => (
                      <MenuItem key={value} value={value}>
                        {t(value)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={formContextControl}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Controller
              name={`salaryInformation.frequency`}
              control={formContextControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled={contract.isLocked || !checkPermissionUpdate}
                  type='number'
                  size='small'
                  fullWidth
                  label={t('Contract.frequency')}
                  value={value}
                  onChange={checkPermissionUpdate && onChange}
                />
              )}
              defaultValue={contract.salaryInformation?.frequency || ''}
            />
          </Grid>
        </Grid>
        {checkPermission(
          PermissionApplication.HRM,
          PermissionPage.CONTRACT_PAYMENT_SCHEDULE,
          PermissionAction.READ
        ) && (
          <PaymentSchedule
            contractId={contract?.id}
            checkPermissionUpdatePayment={checkPermission(
              PermissionApplication.HRM,
              PermissionPage.CONTRACT_PAYMENT_SCHEDULE,
              PermissionAction.WRITE
            )}
          />
        )}

        {fields.map((salary, index) => (
          <Box
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              marginBottom: '16px',
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            <IconButton
              style={{ position: 'absolute', top: '0px', right: '-7px' }}
              size='small'
              onClick={() => remove(index)}
            >
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl size='small' style={{ width: '100%', marginRight: '10px' }}>
                  <InputLabel>{t('Contract.Bonus_Type')}</InputLabel>
                  <Controller
                    name={`salaryInformation.primes[${index}].primeType`}
                    defaultValue={contract.salaryInformation?.primes[index]?.primeType || ''}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={contract.isLocked || !checkPermissionUpdate}
                        value={value}
                        onChange={checkPermissionUpdate && onChange}
                        variant='outlined'
                        label={t('Contract.Bonus_Type')}
                      >
                        {Object.values(IEnumPrime).map(value => (
                          <MenuItem key={value} value={value}>
                            {t(value)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={formContextControl}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`salaryInformation.primes[${index}].annualFrequency`}
                  control={formContextControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      type='number'
                      size='small'
                      fullWidth
                      label={t('Contract.Annual_Frequency')}
                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                    />
                  )}
                  defaultValue={contract.salaryInformation?.primes[index]?.annualFrequency || ''}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name={`salaryInformation.primes[${index}].annualMinAmount`}
                  control={formContextControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      size='small'
                      type='number'
                      fullWidth
                      label={t('Contract.Annual_Min_Amount')}
                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                    />
                  )}
                  defaultValue={contract.salaryInformation?.primes[index]?.annualMinAmount || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`salaryInformation.primes[${index}].annualMaxAmount`}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      size='small'
                      fullWidth
                      type='number'
                      label={t('Contract.Annual_Max_Amount')}
                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                    />
                  )}
                  control={formContextControl}
                  defaultValue={contract.salaryInformation?.primes[index]?.annualMaxAmount || ''}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <TableEditablePaymentBonus contractId={contract?.id} />

        {checkPermissionUpdate && (
          <Button
            variant='contained'
            size={'small'}
            color='primary'
            style={{ marginTop: '20px' }}
            className={'button-padding-style'}
            onClick={() => append({})}
          >
            <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Contract.Add_Bonus')}
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
