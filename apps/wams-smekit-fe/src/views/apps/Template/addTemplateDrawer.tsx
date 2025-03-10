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
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    path: yup.string().required("Path is required"),
    fileName: yup.string().required("File name is required"),
    categoryId: yup.number().required("Category is required"),
    typeTs: yup.string().required("Status type is required"),
    typeTv: yup.string().required("Visibility type is required"),
    typeTl: yup.string().required("Language type is required")
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CategoryTemplateType>({
    defaultValues: categoryTemplate,
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const {data: domainList, isFetched: isFetchedDomains} = useQuery('domains', DomainApis(t).getDomains)

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

  const updateTemplateMutation = useMutation({
    mutationFn: (data: CategoryTemplateType) => updateTemplate(data),
    onSuccess: (res: CategoryTemplateType) => {
      if (res) {
        const cachedData: CategoryTemplateType[] = queryClient.getQueryData('categoryTemplate') || [];
        const index = cachedData.findIndex(obj => obj.id === res.id);
        if (index !== -1) {
          const updatedData = [...cachedData];
          updatedData[index] = res;
          queryClient.setQueryData('categoryTemplate', updatedData);
        }
        toast.success("Template updated successfully");
        handleClose();
      }
    }
  });

  const addTemplateMutation = useMutation({
    mutationFn: (data: CategoryTemplateType) => addTemplate(data),
    onSuccess: (res: CategoryTemplateType) => {
      if (res) {
        const cachedData = (queryClient.getQueryData('categoryTemplate') as any[]) || [];
        const updatedData = [...cachedData];
        updatedData.push(res);
        queryClient.setQueryData('categoryTemplate', updatedData);
        toast.success("Template added successfully");
        handleClose();
      }
    }
  });

  const onSubmit = (data: CategoryTemplateType) => {
    console.log('Données envoyées au backend :', data);
    const categoryData = categories?.find(c => c.id === data.categoryId);
    const authordata = authors?.find(a => a.id === data.authorId);
    data.category = categoryData
    data.author = authordata
    console.log("Données soumises :", data);  // Vérifie si authorId est valide

    if (data.id) {
      updateTemplateMutation.mutate(data);
    } else {
      addTemplateMutation.mutate(data);
    }
  };


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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="path"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="Path"
                  placeholder="Enter path"
                  error={Boolean(errors.path)}
                  helperText={errors.path?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="fileName"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="File Name"
                  placeholder="Enter file name"
                  error={Boolean(errors.fileName)}
                  helperText={errors.fileName?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="authorId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="author"
                  size="small"
                  error={Boolean(errors.author)}
                  helperText={errors.author ? errors.author.message : ''}
                >
                  {authors.map((author) => (
                    <MenuItem key={author.id} value={author.id}>
                      {author.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Catégorie"
                  size="small"
                  error={Boolean(errors.category)}
                  helperText={errors.category ? errors.category.message : ''}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
