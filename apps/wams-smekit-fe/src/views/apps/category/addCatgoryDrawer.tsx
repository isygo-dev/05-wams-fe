import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addCategory, updateCategory, updateCategoryPicture } from '../../../api/category'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Icon from 'template-shared/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CategoryType, IEnumCategoryType } from '../../../types/category'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import {
  Autocomplete,
  Avatar,
  Chip,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import apiUrls from '../../../config/apiUrl'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import CropperCommon from 'template-shared/@core/components/cropper'
import { tagType } from '../../../types/tags'
import { fetchAlltags } from '../../../api/tag'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddCategoryDrawer = ({ category, showDialogue, setShowDialogue }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const { data: domainList } = useQuery('domains', DomainApis(t).getDomains)
  const { data: tagsList = [] } = useQuery('tags', fetchAlltags)
  const [updateImage, setUpdateImage] = useState<boolean>(false)
  const [, setPhotoFile] = useState<File>()
  const [tags, setTags] = useState<(tagType | { tagName: string; displayName: string })[]>([])
  const [inputValue, setInputValue] = useState('')
  const [currentImage] = useState<string | undefined>(undefined)

  const schema = yup.object().shape({
    domain: yup.string().required(t('Domain is required')),
    name: yup.string().required(t('Name is required')),
    description: yup.string().required(t('Description is required')),
    type: yup.string().required()
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CategoryType>({
    defaultValues: {
      ...category,
      type: category?.type || IEnumCategoryType.DISABLED
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (category?.tagName) {
      if (typeof category.tagName === 'string') {
        const tagArray = category.tagName.split(',').map(tag => ({
          tagName: tag.trim(),
          displayName: `${tag.trim()}`
        }))
        setTags(tagArray)
      } else if (Array.isArray(category.tagName)) {
        const formattedTags = category.tagName.map(tag => ({
          ...(typeof tag === 'string' ? { tagName: tag } : tag),
          displayName: `${typeof tag === 'string' ? tag : tag.tagName}`
        }))
        setTags(formattedTags)
      } else {
        setTags([])
      }
    } else {
      setTags([])
    }
  }, [category])

  const typeValue = watch('type')
  const isEnabled = typeValue === IEnumCategoryType.ENABLED

  const updatePictureMutation = useMutation({
    mutationFn: (data: { id: number; file: Blob }) => updateCategoryPicture(data),
    onSuccess: () => {
      setUpdateImage(false)
      toast.success(t('Picture updated successfully'))
      queryClient.invalidateQueries(['categoryList'])
    },
    onError: error => {
      toast.error(t('Failed to update picture'))
      console.error('Update picture error:', error)
    }
  })

  const addCategoryMutation = useMutation({
    mutationFn: (data: FormData) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categoryList'])
      toast.success(t('Category added successfully'))
      handleClose()
    },
    onError: (error: any) => {
      toast.error(error.message || t('Failed to add category'))
      console.error('Add category error:', error)
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryType) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categoryList'])
      toast.success(t('Category updated successfully'))
      handleClose()
    },
    onError: (error: any) => {
      toast.error(error.message || t('Failed to update category'))
      console.error('Update category error:', error)
    }
  })

  const onSaveImage = (newImage: Blob) => {
    if (category?.id) {
      updatePictureMutation.mutate({ id: category.id, file: newImage })
      setPhotoFile(newImage as File)
    }
  }

  const openImageEdit = () => {
    setUpdateImage(true)
  }

  const onSubmit = (data: CategoryType) => {
    if (category?.id) {
      handleUpdateCategory(data)
    } else {
      handleAddCategory(data)
    }
  }

  const handleAddCategory = async (data: CategoryType) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('type', data.type)
    formData.append('description', data.description)
    formData.append('domain', data.domain)

    if (tags.length > 0) {
      const tagNamesString = tags.map(tag => tag.tagName).join(',')
      formData.append('tagName', tagNamesString)
    }

    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }

    try {
      await addCategoryMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Error details:', error)
      toast.error(t('Failed to add category'))
    }
  }

  const handleUpdateCategory = async (data: CategoryType) => {
    const categoryData = {
      id: category.id,
      name: data.name,
      type: data.type,
      description: data.description,
      domain: data.domain,
      imagePath: selectedFile ? undefined : category?.imagePath,
      tagName: tags.map(tag => ({
        id: 'id' in tag ? tag.id : undefined,
        tagName: tag.tagName,
        createDate: 'createDate' in tag ? tag.createDate : new Date().toISOString(),
        createdBy: 'createdBy' in tag ? tag.createdBy : 'currentUser',
        updateDate: new Date().toISOString(),
        updatedBy: 'currentUser'
      }))
    }

    try {
      await updateCategoryMutation.mutateAsync(categoryData)

      if (selectedFile && category?.id) {
        updatePictureMutation.mutate({
          id: category.id,
          file: selectedFile
        })
      }
    } catch (error) {
      toast.error(t('Failed to update category'))
    }
  }

  const handleClose = () => {
    setShowDialogue(false)
    reset()
    setSelectedFile(undefined)
    setTags([])
    setInputValue('')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.checked ? IEnumCategoryType.ENABLED : IEnumCategoryType.DISABLED
    setValue('type', newType, { shouldValidate: true })
  }

  const handleHashtagChange = (event, newValue) => {
    setTags(newValue)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault()

      const tagName = inputValue.trim()

      if (tagName !== '') {
        const existingTag = tagsList.find(tag => tag.tagName.toLowerCase() === tagName.toLowerCase())

        if (existingTag) {
          if (!tags.some(tag => 'id' in tag && tag.id === existingTag.id)) {
            setTags([
              ...tags,
              {
                ...existingTag,
                displayName: existingTag.tagName
              }
            ])
          }
        } else {
          if (!tags.some(tag => tag.tagName?.toLowerCase() === tagName.toLowerCase())) {
            setTags([
              ...tags,
              {
                tagName: tagName,
                displayName: tagName
              }
            ])
          }
        }
        setInputValue('')
      }
    }
  }
  const getHashtagLabel = option => {
    return option.displayName || option.tagName
  }

  const getImageSource = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile)
    }

    return (
      currentImage ||
      (category?.id
        ? `${apiUrls.apiUrl_smekit_Category_ImageDownload_Endpoint}/${category.id}?${Date.now()}`
        : undefined)
    )
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
        <Typography variant='h6'>{t(category?.id ? 'Update Category' : 'Add Category')}</Typography>
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
          <FormControl fullWidth sx={{ mb: 4 }} size='small'>
            <InputLabel id='domain-select-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId='domain-select-label'
                  disabled={!checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE)}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  onChange={onChange}
                  value={value || ''}
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
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  size='small'
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

          {/* tags field */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Autocomplete
              multiple
              id='tags-selection'
              options={tagsList.map(tag => ({
                ...tag,
                displayName: `${tag.tagName}`
              }))}
              getOptionLabel={getHashtagLabel}
              value={tags}
              onChange={handleHashtagChange}
              inputValue={inputValue}
              onInputChange={(event, newValue) => {
                if (newValue && !newValue.startsWith('#') && event?.type === 'change') {
                  setInputValue(`${newValue}`)
                } else {
                  setInputValue(newValue)
                }
              }}
              freeSolo
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('Tags')}
                  placeholder={t('Enter tags')}
                  helperText={t('Press Enter to add a new hashtag')}
                  size='small'
                  onKeyDown={handleKeyDown}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    label={getHashtagLabel(option)}
                    {...getTagProps({ index })}
                    size='small'
                    sx={{
                      '& .MuiChip-label': {
                        color: 'primary.main',
                        fontWeight: 'medium'
                      }
                    }}
                  />
                ))
              }
              filterOptions={(options, params) => {
                const input = params.inputValue.replace('#', '').trim().toLowerCase()

                const filtered = options.filter(option => (option.tagName?.toLowerCase() || '').includes(input))

                if (input !== '' && !filtered.some(option => (option.tagName?.toLowerCase() || '') === input)) {
                  filtered.push({
                    tagName: input,
                    displayName: `${input} (nouveau)`
                  })
                }

                return filtered
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={isEnabled}
                      onChange={handleSwitchChange}
                      color={isEnabled ? 'success' : 'error'}
                    />
                  )}
                />
              }
              label={t('ENABLED')}
              labelPlacement='start'
              sx={{
                justifyContent: 'space-between',
                marginLeft: 0,
                marginRight: 0
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 5 }}>
            <Box display='flex' alignItems='center' gap={2}>
              <Avatar
                src={getImageSource()}
                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                onClick={category?.id ? openImageEdit : undefined}
              />
              <Button
                component='label'
                variant='outlined'
                startIcon={<Icon icon='tabler:upload' />}
                sx={{ width: '100%' }}
              >
                {t('Upload Photo')}
                <input type='file' hidden accept='image/*' onChange={handleFileChange} />
              </Button>
            </Box>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type='submit'
              variant='contained'
              sx={{ mr: 4 }}
              disabled={
                updatePictureMutation.isLoading || addCategoryMutation.isLoading || updateCategoryMutation.isLoading
              }
            >
              {t('Submit')}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClose}
              disabled={
                updatePictureMutation.isLoading || addCategoryMutation.isLoading || updateCategoryMutation.isLoading
              }
            >
              {t('Cancel')}
            </Button>
          </Box>
        </form>

        {category?.id && <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage} />}
      </Box>
    </Drawer>
  )
}

export default AddCategoryDrawer
