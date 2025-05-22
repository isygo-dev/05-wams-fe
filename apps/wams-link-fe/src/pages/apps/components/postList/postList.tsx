import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useMutation, useQueryClient } from 'react-query'
import Button from '@mui/material/Button'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Icon from 'template-shared/@core/components/icon'
import { CommentType, PostType } from 'link-shared/@core/types/link/PostTypes'
import linkApiUrls from 'link-shared/configs/link_apis'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import Avatar from '@mui/material/Avatar'
import Moment from 'react-moment'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'
import Comments from '../comments'
import PostDialogue from '../dialogue'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
import { useInView } from 'react-intersection-observer'
import { isTimeAfterHours } from 'template-shared/@core/api/helper'
import PostApis from 'link-shared/@core/api/link/post'
import { MiniAccountChatType } from 'ims-shared/@core/types/ims/accountTypes'

function PostList({ user, contactsAccount, posts }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [editButton, setEditButton] = useState<boolean>(false)
  const [editDataPost, setEditDataPost] = useState<PostType>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [openImage, setOpenImage] = useState(false)
  const [showListLikedPost, setShowListLikedPost] = useState<string[]>([])
  const [showComments, setShowComments] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [pageCurrent, setPageCurrent] = useState<number>(1)
  const [scrollTrigger, isInView] = useInView()
  const getPostList = async () => {
    setLoading(true)
    const apiPosts = await PostApis(t).getPosts(pageCurrent, 5)
    if (apiPosts?.length > 0) {
      const listOldPosts: PostType[] = queryClient.getQueryData('posts') || []
      apiPosts?.forEach((data: PostType) => {
        listOldPosts.push(data)
      })

      // listOldPosts = [listOldPosts, ...apiPosts]
      queryClient.setQueryData('posts', listOldPosts)
      setPageCurrent(pageCurrent + 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isInView) {
      getPostList()
    }
  }, [isInView])

  const handleTypographyCommentClick = (post: PostType) => {
    post.showComments = !post.showComments
    setShowComments(true)
    const cachedData: PostType[] = queryClient.getQueryData('posts') || []
    const index = cachedData.findIndex(obj => obj.id === post.id)
    cachedData[index] = post
    queryClient.setQueryData('posts', cachedData)
  }

  const getExtension = fileName => {
    if (!fileName || typeof fileName !== 'string') {
      return ''
    }
    const parts = fileName.split('.')

    return parts.length > 1 ? parts.pop().toLowerCase() : ''
  }

  const handleTypographyClick = (listItems: string[]) => {
    setShowListLikedPost(listItems)
    setOpen(true)
  }

  const handleEdit = (data: PostType) => {
    setEditDataPost(data)
    setEditButton(true)
  }

  const handleDelete = (data: PostType) => {
    setEditDataPost(data)
    setDeleteDialogOpen(true)
    setSelectedRowId(data.id)
  }

  const mutationDelete = useMutation({
    mutationFn: (id: number) => PostApis(t).deletePostById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: PostType[] =
          (queryClient.getQueryData('posts') as PostType[])?.filter((item: PostType) => item.id !== id) || []
        queryClient.setQueryData('posts', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleLikePost = (liked: boolean, post: PostType) => {
    post.isLike = liked
    createNewLikePost.mutate(post)
  }

  const handleDislikePost = (liked: boolean, post: PostType) => {
    post.isLike = liked
    createNewDislikePost.mutate(post)
  }

  const createNewLikePost = useMutation({
    mutationFn: (data: PostType) => PostApis(t).addPostLike(data.id, user.code, data.isLike),
    onSuccess: (res: any) => {
      if (res) {
        const cachedData: PostType[] = queryClient.getQueryData('posts') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const dislikePost = [...cachedData]
          res.showComments = cachedData.find(p => p.id === res.id).showComments
          dislikePost[index] = res
          queryClient.setQueryData('posts', dislikePost)
        }
      }
    }
  })

  const createNewDislikePost = useMutation({
    mutationFn: (data: PostType) => PostApis(t).addPostDislike(data.id, user.code, data.isLike),
    onSuccess: (res: PostType) => {
      if (res) {
        const cachedData: PostType[] = queryClient.getQueryData('posts') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const dislikePost = [...cachedData]
          res.showComments = cachedData.find(p => p.id === res.id).showComments
          dislikePost[index] = res
          queryClient.setQueryData('posts', dislikePost)
        }
      }
    }
  })

  const checkMyCode = (code: string, usersList: string[]) => {
    const myAccount = usersList?.find(c => c === code)
    if (myAccount) {
      return true
    } else return false
  }

  const getNameAccount = (code: string) => {
    const nameAccount = contactsAccount?.find(c => c.code === code)

    return nameAccount?.fullName
  }

  const getFunctionRole = (code: string) => {
    const nameAccount = contactsAccount?.find(c => c.code === code)

    return nameAccount?.functionRole
  }

  const handelCheckImagePath = (code: string) => {
    const profile: MiniAccountChatType = contactsAccount?.find(d => d.code === code)
    if (profile) {
      return profile.id
    } else return false
  }

  const countLikePost = (post: PostType) => {
    if (post.usersAccountCode == null || post.usersAccountCode.length == 0) {
      return null
    } else if (post.usersAccountCode.length < 1000) {
      return post.usersAccountCode.length
    } else {
      return post.usersAccountCode.length / 1000 + 'K'
    }
  }

  const countDislikePost = (post: PostType) => {
    if (post.usersAccountCodeDislike == null || post.usersAccountCodeDislike.length == 0) {
      return null
    } else if (post.usersAccountCodeDislike.length < 1000) {
      return post.usersAccountCodeDislike.length
    } else {
      return post.usersAccountCodeDislike.length / 1000 + 'K'
    }
  }

  const countComments = (comments: CommentType[]) => {
    if (comments == null || comments.length == 0) {
      return null
    } else if (comments.length < 1000) {
      return comments.length
    } else {
      return comments.length / 1000 + 'K'
    }
  }

  const countLikeComment = (comment: CommentType) => {
    if (comment.usersAccountCode == null || comment.usersAccountCode.length == 0) {
      return null
    } else if (comment.usersAccountCode.length < 1000) {
      return comment.usersAccountCode.length
    } else {
      return comment.usersAccountCode.length / 1000 + 'K'
    }
  }

  const handleClosePop = () => {
    setShowListLikedPost([])
    setOpen(false)
  }

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setOpenImage(true)
  }

  const handleCloseImage = () => {
    setOpenImage(false)
    setSelectedImage(null)
  }

  return (
    <Grid container mt={2} sx={{ maxWidth: '100%' }}>
      {posts && posts?.length > 0 ? (
        <Grid item md={12}>
          {posts?.map(post => (
            <Card key={post.id} sx={{ mt: 3 }}>
              <CardContent sx={{ pt: '10px' }}>
                <Box>
                  <Grid container spacing={3} sx={{ margin: '0' }}>
                    <Grid item md={9} sm={9} xs={9}>
                      <Box display={'flex'}>
                        <Box>
                          <Avatar
                            src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(
                              post.accountCode
                            )}`}
                            sx={{ mr: 'auto', height: 58, width: 58 }}
                          />
                        </Box>
                        <Box width={'-webkit-fill-available'} ml={2} mt={'4px'}>
                          <Typography variant={'subtitle1'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                            {getNameAccount(post.accountCode)}
                          </Typography>
                          <Typography variant={'subtitle2'} fontSize={'11px'} fontWeight={700}>
                            {getFunctionRole(post.accountCode)}
                          </Typography>
                          <Box display={'flex'} width={'100%'}>
                            <Typography
                              sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '11px', mr: 2 }}
                              lineHeight={1}
                            >
                              {t('AuditInfo.createDate')}: {<Moment format='DD-MM-YY HH:mm'>{post.createDate}</Moment>}
                            </Typography>
                            {post.updateDate && (
                              <Tooltip
                                title={
                                  <Typography sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '11px' }}>
                                    {t('AuditInfo.updateDate')}:
                                    {<Moment format='DD-MM-YY HH:mm'>{post.updateDate}</Moment>}
                                  </Typography>
                                }
                              >
                                <IconButton size='small' sx={{ pt: 0, marginTop: '-15px' }}>
                                  <Icon icon='tabler:info-circle' />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item md={3} sm={3} xs={3} sx={{ display: 'flex', justifyContent: 'right' }}>
                      {post?.isBlog && (
                        <Tooltip title={t('is_Blog')}>
                          <IconButton className={'isBlogClass'}>
                            <Icon icon='tabler:circle-letter-b-filled' />
                          </IconButton>
                        </Tooltip>
                      )}

                      {user.code === post.accountCode && isTimeAfterHours(post.createDate, 24) && (
                        <>
                          <Tooltip title={t('Edit')}>
                            <Button
                              sx={{ height: ' fit-content' }}
                              className={'btnActionLink'}
                              startIcon={<Icon icon='tabler:edit' />}
                              onClick={() => handleEdit(post)}
                            ></Button>
                          </Tooltip>
                          <Tooltip title={t('Delete')}>
                            <Button
                              sx={{ height: ' fit-content' }}
                              className={'btnActionLink'}
                              startIcon={<Icon icon='material-symbols-light:delete-outline' />}
                              onClick={() => handleDelete(post)}
                            ></Button>
                          </Tooltip>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2, mb: 2 }} />

                  <Grid>
                    <Typography
                      variant='subtitle1'
                      whiteSpace='pre-wrap'
                      sx={{
                        wordBreak: 'break-all',
                        fontWeight: '700'
                      }}
                      className={'titleLink'}
                    >
                      <a href={`/apps/view/Detail/${post.id}`}> {post.title}</a>
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      whiteSpace='pre-wrap'
                      sx={{
                        wordBreak: 'break-all'
                      }}
                    >
                      {post.talk}
                    </Typography>
                    <Box width='100%' textAlign='center' mt={3} mb={3}>
                      {post.type === 'Document' && (
                        <Box textAlign='center'>
                          {post.originalFileName}
                          <DocViewer
                            key={Date.now()}
                            pluginRenderers={DocViewerRenderers}
                            documents={[
                              {
                                uri: `${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${post.id}&version=1`,
                                fileType: getExtension(post.originalFileName)
                              }
                            ]}
                            config={{
                              header: {
                                disableHeader: true,
                                disableFileName: false,
                                retainURLParams: false
                              }
                            }}
                            style={{ height: 500 }}
                          />
                        </Box>
                      )}
                      {post.type === 'Media' && post.imagePath !== null && (
                        <Box textAlign='center'>
                          <img
                            src={`${linkApiUrls.apiUrl_LINK_Post_ImageDownload_EndPoint}/${post.id}?${Date.now()}`}
                            id={post.imagePath}
                            alt={post.title}
                            style={{ maxWidth: '100%', maxHeight: '64vh', height: '100%', cursor: 'pointer' }}
                            onClick={() =>
                              handleImageClick(`${linkApiUrls.apiUrl_LINK_Post_ImageDownload_EndPoint}/${post.id}`)
                            }
                          />
                        </Box>
                      )}
                      {post.type === 'Video' && post.imagePath === null && (
                        <Box textAlign='center'>
                          <video
                            controls
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: '4px'
                            }}
                          >
                            <source
                              src={`${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${post.id}&version=1`}
                              type={`video/${getExtension(post.originalFileName)}`}
                            />
                            Your browser does not support the video tag.
                          </video>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Divider sx={{ mt: 2, mb: 2 }} />
                </Box>

                <Grid container>
                  <Grid item md={5.5} sm={5.5} xs={5.5}>
                    <Box display='flex' alignItems='center'>
                      <Box minWidth={62}>
                        {checkMyCode(user.code, post.usersAccountCode) ? (
                          <Button
                            className={'btnActionLink'}
                            aria-controls='zoom-menu'
                            aria-haspopup='true'
                            onClick={() => handleLikePost(false, post)}
                          >
                            <Icon icon='solar:like-bold-duotone' style={{ fontSize: '1.2rem' }} />
                          </Button>
                        ) : (
                          <Tooltip title={t('Link.Like')}>
                            <Button
                              className={'btnActionLink'}
                              aria-controls='zoom-menu'
                              aria-haspopup='true'
                              onClick={() => handleLikePost(true, post)}
                            >
                              <Icon icon='solar:like-line-duotone' style={{ fontSize: '1.2rem' }} />
                            </Button>
                          </Tooltip>
                        )}

                        {countLikePost(post) != null && (
                          <Button
                            onClick={() => handleTypographyClick(post.usersAccountCode)}
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
                              {countLikePost(post)}
                            </Typography>
                          </Button>
                        )}
                      </Box>
                      <Box minWidth={30}>
                        {checkMyCode(user.code, post.usersAccountCodeDislike) ? (
                          <Tooltip title={t('Link.Dislike')}>
                            <Button
                              className={'btnActionLink'}
                              aria-controls='zoom-menu'
                              aria-haspopup='true'
                              onClick={() => handleDislikePost(false, post)}
                            >
                              <Icon icon='solar:dislike-bold' style={{ fontSize: '1.2rem' }} />
                            </Button>
                          </Tooltip>
                        ) : (
                          <Tooltip title={t('Link.Dislike')}>
                            <Button
                              className={'btnActionLink'}
                              aria-controls='zoom-menu'
                              aria-haspopup='true'
                              onClick={() => handleDislikePost(true, post)}
                            >
                              <Icon icon='solar:dislike-linear' style={{ fontSize: '1.2rem' }} />
                            </Button>
                          </Tooltip>
                        )}

                        {countDislikePost(post) != null && (
                          <Button
                            onClick={() => handleTypographyClick(post.usersAccountCodeDislike)}
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
                              {countDislikePost(post)}
                            </Typography>
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={4} xs={4}>
                    <Box display='flex' alignItems='center'>
                      <Tooltip title={t('Link.Comment')}>
                        <Button
                          className={'btnActionLink'}
                          aria-controls='zoom-menu'
                          aria-haspopup='true'
                          onClick={() => handleTypographyCommentClick(post)}
                        >
                          <Icon icon='basil:comment-outline' style={{ fontSize: '1.2rem' }} />
                        </Button>
                      </Tooltip>

                      {countComments(post.comments) != null && (
                        <Button
                          className={'btnActionLink'}
                          sx={{
                            color: 'gray',
                            fontSize: 'small',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleTypographyCommentClick(post)}
                        >
                          {countComments(post.comments)}
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2.5} sm={2.5} xs={2.5} textAlign={'right'} pr={5}>
                    <Tooltip title={t('Link.Share')}>
                      <Button
                        className={'btnActionLink'}
                        aria-controls='zoom-menu'
                        aria-haspopup='true'
                        startIcon={<Icon icon='fluent:share-48-regular' />}
                      ></Button>
                    </Tooltip>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Comments
                      post={post}
                      countLikeComment={countLikeComment}
                      user={user}
                      getFunctionRole={getFunctionRole}
                      handelCheckImagePath={handelCheckImagePath}
                      checkMyCode={checkMyCode}
                      getNameAccount={getNameAccount}
                      handleTypographyClick={handleTypographyClick}
                      showComments={showComments}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Button sx={{ visibility: 'hidden' }} ref={scrollTrigger} onClick={getPostList}>
            <Typography variant={'subtitle1'}> {loading ? 'Loading...' : 'See more'}</Typography>
          </Button>
          {deleteDialogOpen && (
            <DeleteCommonDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              selectedRowId={selectedRowId}
              item='Post'
              onDelete={onDelete}
            />
          )}

          <Dialog open={openImage} maxWidth={'xl'} sx={{ minWidth: '25vw' }} onClose={handleCloseImage}>
            <DialogTitle textAlign={'right'}>
              <Tooltip title={t('Close')}>
                <IconButton onClick={handleCloseImage}>
                  <Icon icon={'tabler:x'} />
                </IconButton>
              </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ marginBottom: '10px !important' }}>
              <img src={selectedImage} alt={'imageview'} style={{ width: '100%', maxHeight: '81vh', height: '100%' }} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={open}
            onClose={handleClosePop}
            maxWidth={'lg'}
            PaperProps={{
              sx: {
                width: '300px',
                maxHeight: '400px',
                overflow: 'auto'
              }
            }}
          >
            <DialogTitle>
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>Liked by</Grid>
                <Grid item>
                  <Tooltip title={t('Close')}>
                    <IconButton onClick={handleClosePop}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </DialogTitle>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <DialogContent>
              {showListLikedPost?.map(user => (
                <Box key={user} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                  <Avatar
                    sx={{
                      width: 63,
                      height: 63
                    }}
                    src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(user)}`}
                  />
                  <Typography variant='h6' ml={3}>
                    {getNameAccount(user)}
                  </Typography>
                </Box>
              ))}
            </DialogContent>
          </Dialog>
          {editButton && (
            <PostDialogue
              isOpen={editButton}
              setIsOpen={setEditButton}
              user={user}
              defaultValues={editDataPost}
              setDefaultValue={setEditDataPost}
            />
          )}
        </Grid>
      ) : (
        <Typography>There is no data </Typography>
      )}
    </Grid>
  )
}

// @ts-ignore
export default PostList
