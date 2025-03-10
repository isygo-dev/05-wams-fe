import React, { useEffect } from 'react';
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "react-query";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import Icon from "template-shared/@core/components/icon";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { AuthorType } from "../../../types/author";
import { addAuthor, updateAuthor } from "../../../api/author";


const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}));

const AddAuthorDrawer = ({ author, showDialogue, setShowDialogue }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    url: yup.string().required("Url is required"),
    description: yup.string().required("Description is required"),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthorType>({
    defaultValues: author,
    mode: 'all',
    resolver: yupResolver(schema)
  });


  const onSubmit = (data: AuthorType) => {
    console.log(" Data sent to API:", data);
    if (data.id) {
      updateAuthorMutation.mutate(data);
    } else {
      addAuthorMutation.mutate(data);
    }
  };

  const addAuthorMutation = useMutation({
    mutationFn: (data: AuthorType) => addAuthor(data),
    onSuccess: (res: AuthorType) => {
      if (res) {
        queryClient.invalidateQueries('AuthorType');
        queryClient.setQueryData('authorList', (oldData: AuthorType[] = []) => [...oldData, res]);
        toast.success("Author added successfully");
        handleClose();
      }
    }
  });



  const updateAuthorMutation = useMutation({
    mutationFn: (data: AuthorType) => updateAuthor(data),
    onSuccess: (res: AuthorType) => {
      if (res) {
        queryClient.invalidateQueries('AuthorType');
        const cachedData: AuthorType[] = queryClient.getQueryData('authorList') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedData = [...cachedData]
          updatedData[index] = res
          queryClient.setQueryData('authorList', updatedData)
        }
        toast.success("Author updated successfully");
        handleClose();


      }
    }
  })

  const handleClose = () => {
    setShowDialogue(false);
    reset();
  };

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
        <Typography variant='h6'>{t(author?.id ? 'Update' : 'Add')}</Typography>
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
              name='url'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
                  {...field}
                  label='url'
                  placeholder='Enter url'
                  error={Boolean(errors.url)}
                  helperText={errors.url?.message}
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
  );
};

export default AddAuthorDrawer;
