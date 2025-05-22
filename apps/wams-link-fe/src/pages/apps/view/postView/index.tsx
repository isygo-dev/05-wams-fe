import Typography from '@mui/material/Typography'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Box, Card, CardContent, Divider, Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import linkApiUrls from 'link-shared/configs/link_apis'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import Moment from 'react-moment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
import Index from '../blogView/commentBlog'
import PostApis from 'link-shared/@core/api/link/post'

const PostView = ({ id, handelCheckImagePath, getNameAccount, getFunctionRole, user }) => {
  const { t } = useTranslation()
  const { data: dataDetail, isLoading: isLoadingData } = useQuery(
    `dataDetail`,
    () => id && PostApis(t).getPostById(Number(id))
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
      {!isLoadingData && dataDetail ? (
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
                            dataDetail.accountCode
                          )}`}
                          sx={{ mr: 'auto', height: 58, width: 58 }}
                        />
                      </Box>
                      <Box width={'-webkit-fill-available'} ml={2} mt={'4px'}>
                        <Typography variant={'subtitle1'} fontSize={'13px'} fontWeight={700} lineHeight={1}>
                          {getNameAccount(dataDetail.accountCode)}
                        </Typography>
                        <Typography variant={'subtitle2'} fontSize={'13px'} fontWeight={700}>
                          {getFunctionRole(dataDetail.accountCode)}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item md={12} display={'flex'}>
                            <Typography
                              sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '12px', mr: 2 }}
                              lineHeight={1}
                            >
                              {t('AuditInfo.createDate')}:{' '}
                              {<Moment format='DD-MM-YY HH:mm'>{dataDetail.createDate}</Moment>}
                            </Typography>
                            {dataDetail.updateDate && (
                              <Tooltip
                                title={
                                  <Typography sx={{ display: 'flex', color: 'rgb(153, 156, 166)', fontSize: '12px' }}>
                                    {t('AuditInfo.updateDate')}:{' '}
                                    {<Moment format='DD-MM-YY HH:mm'>{dataDetail.updateDate}</Moment>}
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
                    <h1>{dataDetail.title}</h1>
                  </Typography>

                  <Typography
                    variant='subtitle1'
                    whiteSpace='pre-wrap'
                    sx={{
                      wordBreak: 'break-all'
                    }}
                  >
                    {dataDetail.description}
                  </Typography>
                  <Box width='100%' textAlign='center' mt={3} mb={3}>
                    {dataDetail.type === 'Document' && (
                      <Box textAlign='center'>
                        {dataDetail.originalFileName}
                        <DocViewer
                          key={Date.now()}
                          pluginRenderers={DocViewerRenderers}
                          documents={[
                            {
                              uri: `${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${dataDetail.id}&version=1`,
                              fileType: getExtension(dataDetail.originalFileName)
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
                    {dataDetail.type === 'Media' && dataDetail.imagePath !== null && (
                      <Box textAlign='center'>
                        <img
                          src={`${linkApiUrls.apiUrl_LINK_Post_ImageDownload_EndPoint}/${dataDetail.id}?${Date.now()}`}
                          id={dataDetail.imagePath}
                          alt={dataDetail.title}
                          style={{ maxWidth: '100%', maxHeight: '64vh', height: '100%', cursor: 'pointer' }}
                        />
                      </Box>
                    )}
                    {dataDetail.type === 'Video' && dataDetail.imagePath === null && (
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
                            src={`${linkApiUrls.apiUrl_LINK_Post_FileDownload_EndPoint}?id=${dataDetail.id}&version=1`}
                            type={`video/${getExtension(dataDetail.originalFileName)}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Index
                  post={dataDetail}
                  getNameAccount={getNameAccount}
                  handelCheckImagePath={handelCheckImagePath}
                  getFunctionRole={getFunctionRole}
                  user={user}
                ></Index>
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
        <Typography>There is no data 123 </Typography>
      )}
    </>
  )
}

export default PostView
