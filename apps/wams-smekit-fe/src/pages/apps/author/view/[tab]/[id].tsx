import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from "next/router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  TextField,
  Box,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

import Icon from 'template-shared/@core/components/icon';

import DomainApis from "ims-shared/@core/api/ims/domain";
import apiUrls from "../../../../../config/apiUrl";
import {
  getAuthorById,
  updateAuthor,
  getAuthorTemplates,
  uploadAuthorFile,
  downloadAuthorFile, updateAutherPicture
} from "../../../../../api/author";
import {downloadTemplateFile, getTemplatePreview} from "../../../../../api/template";
import Tooltip from "@mui/material/Tooltip";
import {AuthorType} from "../../../../../types/author";
import AuthorFilePreviewDialog from "../../../../../views/apps/Author/AuthorFilePreviewDialog";
import TemplatePreviewDialog from "../../../../../views/apps/Template/TemplatePreviewDialog";


const UpdateAuthor = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;
  const authorId = Array.isArray(id) ? id[0] : id;
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);


  const [formData, setFormData] = useState<AuthorType>({
    id: undefined,
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
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState(null);
  const [openCVPreview, setOpenCVPreview] = useState(false);
  const [cvPreviewUrl] = useState<string>('');

  const { data: domainList } = useQuery('domains', DomainApis(t).getDomains);

  const { data: templates, isLoading: isLoadingTemplates } = useQuery(
    ['authorTemplates', authorId],
    () => getAuthorTemplates(Number(authorId)),
    {
      enabled: !!authorId,
      onError: (error) => {
        console.error('[UpdateAuthor] Template fetch error:', error);
        toast.error(t('Failed to load templates'));
      },
      onSuccess: (data) => {
        console.log('[UpdateAuthor] Successfully loaded templates:', data);
      }
    }
  );

  const { data: authorData, isLoading, isError } = useQuery(
    ['author', authorId],
    () => getAuthorById(Number(authorId)),
    {
      enabled: !!authorId,
      onSuccess: (data) => {
        if (data) {
          setFormData({
            ...data,
            imageFile: undefined,
            file: undefined
          });

          if (data.imagePath) {
            setPreviewUrl(`${apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint}/${data.id}?${Date.now()}`);
          }
        }
      },
      onError: () => toast.error(t('Failed to load author data'))
    }
  );

  useEffect(() => {


    return () => {
      if (cvPreviewUrl) {
        URL.revokeObjectURL(cvPreviewUrl);
      }
    };
  }, [cvPreviewUrl]);

  const updateAuthorMutation = useMutation({
    mutationFn: (data: AuthorType) => updateAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['author', authorId]);
      queryClient.invalidateQueries('authorList');
      toast.success(t('Author updated successfully'));

    },
    onError: (error: Error) => {
      toast.error(t('Error updating author'));
      console.error('Update error:', error);
    }
  });

  const handlePreviewCV = () => {
    if (formData.path) {
      setOpenCVPreview(true);
    } else {
      toast.error(t('No CV available for preview'));
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const [fileExist, setFileExist] = useState<File | undefined>(undefined)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileExist(file)
    }
  };

  const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !authorId) return;

    const file = e.target.files[0];
    try {
      await toast.promise(
        uploadAuthorFile(file, Number(authorId)),
        {
          loading: t('Uploading CV...'),
          success: t('CV uploaded successfully!'),
          error: (err) => t(err.message || 'CV upload failed')
        }
      );
      await queryClient.invalidateQueries(['author', authorId]);
    } catch (error) {
      console.error('Full upload error:', error);
    }
  };

  const updatePictureMutation = useMutation({
    mutationFn: (data: { id: number; file: Blob }) => updateAutherPicture(data),
    onSuccess: () => {

      toast.success(t('Picture updated successfully'));
    },
    onError: (error) => {
      toast.error(t('Failed to update picture'));
      console.error('Update picture error:', error);
    }
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newData: AuthorType = {
      id:  formData.id,
      code: formData.code,
      firstname: formData.firstname,
      lastname: formData.lastname,
      domain: formData.domain,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      imagePath: fileExist ? undefined : formData.imagePath,
      fileName: fileExist ? fileExist.name : formData.fileName,
      originalFileName: formData.originalFileName,
      path: formData.path,
      extension: formData.extension
    }

    updateAuthorMutation.mutate(newData);


    if (fileExist && formData?.id) {
      updatePictureMutation.mutate({
        id: formData.id,
        file: fileExist
      });
    }


  }

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  const handlePreviewTemplate = async (template) => {
    if (!template || !template.id) return;

    setTemplateToPreview(template);
    setPreviewLoading(true);
    setOpenPreview(true);

    try {
      const blob = await getTemplatePreview(template.id);
      const url = URL.createObjectURL(blob);
      setPreviewContent(url);
    } catch (error) {
      if (error.message === 'FILE_NOT_FOUND') {
        toast.error(t('Template file not found on server'));
      } else {
        toast.error(t('Failed to load template preview'));
      }
      console.error('Preview error:', error);
      handleClosePreview();
    } finally {
      setPreviewLoading(false);
    }
  }
  const handleClosePreview = () => {
    setOpenPreview(false);
    setTemplateToPreview(null);
    if (previewContent) {
      URL.revokeObjectURL(previewContent);
      setPreviewContent(null);
    }
  }

  const handleDownloadCV = async () => {
    if (!formData.path) return;

    console.log('frfrffrrf', formData)
    setIsDownloading(true);
    try {
      const blob = await downloadAuthorFile(Number(authorId));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formData.originalFileName || `author_${authorId}_cv.${formData.extension || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(t('Failed to download CV'));
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  }

  const handleDownloadTemplate = async (templateId: number, filename: string) => {
    try {
      await downloadTemplateFile({ id: templateId, originalFileName: filename });
    } catch (error) {
      toast.error(t('Failed to download template'));
      console.error(error);
    }
  }

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">{t('Error loading author data')}</Typography>;
  if (!authorData) return <Typography>{t('No author data found')}</Typography>;


  {templateToPreview && (
    <TemplatePreviewDialog
      open={previewDialogOpen}
      onCloseClick={() => {
        setPreviewDialogOpen(false);
        setTemplateToPreview(null);
      }}
      templatePreview={templateToPreview}
    />
  )}


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('Update Author')}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {t('Profile Photo')}
                  </Typography>
                  <Avatar
                    src={fileExist ? URL.createObjectURL(fileExist) : previewUrl}
                    alt={`${formData.firstname} ${formData.lastname}`}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Icon icon="tabler:camera" />}
                    fullWidth
                  >
                    {t('Change Photo')}
                    <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                  </Button>

                  {(formData.firstname || formData.lastname) && (
                    <Box sx={{ width: '100%', mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="h6" align="center">
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
                <Typography variant="h6" gutterBottom>
                  {t('CV Document')}
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Icon icon="tabler:file-upload" />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {t('Upload CV')}
                  <input hidden type="file" accept=".pdf,.doc,.docx" onChange={handleCVFileChange} />
                </Button>

                {formData.originalFileName && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      label={formData.originalFileName}
                      onClick={handleDownloadCV}
                      deleteIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />}
                      onDelete={handleDownloadCV}
                      variant="outlined"
                      sx={{ width: '100%', justifyContent: 'space-between' }}
                      disabled={isDownloading}
                    />

                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={handlePreviewCV}
                      fullWidth
                      size="small"
                    >
                      {t('Preview CV')}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4.5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('Basic Information')}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Code')}
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      disabled
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>{t('Domaine')}</InputLabel>
                      <Select
                        label={t('Domain')}
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                      >
                        <MenuItem value=""><em>{t('None')}</em></MenuItem>
                        {domainList?.map((domain) => (
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
                      label={t('First name')}
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Last_Name')}
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Email')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('Phone')}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      size="small"
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
                <Typography variant="h6" gutterBottom>
                  {t('Associated Templates')}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {isLoadingTemplates ? (
                  <CircularProgress />
                ) : templates && templates.length > 0 ? (
                  <Stack spacing={2}>
                    {templates.map((template) => (
                      <Card key={template.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <InsertDriveFileIcon />
                          <Typography>{template.name}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title={t('Preview')}>
                            <IconButton
                              size="small"
                              onClick={() => handlePreviewTemplate(template)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Télécharger">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadTemplate(template.id, template.name)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">{t('No templates found')}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Dialog
          open={openPreview}
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {templateToPreview?.name || t('Template Preview')}
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {previewLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : previewContent ? (
              <Box sx={{ height: '70vh', width: '100%' }}>
                {templateToPreview?.extension?.toLowerCase() === 'pdf' ? (
                  <object
                    data={previewContent}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  >
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: 2
                    }}>
                      <Typography>{t('Unable to display PDF directly')}</Typography>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
                      >
                        {t('Download to view')}
                      </Button>
                    </Box>
                  </object>
                ) : (
                  <Box sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 1
                  }}>
                    <InsertDriveFileIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {templateToPreview?.name}
                    </Typography>
                    <Typography color="text.secondary" align="center">
                      {t('This file type cannot be previewed directly')}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
                    >
                      {t('Download to view')}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                gap: 2
              }}>
                <Typography color="text.secondary">
                  {t('No preview available')}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
                >
                  {t('Download file')}
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDownloadTemplate(templateToPreview?.id, templateToPreview?.name)}
              startIcon={<DownloadIcon />}
            >
              {t('Download')}
            </Button>
            <Button onClick={handleClosePreview}>
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              router.back(); setFileExist(undefined)
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateAuthorMutation.isLoading}
            startIcon={updateAuthorMutation.isLoading ? <CircularProgress size={20} /> : <Icon icon="tabler:edit" />}
          >
            {updateAuthorMutation.isLoading ? t('Updating...') : t('Update')}
          </Button>
        </Box>
      </form>

      <AuthorFilePreviewDialog
        open={openCVPreview}
        onCloseClick={() => setOpenCVPreview(false)}
        author={formData}
      />
    </Box>
  );
};

export default UpdateAuthor;
