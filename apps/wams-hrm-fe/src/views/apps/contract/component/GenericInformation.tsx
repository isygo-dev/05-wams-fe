import React, {useContext} from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import {useTranslation} from 'react-i18next'
import {Controller, useFormContext} from 'react-hook-form' // Import useFormContext and Controller
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch} from '@mui/material'
import {ContractContext} from '../../../../pages/apps/contract/view/[id]'
import {IEnumContractType, IEnumLocationType, IEnumTimeType} from 'hrm-shared/@core/types/hrm/contractType'
import {GridExpandMoreIcon} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

export function GenericInformation({checkPermissionUpdate}) {
  const {t} = useTranslation()
  const contractData = useContext(ContractContext)
  const contract = contractData.contractData || {}

  const {register, control} = useFormContext()
  console.log(contract.workingMode)

  return (
    <Accordion sx={{height: '100%'}}>
      <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
        <Typography className={'title-card'}>{t('Contract.Contract_Information')}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={3} sx={{mt: 0}}>
          <Grid item sm={12} md={4}>
            <TextField
              size='small'
              label={t('Code')}
              defaultValue={contract.code || ''}
              fullWidth
              disabled={true}
              variant='outlined'
            />
          </Grid>

          <Grid item sm={4} md={4}>
            <Controller
              name='workingMode'
              control={control}
              defaultValue={contract.workingMode || null}
              render={({field: {value, onChange}}) => (
                <FormControl disabled={contract.isLocked || !checkPermissionUpdate} size='small'
                             style={{width: '100%', marginRight: '10px'}}>
                  <InputLabel>{t('Contract.workingMode')}</InputLabel>
                  <Select value={value} fullWidth onChange={checkPermissionUpdate && onChange} variant='outlined'
                          label='Working Mode'>
                    <MenuItem value={IEnumLocationType.PRESENTIAL}>{t('Contract.Presential')}</MenuItem>
                    <MenuItem value={IEnumLocationType.HYBRID}>{t('Contract.Hybrid')}</MenuItem>
                    <MenuItem value={IEnumLocationType.REMOTE}>{t('Contract.Remote')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item sm={4} md={2}>
            <Controller
              name='contract'
              control={control}
              defaultValue={contract.contract || null}
              render={({field: {value, onChange}}) => (
                <FormControl disabled={contract.isLocked || !checkPermissionUpdate} size='small'
                             style={{width: '100%', marginRight: '10px'}}>
                  <InputLabel>{t('Contract.Contract_Type')}</InputLabel>
                  <Select value={value} fullWidth onChange={checkPermissionUpdate && onChange} variant='outlined'
                          label='contractType'>
                    <MenuItem value={IEnumContractType.CDD}>{t('Contract.CDD')}</MenuItem>
                    <MenuItem value={IEnumContractType.CDI}>{t('Contract.CDI')}</MenuItem>
                    <MenuItem value={IEnumContractType.INTERIM}>{t('Contract.Interim')}</MenuItem>
                    <MenuItem value={IEnumContractType.INTERNSHIP}>{t('Contract.Internship')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          {contract.contract === IEnumContractType.CDD || contract.contract === IEnumContractType.INTERIM ? (
            <Grid item sm={12} md={2}>
              <Controller
                name='isContractrenewable'
                control={control}
                defaultValue={contract.isContractrenewable}
                render={({field}) => (
                  <FormControlLabel
                    disabled={contract.isLocked || !checkPermissionUpdate}
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={e => checkPermissionUpdate && field.onChange(e.target.checked)}
                        name='isRenewable'
                        color='primary'
                      />
                    }
                    label={t('Contract.isContractrenewable')}
                  />
                )}
              />
            </Grid>
          ) : null}
        </Grid>
        <Grid container spacing={3} sx={{mt: 0}}>
          <Grid item sm={12} md={4}>
            <DatePickerWrapper className='small-input-data'>
              <Controller
                name='startDate'
                control={control}
                defaultValue={contract.startDate || null}
                render={({field: {value, onChange}}) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    dateFormat='dd/MM/yyyy'
                    onChange={date => checkPermissionUpdate && onChange(date)}
                    disabled={contract.isLocked || !checkPermissionUpdate}
                    customInput={<TextField size='small' fullWidth label={t('Contract.start_Date')}/>}
                  />
                )}
              />
            </DatePickerWrapper>
          </Grid>
          {contract.contract !== IEnumContractType.CDI ? (
            <Grid item sm={12} md={4}>
              <DatePickerWrapper className='small-input-data'>
                <Controller
                  name='endDate'
                  control={control}
                  defaultValue={contract.endDate || null}
                  render={({field: {value, onChange}}) => (
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      dateFormat='dd/MM/yyyy'
                      onChange={date => checkPermissionUpdate && onChange(date)}
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      customInput={<TextField size='small' fullWidth label={t('Contract.End_Date')}/>}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
          ) : (
            <>
              <Grid item sm={12} md={4}>
                <Controller
                  name={`probationaryPeriod`}
                  control={control}
                  defaultValue={contract.probationaryPeriod || ''}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      fullWidth
                      label={t('Contract.probationaryPeriod')}

                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <Controller
                  name='isRenewable'
                  control={control}
                  defaultValue={contract.isRenewable}
                  render={({field}) => (
                    <FormControlLabel
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={e => checkPermissionUpdate && field.onChange(e.target.checked)}
                          name='isRenewable'
                          color='primary'
                        />
                      }
                      label={t('Contract.Is_Renewable')}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          {contract.contract !== IEnumContractType.CDI && (
            <>
              <Grid item sm={12} md={2}>
                <Controller
                  name={`probationaryPeriod`}
                  control={control}
                  defaultValue={contract.probationaryPeriod || ''}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      fullWidth
                      label={t('Contract.probationaryPeriod')}

                      value={value}
                      onChange={checkPermissionUpdate && onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} md={2}>
                {contract.isRenewable == false || contract.isRenewable == null ? (
                  <Controller
                    name='isRenewable'
                    control={control}
                    defaultValue={contract.isRenewable}
                    render={({field}) => (
                      <FormControlLabel
                        disabled={contract.isLocked || !checkPermissionUpdate}
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={e => checkPermissionUpdate && field.onChange(e.target.checked)}
                            name='isRenewable'
                            color='primary'
                          />
                        }
                        label={t('Contract.Is_Renewable')}
                      />
                    )}
                  />
                ) : null}
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={3} sx={{mt: 0}}>
          <Grid item sm={12} md={4}>
            <TextField
              disabled={contract.isLocked || !checkPermissionUpdate}
              size='small'
              label={t('Contract.location')}
              defaultValue={contract.location || ''}
              fullWidth
              variant='outlined'
              {...checkPermissionUpdate && register('location')}
            />
          </Grid>
          <Grid item sm={12} md={4}>
            <Controller
              name='availability'
              control={control}
              defaultValue={contract.availability || null}
              render={({field: {value, onChange}}) => (
                <FormControl size='small' disabled={contract.isLocked || !checkPermissionUpdate}
                             style={{width: '100%', marginRight: '10px'}}>
                  <InputLabel>{t('Contract.availability')}</InputLabel>
                  <Select value={value} fullWidth onChange={checkPermissionUpdate && onChange} variant='outlined'
                          label='availiblity'>
                    <MenuItem value={IEnumTimeType.PARTTIME}>{t('Contract.PART-TIME')}</MenuItem>
                    <MenuItem value={IEnumTimeType.FULLTIME}>{t('Contract.FULL-TIME')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
