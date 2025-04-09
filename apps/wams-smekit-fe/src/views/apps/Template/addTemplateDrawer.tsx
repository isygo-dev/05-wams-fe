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
import {useMutation, useQuery, useQueryClient} from "react-query";
import toast from "react-hot-toast";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { fetchAll } from "../../../api/category";
import { CategoryType } from "../../../types/category";
import {AuthorType} from "../../../types/author";
import {fetchAllAuthor} from "../../../api/author";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import DomainApis from "ims-shared/@core/api/ims/domain";


const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}));

const AddTemplateDrawer = ({ categoryTemplate, showDialogue, setShowDialogue }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null)
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    categoryId: yup.number().required("Category is required"),
    typeTs: yup.string().required("Status type is required"),
    typeTv: yup.string().required("Visibility type is required"),
    typeTl: yup.string().required("Language type is required"),
    file: yup.mixed().when('id', {
      is: (id: number) => !id,
      then: (schema) => schema.required("File is required"),
      otherwise: (schema) => schema.notRequired()
    })
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      setValue('file', files[0])
    }
    trigger('file')
  }

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors }
  } = useForm<CategoryTemplateType>({
    defaultValues: categoryTemplate,
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const {data: domainList} = useQuery('domains', DomainApis(t).getDomains)

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

      toast.success(t('Template added successfully'));
      handleClose();
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

      toast.success("Template updated successfully")
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
        formData.append('id', data.id.toString());
        await updateTemplateMutation.mutateAsync(formData);
      } else {
        if (!data.file) {
          throw new Error("File is required for new templates");
        }
        await addTemplateMutation.mutateAsync(formData);
      }

    } catch (error) {
      toast.error(error.message || t('Failed to submit template'));
    }
  }

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

          <FormControl fullWidth sx={{mb: 4}}>
            <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer'}}>
              <Button
                color='primary'
                variant='outlined'
                component='span'
                sx={{width: '100%'}}
                startIcon={<Icon icon='tabler:upload'/>}
              >
                {t('Template.Template')}
              </Button>
              <input
                type='file'
                name='file'
                id='file'
                style={{display: 'none'}}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <Typography variant='body2' sx={{mt: 1}}>
                {file ? file.name : t('No file selected')}
              </Typography>
            </label>
            {errors.file && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.file.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  disabled={checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domainList?.map((domain: DomainType) => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="Name"
                  placeholder="Enter name"
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
                  size="small"
                  {...field}
                  label="Description"
                  placeholder="Enter description"
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </FormControl>

          {/*<FormControl fullWidth sx={{ mb: 4 }}>*/}
          {/*  <Controller*/}
          {/*    name="fileName"*/}
          {/*    control={control}*/}
          {/*    render={({ field }) => (*/}
          {/*      <TextField*/}
          {/*        size="small"*/}
          {/*        {...field}*/}
          {/*        label="File Name"*/}
          {/*        placeholder="Enter file name"*/}
          {/*        error={Boolean(errors.fileName)}*/}
          {/*        helperText={errors.fileName?.message}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</FormControl>*/}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Author</InputLabel>
            <Controller
              name="authorId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Author"
                  value={field.value || ''}
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

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Category</InputLabel>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Category"
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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="typeTs"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  size="small"
                  error={Boolean(errors.typeTs)}
                  helperText={errors.typeTs ? errors.typeTs.message : ''}
                >
                  {Object.values(IEnumDocTempStatus).map((type) => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="typeTv"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Visibility"
                  size="small"
                  error={Boolean(errors.typeTv)}
                  helperText={errors.typeTv ? errors.typeTv.message : ''}
                >
                  {Object.values(IEnumTemplateVisibility).map((type) => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="typeTl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Language"
                  size="small"
                  error={Boolean(errors.typeTl)}
                  helperText={errors.typeTl ? errors.typeTl.message : ''}
                >
                  {Object.values(IEnumTemplateLanguage).map((type) => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>

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
  );
};

export default AddTemplateDrawer;
