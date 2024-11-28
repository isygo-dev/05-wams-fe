import React, {useState} from 'react'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useTranslation} from 'react-i18next'
import {CustomerDetailType} from "ims-shared/@core/types/ims/customerTypes";
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {FormHelperText, IconButton} from '@mui/material'
import imsApiUrls from "ims-shared/configs/ims_apis"
import Icon from 'template-shared/@core/components/icon'
import CropperCommon from 'template-shared/@core/components/cropper'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import CommonAddress from 'template-shared/@core/components/common-address/CommonAddress'
import Button from '@mui/material/Button'
import {AddressTypes} from 'ims-shared/@core/types/ims/addressTypes'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import LinkToAccountModal from './LinkToAccountModal'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import PictureCard from 'template-shared/@core/components/pictureCard'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'
import AccountApis from "ims-shared/@core/api/ims/account";
import CustomerApis from "ims-shared/@core/api/ims/customer";
import {AdminStatus} from "ims-shared/@core/types/ims/accountTypes";
import {RequestStatus} from "template-shared/@core/types/helper/userTypes";

type propsType = {
  customerData: CustomerDetailType
}

const CustomerView = (props: propsType) => {
  const {customerData} = props
  const queryClient = useQueryClient()
  const {t} = useTranslation()
  const [photoFile, setPhotoFile] = useState<File>()
  const [updateImage, setUpdateImage] = useState<boolean>(false)
  const initialAdress = {
    country: '',
    state: '',
    city: '',
    street: '',
    latitude: '',
    longitude: '',
    additionalInfo: ''
  }

  const [editedAddress, setEditedAddress] = useState<AddressTypes>(
    customerData?.address ? customerData?.address : initialAdress
  )
  const [newStatus, setNewStatus] = useState<boolean>(customerData && customerData.adminStatus === 'ENABLED')
  const schema = yup.object().shape({
    name: yup.string().required(),
    url: yup.string().required(),
    description: yup.string()
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm<CustomerDetailType>({
    defaultValues: customerData, // Start with an empty object
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const openImageEdit = () => {
    setUpdateImage(true)
  }

  const onSaveImage = (newImage: Blob) => {
    updatePictureMutation.mutate({id: customerData.id, file: newImage})
    setPhotoFile(newImage as File)
  }

  const updatePictureMutation = useMutation({
    mutationFn: (newMutation: { id: number; file: Blob }) => CustomerApis(t).updateCustomerImage(newMutation),
    onSuccess: () => {
      setUpdateImage(false)
    }
  })

  const mutationEdit = useMutation({
    mutationFn: (data: CustomerDetailType) => CustomerApis(t).updateCustomer(data),
    onSuccess: res => {
      console.log('res', res)
    }
  })

  const mutationCustomer = useMutation({
    mutationFn: (data: RequestStatus) => CustomerApis(t).updateCustomerStatus(data),
    onSuccess: res => {
      const cachedData: CustomerDetailType | undefined = queryClient.getQueryData('customerData')
      if (cachedData != undefined) {
        cachedData.adminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        queryClient.setQueryData('customerData', cachedData)
      }
    }
  })

  const onSubmit = async (data: CustomerDetailType) => {
    const request: CustomerDetailType = {
      id: customerData.id,
      ...data,
      adminStatus: customerData.adminStatus,
      address: editedAddress || undefined
    }
    console.log(request)
    mutationEdit.mutate(request)
  }

  const handleReset = () => {
    if (customerData) {
      setEditedAddress({...customerData.address})
      reset()
    }
  }

  const {
    control: controlCheck,
    handleSubmit: handleSubmitCheck,
    formState: {errors: errorsCheck}
  } = useForm({defaultValues: {checkbox: false}})

  const onSubmitCheck = () => {
    const data: RequestStatus = {
      id: customerData.id ?? 0,
      newReqStatus: customerData.adminStatus == 'ENABLED' ? 'DISABLED' : 'ENABLED'
    }
    console.log(data)
    mutationCustomer.mutate(data)
    setNewStatus(!newStatus)
  }

  const [linkedUser, setLinkUser] = useState<boolean>(false)
  const {data: accounts, isLoading: isLoadingAccounts} = useQuery(`accounts`, () => AccountApis(t).getAccounts())
  const handleClose = (accountCodeDta: string) => {
    console.log('accountCodeDta', accountCodeDta)
    if (accountCodeDta !== null) {
      setValue('accountCode', accountCodeDta)
    }
    setLinkUser(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={2} xs={12}>
            <PictureCard
              photoFile={photoFile}
              url={`${imsApiUrls.apiUrl_IMS_Customer_ImageDownload_EndPoint}/${customerData.id}`}
              openImageEdit={openImageEdit}
              permissionPage={PermissionPage.CUSTOMER}
              permissionApplication={PermissionApplication.IMS}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={10}>
            <Card sx={{height: '100%'}}>
              <CardContent className='container'></CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Customer Details')}/>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent style={{padding: '5px !important'}}>
              <Grid container item md={12}>
                <Grid item md={6}>
                  <CardHeader title={t('Personal Information ')}/>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='domain'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value}}) => (
                        <TextField disabled size='small' value={value} label={t('Domain.Domain')}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value, onChange}}) => (
                        <TextField
                          size='small'
                          value={value}
                          label={t('Name')}
                          onChange={
                            checkPermission(
                              PermissionApplication.IMS,
                              PermissionPage.CUSTOMER,
                              PermissionAction.WRITE
                            ) && onChange
                          }
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value, onChange}}) => (
                        <EmailInputMask
                          value={value}
                          onChange={
                            checkPermission(
                              PermissionApplication.IMS,
                              PermissionPage.CUSTOMER,
                              PermissionAction.WRITE
                            ) && onChange
                          }
                          error={Boolean(errors.email)}
                        />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='phoneNumber'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value}}) => (
                        <MuiPhoneNumber
                          variant='outlined'
                          size='small'
                          defaultCountry={'tn'}
                          countryCodeEditable={true}
                          label={t('Phone_Number')}
                          value={value}
                          onChange={e => {
                            if (
                              checkPermission(
                                PermissionApplication.IMS,
                                PermissionPage.CUSTOMER,
                                PermissionAction.WRITE
                              )
                            ) {
                              const updatedValue = e.replace(/\s+/g, '')
                              setValue('phoneNumber', updatedValue)
                            }
                          }}
                          error={Boolean(errors.phoneNumber)}
                        />
                      )}
                    />
                    {errors.phoneNumber && (
                      <FormHelperText sx={{color: 'error.main'}}>{errors.phoneNumber.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='url'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value, onChange}}) => (
                        <TextField
                          size='small'
                          value={value}
                          label={t('Url')}
                          onChange={
                            checkPermission(
                              PermissionApplication.IMS,
                              PermissionPage.CUSTOMER,
                              PermissionAction.WRITE
                            ) && onChange
                          }
                          error={Boolean(errors.url)}
                        />
                      )}
                    />
                    {errors.url && (
                      <FormHelperText sx={{color: 'error.main'}}>{errors.url.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='accountCode'
                      control={control}
                      rules={{required: true}}
                      render={({field: {value, onChange}}) => (
                        <>
                          <TextField
                            size='small'
                            value={value}
                            label={t('Customer.LinkedUser')}
                            onChange={onChange}
                            disabled
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Tooltip title={t('Customer.LinkedUser')}>
                                    <IconButton
                                      size='small'
                                      sx={{color: 'text.secondary'}}
                                      onClick={() =>
                                        checkPermission(
                                          PermissionApplication.IMS,
                                          PermissionPage.CUSTOMER,
                                          PermissionAction.WRITE
                                        ) && setLinkUser(true)
                                      }
                                    >
                                      <Icon icon='tabler:link-plus'/>
                                    </IconButton>
                                  </Tooltip>
                                </InputAdornment>
                              )
                            }}
                          />
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{mb: 4}}>
                    <Controller
                      name='description'
                      control={control}
                      render={({field: {value, onChange}}) => (
                        <TextField
                          size='small'
                          value={value}
                          multiline
                          rows={3}
                          InputProps={{readOnly: false}}
                          label={t('Description')}
                          onChange={
                            checkPermission(
                              PermissionApplication.IMS,
                              PermissionPage.CUSTOMER,
                              PermissionAction.WRITE
                            ) && onChange
                          }
                          error={Boolean(errors.description)}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <CardHeader title={t('Address.Address')} sx={{paddingBottom: '0px !important'}}/>

                <CommonAddress
                  editedAddress={editedAddress}
                  setEditedAddress={setEditedAddress}
                  permissionApplication={PermissionApplication.IMS}
                  permissionPage={PermissionPage.CUSTOMER}
                  permissionAction={PermissionAction.WRITE}
                />
              </Grid>

              <Grid item xs={12} sx={{pt: theme => `${theme.spacing(6.5)} !important`}}>
                {checkPermission(
                  PermissionApplication.IMS,
                  PermissionPage.CUSTOMER,
                  PermissionAction.WRITE
                ) && (
                  <Button type='submit' variant='contained' sx={{mr: 3}}>
                    {t('Save Changes')}
                  </Button>
                )}
                {checkPermission(
                  PermissionApplication.IMS,
                  PermissionPage.CUSTOMER,
                  PermissionAction.WRITE
                ) && (
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => handleReset()}>
                    {t('Reset')}
                  </Button>
                )}
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <Card>
            <CardContent>
              <form onSubmit={handleSubmitCheck(onSubmitCheck)}>
                <Box sx={{mb: 4}}>
                  <FormControl>
                    <Controller
                      name='checkbox'
                      control={controlCheck}
                      rules={{required: true}}
                      render={({field}) => (
                        <FormControlLabel
                          label={`I confirm my customer ${
                            customerData && customerData.adminStatus === 'ENABLED' ? 'deactivation' : 'activation'
                          }`}
                          sx={errorsCheck.checkbox ? {'& .MuiTypography-root': {color: 'error.main'}} : null}
                          control={
                            <Checkbox
                              {...field}
                              size='small'
                              name='validation-basic-checkbox'
                              sx={errorsCheck.checkbox ? {color: 'error.main'} : null}
                            />
                          }
                        />
                      )}
                    />
                    {errorsCheck.checkbox && (
                      <FormHelperText sx={{color: 'error.main'}} id='validation-basic-checkbox'>
                        Please confirm you want to{' '}
                        {customerData && customerData.adminStatus == 'DISABLED' ? 'activate' : 'deactivate'}{' '}
                        customer
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Button
                  variant='contained'
                  color='error'
                  type='submit'
                  disabled={errorsCheck.checkbox !== undefined}
                >
                  {customerData && customerData.adminStatus == 'DISABLED' ? 'Activate' : 'Deactivate'} Customer
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </Grid>
      {checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
        <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage}/>
      )}
      {linkedUser &&
        !isLoadingAccounts &&
        checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <LinkToAccountModal
            open={linkedUser}
            handleClose={handleClose}
            selectedCustomer={customerData}
            accounts={accounts}
          />
        )}
    </Grid>
  )
}

export default CustomerView
