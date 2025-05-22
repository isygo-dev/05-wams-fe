import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { updateAuthor } from '../../../api/author'
import toast from 'react-hot-toast'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Icon from 'template-shared/@core/components/icon'
import apiUrls from '../../../config/apiUrl'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import DomainApis from 'ims-shared/@core/api/ims/domain'

const UpdateAuthor = ({ open, onClose, author }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    id: author?.id || '',
    code: author?.code || '',
    firstname: author?.firstname || '',
    lastname: author?.lastname || '',
    domain: author?.domain || '',
    email: author?.email || '',
    phone: author?.phone || '',
    type: author?.type || '',
    extension: author?.extension || '',
    file: undefined,
    fileName: author?.fileName || '',
    originalFileName: author?.originalFileName || '',
    path: author?.path || '',
    imagePath: author?.imagePath || ''
  })

  const [, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const { data: domainList } = useQuery('domains', DomainApis(t).getDomains)

  useEffect(() => {
    if (author) {
      setFormData({
        id: author.id || '',
        code: author.code || '',
        firstname: author.firstname || '',
        lastname: author.lastname || '',
        domain: author.domain || '',
        email: author.email || '',
        phone: author.phone || '',
        type: author.type || '',
        extension: author.extension || '',
        file: undefined,
        fileName: author.fileName || '',
        originalFileName: author.originalFileName || '',
        path: author.path || '',
        imagePath: author.imagePath || ''
      })

      if (author.imagePath) {
        setPreviewUrl(`${apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint}/${author.id}?${Date.now()}`)
      } else {
        setPreviewUrl('')
      }
    }
  }, [author])

  const updateAuthorMutation = useMutation({
    mutationFn: (data: FormData) => {
      return updateAuthor(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('authorList')
      toast.success(t('Author updated successfully'))
      handleClose()
    },
    onError: error => {
      toast.error(t('Error updating author'))
      console.error('Update error:', error)
    }
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name,
        originalFileName: file.name,
        extension: file.name.split('.').pop()
      }))
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    const submitData = new FormData()

    Object.keys(formData).forEach(key => {
      if (key === 'file' && formData[key]) {
        submitData.append(key, formData[key])
      } else if (key !== 'file' && formData[key] !== undefined) {
        submitData.append(key, formData[key])
      }
    })

    updateAuthorMutation.mutate(submitData)
  }

  const handleClose = () => {
    if (previewUrl && !previewUrl.includes(apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint)) {
      URL.revokeObjectURL(previewUrl)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        {t('Update Author')}
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <Icon icon='tabler:x' />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={previewUrl} alt={formData.firstname} sx={{ width: 100, height: 100 }} />
                <IconButton
                  component='label'
                  sx={{
                    position: 'absolute',
                    right: -10,
                    bottom: -10,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <input hidden type='file' accept='image/*' onChange={handleFileChange} />
                  <Icon icon='tabler:camera' />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Code')}
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
                disabled
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id='domain-select-label'>{t('Domain.Domain')}</InputLabel>
                <Select
                  labelId='domain-select-label'
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  value={formData.domain}
                  onChange={handleChange}
                  disabled={!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domainList?.map(domain => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('FirstName')}
                name='firstname'
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('LastName')}
                name='lastname'
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('email')}
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label={t('phone')} name='phone' value={formData.phone} onChange={handleChange} />
            </Grid>
          </Grid>

          {updateAuthorMutation.isError && (
            <Typography color='error' sx={{ mt: 2 }}>
              {t('Error occurred during update')}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button type='submit' variant='contained' disabled={updateAuthorMutation.isLoading}>
            {updateAuthorMutation.isLoading ? t('Updating...') : t('Update')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateAuthor
