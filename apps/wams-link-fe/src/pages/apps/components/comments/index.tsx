import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import imsApiUrls from "ims-shared/configs/ims_apis"
import Typography from '@mui/material/Typography'
import Moment from 'react-moment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {CommentType, PostType} from 'link-shared/@core/types/link/PostTypes'
import {useMutation, useQueryClient} from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {Divider} from '@mui/material'
import {isTimeAfterHours} from 'template-shared/@core/api/helper'
import PostApis from "link-shared/@core/api/link/post";

function Comments({
                    post,
                    getNameAccount,
                    handelCheckImagePath,
                    getFunctionRole,
                    checkMyCode,
                    handleTypographyClick,
                    countLikeComment,
                    user,
                    showComments
                  }) {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [valueAddComment, setValueAddComment] = useState('')
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState<boolean>(false)
  const [selectedRowCommentId, setSelectedRowCommentId] = useState<number>(0)
  const [editDataComment, setEditDataComment] = useState<CommentType>(null)
  const [editButtonComment, setEditButtonComment] = useState<boolean>(false)
  const [valueCommentChange, setValueCommentChange] = useState('')
  const handleEditComment = (data: CommentType) => {
    data.hideBtn = true
    setEditDataComment(data)
    setValueCommentChange(data.text)
    setEditButtonComment(true)
  }

  const handleDeleteComment = (data: CommentType) => {
    setEditDataComment(data)
    setValueCommentChange(data.text)
    setDeleteCommentDialogOpen(true)
    setSelectedRowCommentId(data.id)
  }

  const handleSaveEditComment = () => {
    editDataComment.text = valueCommentChange
    editDataComment.updatedBy = user.fullName
    updateCommentMutation.mutate(editDataComment)
  }

  const handleSaveAddComment = () => {
    const comment: CommentType = {
      accountCode: user.code,
      text: valueAddComment,
      postId: post.id
    }
    createNewComment.mutate(comment)
  }

  const createNewComment = useMutation({
    mutationFn: (params: CommentType) => PostApis(t).addPostComment(params),
    onSuccess: (res: CommentType) => {
      setValueAddComment('')
      const cachedData: PostType[] = queryClient.getQueryData('posts') || []
      const index = cachedData.findIndex(obj => obj.id === res.postId)
      if (index !== -1) {
        const updatedComment = [...cachedData]
        const cachedDataPost = cachedData.find(p => p.id === res.postId)
        if (!cachedDataPost.comments) {
          cachedDataPost.comments = []
        }
        cachedDataPost.showComments = true
        cachedDataPost.comments = [res, ...cachedDataPost.comments]

        updatedComment[index] = cachedDataPost
        queryClient.setQueryData('posts', updatedComment)
      }
    }
  })

  const updateCommentMutation = useMutation({
    mutationFn: (params: CommentType) => PostApis(t).updatePostComment(params),
    onSuccess: async (res: CommentType) => {
      res.updateDate = new Date()
      res.hideBtn = false

      const cachedData: PostType[] = queryClient.getQueryData('posts') || []
      const index = cachedData.findIndex(obj => obj.id === res.postId)
      const dataPost = cachedData.find(p => p.id === res.postId)
      if (index > -1) {
        const indexComment = dataPost.comments?.findIndex(obj => obj.id === res.id)
        if (indexComment > -1) {
          cachedData[index].comments[indexComment] = res
          queryClient.setQueryData('posts', cachedData)
          setEditButtonComment(false)
          setEditDataComment(null)
          setValueCommentChange('')
        }
      }
    }
  })

  const handleChangeValueComment = (data: string) => {
    setValueAddComment(data)
  }

  const handleLikeComment = (liked: boolean, comment: CommentType) => {
    if (!liked) {
      createNewDislikeComment.mutate(comment)
    } else {
      createNewLikeComment.mutate(comment)
    }
  }

  const createNewLikeComment = useMutation({
    mutationFn: (data: CommentType) => PostApis(t).addPostCommentLike(data.id, user.code),
    onSuccess: (res: CommentType) => {
      if (res) {
        const cachedData: PostType[] = queryClient.getQueryData('posts') || []
        const postEditComment: PostType = cachedData?.find(p => p.id === res.postId)

        const index = postEditComment.comments.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const likePost: PostType = {...postEditComment}
          likePost.comments[index] = res

          const indexPost = cachedData.findIndex(obj => obj.id === res.postId)
          if (indexPost !== -1) {
            const newCachedData = [...cachedData]
            newCachedData[indexPost] = likePost
            queryClient.setQueryData('posts', newCachedData)
          }
        }
      }
    }
  })

  const createNewDislikeComment = useMutation({
    mutationFn: (data: CommentType) => PostApis(t).addPostCommentDislike(data.id, user.code),
    onSuccess: (res: CommentType) => {
      if (res) {
        const cachedData: PostType[] = queryClient.getQueryData('posts') || []
        const postEditComment: PostType = cachedData?.find(p => p.id === res.postId)

        const index = postEditComment.comments.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const dislikePost: PostType = {...postEditComment}
          dislikePost.comments[index] = res

          const indexPost = cachedData.findIndex(obj => obj.id === res.postId)
          if (indexPost !== -1) {
            const newCachedData = [...cachedData]
            newCachedData[indexPost] = dislikePost
            queryClient.setQueryData('posts', newCachedData)
          }
        }
      }
    }
  })

  const mutationDeleteComment = useMutation({
    mutationFn: (id: number) => PostApis(t).deletePostCommentById(id),
    onSuccess: (id: number) => {
      const updateItem: PostType = (queryClient.getQueryData('posts') as PostType[])?.find(
        d => d.id === editDataComment.postId
      )

      const newListComment = updateItem.comments?.filter(c => c.id !== id)
      updateItem.comments = newListComment

      const cachedPost: PostType[] = queryClient.getQueryData('posts') || []
      const index = cachedPost.findIndex(obj => obj.id === updateItem.id)
      if (index !== -1) {
        const updatedPost = [...cachedPost]
        updatedPost[index] = updateItem
        queryClient.setQueryData('posts', updatedPost)
      }
      setValueCommentChange('')
      setEditDataComment(null)
      setDeleteCommentDialogOpen(false)
    }
  })

  function onDeleteComment(id: number) {
    mutationDeleteComment.mutate(id)
  }

  return (
    <Box>
      <Grid container sx={{marginTop: '13px'}} spacing={3}>
        <Grid item md={1.22} xs={2} sm={1.5}>
          <Avatar
            className={'avatarComment'}
            src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(user?.code)}`}
            sx={{mr: 2.5}}
          />
        </Grid>
        <Grid item md={10.77} sm={10} xs={10} pl={0}>
          <TextField
            fullWidth
            type='input'
            color='secondary'
            size='small'
            label={t('Link.Add_your_comment')}
            value={valueAddComment}
            onChange={e => handleChangeValueComment(e.target.value)}
            placeholder={t('Link.Add_your_comment')}
            InputProps={{
              endAdornment: (
                <Tooltip title={t('Link.Send')}>
                  <IconButton onClick={handleSaveAddComment} size={'small'}>
                    <Icon icon={'tabler:send-2'}/>
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={12} mt={3} width={'100%'}>
          {showComments &&
            post.showComments &&
            post.comments?.map((comment: CommentType) => (
              <Box key={comment.id} sx={{padding: 2, margin: 3}}>
                <Grid container item>
                  <Grid item md={1.25} sm={1.25} xs={1.25}>
                    <Avatar
                      src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(comment.accountCode)}`}
                      sx={{mr: 2.5, height: 45, width: 45, marginTop: 3}}
                    />
                  </Grid>
                  <Grid item md={10.75} sm={10.75} xs={10.75}>
                    <Box sx={{backgroundColor: '#dddddd78', borderRadius: '6px', padding: '10px'}}>
                      <Grid container spacing={3}>
                        <Grid item md={10} sm={10} xs={10}>
                          <Grid item md={11} sm={11} xs={11}>
                            <Box width={'-webkit-fill-available'} ml={2} mt={'4px'}>
                              <Typography variant={'subtitle1'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                                {getNameAccount(comment.accountCode)}
                              </Typography>
                              <Typography variant={'subtitle2'} fontSize={'13px'} fontWeight={700}>
                                {getFunctionRole(comment.accountCode)}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item md={8} display={'flex'}>
                                  <Typography
                                    sx={{
                                      display: 'flex',
                                      color: 'rgb(153, 156, 166)',
                                      fontSize: '12px',
                                      mr: 2
                                    }}
                                    lineHeight={1}
                                  >
                                    {t('AuditInfo.createDate')}:
                                    {<Moment format='DD-MM-YY HH:mm'>{comment.createDate}</Moment>}
                                  </Typography>
                                  {comment.updateDate && (
                                    <Tooltip
                                      title={
                                        <Typography
                                          sx={{
                                            display: 'flex',
                                            color: 'rgb(153, 156, 166)',
                                            fontSize: '12px'
                                          }}
                                        >
                                          {t('AuditInfo.updateDate')}:
                                          {<Moment format='DD-MM-YY HH:mm'>{comment.updateDate}</Moment>}
                                        </Typography>
                                      }
                                    >
                                      <IconButton size='small' sx={{pt: 0, marginTop: '-5px'}}>
                                        <Icon icon='tabler:info-circle'/>
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                        {user.code === comment.accountCode && isTimeAfterHours(comment.createDate, 24) ? (
                          comment.hideBtn ? null : (
                            <Grid item md={2} sm={2} xs={2} justifyContent={'right'} display={'flex'}>
                              <Tooltip title={t('Edit')}>
                                <Button
                                  sx={{height: ' fit-content'}}
                                  className={'btnActionLink'}
                                  startIcon={<Icon icon='tabler:edit'/>}
                                  onClick={() => handleEditComment(comment)}
                                ></Button>
                              </Tooltip>
                              <Tooltip title={t('Delete')}>
                                <Button
                                  sx={{height: ' fit-content'}}
                                  className={'btnActionLink'}
                                  startIcon={<Icon icon='material-symbols-light:delete-outline'/>}
                                  onClick={() => handleDeleteComment(comment)}
                                ></Button>
                              </Tooltip>
                            </Grid>
                          )
                        ) : null}
                      </Grid>

                      <Grid container>
                        <Grid item md={12}>
                          {editButtonComment && editDataComment.id === comment.id ? (
                            <div>
                              <TextField
                                fullWidth
                                id='form-props-read-only-input'
                                value={valueCommentChange}
                                size={'small'}
                                variant={'standard'}
                                onChange={e => setValueCommentChange(e.target.value)}
                              />
                              <Tooltip title={t('Update')}>
                                <Button
                                  onClick={handleSaveEditComment}
                                  sx={{mt: 2, fontSize: '10px' /* , textTransform: 'capitalize' */}}
                                  variant={'contained'}
                                  className={'btnActionLink'}
                                >
                                  {t('Update')}
                                </Button>
                              </Tooltip>
                            </div>
                          ) : (
                            <>
                              <Typography sx={{display: 'flex', padding: 2}}>{comment.text}</Typography>

                              <Divider/>
                              <Grid container alignItems='center' spacing={2}>
                                <Grid item md={12} sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                                  {checkMyCode(user.code, comment.usersAccountCode) ? (
                                    <Tooltip title={t('Link.Dislike')}>
                                      <Button
                                        className={'btnActionLink'}
                                        aria-controls='zoom-menu'
                                        aria-haspopup='true'
                                        onClick={() => handleLikeComment(false, comment)}
                                      >
                                        <Icon icon='solar:like-bold-duotone' style={{fontSize: '1.2rem'}}/>
                                      </Button>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title={t('Link.Like')}>
                                      <Button
                                        className={'btnActionLink'}
                                        aria-controls='zoom-menu'
                                        aria-haspopup='true'
                                        onClick={() => handleLikeComment(true, comment)}
                                      >
                                        <Icon icon='solar:like-line-duotone' style={{fontSize: '1.2rem'}}/>
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {countLikeComment(comment) > 0 && (
                                    <Button
                                      onClick={() => handleTypographyClick(comment.usersAccountCode)}
                                      className={'btnActionLink'}
                                    >
                                      <Typography
                                        sx={{
                                          color: 'gray',
                                          fontSize: 'small',
                                          fontFamily: 'Arial, sans-serif',
                                          marginLeft: '4px'
                                        }}
                                      >
                                        {countLikeComment(comment)}
                                      </Typography>
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
        </Grid>
      </Grid>

      {deleteCommentDialogOpen && (
        <DeleteCommonDialog
          open={deleteCommentDialogOpen}
          setOpen={setDeleteCommentDialogOpen}
          selectedRowId={selectedRowCommentId}
          item='Comment'
          onDelete={onDeleteComment}
        />
      )}
    </Box>
  )
}

export default Comments
