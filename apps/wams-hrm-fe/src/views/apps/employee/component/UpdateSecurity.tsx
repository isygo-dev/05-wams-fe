import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Icon from 'template-shared/@core/components/icon'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { EmployeeType, IEnumInsuranceType, InsuranceSecurity } from 'hrm-shared/@core/types/hrm/employeeTypes'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import { InputLabel, MenuItem, Select } from '@mui/material'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'

interface UpdateSecurityType {
  open?: boolean
  toggle?: () => void
  dataParameter?: EmployeeType | undefined
  refetch?: () => EmployeeType
}

const schema = yup.object().shape({
  cardNumber: yup.string().required('Card number is required'),
  issuedDate: yup.date().required('Issued date is required'),
  expiredDate: yup.date().required('Issued date is required'),
  issuedPlace: yup.string().required('Issued place is required')
})

export const UpdateSecurity: React.FC<UpdateSecurityType> = ({ open, toggle, dataParameter, refetch }) => {
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const defaultValues: InsuranceSecurity = {
    id: dataParameter?.details?.securities[0]?.id || null,
    cardNumber: dataParameter?.details?.securities[0]?.cardNumber || '',
    code: dataParameter?.details?.securities[0]?.code || '',
    issuedDate: dataParameter?.details?.securities[0]?.issuedDate || '',
    expiredDate: dataParameter?.details?.securities[0]?.expiredDate || '',
    imagePath: dataParameter?.details?.securities[0]?.imagePath || '',
    issuedPlace: dataParameter?.details?.securities[0]?.issuedPlace || '',
    domain: dataParameter?.details?.securities[0]?.domain || '',
    insuranceType: dataParameter?.details?.securities[0]?.insuranceType || null,
    employeeDetailsId: dataParameter?.details?.securities[0]?.employeeDetailsId || null
  }

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  })

  const updatePictureMutation = useMutation({
    mutationFn: (data: FormData) =>
      EmployeeApis(t).updateEmployeeSecurityDocImage(data, dataParameter?.details?.securities[0]?.id),
    onSuccess: () => {
      handleClose()
      refetch()
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: InsuranceSecurity) => {
    const formData = new FormData()
    if (data.cardNumber != null && data.cardNumber !== undefined) {
      formData.set('cardNumber', data.cardNumber)
    }
    if (data.insuranceType != null && data.insuranceType !== undefined) {
      formData.set('insuranceType', data.insuranceType)
    }
    if (
      dataParameter?.details?.securities[0]?.id.toString() != null &&
      dataParameter?.details?.securities[0]?.id.toString() !== undefined
    ) {
      formData.set('id', dataParameter?.details?.securities[0]?.id.toString())
    }
    if (
      dataParameter?.details?.securities[0]?.code != null &&
      dataParameter?.details?.securities[0]?.code !== undefined
    ) {
      formData.set('code', dataParameter?.details?.securities[0]?.code)
    }
    if (data.issuedPlace != null && data.issuedPlace !== undefined) {
      formData.set('issuedPlace', data.issuedPlace)
    }
    formData.set('employeeDetailsId', dataParameter.details.id.toString())
    formData.set('domain', dataParameter.domain)
    if (data.issuedDate) {
      const issuedDateISOString =
        typeof data.issuedDate === 'string'
          ? new Date(data.issuedDate).toISOString().split('T')[0]
          : data.issuedDate.toISOString().split('T')[0]
      formData.set('issuedDate', issuedDateISOString)
    }
    if (data.expiredDate) {
      const issuedDateISOString =
        typeof data.expiredDate === 'string'
          ? new Date(data.expiredDate).toISOString().split('T')[0]
          : data.expiredDate.toISOString().split('T')[0]
      formData.set('expiredDate', issuedDateISOString)
    }
    if (selectedFile) {
      formData.append('file', selectedFile)
    } else {
      formData.append('imagePath', dataParameter?.details?.securities[0]?.imagePath)
    }
    updatePictureMutation.mutate(formData)
    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Dialog
      open={open}
      aria-labelledby='user-view-billing-edit-card'
      aria-describedby='user-view-billing-edit-card-description'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
    >
      <DialogTitle
        id='user-view-billing-edit-card'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Update Insurance Security
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(6)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText
          variant='body2'
          id='user-view-billing-edit-card-description'
          sx={{ textAlign: 'center', mb: 7 }}
        >
          Update your saved Insurance Document
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='cardNumber'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size='small'
                      value={value}
                      id='form-props-read-only-input'
                      InputProps={{ readOnly: false }}
                      label={t('CardNumber')}
                      onChange={onChange}
                      defaultValue={dataParameter?.details?.securities[0]?.cardNumber}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='issuedPlace'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size='small'
                      value={value}
                      id='form-props-read-only-input'
                      InputProps={{ readOnly: false }}
                      label={t('issuedPlace')}
                      onChange={onChange}
                      defaultValue={dataParameter?.details?.securities[0]?.issuedPlace}
                      error={!!errors.issuedPlace}
                      helperText={errors.issuedPlace?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper className='small-input-data'>
                <Controller
                  name='issuedDate'
                  control={control}
                  defaultValue={dataParameter?.details?.securities[0]?.issuedDate || null}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      dateFormat='dd/MM/yyyy'
                      onChange={date => onChange(date)}
                      customInput={<TextField size='small' fullWidth label={t('issuedDate')} />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper className='small-input-data'>
                <Controller
                  name='expiredDate'
                  control={control}
                  defaultValue={dataParameter?.details?.securities[0]?.expiredDate || null}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      dateFormat='dd/MM/yyyy'
                      onChange={date => onChange(date)}
                      customInput={<TextField size='small' fullWidth label={t('expiredDate')} />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>{t('InsuranceType')}</InputLabel>
                <Controller
                  name='insuranceType'
                  control={control}
                  defaultValue={defaultValues.insuranceType || null}
                  render={({ field: { value, onChange } }) => (
                    <Select label='InsuranceType' size='small' value={value} onChange={onChange}>
                      <MenuItem value={IEnumInsuranceType.HEALTH_INSURANCE}>{t('Health Insurance')}</MenuItem>
                      <MenuItem value={IEnumInsuranceType.SOCIAL_SECURITY}>{t('Social Security')}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                {(selectedFile != null ||
                  undefined ||
                  dataParameter?.details?.securities[0]?.imagePath != null ||
                  undefined) && (
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : dataParameter?.details?.securities[0]?.imagePath
                        ? `${hrmApiUrls.apiUrl_HRM_InsuranceDoc_ImageDownload_EndPoint}/${dataParameter?.details?.securities[0]?.id}`
                        : undefined
                    }
                    alt={selectedFile ? '' : dataParameter?.details?.securities[0]?.imagePath ? 'securities Image' : ''}
                    style={{
                      cursor: 'pointer',
                      width: '400px',
                      height: '150px',
                      borderRadius: '10px',
                      marginBottom: '10px'
                    }}
                  />
                )}

                <FormControl fullWidth sx={{}}>
                  <label htmlFor='file' style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}>
                    <Button
                      color='primary'
                      variant='outlined'
                      component='span'
                      sx={{ width: '100%', marginTop: '10px' }}
                      startIcon={<Icon icon='tabler:upload' />}
                    >
                      {t('Photo')}
                    </Button>
                    <input type='file' name='file' id='file' style={{ display: 'none' }} onChange={handleFileChange} />
                  </label>
                </FormControl>
              </div>
            </Grid>
          </Grid>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
