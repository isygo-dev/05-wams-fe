import {useMutation, useQueryClient} from 'react-query'
import {Controller, useForm} from 'react-hook-form'
import React, {useState} from 'react'
import Icon from 'template-shared/@core/components/icon'
import CustomChip from 'template-shared/@core/components/mui/chip'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField
} from '@mui/material'
import {useTranslation} from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import {CloseIcon} from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'
import Tooltip from '@mui/material/Tooltip'
import linkApiUrls from "link-shared/configs/link_apis"
import Checkbox from '@mui/material/Checkbox'
import PostApis from "link-shared/@core/api/link/post";
import {PostType} from "link-shared/@core/types/link/PostTypes";
import {BlogType} from "link-shared/@core/types/link/BlogTypes";

const PostDialogue = ({isOpen, setIsOpen, user, defaultValues, setDefaultValue}) => {
  console.log('defaultValues', defaultValues)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [isChecked, setIsChecked] = useState<boolean>(defaultValues?.isBlog ? defaultValues.isBlog : false)

  const {t} = useTranslation()
  const [pathChange, setPathChange] = useState(
    defaultValues?.imagePath !== null ? `${linkApiUrls.apiUrl_LINK_Post_ImageDownload_EndPoint}/${defaultValues?.id}` : ''
  )
  const [docName] = useState(defaultValues?.originalFileName !== null ? defaultValues?.originalFileName : '')
  const [pathChangeVideo, setPathChangeVideo] = useState(
    defaultValues?.type === 'Video'
      ? `${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${defaultValues.id}&version=1`
      : ''
  )

  const [type, setType] = useState<string>(defaultValues?.type !== null ? defaultValues?.type : '')
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType('Document')
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const deletePicture = () => {
    setDefaultValue('imagePath', '')
    setPathChange('')
    setPathChangeVideo('')
    setSelectedFile(null)
  }

  const handleClosePop = () => {
    setIsOpen(false)
    setSelectedFile(undefined)
    setSelectedFile(undefined)
    setDefaultValue(null)
    setPathChange('')
    setPathChangeVideo('')
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType('Media')
    const file = event.target.files?.[0]
    setSelectedFile(file)
    setPathChange('')
    setPathChangeVideo('')
  }

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType('Video')
    const file = event.target.files?.[0]
    setSelectedFile(file)
    setPathChange('')
    setPathChangeVideo('')
  }

  const queryClient = useQueryClient()

  const {handleSubmit, control} = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const updatePostMediaMutation = useMutation({
    mutationFn: (params: FormData) => PostApis(t).updatePostImage(params),
    onSuccess: async (res: PostType) => {
      console.log('res', res)
      const cachedPost: PostType[] = queryClient.getQueryData('posts') || []
      const index = cachedPost.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedPost = [...cachedPost]
        updatedPost[index] = res
        queryClient.setQueryData('posts', updatedPost)
      }
      const cachedBlogs: BlogType[] = queryClient.getQueryData('blogs') || []

      if (res.isBlog) {
        const indexBlog = cachedBlogs.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedBlogs = [...cachedBlogs]
          updatedBlogs[indexBlog] = {
            id: res.id,
            title: res.title,
            description: res.talk,
            updatedBy: res.updatedBy,
            accountCode: res.accountCode,
            domain: res.domain
          }
          queryClient.setQueryData('blogs', updatedBlogs)
        }
      }
      handleClosePop()
    }
  })

  const updatePostDocumentMutation = useMutation({
    mutationFn: (params: FormData) => PostApis(t).updatePostDocument(defaultValues.id, params),
    onSuccess: async (res: PostType) => {
      console.log('res', res)
      const cachedPost: PostType[] = queryClient.getQueryData('posts') || []
      const index = cachedPost.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedPost = [...cachedPost]
        updatedPost[index] = res
        queryClient.setQueryData('posts', updatedPost)
      }
      const cachedBlogs: BlogType[] = queryClient.getQueryData('blogs') || []

      if (res.isBlog) {
        const indexBlog = cachedBlogs.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedBlogs = [...cachedBlogs]
          updatedBlogs[indexBlog] = {
            id: res.id,
            title: res.title,
            description: res.talk,
            updatedBy: res.updatedBy,
            accountCode: res.accountCode,
            domain: res.domain
          }
          queryClient.setQueryData('blogs', updatedBlogs)
        }
      }
      handleClosePop()
    }
  })

  const onSubmit = (data: PostType) => {
    if (data.id) {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('file', selectedFile)
        formData.append('fileName', selectedFile.name)
      }

      if (pathChange?.trim().length > 0 && selectedFile == undefined) {
        formData.append('imagePath', pathChange)
      }

      if (pathChangeVideo?.trim().length > 0 && selectedFile == undefined) {
        formData.append('originalFileName', defaultValues.originalFileName)
        formData.append('extension', defaultValues.extension)
      }
      formData.append('title', data.title)
      formData.append('talk', data.talk)
      formData.append('accountCode', data.accountCode)
      formData.append('domain', data.domain)
      formData.append('type', type)
      formData.append('id', data.id.toString())

      formData.append('isBlog', isChecked.toString())

      if (type == 'Document' || type == 'Video') {
        updatePostDocumentMutation.mutate(formData)
      } else {
        updatePostMediaMutation.mutate(formData)
      }
    } else {
      const formData = new FormData()
      console.log('selectedFile', selectedFile)
      if (selectedFile) {
        formData.append('file', selectedFile)
        formData.append('fileName', selectedFile.name)
      }
      formData.append('talk', data.talk)
      formData.append('title', data.title)
      formData.append('createdBy', user.fullName)
      formData.append('accountCode', user.code)
      formData.append('domain', user.domain)
      formData.append('type', type)

      formData.append('isBlog', isChecked.toString())

      if (type == 'Document' || type == 'Video') {
        createNewPostDocument.mutate(formData)
      } else {
        createNewPostMedia.mutate(formData)
      }
    }
  }

  const createNewPostDocument = useMutation({
    mutationFn: (params: FormData) => PostApis(t).addPostDocument(params),
    onSuccess: (res: PostType) => {
      const cachedData: PostType[] = queryClient.getQueryData('posts') || []
      const updatedData = [res, ...cachedData]
      queryClient.setQueryData('posts', updatedData)
      const cachedDataBlog: BlogType[] = queryClient.getQueryData('blogs') || []
      if (res.isBlog && cachedDataBlog?.length < 5) {
        const newBlogs = {
          id: res.id,
          title: res.title,
          description: res.talk,
          updatedBy: res.updatedBy,
          accountCode: res.accountCode,
          domain: res.domain
        }
        const updatedDataBlog = [...cachedDataBlog, newBlogs]
        queryClient.setQueryData('blogs', updatedDataBlog)
      }
      handleClosePop()
    }
  })

  const createNewPostMedia = useMutation({
    mutationFn: (params: FormData) => PostApis(t).addPostImage(params),
    onSuccess: (res: PostType) => {
      const cachedData: PostType[] = queryClient.getQueryData('posts') || []

      const updatedData = [res, ...cachedData]
      queryClient.setQueryData('posts', updatedData)
      const cachedDataBlog: BlogType[] = queryClient.getQueryData('blogs') || []
      if (res.isBlog && cachedDataBlog?.length < 5) {
        const newBlogs = {
          id: res.id,
          title: res.title,
          description: res.talk,
          updatedBy: res.updatedBy,
          accountCode: res.accountCode,
          domain: res.domain
        }
        const updatedDataBlog = [...cachedDataBlog, newBlogs]
        queryClient.setQueryData('blogs', updatedDataBlog)
      }
      handleClosePop()
    }
  })

  return (
    <Dialog
      className={'scroll-card'}
      open={isOpen}
      fullWidth
      maxWidth={'md'}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClosePop()
        }
      }}
    >
      <DialogTitle>{defaultValues?.id ? <>{t('Link.Update_Post')} </> : <>{t('Link.Add_Post')} </>}</DialogTitle>
      <Tooltip title={t('Close')}>
        <IconButton
          onClick={handleClosePop}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            m: 1
          }}
        >
          <CloseIcon/>
        </IconButton>
      </Tooltip>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{pt: '0 !important'}}>
          {defaultValues?.isBlog ? (
            <CustomChip
              sx={{
                marginBottom: '10px',
                float: 'inline-end'
              }}
              rounded
              skin='light'
              label={t('is_Blog')}
              color={'info'}
            />
          ) : (
            <FormControlLabel
              control={<Checkbox checked={isChecked} onChange={e => setIsChecked(e.target.checked)}/>}
              label='Is a blog'
              sx={{
                width: '100%',
                marginLeft: 'inherit',
                marginRight: 'inherit',
                justifyContent: 'right'
              }}
            />
          )}

          <Controller
            name='title'
            control={control}
            render={({field: {value, onChange}}) => (
              <TextField
                fullWidth
                placeholder={'Title'}
                sx={{mb: 2}}
                type='input'
                size='small'
                value={value}
                onChange={onChange}
                minRows={1}
              />
            )}
          />

          <Controller
            name='talk'
            control={control}
            render={({field: {value, onChange}}) => (
              <TextField
                fullWidth
                placeholder={'Text'}
                sx={{mb: 2}}
                type='input'
                size='small'
                value={value}
                onChange={onChange}
                minRows={5}
                multiline
              />
            )}
          />

          {selectedFile && type === 'Media' && (
            <Box display={'block'}>
              <Box textAlign={'right'}>
                <Tooltip title={t('Delete')}>
                  <IconButton onClick={() => deletePicture()}>
                    <Icon icon={'tabler:x'} color={'primary'}/>
                  </IconButton>
                </Tooltip>
              </Box>
              <Box textAlign={'center'}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt={t('Link.Selected_File_Preview')}
                  style={{
                    width: 'auto',
                    borderRadius: '4px',
                    maxWidth: '100%'
                  }}
                />
              </Box>
            </Box>
          )}
          {selectedFile && type === 'Video' && (
            <Box display='block'>
              <Box textAlign='right'>
                <Tooltip title={t('Delete')}>
                  <IconButton onClick={deletePicture}>
                    <Icon icon='tabler:x' color='primary'/>
                  </IconButton>
                </Tooltip>
              </Box>
              <Box textAlign='center'>
                <video
                  controls
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    borderRadius: '4px'
                  }}
                >
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type}/>
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Box>
          )}
          {type === 'Document' && selectedFile ? (
            <div style={{display: 'flex', marginBottom: '7px'}}>
              {selectedFile.name.split('.')[1] === 'pdf' && (
                <>
                  <Icon icon='tabler:file-type-pdf'/>
                  <span>{selectedFile.name}</span>
                </>
              )}

              {selectedFile.name.split('.')[1] === 'docx' && (
                <>
                  <Icon icon='tabler:file-type-docx'/>
                  <span>{selectedFile.name}</span>
                </>
              )}

              {selectedFile.name.split('.')[1] === 'pptx' && (
                <>
                  <Icon icon='tabler:file-type-ppt'/>
                  <span>{selectedFile.name}</span>
                </>
              )}
            </div>
          ) : null}
          {defaultValues?.id
            ? pathChange &&
            type == 'Media' &&
            pathChange.trim().length > 0 && (
              <Box display={'block'}>
                <Box textAlign={'right'}>
                  <Tooltip title={t('Delete')}>
                    <IconButton onClick={() => deletePicture()}>
                      <Icon icon={'tabler:x'} color={'primary'}/>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box textAlign={'center'}>
                  <img
                    src={pathChange}
                    alt={t('Link.Selected_File_Preview')}
                    style={{
                      width: 'auto',
                      borderRadius: '4px',
                      maxWidth: '100%'
                    }}
                  />
                </Box>
              </Box>
            )
            : null}

          {defaultValues?.id
            ? pathChangeVideo &&
            pathChangeVideo.trim().length > 0 && (
              <Box display={'block'}>
                <Box textAlign={'right'}>
                  <Tooltip title={t('Delete')}>
                    <IconButton onClick={() => deletePicture()}>
                      <Icon icon={'tabler:x'} color={'primary'}/>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box textAlign={'center'}>
                  <video
                    controls
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      borderRadius: '4px'
                    }}
                  >
                    <source src={pathChangeVideo}/>
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Box>
            )
            : null}

          {selectedFile == null && defaultValues?.id
            ? docName &&
            docName.trim().length > 0 && (
              <div style={{display: 'flex', marginBottom: '7px'}}>
                {docName.split('.')[1] === 'pdf' && (
                  <>
                    <Icon icon='tabler:file-type-pdf'/>
                    <span>{docName}</span>
                  </>
                )}

                {docName.split('.')[1] === 'docx' && (
                  <>
                    <Icon icon='tabler:file-type-docx'/>
                    <span>{docName}</span>
                  </>
                )}
                {docName.split('.')[1] === 'pptx' && (
                  <>
                    <Icon icon='tabler:file-type-ppt'/>
                    <span>{docName}</span>
                  </>
                )}
              </div>
            )
            : null}

          <FormControl sx={{mb: 4}}>
            <div style={{display: 'flex', gap: '10px'}}>
              <label htmlFor='file-media' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
                <Tooltip title='Add Media'>
                  <Button
                    color='primary'
                    component='span'
                    sx={{flexGrow: 1, justifyContent: 'center'}}
                    startIcon={<Icon icon='tabler:photo'/>}
                  ></Button>
                </Tooltip>
                <input
                  type='file'
                  name='file-media'
                  id='file-media'
                  style={{display: 'none'}}
                  accept='image/*'
                  onChange={handleMediaChange}
                />
              </label>

              <label htmlFor='file-video' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
                <Tooltip title='Add Video'>
                  <Button
                    color='primary'
                    component='span'
                    sx={{flexGrow: 1, justifyContent: 'center'}}
                    startIcon={<Icon icon='ph:video'/>}
                  ></Button>
                </Tooltip>
                <input
                  type='file'
                  name='file-video'
                  id='file-video'
                  style={{display: 'none'}}
                  accept={'video/mp4,video/x-m4v,video/*'}
                  onChange={handleVideoChange}
                />
              </label>

              <label htmlFor='file-document' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
                <Tooltip title='Add Document'>
                  <Button
                    color='primary'
                    component='span'
                    sx={{flexGrow: 1, justifyContent: 'center'}}
                    startIcon={<Icon icon='tabler:file'/>}
                  ></Button>
                </Tooltip>
                <input
                  type='file'
                  name='file-document'
                  id='file-document'
                  style={{display: 'none'}}
                  accept='application/pdf'
                  onChange={handleDocumentChange}
                />
              </label>
            </div>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Tooltip title={t('Link.Schedule')}>
            <Button startIcon={<Icon icon='lets-icons:time-light'/>}></Button>
          </Tooltip>
          <Tooltip title={t('Add')}>
            <Button variant='contained' type='submit'>
              {t('Link.Post')}
            </Button>
          </Tooltip>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PostDialogue
