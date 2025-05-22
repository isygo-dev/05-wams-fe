import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import Typography from '@mui/material/Typography'
import Moment from 'react-moment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { isTimeAfterHours } from 'template-shared/@core/api/helper'
import BlogTalkApis from 'link-shared/@core/api/link/blog/talk'
import { BlogTalkType, BlogType } from 'link-shared/@core/types/link/BlogTypes'

function CommentBlog({ post, getNameAccount, handelCheckImagePath, getFunctionRole, user }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [valueAddComment, setValueAddComment] = useState('')
  const [valueAddCommentOnComment, setValueAddCommentOnComment] = useState('')

  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState<boolean>(false)
  const [selectedRowCommentId, setSelectedRowCommentId] = useState<number>(0)
  const [editDataComment, setEditDataComment] = useState<BlogTalkType>(null)
  const [editButtonComment, setEditButtonComment] = useState<boolean>(false)
  const [showAddComment, setShowAddComment] = useState<boolean>(false)
  const [commentOnCommentData, setCommentOnCommentData] = useState<BlogTalkType>()
  const { data: blogTalk, isLoading: isLoadingBlogTalk } = useQuery(
    `blogTalk`,
    () => post.id && BlogTalkApis(t).getBlogTalksByBlogId(post.id)
  )

  const [valueCommentChange, setValueCommentChange] = useState('')

  const handleEditComment = (data: any) => {
    setCommentOnCommentData(null)
    setEditDataComment(data)
    setValueCommentChange(data.text)
    setEditButtonComment(true)
    setValueAddCommentOnComment('')
    setCommentOnCommentData(null)
    setShowAddComment(!showAddComment)
  }

  const handleAddComment = (commentData: BlogTalkType, item: boolean) => {
    setShowAddComment(!item)
    setValueAddCommentOnComment('')
    setEditDataComment(null)
    setValueCommentChange('')
    setEditButtonComment(false)
    if (item) {
      setCommentOnCommentData(commentData)
    } else {
      setCommentOnCommentData(null)
    }
  }

  const handleDeleteComment = (data: any) => {
    setEditDataComment(data)
    setValueCommentChange(data.text)
    setDeleteCommentDialogOpen(true)
    setSelectedRowCommentId(data.id)
    setShowAddComment(false)
    setValueAddCommentOnComment('')
    setEditButtonComment(false)
  }

  const handleSaveEditComment = (item: boolean) => {
    if (item) {
      if (valueCommentChange.trim().length > 0) {
        editDataComment.text = valueCommentChange
        editDataComment.updatedBy = user.fullName
        updateBlogTalkMutation.mutate(editDataComment)
      }
    } else {
      setEditDataComment(null)
      setValueCommentChange('')
      setEditButtonComment(false)
    }
  }

  const handleSaveAddComment = () => {
    if (valueAddComment.trim().length > 0) {
      const blogTalk: BlogTalkType = {
        accountCode: user.code,
        text: valueAddComment,
        blogId: post.id,
        parent: null,
        createDate: new Date(),
        createdBy: user.code
      }
      createNewBlogTalk.mutate(blogTalk)
    }
  }

  const handleSaveAddCommentOnComment = (commentId: number) => {
    if (valueAddCommentOnComment.trim().length > 0) {
      const blogTalk: BlogTalkType = {
        accountCode: user.code,
        text: valueAddCommentOnComment,
        blogId: post.id,
        parent: commentId,
        createDate: Date.now(),
        updateDate: Date.now(),
        createdBy: user.code,
        updatedBy: user.code
      }
      createNewBlogTalk.mutate(blogTalk)
    }
  }

  const handleCancelAddCommentOnComment = () => {
    setShowAddComment(false)
    setValueAddCommentOnComment('')
    setCommentOnCommentData(null)
  }

  const createNewBlogTalk = useMutation({
    mutationFn: (blogTalk: BlogTalkType) => BlogTalkApis(t).addBlogTalk(blogTalk),
    onSuccess: (res: any) => {
      const cachedData: BlogTalkType[] = queryClient.getQueryData('blogTalk') || []
      const updatedData = [...cachedData, res]
      queryClient.setQueryData('blogTalk', updatedData)
      handleCancelAddCommentOnComment()
      setValueAddComment('')
    }
  })

  const updateBlogTalkMutation = useMutation({
    mutationFn: (params: BlogTalkType) => BlogTalkApis(t).updateBlogTalk(params),
    onSuccess: async (res: BlogTalkType) => {
      const cachedPost: BlogTalkType[] = queryClient.getQueryData('blogTalk') || []
      const index = cachedPost.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedPost = [...cachedPost]
        updatedPost[index] = res
        queryClient.setQueryData('blogTalk', updatedPost)
      }
      setEditDataComment(null)
      setValueCommentChange('')
      setEditButtonComment(false)
    }
  })

  const handleChangeValueComment = (data: string) => {
    setValueAddComment(data)
  }

  const handleChangeValueCommentOnComment = (data: string) => {
    setValueAddCommentOnComment(data)
  }

  const mutationDeleteBlogTalk = useMutation({
    mutationFn: (id: number) => BlogTalkApis(t).deleteBlogTalkById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteCommentDialogOpen(false)
        const updatedItems: BlogType[] =
          (queryClient.getQueryData('blogTalk') as BlogType[])?.filter((item: BlogType) => item.id !== id) || []
        queryClient.setQueryData('blogTalk', updatedItems)
      }
    }
  })

  function onDeleteComment(id: number) {
    mutationDeleteBlogTalk.mutate(id)
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item md={12} mt={3} width={'100%'}>
          {!isLoadingBlogTalk && blogTalk && (
            <>
              {blogTalk?.map((comment: BlogTalkType) => (
                <Box key={comment.id} sx={{ padding: 2, margin: 3 }}>
                  <Grid container item>
                    <Grid item md={1} sm={1.25} xs={1.25}>
                      <Avatar
                        src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(
                          comment?.accountCode
                        )}`}
                        sx={{ mr: 2.5, height: 45, width: 45, marginTop: 3 }}
                      />
                    </Grid>
                    <Grid item md={11} sm={10.75} xs={10.75}>
                      <Box sx={{ backgroundColor: '#dddddd78', borderRadius: '6px', padding: '10px' }}>
                        <Grid container spacing={3}>
                          <Grid item md={10} sm={10} xs={10}>
                            <Box width={'-webkit-fill-available'} ml={2} mt={'4px'}>
                              <Typography variant={'subtitle1'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                                {getNameAccount(comment.accountCode)} :
                              </Typography>

                              <Typography variant={'subtitle2'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                                {getFunctionRole(comment.accountCode)}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item md={8} display={'flex'}>
                                  <Typography
                                    sx={{
                                      display: 'flex',
                                      color: 'rgb(153, 156, 166)',
                                      fontSize: '11px',
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
                                            fontSize: '11px'
                                          }}
                                        >
                                          {t('AuditInfo.updateDate')}:
                                          {<Moment format='DD-MM-YY HH:mm'>{comment.updateDate}</Moment>}
                                        </Typography>
                                      }
                                    >
                                      <IconButton size='small' sx={{ pt: 0, marginTop: '-5px' }}>
                                        <Icon icon='tabler:info-circle' />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                          {!editButtonComment && (
                            <Grid item md={2} sm={2} xs={2} justifyContent={'right'} display={'flex'}>
                              {/* Action buttons for comment */}
                              <Tooltip title={t('Link.Comment')}>
                                <Button
                                  sx={{ height: 'fit-content' }}
                                  className={'btnActionLink'}
                                  startIcon={<Icon icon='basil:comment-outline' />}
                                  onClick={() => handleAddComment(comment, showAddComment)}
                                />
                              </Tooltip>
                              {user?.code === comment?.accountCode && isTimeAfterHours(comment.createDate, 24) ? (
                                <>
                                  <Tooltip title={t('Edit')}>
                                    <Button
                                      sx={{ height: ' fit-content' }}
                                      className={'btnActionLink'}
                                      startIcon={<Icon icon='tabler:edit' />}
                                      onClick={() => handleEditComment(comment)}
                                    ></Button>
                                  </Tooltip>
                                  <Tooltip title={t('Delete')}>
                                    <Button
                                      sx={{ height: ' fit-content' }}
                                      className={'btnActionLink'}
                                      startIcon={<Icon icon='material-symbols-light:delete-outline' />}
                                      onClick={() => handleDeleteComment(comment)}
                                    ></Button>
                                  </Tooltip>
                                </>
                              ) : null}
                            </Grid>
                          )}
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
                                <Button
                                  onClick={() => handleSaveEditComment(true)}
                                  sx={{ mt: 2, mr: 2, fontSize: '10px' /* , textTransform: 'capitalize' */ }}
                                  variant={'contained'}
                                  className={'btnActionLink'}
                                >
                                  {t('Update')}
                                </Button>
                                <Button
                                  onClick={() => handleSaveEditComment(false)}
                                  sx={{ mt: 2, fontSize: '10px' /* , textTransform: 'capitalize' */ }}
                                  variant={'outlined'}
                                  className={'btnActionLink'}
                                >
                                  {t('Cancel')}
                                </Button>
                              </div>
                            ) : (
                              <Typography sx={{ display: 'flex', padding: 2 }}>{comment.text}</Typography>
                            )}

                            {commentOnCommentData && commentOnCommentData.id === comment.id && (
                              <Box
                                sx={{
                                  backgroundColor: '#dddddd78',
                                  borderRadius: '6px',
                                  padding: '8px',
                                  marginLeft: '15px',
                                  marginTop: '15px'
                                }}
                              >
                                <TextField
                                  fullWidth
                                  type='input'
                                  color='secondary'
                                  size='small'
                                  label={t('Link.Add_your_comment')}
                                  value={valueAddCommentOnComment}
                                  onChange={e => handleChangeValueCommentOnComment(e.target.value)}
                                  minRows={2}
                                  multiline
                                  placeholder={t('Link.Add_your_comment')}
                                  InputProps={{
                                    endAdornment: (
                                      <>
                                        <Tooltip title={t('Link.Send')}>
                                          <IconButton
                                            onClick={() => handleSaveAddCommentOnComment(comment.id)}
                                            size={'small'}
                                          >
                                            <Icon icon={'tabler:send-2'} />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('Cancel')}>
                                          <IconButton onClick={handleCancelAddCommentOnComment} size={'small'}>
                                            <Icon icon='tabler:circle-x-filled' />
                                          </IconButton>
                                        </Tooltip>
                                      </>
                                    )
                                  }}
                                />
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </>
          )}
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: '13px', paddingRight: '18px', paddingLeft: '17px' }} spacing={1}>
        <Grid item md={1.22} xs={1.22} sm={1.22}>
          <Avatar
            src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(user?.code)}`}
            sx={{ mr: 2.5, height: 45, width: 45 }}
          />
        </Grid>
        <Grid item md={10.77} sm={10.77} xs={10.77} pl={0}>
          <TextField
            fullWidth
            type='input'
            color='secondary'
            size='small'
            label={t('Link.Add_your_comment')}
            value={valueAddComment}
            onChange={e => handleChangeValueComment(e.target.value)}
            minRows={2}
            multiline
            placeholder={t('Link.Add_your_comment')}
            InputProps={{
              endAdornment: (
                <Tooltip title={t('Link.Send')}>
                  <IconButton onClick={handleSaveAddComment} size={'small'}>
                    <Icon icon={'tabler:send-2'} />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
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

export default CommentBlog
