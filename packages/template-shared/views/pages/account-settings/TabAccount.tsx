import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CropperCommon from 'template-shared/@core/components/cropper'
import CommonAddress from 'template-shared/@core/components/common-address/CommonAddress'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'
import i18n from 'i18next'
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import localStorageKeys from '../../../configs/localeStorage'
import { RequestStatus } from 'template-shared/@core/types/helper/userTypes'
import Typography from '@mui/material/Typography'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import AnnexApis from 'ims-shared/@core/api/ims/annex'
import { IEnumAnnex } from 'ims-shared/@core/types/ims/annexTypes'
import PictureCard from 'template-shared/@core/components/pictureCard'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from '../../forms/form-elements/input-mask/EmailInputMask'
import AccountApis from 'ims-shared/@core/api/ims/account'
import RolePermissionApis from 'ims-shared/@core/api/ims/role-permission'
import { AccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import { RoleTypes } from 'ims-shared/@core/types/ims/roleTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { AddressTypes } from 'ims-shared/@core/types/ims/addressTypes'
import imsApiUrls from 'ims-shared/configs/ims_apis'

interface Data {
  firstName: string
  lastName: string
  domain: string
  email: string
  phoneNumber: string
  roleInfo: RoleTypes[]
  state?: string
  address?: AddressTypes
  country: string
  currency: string
  language: string
  functionRole?: string
  timezone: string
  zipCode?: number | string
}

interface PropsAccountDetailType {
  id: number | null
  user: AccountDto
  setPhoto: (photo: string) => void
  photo: string
  myProfile: boolean
}

const TabAccount = (props: PropsAccountDetailType) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { id, user, setPhoto, photo, myProfile } = props
  const initialData: Data = {
    lastName: '',
    currency: 'usd',
    firstName: '',
    language: 'arabic',
    timezone: 'gmt-12',
    country: 'australia',
    domain: '',
    functionRole: user?.functionRole,
    email: '',
    phoneNumber: '',
    roleInfo: []
  }
  const [formData, setFormData] = useState<Data>(initialData)
  const { data: rolesList } = useQuery('roles', RolePermissionApis(t).getRoles)
  const { data: functionalRole, isLoading: isLoadingFunctionRole } = useQuery('functionalRole', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.FUNCTION_ROL)
  )

  const [photoFile, setPhotoFile] = useState<File>()
  const [checked, setChecked] = useState<RoleTypes[]>([])
  const [editedAddress, setEditedAddress] = useState<AddressTypes>({
    country: '',
    state: '',
    city: '',
    street: '',
    zipCode: 0,
    latitude: '',
    longitude: '',
    additionalInfo: ''
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [newStatus, setNewStatus] = useState<boolean>(user && user.adminStatus === 'ENABLED' ? true : false)

  useEffect(() => {
    if (user) {
      if (user.accountDetails.address) {
        setEditedAddress(user.accountDetails?.address)
      }
      setFormData({
        domain: user.domain,
        email: user.email,
        firstName: user.accountDetails?.firstName,
        lastName: user.accountDetails?.lastName,
        phoneNumber: user.phoneNumber,
        roleInfo: user.roleInfo,
        state: '',
        address: user.accountDetails?.address,
        zipCode: '',
        functionRole: user?.functionRole,
        currency: 'usd',
        language: user?.language,
        timezone: 'gmt-12',
        country: 'australia'
      })
      setNewStatus(user?.adminStatus === 'ENABLED')
      setPhoto(`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user.id}?` + new Date().getTime())
      setChecked(user.roleInfo)
    }
  }, [setPhoto, user])

  useQuery(
    'avatar',
    () =>
      user?.id ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user.id}?` + new Date().getTime() : null,
    {
      enabled: !!user?.id, // Enable the query only when 'user.id' is available
      onSuccess: () => {
        if (user?.id) {
          setPhoto(`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user?.id}?` + new Date().getTime())
        }
      }
    }
  )

  const [updateImage, setUpdateImage] = useState<boolean>(false)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })

  const auth = useAuth()
  const onSubmit = () => {
    handleOpenUpdateStatusDialog(user.id, !newStatus)
  }
  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    const data: RequestStatus = { id: rowId ?? 0, newReqStatus: status === true ? 'ENABLED' : 'DISABLED' }
    mutationAccount.mutate(data)
    setNewStatus(status)
  }
  const handleToggle = (value: RoleTypes) => () => {
    if (!checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.WRITE)) {
      const currentIndex = checked.findIndex(r => r.name === value.name)
      const newChecked = [...checked]

      if (currentIndex === -1) {
        newChecked.push(value)
      } else {
        if (newChecked.length > 1) {
          newChecked.splice(currentIndex, 1)
        } else {
          setErrorMessage('At least one role must be checked.')

          return
        }
      }
      setChecked(newChecked)
      setErrorMessage('')
    }
  }

  const openImageEdit = () => {
    setUpdateImage(true)
  }

  const saveProfileData = () => {
    const editedProfile: AccountDto = { ...user }
    if (editedProfile.accountDetails) {
      editedProfile.accountDetails.firstName = formData.firstName
      editedProfile.accountDetails.lastName = formData.lastName
      if (editedAddress) {
        editedProfile.accountDetails.address = editedAddress
      }
    }
    editedProfile.roleInfo = [...checked]

    editedProfile.domain = user.domain
    editedProfile.email = formData.email
    editedProfile.phoneNumber = formData.phoneNumber
    editedProfile.language = formData.language
    editedProfile.functionRole = formData.functionRole
    i18n.changeLanguage(formData.language?.toLowerCase())
    i18n.services.languageDetector.cacheUserLanguage(formData.language)
    updateProfile(editedProfile)
  }

  async function onSaveImage(newImage: Blob) {
    if (user && user.id) {
      const result = AccountApis(t).uploadPicture({ id: user.id, file: newImage })
      if (result) {
        queryClient.setQueryData(
          'avatar',
          `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user.id}?` + new Date().getTime()
        )
      } else {
        queryClient.setQueryData(
          'avatar',
          `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user.id}?` + new Date().getTime()
        )
      }

      setPhotoFile(newImage as File)
      setUpdateImage(false)
    }
  }

  async function updateProfile(account: AccountDto) {
    if (!id) {
      const editAccount: AccountDto = await AccountApis(t).updateProfile(account)
      const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_MyProfile_EndPoint}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(account)
      })
      if (editAccount) {
        let userData
        localStorage.getItem(localStorageKeys.userData) ??
          (userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}'))

        userData.firstName != editAccount.accountDetails.firstName
          ? (userData.firstName = editAccount.accountDetails.firstName)
          : (userData.firstName = userData.firstName)

        userData.lastName != editAccount.accountDetails.lastName
          ? (userData.lastName = editAccount.accountDetails.lastName)
          : (userData.lastName = userData.lastName)

        if (localStorage.getItem(localStorageKeys.userData)) {
          localStorage.removeItem(localStorageKeys.userData)
          localStorage.setItem(localStorageKeys.userData, JSON.stringify(userData))
          auth.setUser(userData)
        }

        return editAccount
      } else {
        console.error('Request failed:', response.status)
      }
    } else {
      AccountApis(t).updateUserAccount({ id, account })
    }
  }

  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const handleFormChange = (field: keyof Data, value: string) => {
    if (!checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.WRITE)) {
      return
    }
    setFormData({ ...formData, [field]: value })
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setValidationErrors(prevErrors => ({ ...prevErrors, email: 'Invalid email format' }))
      } else {
        setValidationErrors(prevErrors => ({ ...prevErrors, email: '' }))
      }
    } else if (!value) {
      setValidationErrors(prevErrors => ({ ...prevErrors, [field]: `${field} is required` }))
    } else {
      setValidationErrors(prevErrors => ({ ...prevErrors, [field]: '' }))
    }
  }

  const handleChange = newValue => {
    const updatedValue = newValue.replace(/\s+/g, '')

    if (!checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.WRITE)) {
      return
    }
    setFormData({ ...formData, phoneNumber: updatedValue })
  }

  const mutationAccount = useMutation({
    mutationFn: (data: RequestStatus) => AccountApis(t).updateAccountAdminStatus(data),
    onSuccess: (res: RequestStatus) => {
      const cachedData: AccountDto | undefined = queryClient.getQueryData('profile')
      if (cachedData != undefined) {
        cachedData.adminStatus = res.newReqStatus
        queryClient.setQueryData('profile', cachedData)
      }
      const cachedAccounts: AccountDto[] = queryClient.getQueryData('accounts') || []
      const index = cachedAccounts.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedAccounts = [...cachedAccounts]
        updatedAccounts[index].adminStatus = res.newReqStatus
        queryClient.setQueryData('accounts', updatedAccounts)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  return (
    <>
      {formData ? (
        <Grid container spacing={6}>
          {/* Account Details Card */}
          <Grid item md={12} mt={3}>
            <Grid container spacing={2} justifyContent='space-between' alignItems='stretch' mt={3}>
              <Grid item sm={12} md={2} xs={12}>
                <PictureCard
                  photoFile={photoFile}
                  url={photo}
                  openImageEdit={openImageEdit}
                  permissionPage={PermissionPage.ACCOUNT_IMAGE}
                  permissionApplication={PermissionApplication.IMS}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={10}>
                <Card sx={{ height: '100%' }}>
                  <CardContent className='container'></CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Account.Profile_Details')} />
              <form>
                <CardContent>
                  <CardHeader
                    sx={{ paddingLeft: '0.2rem' }}
                    title={
                      <>
                        {t('Resume.Personal_Information')} ({user?.code})
                      </>
                    }
                  />
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size='small'
                        fullWidth
                        label={t('First_Name')}
                        placeholder='John'
                        value={formData?.firstName}
                        onChange={e => handleFormChange('firstName', e.target.value)}
                        required
                        error={!!validationErrors.firstName}
                        helperText={validationErrors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size='small'
                        fullWidth
                        label={t('Last_Name')}
                        placeholder='Doe'
                        value={formData?.lastName}
                        onChange={e => handleFormChange('lastName', e.target.value)}
                        required
                        error={!!validationErrors.lastName}
                        helperText={validationErrors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <EmailInputMask
                        value={formData?.email}
                        onChange={value => handleFormChange('email', value)}
                        error={!!validationErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size='small'
                        fullWidth
                        label={t('Domain.Domain')}
                        placeholder='Domain'
                        value={formData?.domain}
                        onChange={e => handleFormChange('domain', e.target.value)}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiPhoneNumber
                        variant='outlined'
                        fullWidth
                        size='small'
                        defaultCountry={'tn'}
                        countryCodeEditable={true}
                        label={t('Phone_Number')}
                        value={formData?.phoneNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>{t('Language')}</InputLabel>
                        <Select
                          size='small'
                          label={t('Language')}
                          value={formData?.language}
                          onChange={e => handleFormChange('language', e.target.value)}
                        >
                          <MenuItem value='AR'>Arabic</MenuItem>
                          <MenuItem value='EN'>English</MenuItem>
                          <MenuItem value='FR'>French</MenuItem>
                          <MenuItem value='DE'>German</MenuItem>
                          <MenuItem value='IT'>Italien</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>{t('Timezone')}</InputLabel>
                        <Select
                          size='small'
                          label={t('Timezone')}
                          value={formData?.timezone}
                          onChange={e => handleFormChange('timezone', e.target.value)}
                        >
                          <MenuItem value='gmt-12'>(GMT-12:00) International Date Line West</MenuItem>
                          <MenuItem value='gmt-11'>(GMT-11:00) Midway Island, Samoa</MenuItem>
                          <MenuItem value='gmt-10'>(GMT-10:00) Hawaii</MenuItem>
                          <MenuItem value='gmt-09'>(GMT-09:00) Alaska</MenuItem>
                          <MenuItem value='gmt-08'>(GMT-08:00) Pacific Time (US & Canada)</MenuItem>
                          <MenuItem value='gmt-08-baja'>(GMT-08:00) Tijuana, Baja California</MenuItem>
                          <MenuItem value='gmt-07'>(GMT-07:00) Chihuahua, La Paz, Mazatlan</MenuItem>
                          <MenuItem value='gmt-07-mt'>(GMT-07:00) Mountain Time (US & Canada)</MenuItem>
                          <MenuItem value='gmt-06'>(GMT-06:00) Central America</MenuItem>
                          <MenuItem value='gmt-06-ct'>(GMT-06:00) Central Time (US & Canada)</MenuItem>
                          <MenuItem value='gmt-06-mc'>(GMT-06:00) Guadalajara, Mexico City, Monterrey</MenuItem>
                          <MenuItem value='gmt-06-sk'>(GMT-06:00) Saskatchewan</MenuItem>
                          <MenuItem value='gmt-05'>(GMT-05:00) Bogota, Lima, Quito, Rio Branco</MenuItem>
                          <MenuItem value='gmt-05-et'>(GMT-05:00) Eastern Time (US & Canada)</MenuItem>
                          <MenuItem value='gmt-05-ind'>(GMT-05:00) Indiana (East)</MenuItem>
                          <MenuItem value='gmt-04'>(GMT-04:00) Atlantic Time (Canada)</MenuItem>
                          <MenuItem value='gmt-04-clp'>(GMT-04:00) Caracas, La Paz</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          size='small'
                          label={t('Currency')}
                          value={formData?.currency}
                          onChange={e => handleFormChange('currency', e.target.value)}
                        >
                          <MenuItem value='usd'>USD</MenuItem>
                          <MenuItem value='eur'>EUR</MenuItem>
                          <MenuItem value='pound'>Pound</MenuItem>
                          <MenuItem value='bitcoin'>Bitcoin</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CardHeader sx={{ paddingLeft: '0.2rem' }} title={t('Address.Address')} />

                      <CommonAddress
                        permissionApplication={PermissionApplication.IMS}
                        permissionPage={PermissionPage.ACCOUNT_DETAIL}
                        permissionAction={PermissionAction.WRITE}
                        editedAddress={editedAddress}
                        setEditedAddress={setEditedAddress}
                      />
                    </Grid>

                    <Grid item md={3} sm={12}>
                      <Typography variant={'h5'}>{t('Role.Functional_Role')}</Typography>
                    </Grid>

                    <Grid item md={9} sm={12}>
                      <FormControl fullWidth>
                        <Select
                          size='small'
                          defaultValue=''
                          value={formData?.functionRole ? formData?.functionRole : ''}
                          onChange={e => handleFormChange('functionRole', e.target.value)}
                        >
                          {!isLoadingFunctionRole
                            ? functionalRole?.map(res => (
                                <MenuItem key={res.id} value={res.value}>
                                  {res.value}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CardHeader sx={{ paddingLeft: '0.2rem' }} title={t('Role.Role')} />
                      <FormControl fullWidth>
                        {myProfile ? (
                          <List>
                            {user?.roleInfo &&
                              user?.roleInfo?.map((tool: RoleTypes, index: number) => (
                                <Tooltip title={t(tool?.description ?? '') as string} key={index}>
                                  <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={handleToggle(tool)}>
                                      <ListItemText id={`checkbox-list-label-${index}`} primary={tool.name} />
                                      <ListItemSecondaryAction>
                                        <Checkbox
                                          edge='end'
                                          tabIndex={-1}
                                          disableRipple
                                          checked={checked.some(r => r.name === tool.name)}
                                          inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                                          disabled={
                                            !checkPermission(
                                              PermissionApplication.IMS,
                                              PermissionPage.ACCOUNT_DETAIL,
                                              PermissionAction.WRITE
                                            )
                                          }
                                        />
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                  </ListItem>
                                </Tooltip>
                              ))}
                          </List>
                        ) : (
                          <List>
                            {rolesList?.map((tool: RoleTypes, index: number) => (
                              <Tooltip title={t(tool?.description ?? '') as string} key={index}>
                                <ListItem key={index} disablePadding>
                                  <ListItemButton onClick={handleToggle(tool)}>
                                    <ListItemText id={`checkbox-list-label-${index}`} primary={tool.name} />
                                    <ListItemSecondaryAction>
                                      <Checkbox
                                        edge='end'
                                        tabIndex={-1}
                                        disableRipple
                                        checked={checked.some(r => r.name === tool.name)}
                                        inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                                        disabled={
                                          !checkPermission(
                                            PermissionApplication.IMS,
                                            PermissionPage.ACCOUNT_DETAIL,
                                            PermissionAction.WRITE
                                          )
                                        }
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItemButton>
                                </ListItem>
                              </Tooltip>
                            ))}
                          </List>
                        )}
                        {errorMessage && <FormHelperText sx={{ color: 'error.main' }}>{errorMessage}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                      <Button
                        variant='contained'
                        sx={{ mr: 4 }}
                        onClick={saveProfileData}
                        style={{
                          display: checkPermission(
                            PermissionApplication.IMS,
                            PermissionPage.ACCOUNT_DETAIL,
                            PermissionAction.WRITE
                          )
                            ? 'inline'
                            : 'none'
                        }}
                      >
                        {t('Reset Password.Save Changes')}
                      </Button>
                      <Button
                        type='reset'
                        variant='outlined'
                        color='secondary'
                        onClick={() => setFormData(initialData)}
                        style={{
                          display: checkPermission(
                            PermissionApplication.IMS,
                            PermissionPage.ACCOUNT_DETAIL,
                            PermissionAction.WRITE
                          )
                            ? 'inline'
                            : 'none'
                        }}
                      >
                        {t('Reset Password.Reset')}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </form>
            </Card>
          </Grid>

          {/* Delete Account Card */}
          {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.WRITE) ? (
            <Grid item xs={12}>
              <Card>
                <CardHeader title={t('Account.Delete_Account')} />
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: 4 }}>
                      <FormControl>
                        <Controller
                          name='checkbox'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <FormControlLabel
                              label={t(
                                user && user.adminStatus === 'ENABLED'
                                  ? 'Account.I_Confirm_My_Account_Deactivation'
                                  : 'Account.I_Confirm_My_Account_Activation'
                              )}
                              sx={errors.checkbox ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                              control={
                                <Checkbox
                                  {...field}
                                  size='small'
                                  name='validation-basic-checkbox'
                                  sx={errors.checkbox ? { color: 'error.main' } : null}
                                />
                              }
                            />
                          )}
                        />
                        {errors.checkbox && (
                          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                            {t(
                              user && user.adminStatus === 'ENABLED'
                                ? 'Account.Please_Confirm_Yo_Want_To_Deactivate_Account'
                                : 'Account.Please_Confirm_Yo_Want_To_Activate_Account'
                            )}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                    <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                      {t(
                        user && user.adminStatus === 'ENABLED'
                          ? 'Account.Deactivate_Account'
                          : 'Account.Activate_Account'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage} />
        </Grid>
      ) : null}
    </>
  )
}

export default TabAccount
