import React  from 'react';
import Typography from "@mui/material/Typography";
import { useMutation,   useQueryClient } from "react-query";
import { addCategory, updateCategory } from "../../../api/category";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import Icon from "template-shared/@core/components/icon";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CategoryType, IEnumCategoryType } from "../../../types/category";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { MenuItem, Select} from "@mui/material";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddCategoryDrawer = ({category, showDialogue, setShowDialogue}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const schema = yup.object().shape({
    domain: yup.string().required("Domain is required"),
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    type: yup.string().oneOf(Object.values(IEnumCategoryType)).required("Type is required")
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryType>({
    defaultValues:  category,
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: CategoryType) => {
    if (data.id) {
      updateCategoryMutation.mutate(data);
    } else {
      addCategoryMutation.mutate(data);
    }
  }

  const addCategoryMutation = useMutation({
    mutationFn: (data: CategoryType) => addCategory(data),
    onSuccess: (res: CategoryType) => {
      if (res) {

        const cachedData = (queryClient.getQueryData('categoryList') as any[]) || []
        const updatedData = [...cachedData]
        updatedData.push(res)
        queryClient.setQueryData('categoryList', updatedData)
        toast.success("Category added successfully");
        handleClose();
      }
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryType) => updateCategory(data),
    onSuccess: (res: CategoryType) => {
      if (res) {

        const cachedData: CategoryType[] = queryClient.getQueryData('categoryList') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedData = [...cachedData]
          updatedData[index] = res
          queryClient.setQueryData('categoryList', updatedData)
        }
        toast.success("Category updated successfully");
        handleClose();


      }
    }
  })
  const handleClose = () => {
    setShowDialogue(false);
    reset();
  }


  return (

    <Drawer
      open={showDialogue}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t(category?.id ? 'Update' : 'Add')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='domain'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label='Domain'
                  placeholder='Enter domain'
                  error={Boolean(errors.domain)}
                  helperText={errors.domain?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label='Name'
                  placeholder='Enter name'
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
                  size='small'
                  {...field}
                  label='Description'
                  placeholder='Enter description'
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <Select size='small' {...field} error={Boolean(errors.type)}>
                  {Object.values(IEnumCategoryType).map(type => (
                    <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }} >
              {t('Submit')}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddCategoryDrawer;
