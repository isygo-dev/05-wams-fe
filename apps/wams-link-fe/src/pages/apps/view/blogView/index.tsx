import { Box, Card, CardContent, Divider, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import Avatar from '@mui/material/Avatar'
import linkApiUrls from 'link-shared/configs/link_apis'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
import CommentBlog from './commentBlog'
import BlogApis from 'link-shared/@core/api/link/blog'

const BlogView = ({ id, handelCheckImagePath, getNameAccount, getFunctionRole, user, data }) => {
  const { t } = useTranslation()
  const { data: blogDetails, isLoading: isLoadingBlogDetails } = useQuery(
    `blogDetails`,
    () => id && BlogApis(t).getBlogById(id)
  )
  const getExtension = fileName => {
    if (!fileName || typeof fileName !== 'string') {
      return ''
    }
    const parts = fileName.split('.')

    return parts.length > 1 ? parts.pop().toLowerCase() : ''
  }

  return (
    <>
      {!isLoadingBlogDetails && blogDetails ? (
        <Grid item md={12}>
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ pt: '10px' }}>
              <Box>
                <Grid container spacing={3} sx={{ margin: '0' }}>
                  <Grid item md={10} sm={10} xs={10}>
                    <Box display={'flex'}>
                      <Box>
                        <Avatar
                          src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(
                            blogDetails.accountCode
                          )}`}
                          sx={{ mr: 'auto', height: 58, width: 58 }}
                        />
                      </Box>
                      <Box width={'-webkit-fill-available'} ml={2} mt={'4px'}>
                        <Typography variant={'subtitle1'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                          {getNameAccount(blogDetails.accountCode)}
                        </Typography>
                        <Typography variant={'subtitle2'} fontSize={'13px'} fontWeight={700}>
                          {getFunctionRole(blogDetails.accountCode)}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item md={12} display={'flex'}>
                            <Typography
                              sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '11px', mr: 2 }}
                              lineHeight={1}
                            >
                              {t('AuditInfo.createDate')}:{' '}
                              {<Moment format='DD-MM-YY HH:mm'>{blogDetails.createDate}</Moment>}
                            </Typography>
                            <Tooltip
                              title={
                                <Typography sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '11px' }}>
                                  {t('AuditInfo.updateDate')}:{' '}
                                  {<Moment format='DD-MM-YY HH:mm'>{data.updateDate}</Moment>}
                                </Typography>
                              }
                            >
                              <IconButton size='small' sx={{ pt: 0, marginTop: '-5px' }}>
                                <Icon icon='tabler:info-circle' />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Grid>
                  <Typography
                    variant='subtitle1'
                    whiteSpace='pre-wrap'
                    sx={{
                      wordBreak: 'break-all'
                    }}
                  >
                    <h1>{blogDetails.title}</h1>
                  </Typography>

                  <Typography
                    variant='subtitle1'
                    whiteSpace='pre-wrap'
                    sx={{
                      wordBreak: 'break-all'
                    }}
                  >
                    {blogDetails.description}
                  </Typography>
                  <Box width='100%' textAlign='center' mt={3} mb={3}>
                    {data.type === 'Document' && (
                      <Box textAlign='center'>
                        {data.originalFileName}
                        <DocViewer
                          key={Date.now()}
                          pluginRenderers={DocViewerRenderers}
                          documents={[
                            {
                              uri: `${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${data.id}&version=1`,
                              fileType: data.extension
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
                    {data.type === 'Media' && data.imagePath !== null && (
                      <Box textAlign='center'>
                        <img
                          src={`${linkApiUrls.apiUrl_LINK_Post_ImageDownload_EndPoint}/${data.id}?${Date.now()}`}
                          id={data.imagePath}
                          alt={blogDetails.title}
                          style={{ maxWidth: '100%', maxHeight: '64vh', height: '100%', cursor: 'pointer' }}
                        />
                      </Box>
                    )}
                    {data.type === 'Video' && (
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
                            src={`${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${data.id}&version=1`}
                            type={`video/${getExtension(data.originalFileName)}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }} />

                <CommentBlog
                  post={blogDetails}
                  getNameAccount={getNameAccount}
                  handelCheckImagePath={handelCheckImagePath}
                  getFunctionRole={getFunctionRole}
                  user={user}
                ></CommentBlog>
              </Box>
              <Grid container>
                <Grid item md={5.5}>
                  <Box display='flex' alignItems='center'></Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Typography>There is no data </Typography>
      )}
    </>
  )
}

export default BlogView
