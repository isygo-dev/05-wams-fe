import React, {useContext, useState} from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import {useTranslation} from 'react-i18next'
import {Controller, useFormContext} from 'react-hook-form' // Import useFormContext and Controller
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {EmployeeType, IEnumCivility, IEnumGender} from 'hrm-shared/@core/types/hrm/employeeTypes'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material'

import CommonAddress from 'template-shared/@core/components/common-address/CommonAddress'
import {GridExpandMoreIcon} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import {useQuery} from 'react-query'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import MuiPhoneNumber from "material-ui-phone-number";
import IconButton from "@mui/material/IconButton";
import EventIcon from "@mui/icons-material/Event";
import AnnexApis from "ims-shared/@core/api/ims/annex";
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";
import {EmployeeContext} from "../../../../pages/apps/employee/view/[id]";
import {AddressTypes} from "ims-shared/@core/types/ims/addressTypes";

type PersonnelInformationProps = {
  disabled: boolean
  personnelData?: EmployeeType
  checkPermissionUpdate: boolean
}

export const PersonnelInformation: React.FC<PersonnelInformationProps> = ({
                                                                            disabled,
                                                                            personnelData,
                                                                            checkPermissionUpdate
                                                                          }) => {
  const {t} = useTranslation()
  console.log(personnelData)
  const employee = useContext(EmployeeContext)
  const employeeDatacontext = employee?.employeeData || personnelData || {}

  const {register, control, setValue} = useFormContext()
  const [showNumberOfChildren, setShowNumberOfChildren] = useState(
    employeeDatacontext.details?.civility === IEnumCivility.M ||
    employeeDatacontext.details?.civility === IEnumCivility.D
  )
  const {data: functionalRole, isLoading: isLoadingFunctionRole} = useQuery('functionalRole', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.FUNCTION_ROL)
  )
  const [editedAddress, setEditedAddress] = useState<AddressTypes>(employeeDatacontext.address)
  setValue('address', editedAddress)

  return (
    <>

      <Accordion defaultExpanded={true} sx={{height: '100%'}} className={'accordion-expanded'}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
          <Typography className={'title-card'}>{t('Employee.Personal_Information')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container sx={{marginBottom: 4}} spacing={3}>
            <Grid item sm={12} md={4}>
              <TextField
                size='small'
                label={t('Code')}
                defaultValue={employeeDatacontext.code || ''}
                fullWidth
                variant='outlined'
                disabled
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <div className='form-group'>
                <TextField
                  size='small'
                  label={t('Domain.Domain')}
                  defaultValue={employeeDatacontext.domain || ''}
                  fullWidth
                  variant='outlined'
                  disabled={true}
                  {...register('domain')}
                />
              </div>
            </Grid>
            <Grid item sm={12} md={4}>
              <TextField
                size='small'
                label={t('Employee.firstName')}
                defaultValue={employeeDatacontext.firstName || ''}
                fullWidth
                variant='outlined'
                disabled={disabled || !checkPermissionUpdate}
                {...checkPermissionUpdate && register('firstName')}
              />
            </Grid>
          </Grid>
          <Grid container sx={{marginBottom: 4}} spacing={3}>
            <Grid item sm={12} md={4}>
              <TextField
                size='small'
                disabled={disabled || !checkPermissionUpdate}
                label={t('Employee.lastName')}
                defaultValue={employeeDatacontext.lastName || ''}
                fullWidth

                variant='outlined'
                {...checkPermissionUpdate && register('lastName')}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <TextField
                size='small'
                label={t('Employee.Email')}
                disabled={disabled || !checkPermissionUpdate}
                defaultValue={employeeDatacontext.email || ''}
                fullWidth

                variant='outlined'
                {...checkPermissionUpdate && register('email')}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <MuiPhoneNumber
                variant="outlined"
                fullWidth
                size="small"
                defaultCountry={"tn"}
                countryCodeEditable={true}
                label={t('Employee.Phone_Number')}
                disabled={disabled || !checkPermissionUpdate}
                value={employeeDatacontext.phone || ''}
                onChange={(e) => {
                  const updatedValue = e.replace(/\s+/g, '')
                  setValue('phone', updatedValue)
                  if (checkPermissionUpdate) {
                    register('phone')
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container sx={{marginBottom: 4}} spacing={3}>
            <Grid item xs={12} sm={4}>
              <DatePickerWrapper className='small-input-data'>
                <Controller
                  name='details.birthDate'
                  control={control}
                  defaultValue={employeeDatacontext.details?.birthDate || null}
                  render={({field: {value, onChange}}) => (
                    <DatePicker

                      disabled={disabled || !checkPermissionUpdate}
                      selected={value ? new Date(value) : null}
                      dateFormat='dd/MM/yyyy'
                      onChange={date => checkPermissionUpdate && onChange(date)}
                      customInput={<TextField size='small' fullWidth label={t('Employee.Birth_Date')} InputProps={{
                        endAdornment: (
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        ),
                      }}/>}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                disabled={disabled || !checkPermissionUpdate}
                size='small'
                label={t('Employee.placeOfBirth')}
                defaultValue={employeeDatacontext.details?.placeofBirth || ''}
                fullWidth
                variant='outlined'
                {...checkPermissionUpdate && register('details.placeofBirth')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='details.gender'
                control={control}
                defaultValue={employeeDatacontext.details?.gender || null}
                render={({field: {value, onChange}}) => (
                  <FormControl size='small' style={{width: '100%', marginRight: '10px'}}>
                    <InputLabel>{t('Employee.Gender')}</InputLabel>
                    <Select
                      value={value}
                      disabled={disabled || !checkPermissionUpdate}
                      fullWidth
                      onChange={checkPermissionUpdate && onChange}
                      variant='outlined'
                      label='Gender'
                    >
                      <MenuItem value={IEnumGender.MALE}>{t('Employee.Male')}</MenuItem>
                      <MenuItem value={IEnumGender.FEMALE}>{t('Employee.Female')}</MenuItem>
                      <MenuItem value={IEnumGender.OTHER}>{t('Employee.Other')}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item sm={12} md={4}>
              <Controller
                name='details.civility'
                control={control}
                defaultValue={employeeDatacontext.details?.civility || null}
                render={({field: {value, onChange}}) => (
                  <FormControl size='small' style={{width: '100%', marginRight: '10px'}}>
                    <InputLabel>{t('Employee.Civility')}</InputLabel>
                    <Select

                      disabled={disabled || !checkPermissionUpdate}
                      value={value}
                      fullWidth
                      onChange={e => {
                        checkPermissionUpdate &&
                        onChange(e)
                        if (e.target.value === IEnumCivility.M || e.target.value === IEnumCivility.D) {
                          setShowNumberOfChildren(true)
                        } else {
                          setShowNumberOfChildren(false)
                        }
                      }}
                      variant='outlined'
                      label='Civility'
                    >
                      <MenuItem value={IEnumCivility.M}>{t('Employee.Married')}</MenuItem>
                      <MenuItem value={IEnumCivility.S}>{t('Employee.Single')}</MenuItem>
                      <MenuItem value={IEnumCivility.D}>{t('Employee.Divorced')}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {showNumberOfChildren && (
              <Grid item sm={12} md={4}>
                <TextField
                  size='small'
                  disabled={disabled || !checkPermissionUpdate}
                  label={t('Employee.NumberOfChildren')}
                  fullWidth
                  defaultValue={
                    employeeDatacontext.details?.familyInformation?.numberOfChildren
                      ? parseInt(employeeDatacontext.details.familyInformation.numberOfChildren)
                      : null
                  }
                  variant='outlined'
                  {...checkPermissionUpdate && register('details.familyInformation.numberOfChildren')}
                />
              </Grid>
            )}
            <Grid item sm={12} md={4}>
              <Controller
                name='functionRole'
                control={control}
                defaultValue={employeeDatacontext.functionRole || null}
                render={({field: {value, onChange}}) => (
                  <FormControl fullWidth>
                    <InputLabel>{t('Func. Role')}</InputLabel>
                    <Select size='small'
                            value={value}
                            onChange={checkPermissionUpdate && onChange}
                            label='Func. Role'
                            disabled={!checkPermissionUpdate}>
                      {!isLoadingFunctionRole
                        ? functionalRole?.map(res => (
                          <MenuItem key={res.id} value={res.value}>
                            {res.value}
                          </MenuItem>
                        ))
                        : null}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>


      <Accordion sx={{height: '100%', mt: 2}}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
          <Typography className={'title-card'}>{t('Address.Address')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CommonAddress editedAddress={editedAddress} disabled={disabled} setEditedAddress={setEditedAddress}
                         permissionApplication={PermissionApplication.HRM}
                         permissionAction={PermissionAction.WRITE}
                         permissionPage={disabled ? PermissionPage.CONTRACT : PermissionPage.EMPLOYEE}/>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
