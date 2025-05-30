import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import CloseIcon from '@mui/icons-material/Close'

import Icon from 'template-shared/@core/components/icon'

import DomainApis from 'ims-shared/@core/api/ims/domain'
import apiUrls from '../../../../../config/apiUrl'
import {
  downloadAuthorFile,
  getAuthorById,
  getAuthorTemplates,
  updateAuthor,
  uploadAuthorFile
} from '../../../../../api/author'
import { downloadTemplateFile, getTemplatePreview } from '../../../../../api/template'
import Tooltip from '@mui/material/Tooltip'

interface AuthorFormData {
  id: string
  code: string
  firstname: string
  lastname: string
  domain: string
  email: string
  phone: string
  type: string
  imageFile?: File
  imagePath: string
  file?: File
  fileName: string
  originalFileName: string
  path: string
  extension: string
}

const UpdateAuthor = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { id } = router.query
  const authorId = Array.isArray(id) ? id[0] : id

  const [formData, setFormData] = useState<AuthorFormData>({
    id: '',
    code: '',
    firstname: '',
    lastname: '',
    domain: '',
    email: '',
    phone: '',
    type: '',
    imagePath: '',
    fileName: '',
    originalFileName: '',
    path: '',
    extension: ''
  })

  const [previewUrl, setPreviewUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [templateToPreview, setTemplateToPreview] = useState(null)

  const { data: domainList } = useQuery('domains', DomainApis(t).getDomains)

  const { data: templates, isLoading: isLoadingTemplates } = useQuery(
    ['authorTemplates', authorId],
    () => getAuthorTemplates(Number(authorId)),
    {
      enabled: !!authorId,
      onError: () => toast.error(t('Failed to load templates'))
    }
  )

  const {
    data: authorData,
    isLoading,
    isError
  } = useQuery(['author', authorId], () => getAuthorById(Number(authorId)), {
    enabled: !!authorId,
    onSuccess: data => {
      if (data) {
        setFormData({
          ...data,
          imageFile: undefined,
          file: undefined
        })

        if (data.imagePath) {
          setPreviewUrl(`${apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint}/${data.id}?${Date.now()}`)
        }
      }
    },
    onError: () => toast.error(t('Failed to load author data'))
  })

  const updateAuthorMutation = useMutation({
    mutationFn: (data: FormData) => updateAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['author', authorId])
      queryClient.invalidateQueries('authorList')
      toast.success(t('Author updated successfully'))
      router.push('/apps/author')
    },
    onError: (error: Error) => {
      toast.error(t('Error updating author'))
      console.error('Update error:', error)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setPreviewUrl(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, imageFile: file }))
    }
  }

  const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !authorId) return

    const file = e.target.files[0]
    try {
      await toast.promise(uploadAuthorFile(file, Number(authorId)), {
        loading: t('Uploading CV...'),
        success: t('CV uploaded successfully!'),
        error: err => t(err.message || 'CV upload failed')
      })
      await queryClient.invalidateQueries(['author', authorId])
    } catch (error) {
      console.error('Full upload error:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formDataToSend.append(key, value instanceof File ? value : String(value))
      }
    })

    updateAuthorMutation.mutate(formDataToSend)
  }

  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState(null)

  const handlePreviewTemplate = async template => {
    if (!template || !template.id) return

    setTemplateToPreview(template)
    setPreviewLoading(true)
    setOpenPreview(true)

    try {
      const blob = await getTemplatePreview(template.id)
      const previewUrl = URL.createObjectURL(blob)
      setPreviewContent(previewUrl)
    } catch (error) {
      toast.error(t('Failed to load template preview'))
      console.error('Preview error:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleClosePreview = () => {
    setOpenPreview(false)
    setTemplateToPreview(null)
    if (previewContent) {
      URL.revokeObjectURL(previewContent)
      setPreviewContent(null)
    }
  }

  const handleDownloadCV = async () => {
    if (!formData.path) return

    setIsDownloading(true)
    try {
      const blob = await downloadAuthorFile(Number(authorId))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = formData.fileName || `author_${authorId}_cv.${formData.extension || 'pdf'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(t('Failed to download CV'))
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadTemplate = async (templateId: number, filename: string) => {
    try {
      await downloadTemplateFile({ id: templateId, originalFileName: filename })
    } catch (error) {
      toast.error(t('Failed to download template'))
      console.error(error)
    }
  }

  if (isLoading) return <CircularProgress />
  if (isError) return <Typography color='error'>{t('Error loading author data')}</Typography>
  if (!authorData) return <Typography>{t('No author data found')}</Typography>

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        {t('Update Author')}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant='h6' gutterBottom>
                    {t('Profile Photo')}
                  </Typography>
                  <Avatar
                    src={previewUrl}
                    alt={`${formData.firstname} ${formData.lastname}`}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  <Button component='label' variant='outlined' startIcon={<Icon icon='tabler:camera' />} fullWidth>
                    {t('Change Photo')}
                    <input hidden type='file' accept='image/*' onChange={handleImageChange} />
                  </Button>

                  {(formData.firstname || formData.lastname) && (
                    <Box sx={{ width: '100%', mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant='h6' align='center'>
                        {`${formData.firstname} ${formData.lastname}`.trim()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4.5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {t('CV Document')}
                </Typography>
                <Button
                  component='label'
                  variant='outlined'
                  startIcon={<Icon icon='tabler:file-upload' />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {t('Upload CV')}
                  <input hidden type='file' accept='.pdf,.doc,.docx' onChange={handleCVFileChange} />
                </Button>

                {formData.originalFileName && (
                  <Chip
                    icon={<InsertDriveFileIcon />}
                    label={formData.originalFileName}
                    onClick={handleDownloadCV}
                    deleteIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />}
                    onDelete={handleDownloadCV}
                    variant='outlined'
                    sx={{ width: '100%', justifyContent: 'space-between' }}
                    disabled={isDownloading}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4.5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {t('Basic Information')}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Code')}
                      name='code'
                      value={formData.code}
                      onChange={handleChange}
                      required
                      disabled
                      size='small'
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                      <InputLabel>{t('Domaine')}</InputLabel>
                      <Select label={t('Domain')} name='domain' value={formData.domain} onChange={handleChange}>
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

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('First Name')}
                      name='firstname'
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      size='small'
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Last Name')}
                      name='lastname'
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      size='small'
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Email')}
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      size='small'
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Phone')}
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      size='small'
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {!isLoadingTemplates && templates && templates.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {t('Associated Templates')}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {isLoadingTemplates ? (
                  <CircularProgress />
                ) : templates && templates.length > 0 ? (
                  <Stack spacing={2}>
                    {templates.map(template => (
                      <Card
                        key={template.id}
                        variant='outlined'
                        sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Stack direction='row' alignItems='center' spacing={2}>
                          <InsertDriveFileIcon />
                          <Typography>{template.name}</Typography>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Tooltip title={t('Preview')}>
                            <IconButton size='small' onClick={() => handlePreviewTemplate(template)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Télécharger'>
                            <IconButton size='small' onClick={() => handleDownloadTemplate(template.id, template.name)}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Typography color='text.secondary'>{t('No templates found')}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Dialog open={openPreview} onClose={handleClosePreview} maxWidth='md' fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {templateToPreview?.name || t('Template Preview')}
            <IconButton onClick={handleClosePreview} size='small'>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {previewLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : previewContent ? (
              <Box sx={{ p: 2, minHeight: '50vh' }}>
                {templateToPreview?.extension?.toLowerCase() === 'pdf' ? (
                  <iframe
                    src={previewContent}
                    style={{ width: '100%', height: '70vh', border: 'none' }}
                    title={templateToPreview.name}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '70vh',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      p: 3,
                      overflow: 'auto',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Typography variant='body1'>{t('Preview not available for this file type')}</Typography>
                    <Button
                      variant='contained'
                      startIcon={<DownloadIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
                    >
                      {t('Download to view')}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography color='text.secondary'>{t('No template content to preview')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
              startIcon={<DownloadIcon />}
            >
              {t('Download')}
            </Button>
            <Button onClick={handleClosePreview}>{t('Close')}</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='outlined' onClick={() => router.back()}>
            {t('Cancel')}
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={updateAuthorMutation.isLoading}
            startIcon={updateAuthorMutation.isLoading ? <CircularProgress size={20} /> : <Icon icon='tabler:edit' />}
          >
            {updateAuthorMutation.isLoading ? t('Updating...') : t('Update')}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default UpdateAuthor
