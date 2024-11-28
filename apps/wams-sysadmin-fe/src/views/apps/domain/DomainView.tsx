import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Icon from 'template-shared/@core/components/icon'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import CommonAddress from 'template-shared/@core/components/common-address/CommonAddress'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import {Controller, useForm} from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import CropperCommon from 'template-shared/@core/components/cropper'
import imsApiUrls from "ims-shared/configs/ims_apis"
import {useMutation, useQueryClient} from 'react-query'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {URL_PATTERN} from 'template-shared/@core/types/helper/patternTypes'
import {AdminStatus} from "ims-shared/@core/types/ims/accountTypes";
import {AddressTypes} from 'ims-shared/@core/types/ims/addressTypes'
import {RequestStatus} from "template-shared/@core/types/helper/userTypes";
import Typography from '@mui/material/Typography'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import {DialogContentText} from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import MuiPhoneNumber from "material-ui-phone-number";
import PictureCard from "template-shared/@core/components/pictureCard";
import EmailInputMask from "template-shared/views/forms/form-elements/input-mask/EmailInputMask";
import AdminAccountsList from "./AdminAccountsList";
import DomainApis from "ims-shared/@core/api/ims/domain";
import {DomainDetailType, EnumLinkDomain} from "ims-shared/@core/types/ims/domainTypes";

const schema = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  domain: yup.string().default(''),
  description: yup.string(),
  adminStatus: yup.string(),
  code: yup.string(),
  lnk_facebook: yup.string(),
  lnk_linkedin: yup.string(),
  lnk_xing: yup.string(),
  email: yup.string(),
  phone: yup.string()
})

interface DomainViewType {
  domainDetail: DomainDetailType
}

const DomainView = (props: DomainViewType) => {
  const {domainDetail} = props
  const {t} = useTranslation()
  const [updateImage, setUpdateImage] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [photoFile, setPhotoFile] = useState<File>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [linkDeleted, setLinkDeleted] = useState('')
  const [linkAdded, setLinkAdded] = useState('')
  const [newLinkValue, setNewLinkValue] = useState<string>('')
  const [errorNewLinkValue, setErrorNewLinkValue] = useState<boolean>(false)
  const [defaultValues, setDefaultValues] = useState<DomainDetailType>({...domainDetail})
  const [newStatus, setNewStatus] = useState<boolean>(
    domainDetail && domainDetail.adminStatus === 'ENABLED' ? true : false
  )
  const initAdress = {
    country: '',
    state: '',
    city: '',
    street: '',
    latitude: '',
    longitude: '',
    additionalInfo: ''
  }

  const [editedAddress, setEditedAddress] = useState<AddressTypes>(
    domainDetail && domainDetail?.address ? domainDetail.address : initAdress
  )

  const openImageEdit = () => {
    setUpdateImage(true)
  }

  async function onSaveImage(newImage: Blob) {
    updatePictureMutation.mutate({id: domainDetail.id, file: newImage})
    setPhotoFile(newImage as File)
  }

  const updatePictureMutation = useMutation({
    mutationFn: (newMutation: { id: number; file: Blob }) => DomainApis(t).updateDomainImage(newMutation),
    onSuccess: () => {
      setUpdateImage(false)
    }
  })

  const handlereset = () => {
    setEditedAddress({...domainDetail.address})
    reset()
  }

  const mutationEdit = useMutation({
    mutationFn: (data: DomainDetailType) => DomainApis(t).updateDomain(data),
    onSuccess: (res: DomainDetailType) => {
      console.log('res', res)
      setDefaultValues(res)
      setErrorNewLinkValue(false)
      handleClickOpen()
      setLinkDeleted('')
    }
  })

  const mutationEditSocial = useMutation({
    mutationFn: (data: {
      id: number,
      social: string,
      link: string
    }) => DomainApis(t).updateDomainSocial(data.id, data.social, data.link),
    onSuccess: (res: DomainDetailType) => {
      setDefaultValues(res)
      setErrorNewLinkValue(false)
      handleClickOpen()
      setLinkDeleted('')
    }
  })

  const mutationEditStatus = useMutation({
    mutationFn: (data: RequestStatus) => DomainApis(t).updateDomainStatus(data),
    onSuccess: res => {
      const cachedData: DomainDetailType | undefined = queryClient.getQueryData('domainDetail')
      if (cachedData != undefined) {
        console.log(cachedData)
        cachedData.adminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        queryClient.setQueryData('domainDetail', cachedData)
      }
    }
  })

  const {
    getValues,
    reset,
    control,
    setValue,
    formState: {errors}
  } = useForm<DomainDetailType>({
    defaultValues, // Start with an empty object
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmitDtata = (data: DomainDetailType) => {
    const request: DomainDetailType = {
      id: domainDetail.id,
      ...data,
      lnk_xing: defaultValues.lnk_xing,
      lnk_linkedin: defaultValues.lnk_linkedin,
      lnk_facebook: defaultValues.lnk_facebook,
      adminStatus: newStatus ? AdminStatus.ENABLED : AdminStatus.DISABLED,
      address: editedAddress || undefined
    }
    mutationEdit.mutate(request)
  }

  const onSubmitSocial = (id: number, social: string, link: string) => {
    mutationEditSocial.mutate({id, social, link})
  }

  const {
    control: controlCheck,
    handleSubmit: handleSubmitCheck,
    formState: {errors: errorsCheck}
  } = useForm({defaultValues: {checkbox: false}})

  const onSubmitCheck = () => {
    const data: RequestStatus = {id: domainDetail.id ?? 0, newReqStatus: newStatus ? 'ENABLED' : 'DISABLED'}
    console.log('data onSubmitCheck, ', data)
    mutationEditStatus.mutate(data)
    setNewStatus(!newStatus)
  }

  function onDelete() {
    switch (linkDeleted) {
      case EnumLinkDomain.lnk_facebook:
        defaultValues.lnk_facebook = ''
        break
      case EnumLinkDomain.lnk_linkedin:
        defaultValues.lnk_linkedin = ''
        break
      case EnumLinkDomain.lnk_xing:
        defaultValues.lnk_xing = ''
        break
    }
    onSubmitSocial(defaultValues.id, linkDeleted, '')
  }

  const onDeleteLink = (item: string) => {
    if (!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)) {
      return
    }
    setLinkDeleted(item)
    setDeleteDialogOpen(true)
  }

  const onAddLink = (item: string) => {
    if (!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)) {
      return
    }
    setLinkAdded(item)
    setOpenAddLink(!openAddLink)
  }

  const [openAddLink, setOpenAddLink] = useState<boolean>(false)

  const handleClickOpen = () => {
    setOpenAddLink(false)
    setNewLinkValue('')
    setErrorNewLinkValue(false)
  }

  const handleSaveSocial = () => {
    if (linkAdded && linkAdded.trim() !== '' && URL_PATTERN.test(newLinkValue)) {
      switch (linkAdded) {
        case EnumLinkDomain.lnk_facebook:
          defaultValues.lnk_facebook = newLinkValue
          break

        case EnumLinkDomain.lnk_linkedin:
          defaultValues.lnk_linkedin = newLinkValue
          break

        case EnumLinkDomain.lnk_xing:
          defaultValues.lnk_xing = newLinkValue
          break
      }
      onSubmitSocial(domainDetail.id, linkAdded, newLinkValue)
      setErrorNewLinkValue(false)
    } else {
      setErrorNewLinkValue(true)
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={12} md={2} xs={12}>
          <PictureCard photoFile={photoFile}
                       url={`${imsApiUrls.apiUrl_IMS_Domain_ImageDownload_EndPoint}/${domainDetail.id}`}
                       openImageEdit={openImageEdit}
                       permissionPage={PermissionPage.DOMAIN}
                       permissionApplication={PermissionApplication.IMS}/>
        </Grid>
        <Grid item xs={12} sm={6} md={10}>
          <Card sx={{height: '100%'}}>
            <CardContent className='container'></CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={6} mt={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t('Domain.Details')}/>
            <form>
              <CardContent style={{padding: '5px !important'}}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={6}>
                    {/*// box 1*/}
                    <Box>
                      <Grid container spacing={3} item md={12} xs={12}>
                        <Grid item xs={12} sm={12}>
                          <CardHeader
                            sx={{paddingLeft: '10px', paddingBottom: '0px'}}
                            title={t('Domain Information ')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='code'
                              control={control}
                              rules={{required: true}}
                              render={({field: {value, onChange}}) => (
                                <TextField
                                  disabled
                                  size='small'
                                  value={value}
                                  label={t('Code')}
                                  onChange={
                                    checkPermission(
                                      PermissionApplication.IMS,
                                      PermissionPage.DOMAIN,
                                      PermissionAction.WRITE
                                    ) && onChange
                                  }
                                  error={Boolean(errors.code)}
                                />
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
                                      PermissionPage.DOMAIN,
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
                              render={({field: {value, onChange}}) => (
                                <EmailInputMask
                                  value={value}
                                  onChange={
                                    checkPermission(
                                      PermissionApplication.IMS,
                                      PermissionPage.DOMAIN,
                                      PermissionAction.WRITE
                                    ) && onChange
                                  }
                                  error={Boolean(errors.email)}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='phone'
                              control={control}
                              rules={{required: false}}
                              render={({field: {value}}) => (
                                <MuiPhoneNumber
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  defaultCountry={"tn"}
                                  countryCodeEditable={true}
                                  label={t('Phone_Number')}
                                  value={value}
                                  onChange={(e) => {
                                    if (!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)) {
                                      const updatedValue = e.replace(/\s+/g, '')
                                      setValue('phone', updatedValue)
                                    }
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} md={12}>
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
                                      PermissionPage.DOMAIN,
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
                                      PermissionPage.DOMAIN,
                                      PermissionAction.WRITE
                                    ) && onChange
                                  }
                                  error={Boolean(errors.description)}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CardHeader title={t('Connections.Social_Accounts')} titleTypographyProps={{sx: {mb: 1}}}/>
                    <Box sx={{paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>
                      <Grid container item md={12}>
                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='lnk_facebook'
                              control={control}
                              render={() => (
                                <Box
                                  sx={{
                                    gap: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:not(:last-of-type)': {mb: 4}
                                  }}
                                >
                                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 4, minWidth: 45, display: 'bloc', justifyContent: 'center'}}>
                                      <img src={'/images/logos/facebook.png'} alt={'facebook'} height='30'/>

                                      <a href={defaultValues.lnk_facebook} target='_blan' className={'link-hover'}>
                                        <Typography variant='subtitle2' sx={{color: 'text.disabled'}}>
                                          {defaultValues.lnk_facebook}
                                        </Typography>
                                      </a>
                                    </Box>
                                  </Box>
                                  {checkPermission(
                                    PermissionApplication.IMS,
                                    PermissionPage.DOMAIN,
                                    PermissionAction.WRITE
                                  ) && (
                                    <Button
                                      onClick={() => {
                                        defaultValues.lnk_facebook
                                          ? onDeleteLink(EnumLinkDomain.lnk_facebook)
                                          : onAddLink(EnumLinkDomain.lnk_facebook)
                                      }}
                                      variant='outlined'
                                      sx={{p: 1.5, minWidth: 38}}
                                      color={defaultValues.lnk_facebook ? 'error' : 'secondary'}
                                    >
                                      <Icon icon={defaultValues.lnk_facebook ? 'tabler:trash' : 'tabler:link'}/>
                                    </Button>
                                  )}
                                </Box>
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='lnk_linkedin'
                              control={control}
                              render={() => (
                                <Box
                                  sx={{
                                    gap: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:not(:last-of-type)': {mb: 4}
                                  }}
                                >
                                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 4, minWidth: 45, display: 'block', justifyContent: 'center'}}>
                                      <img src={'/images/logos/linkedin.png'} alt={'lnk_linkedin'} height='30'/>

                                      <a href={defaultValues.lnk_linkedin} target='_blan' className={'link-hover'}>
                                        <Typography variant='subtitle2' sx={{color: 'text.disabled'}}>
                                          {defaultValues.lnk_linkedin}
                                        </Typography>
                                      </a>
                                    </Box>
                                  </Box>
                                  {checkPermission(
                                    PermissionApplication.IMS,
                                    PermissionPage.DOMAIN,
                                    PermissionAction.WRITE
                                  ) && (
                                    <Button
                                      onClick={() => {
                                        defaultValues.lnk_linkedin
                                          ? onDeleteLink(EnumLinkDomain.lnk_linkedin)
                                          : onAddLink(EnumLinkDomain.lnk_linkedin)
                                      }}
                                      color={defaultValues.lnk_linkedin ? 'error' : 'secondary'}
                                      variant='outlined'
                                      sx={{p: 1.5, minWidth: 38}}
                                    >
                                      <Icon icon={defaultValues.lnk_linkedin ? 'tabler:trash' : 'tabler:link'}/>
                                    </Button>
                                  )}
                                </Box>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='lnk_xing'
                              control={control}
                              render={() => (
                                <Box
                                  sx={{
                                    gap: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:not(:last-of-type)': {mb: 4}
                                  }}
                                >
                                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 4, minWidth: 45, display: 'bloc', justifyContent: 'center'}}>
                                      <img src={'/images/logos/xing.png'} alt={'lnk_xing'} height='30'/>
                                      <a href={defaultValues.lnk_xing} target='_blan' className={'link-hover'}>
                                        <Typography variant='subtitle2' sx={{color: 'text.disabled'}}>
                                          {defaultValues.lnk_xing}
                                        </Typography>
                                      </a>
                                    </Box>
                                  </Box>
                                  {checkPermission(
                                    PermissionApplication.IMS,
                                    PermissionPage.DOMAIN,
                                    PermissionAction.WRITE
                                  ) && (
                                    <Button
                                      onClick={() => {
                                        defaultValues.lnk_xing
                                          ? onDeleteLink(EnumLinkDomain.lnk_xing)
                                          : onAddLink(EnumLinkDomain.lnk_xing)
                                      }}
                                      color={defaultValues.lnk_xing ? 'error' : 'secondary'}
                                      variant='outlined'
                                      sx={{p: 1.5, minWidth: 38}}
                                    >
                                      <Icon icon={defaultValues.lnk_xing ? 'tabler:trash' : 'tabler:link'}/>
                                    </Button>
                                  )}
                                </Box>
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <CardHeader
                    title={t('Address.Address')}
                    sx={{paddingBottom: '0px !important', paddingLeft: '19px'}}
                  />

                  <CommonAddress
                    editedAddress={editedAddress}
                    setEditedAddress={setEditedAddress}
                    permissionApplication={PermissionApplication.IMS}
                    permissionPage={PermissionPage.DOMAIN}
                    permissionAction={PermissionAction.WRITE}
                  />

                </Grid>

                <Grid item xs={12} sx={{pt: theme => `${theme.spacing(6.5)} !important`}}>
                  {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
                    <Button variant='contained' sx={{mr: 3}} onClick={() => onSubmitDtata(getValues())}>
                      {t('Save Changes')}
                    </Button>
                  )}
                  {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
                    <Button type='reset' variant='outlined' color='secondary' onClick={handlereset}>
                      {t('Reset')}
                    </Button>
                  )}
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>
        <Grid item md={12}>

          <AdminAccountsList domain={defaultValues?.name}/>
        </Grid>
        <Grid item xs={12}>
          {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
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
                            label={
                              domainDetail && domainDetail.adminStatus === 'ENABLED' ? t('Domain.I_confirm_my_domain_deactivation') : t('Domain.I_confirm_my_domain_activation')
                            }
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

                          {domainDetail && domainDetail.adminStatus == 'DISABLED' ? t('Domain.Please_confirm_you_want_to_activate_domain') : t('Domain.Please_confirm_you_want_to_deactivate_domain')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Button variant='contained' color='error' type='submit' disabled={errorsCheck.checkbox !== undefined}>
                    {domainDetail && domainDetail.adminStatus === 'DISABLED' ?
                      t('Contract.activate') :
                      t('Contract.deactivate')} {t('Domain.Domain')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openAddLink}
        maxWidth={'md'}
        fullWidth
        keepMounted
        onClose={handleClickOpen}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>Get your link</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <Grid container>
              <Grid item md={1} sm={1} xs={1}>
                {linkAdded && linkAdded === EnumLinkDomain.lnk_facebook ? (
                  <img src={'/images/logos/facebook.png'} alt={'facebook'} height='30'/>
                ) : null}
                {linkAdded && linkAdded === EnumLinkDomain.lnk_linkedin ? (
                  <img src={'/images/logos/linkedin.png'} alt={'linkedin'} height='30'/>
                ) : null}
                {linkAdded && linkAdded === EnumLinkDomain.lnk_xing ? (
                  <img src={'/images/logos/xing.png'} alt={'xing'} height='30'/>
                ) : null}
              </Grid>

              <Grid item md={11} sm={11} xs={11}>
                <TextField
                  fullWidth
                  value={newLinkValue}
                  size='small'
                  required={true}
                  label={t('Link')}
                  error={errorNewLinkValue}
                  onChange={e => setNewLinkValue(e.target.value)}
                />
                {errorNewLinkValue && <FormHelperText sx={{color: 'error.main'}}>Enter a valid url</FormHelperText>}
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClickOpen}>{t('Cancel')}</Button>
          <Button variant={'contained'} onClick={handleSaveSocial}>{t('Save')}</Button>
        </DialogActions>
      </Dialog>

      <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage}/>

      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={1}
          item='DomainLink'
          onDelete={onDelete}
        />
      )}
    </>
  )
}

export default DomainView
