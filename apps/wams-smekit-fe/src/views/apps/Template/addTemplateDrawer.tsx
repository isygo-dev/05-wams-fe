import React, { useEffect, useState } from 'react';
import {
  CategoryTemplateType,
  IEnumDocTempStatus,
  IEnumTemplateLanguage,
  IEnumTemplateVisibility
} from "../../../types/categoryTemplateType";
import Drawer from "@mui/material/Drawer";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Icon from "template-shared/@core/components/icon";
import Box, { BoxProps } from "@mui/material/Box";
import { addTemplate, updateTemplate } from "../../../api/template";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { fetchAll } from "../../../api/category";
import { CategoryType } from "../../../types/category";
import { AuthorType } from "../../../types/author";
import { fetchAllAuthor } from "../../../api/author";
import { checkPermission } from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import { DomainType } from "ims-shared/@core/types/ims/domainTypes";
import DomainApis from "ims-shared/@core/api/ims/domain";
import AccountApis from "ims-shared/@core/api/ims/account";

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))
const FormSection = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(4)
}))
const SectionTitle = styled(Typography)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  fontSize: '0.875rem'
}))
const FileUploadContainer = styled(Box)<BoxProps>(({ theme }) => ({
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const AddTemplateDrawer = ({ categoryTemplate, showDialogue, setShowDialogue }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const schema = yup.object().shape({
    name: yup.string().required(t("Name is required")),
    domain: yup.string().required(t("Domain is required")),
    description: yup.string().required(t("Description is required")),
    categoryId: yup.number().required(t("Category is required")),
    authorId: yup.number().required(t("Author is required")),

    typeTs: yup.string().required(t("Status type is required")),
    typeTv: yup.string().required(t("Visibility type is required")),
    typeTl: yup.string().required(t("Language type is required")),
    version: yup.string().notRequired(),
    file: yup.mixed().when('id', {
      is: (id: number) => !id,
      then: (schema) => schema.required(t("File is required")),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.checked ? IEnumTemplateVisibility.PRV : IEnumTemplateVisibility.PB;
    setValue('typeTv', newType, { shouldValidate: true });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setValue('file', files[0]);
    }
    trigger('file');
  };

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    watch,
    control,
    formState: { errors }
  } = useForm<CategoryTemplateType>({
    defaultValues:{ ...categoryTemplate,
    version: categoryTemplate?.version || '1'},
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const { data: domainList } = useQuery('domains', DomainApis(t).getDomains);
  const typeTv = watch('typeTv');
  const isPrivate = typeTv === IEnumTemplateVisibility.PRV;
  const AccountApi = AccountApis(t);
  const { data: user } = useQuery('userData', AccountApi.getAccountProfile);

  useEffect(() => {
    if (user?.domain) {
      setValue("domain", user.domain);
    }
  }, [user]);

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await fetchAll();
      setCategories(categoriesData);
    };
    const loadAuthors = async () => {
      const authorsData = await fetchAllAuthor();
      setAuthors(authorsData);
    };
    loadCategories();
    loadAuthors();
  }, []);

  const handleClose = () => {
    setShowDialogue(false);
    reset();
  };

  const addTemplateMutation = useMutation({
    mutationFn: (formData: FormData) => addTemplate(formData),
    onSuccess: (newTemplate) => {
      const author = authors.find(a => a.id === newTemplate.authorId);
      const category = categories.find(c => c.id === newTemplate.categoryId);

      const completeTemplate = {
        ...newTemplate,
        author,
        category
      };

      queryClient.setQueryData('categoryTemplate', (old: CategoryTemplateType[] = []) => [
        ...old,
        completeTemplate
      ]);

      queryClient.invalidateQueries('categoryTemplate');

      toast.success(t('Template added successfully'));
      handleClose();
    },
    onError: (error) => {
      toast.error( t('Failed to add template'));
    }
  });
  const updateTemplateMutation = useMutation({
    mutationFn: (formData: FormData) => updateTemplate(formData),
    onSuccess: (updatedTemplate) => {
      const author = authors.find(a => a.id === updatedTemplate.authorId);
      const category = categories.find(c => c.id === updatedTemplate.categoryId);

      queryClient.setQueryData('categoryTemplate', (old: CategoryTemplateType[] = []) =>
        old.map(item =>
          item.id === updatedTemplate.id
            ? { ...updatedTemplate, author, category }
            : item
        )
      );

      toast.success("Template updated successfully");
      handleClose();
    }
  });

  const onSubmit = async (data: CategoryTemplateType) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId.toString());
      formData.append('typeTs', data.typeTs);
      formData.append('typeTv', data.typeTv);
      formData.append('typeTl', data.typeTl);
      formData.append('version', data.id ? (data.version || '1') : '1');
      if (data.file) {
        formData.append('file', data.file);
      }

      if (data.authorId) {
        formData.append('authorId', data.authorId.toString());
      }
      if (data.domain) {
        formData.append('domain', data.domain);
      }

      if (data.id) {
        await updateTemplateMutation.mutateAsync(formData);
      } else {
        if (!data.file) {
          throw new Error(t("File is required for new templates"));
        }
        await addTemplateMutation.mutateAsync(formData);
      }

    } catch (error) {
      toast.error(error.message || t('Failed to submit template'));
    }
  };
  const isEditMode = Boolean(categoryTemplate?.id);

  return (
    <Drawer
      open={showDialogue}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">{t(categoryTemplate?.id ? 'Update' : 'Add')}</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            <SectionTitle>{t('Template File')}</SectionTitle>
            <FormControl fullWidth>
              <input
                type='file'
                name='file'
                id='file'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor='file'>
                <FileUploadContainer>
                  <Icon icon='tabler:upload' fontSize="2rem" color="primary" />
                  <Typography variant='body1' sx={{ mt: 2, fontWeight: 500 }}>
                    {t('Upload Template File')}
                  </Typography>
                  <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
                    {file ? file.name : isEditMode ? t('Upload new file (optional)') : t('Click to browse (.pdf, .doc, .docx)')}
                  </Typography>
                  {file && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setValue('file', null);
                      }}
                    >
                      {t('Remove')}
                    </Button>
                  )}
                </FileUploadContainer>
              </label>
              {errors.file && (
                <FormHelperText error>{errors.file.message}</FormHelperText>
              )}
            </FormControl>
          </FormSection>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="version"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label={t('Version')}
                  placeholder="1"
                  error={Boolean(errors.version)}
                  helperText={errors.version?.message}
                  sx={{ display: 'none' }}
                />
              )}
            />
          </FormControl>


          <FormControl fullWidth sx={{ mb: 4 }} size="small">
            <InputLabel id="domain-select-label">{t('Domain.Domain')}</InputLabel>
            <Controller
              name="domain"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="domain-select-label"
                  label={t('Domain.Domain')}
                  {...field}
                  value={field.value || ''}
                  error={Boolean(errors.domain)}
                  disabled={!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)}
                >
                  <MenuItem value="">
                    <em>{t('None')}</em>
                  </MenuItem>

                  {/* Domaine utilisateur si absent de la liste */}
                  {watch("domain") && !domainList?.some(d => d.name === watch("domain")) && (
                    <MenuItem value={watch("domain")}>{watch("domain")}</MenuItem>
                  )}

                  {/* Domaines disponibles */}
                  {domainList?.map((domain: DomainType) => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.domain?.message}
              </FormHelperText>
            )}
          </FormControl>





          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label={t('Name')}
                  placeholder={t('Enter name')}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  multiline
                  rows={4}
                  size='small'
                  {...field}
                  label={t('Description')}
                  placeholder={t('Enter description')}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }} size="small">
            <InputLabel id="author-select-label">{t('Author')}</InputLabel>
            <Controller
              name="authorId"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="author-select-label"
                  label={t('Author')}
                  error={Boolean(errors.authorId)}
                  {...field}
                >
                  <MenuItem value="" disabled>
                    {t('Select an author')}
                  </MenuItem>
                  {authors.map((author) => (
                    <MenuItem key={author.id} value={author.id}>
                      {`${author.firstname} ${author.lastname || ''}`.trim()}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.authorId && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.authorId?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }} size="small">
            <InputLabel id="category-select-label">{t('Category')}</InputLabel>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="category-select-label"
                  {...field}
                  label={t('Category')}
                  size="small"
                  value={field.value || ''}
                >
                  <MenuItem value="" disabled>
                    {t('Select a category')}
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.categoryId && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.categoryId?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }} size="small">
            <InputLabel id="status-select-label">{t('Status')}</InputLabel>
            <Controller
              name="typeTs"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="status-select-label"
                  {...field}
                  label={t('Status')}
                  size="small"
                  error={Boolean(errors.typeTs)}
                >
                  {Object.values(IEnumDocTempStatus).map((type) => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.typeTs && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.typeTs?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }} size="small">
            <InputLabel id="language-select-label">{t('Language')}</InputLabel>
            <Controller
              name="typeTl"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="language-select-label"
                  {...field}
                  label={t('Language')}
                  size="small"
                  error={Boolean(errors.typeTl)}
                >
                  {Object.values(IEnumTemplateLanguage).map((type) => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.typeTl && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.typeTl?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Controller
                  name="typeTv"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={isPrivate}
                      onChange={handleSwitchChange}
                      color={isPrivate ? 'success' : 'error'}
                    />
                  )}
                />
              }
              label={t('Private')}
              labelPlacement="start"
              sx={{
                justifyContent: 'space-between',
                marginLeft: 0,
                marginRight: 0
              }}
            />
          </FormControl>

          {/* Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" sx={{ mr: 3 }}>
              {t('Submit')}
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddTemplateDrawer
