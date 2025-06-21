import React, {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
  CircularProgress,
  Switch,
  Divider,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import Icon from 'template-shared/@core/components/icon';
import {  updateTemplate, fetchAllTemplate } from "../../../../../api/template";
import { CategoryTemplateType, IEnumDocTempStatus, IEnumTemplateLanguage, IEnumTemplateVisibility } from "../../../../../types/categoryTemplateType";
import { fetchAll } from "../../../../../api/category";
import { fetchAllAuthor } from "../../../../../api/author";
import { AuthorType } from "../../../../../types/author";
import { CategoryType } from "../../../../../types/category";
import { Controller, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TemplatePreviewDialog from "../../../../../views/apps/Template/TemplatePreviewDialog";


const UpdateTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateData, setTemplateData] = useState<CategoryTemplateType | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CategoryTemplateType | null>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryTemplateType>({
    defaultValues: {
      name: '',
      description: '',
      categoryId: undefined,
      authorId: undefined,
      typeTl: IEnumTemplateLanguage.EN,
      typeTv: IEnumTemplateVisibility.PB,
      typeTs: IEnumDocTempStatus.EDITING
    }
  });

  const typeTv = watch('typeTv');
  const isPrivate = typeTv === IEnumTemplateVisibility.PRV;
  const selectedFile = watch('file');
  const templateStatus = watch('typeTs');

  const getStatusColor = (status) => {
    switch(status) {
      case IEnumDocTempStatus.EDITING: return 'info';
      case IEnumDocTempStatus.VALIDATING: return 'warning';
      case IEnumDocTempStatus.REJECTED: return 'error';
      default: return 'default';
    }
  };

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const templates = await fetchAllTemplate();
        const template = templates.find(t => t.id === Number(id));

        if (template) {
          setTemplateData(template);
          setValue('id', template.id);
          setValue('name', template.name);
          setValue('description', template.description);
          setValue('categoryId', template.categoryId);
          setValue('authorId', template.authorId);
          setValue('originalFileName', template.originalFileName);
          setValue('typeTl', template.typeTl || IEnumTemplateLanguage.EN);
          setValue('typeTv', template.typeTv || IEnumTemplateVisibility.PB);
          setValue('typeTs', template.typeTs || IEnumDocTempStatus.EDITING);
        } else {
          toast.error(t('Template not found'));
          router.push('/apps/template');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error(t('Error loading template'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [id, setValue, router, t]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, auths] = await Promise.all([
          fetchAll(),
          fetchAllAuthor()
        ]);
        setCategories(cats);
        setAuthors(auths);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(t('Error loading categories or authors'));
      }
    };

    loadData();
  }, [t]);

  const handlePreviewClick = () => {
    if (templateData) {
      const currentFormData = watch();
      const previewData: CategoryTemplateType = {
        ...templateData,
        ...currentFormData,
        file: currentFormData.file || undefined
      };

      setPreviewTemplate(previewData);
      setPreviewDialogOpen(true);
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.checked ? IEnumTemplateVisibility.PRV : IEnumTemplateVisibility.PB;
    setValue('typeTv', newType, { shouldValidate: true });
  };

  const updateTemplateMutation = useMutation(updateTemplate, {
    onSuccess: () => {
      toast.success(t('Template updated successfully'));
      router.push('/apps/template');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error(t('Failed to update template'));

      if (id) {
        const fetchTemplateData = async () => {
          const templates = await fetchAllTemplate();
          const template = templates.find(t => t.id === Number(id));
          if (template) setTemplateData(template);
        };
        fetchTemplateData();
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file);
      setValue('originalFileName', file.name);

      setTemplateData(prev => prev ? {
        ...prev,
        originalFileName: file.name,
        file: file
      } : null);
    }
  };

  const onSubmit = (data: CategoryTemplateType) => {
    const formData = new FormData();

    formData.append('id', data.id?.toString() || '');
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId?.toString() || '');
    formData.append('authorId', data.authorId?.toString() || '');
    formData.append('typeTl', data.typeTl || IEnumTemplateLanguage.EN);
    formData.append('typeTv', data.typeTv || IEnumTemplateVisibility.PB);
    formData.append('typeTs', data.typeTs || IEnumDocTempStatus.EDITING);
    formData.append('domain', data.domain?.toString() || 'default-domain' );

    if (data.file) {
      formData.append('file', data.file);
      formData.append('originalFileName', data.file.name);
    } else if (templateData?.originalFileName) {
      formData.append('originalFileName', templateData.originalFileName);
      formData.append('preserveFile', 'true');
    }

    updateTemplateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {t('Update Template')}
        </Typography>
        <Box>
          <Chip
            label={t(watch('typeTs'))}
            color={getStatusColor(templateStatus)}
            sx={{ mr: 2 }}
          />
          <Chip
            icon={<Icon icon={isPrivate ? 'mdi:lock' : 'mdi:earth'} />}
            label={t(isPrivate ? 'Private' : 'Public')}
            color={isPrivate ? 'default' : 'success'}
          />
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardHeader
                title={t('Basic Information')}
                avatar={<Icon icon="mdi:file-document-outline" />}
              />
              <Divider />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: t('Name is required') }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('Name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('Description')}
                        multiline
                        rows={4}
                        error={Boolean(errors.description)}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </FormControl>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="category-label">{t('Category')}</InputLabel>
                      <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: t('Category is required') }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="category-label"
                            label={t('Category')}
                            error={Boolean(errors.categoryId)}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.categoryId && (
                        <FormHelperText error>{errors.categoryId.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="author-label">{t('Author')}</InputLabel>
                      <Controller
                        name="authorId"
                        control={control}
                        rules={{ required: t('Author is required') }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="author-label"
                            label={t('Author')}
                            error={Boolean(errors.authorId)}
                          >
                            {authors.map((author) => (
                              <MenuItem key={author.id} value={author.id}>
                                {author.firstname} {author.lastname}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.authorId && (
                        <FormHelperText error>{errors.authorId.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title={t('Template File')}
                avatar={<Icon icon="mdi:file-upload-outline" />}
              />
              <Divider />
              <CardContent>
                {templateData?.originalFileName || selectedFile ? (
                  <Paper elevation={0} variant="outlined" sx={{ mb: 4, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Icon icon="mdi:file-document" fontSize={40} color="primary" />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      {selectedFile?.name || templateData?.originalFileName}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Icon icon="mdi:eye" />}
                      onClick={handlePreviewClick}
                    >
                      {t('Preview')}
                    </Button>
                  </Paper>
                ) : (
                  <Alert severity="info" sx={{ mb: 4 }}>
                    {t('No file available for preview')}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Icon icon="mdi:upload" />}
                      sx={{ mb: 1 }}
                    >
                      {t('Upload New File')}
                    </Button>
                  </label>
                  {selectedFile && (
                    <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                      {t('New file selected')}: {selectedFile.name}
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 4 }}>
              <CardHeader
                title={t('Settings')}
                avatar={<Icon icon="mdi:cog-outline" />}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      {t('Status')}
                    </Typography>
                    <FormControl fullWidth>
                      <Controller
                        name="typeTs"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            displayEmpty
                            variant="outlined"
                            IconComponent={() => null}
                          >
                            <MenuItem value={IEnumDocTempStatus.EDITING}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon
                                  icon="mdi:pencil"
                                  style={{ marginRight: 8 }}
                                />
                                {t('Editing')}
                              </Box>
                            </MenuItem>
                            <MenuItem value={IEnumDocTempStatus.VALIDATING}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon
                                  icon="mdi:check-circle-outline"
                                  style={{ marginRight: 8, color: 'warning.main' }}
                                />
                                {t('Validating')}
                              </Box>
                            </MenuItem>
                            <MenuItem value={IEnumDocTempStatus.REJECTED}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon
                                  icon="mdi:close-circle-outline"
                                  style={{ marginRight: 8, color: 'error.main' }}
                                />
                                {t('Rejected')}
                              </Box>
                            </MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      {t('Language')}
                    </Typography>
                    <FormControl fullWidth>
                      <Controller
                        name="typeTl"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            displayEmpty
                            variant="outlined"
                          >
                            {Object.values(IEnumTemplateLanguage).map((lang) => (
                              <MenuItem key={lang} value={lang}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Icon
                                    icon={{
                                      [IEnumTemplateLanguage.EN]: 'emojione:flag-for-united-kingdom',
                                      [IEnumTemplateLanguage.FR]: 'emojione:flag-for-france',
                                      [IEnumTemplateLanguage.AR]: 'emojione:flag-for-saudi-arabia',
                                      [IEnumTemplateLanguage.DE]: 'emojione:flag-for-germany',
                                      [IEnumTemplateLanguage.SPA]: 'emojione:flag-for-spain',
                                      [IEnumTemplateLanguage.ITA]: 'emojione:flag-for-italy',
                                    }[lang] || 'emojione:flag-for-world'}
                                    width={24}
                                    height={24}
                                  />
                                  <Typography>{t(lang)}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 16px',
                      border: '1px solid',
                      borderRadius: 2,
                      color: '#33303cde',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon
                        icon={isPrivate ? 'mdi:lock-outline' : 'mdi:lock-open-outline'}
                        style={{ fontSize: 20, color: 'text.secondary' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary' }}
                      >
                        {t('Private')}
                      </Typography>
                    </Box>
                    <Controller
                      name="typeTv"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={isPrivate}
                          onChange={handleSwitchChange}
                          sx={{
                            '& .MuiSwitch-track': {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              opacity: 1,
                            },
                            '& .MuiSwitch-thumb': {
                              backgroundColor: '#fff',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </FormControl>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={updateTemplateMutation.isLoading}
                startIcon={updateTemplateMutation.isLoading ?
                  <CircularProgress size={20} /> :
                  <Icon icon="mdi:content-save" />
                }
                size="large"
                fullWidth
              >
                {t('Update Template')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/apps/template')}
                startIcon={<Icon icon="mdi:arrow-left" />}
                fullWidth
              >
                {t('Back to Templates')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {previewTemplate && (
        <TemplatePreviewDialog
          open={previewDialogOpen}
          onCloseClick={() => {
            setPreviewDialogOpen(false);
            setPreviewTemplate(null);
          }}
          templatePreview={previewTemplate}
        />
      )}
    </Box>
  );
};

export default UpdateTemplate;
