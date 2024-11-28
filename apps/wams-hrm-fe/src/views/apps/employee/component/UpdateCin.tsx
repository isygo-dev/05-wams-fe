import React, {useState} from 'react'
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
import {useTranslation} from 'react-i18next'
import {Controller, useForm} from 'react-hook-form'
import {useMutation} from 'react-query'
import {Cin, EmployeeType} from 'hrm-shared/@core/types/hrm/employeeTypes'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import EmployeeApis from "hrm-shared/@core/api/hrm/employee";

interface UpdateCinType {
  open?: boolean
  toggle?: () => void
  dataParameter?: EmployeeType | undefined
  refetch?: () => EmployeeType
}

const schema = yup.object().shape({
  cardNumber: yup.string().required('Card number is required'),
  issuedDate: yup.date().required('Issued date is required'),
  issuedPlace: yup.string().required('Issued place is required')
})

export const UpdateCin: React.FC<UpdateCinType> = ({open, toggle, dataParameter, refetch}) => {
  const {t} = useTranslation()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const defaultValues: Cin = {
    id: dataParameter?.details?.cin[0]?.id || null,
    cardNumber: dataParameter?.details?.cin[0]?.cardNumber || '',
    code: dataParameter?.details?.cin[0]?.code || '',
    issuedDate: dataParameter?.details?.cin[0]?.issuedDate || '',
    imagePath: dataParameter?.details?.cin[0]?.imagePath || '',
    issuedPlace: dataParameter?.details?.cin[0]?.issuedPlace || '',
    domain: dataParameter?.details?.cin[0]?.domain || '',
    employeeDetailsId: dataParameter?.details?.cin[0]?.employeeDetailsId || null
  }

  const {
    reset,
    handleSubmit,
    control,
    formState: {errors}
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  })

  const updatePictureMutation = useMutation({
    mutationFn: (data: FormData) => EmployeeApis(t).updateEmployeeIdentityDocImage(data, dataParameter?.details?.cin[0]?.id),
    onSuccess: () => {
      handleClose()
      refetch()
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmitCin = async (data: Cin) => {
    const formData = new FormData()
    if (data.cardNumber != null && data.cardNumber !== undefined) {
      formData.set('cardNumber', data.cardNumber)
    }
    if (
      dataParameter?.details?.cin[0]?.id.toString() != null &&
      dataParameter?.details?.cin[0]?.id.toString() !== undefined
    ) {
      formData.set('id', dataParameter?.details?.cin[0]?.id.toString())
    }
    if (dataParameter?.details?.cin[0]?.code != null && dataParameter?.details?.cin[0]?.code !== undefined) {
      formData.set('code', dataParameter?.details?.cin[0]?.code)
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
    if (selectedFile) {
      formData.append('file', selectedFile)
    } else {
      formData.append('imagePath', dataParameter?.details?.cin[0]?.imagePath)
    }
    console.log(data)
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
      sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 650}}}
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
        Update NIC
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
          sx={{textAlign: 'center', mb: 7}}
        >
          Update your saved card details
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmitCin)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='cardNumber'
                  control={control}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      id='form-props-read-only-input'
                      InputProps={{readOnly: false}}
                      label={t('CardNumber')}
                      onChange={onChange}
                      defaultValue={dataParameter?.details?.cin[0]?.cardNumber}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
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
                  defaultValue={dataParameter?.details?.cin[0]?.issuedDate || null}
                  render={({field: {value, onChange}}) => (
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      dateFormat='dd/MM/yyyy'
                      onChange={date => onChange(date)}
                      customInput={<TextField size='small' fullWidth label={t('issuedDate')}/>}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name='issuedPlace'
                  control={control}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      size='small'
                      value={value}
                      id='form-props-read-only-input'
                      InputProps={{readOnly: false}}
                      label={t('issuedPlace')}
                      onChange={onChange}
                      defaultValue={dataParameter?.details?.cin[0]?.issuedPlace}
                      error={!!errors.issuedPlace}
                      helperText={errors.issuedPlace?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px'}}>
                {(selectedFile != null ||
                  undefined ||
                  dataParameter?.details?.cin[0]?.imagePath != null ||
                  undefined) && (
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : dataParameter?.details?.cin[0]?.imagePath
                          ? `${hrmApiUrls.apiUrl_HRM_IdentityDoc_ImageDownload_EndPoint}/${dataParameter?.details?.cin[0]?.id}`
                          : undefined
                    }
                    alt={selectedFile ? '' : dataParameter?.details?.passport[0]?.imagePath ? 'Cin Image' : ''}
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
                  <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
                    <Button
                      color='primary'
                      variant='outlined'
                      component='span'
                      sx={{width: '100%', marginTop: '10px'}}
                      startIcon={<Icon icon='tabler:upload'/>}
                    >
                      {t('Photo')}
                    </Button>
                    <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
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
            <Button type='submit' variant='contained' sx={{mr: 3}}>
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
