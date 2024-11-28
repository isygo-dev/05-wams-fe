import React, {useState} from 'react'
import {Box, Button, Card, CardContent, CardMedia} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import imsApiUrls from "ims-shared/configs/ims_apis"
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'template-shared/@core/components/icon'
import {useQuery, useQueryClient} from 'react-query'
import {PostType} from 'link-shared/@core/types/link/PostTypes'
import {useRouter} from 'next/router'
import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import PostApis from "link-shared/@core/api/link/post";

const LeftColumn = ({handelCheckImagePath, user, hideAvatar}) => {
  const {t} = useTranslation()
  const {data: blogs, isLoading: isLoadingDataBlogs} = useQuery(`blogs`, () => PostApis(t).getPostBlogByPage(0, 5))
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const theme = useTheme()
  const [pageCurrent, setPageCurrent] = useState<number>(0)
  const queryClient = useQueryClient()
  const getBlogDetail = (blog: PostType) => {
    router.push(`/apps/view/Detail/${blog.id}`)
  }

  const getBlogsList = async () => {
    setLoading(true)

    let itemPage: number
    if (blogs?.length >= 5) {
      itemPage = pageCurrent + 1
    } else {
      itemPage = 0
    }

    const apiBlogs = await PostApis(t).getPostBlogByPage(itemPage, 5)

    if (apiBlogs?.length > 0) {
      const listOldBlogs: PostType[] = queryClient.getQueryData('blogs') || []

      const newList = [...listOldBlogs, ...apiBlogs]
      queryClient.setQueryData('blogs', newList)
      setPageCurrent(pageCurrent + 1)
    }

    setLoading(false)
  }

  const renderBlog = () => {
    if (blogs && blogs?.length > 0) {
      return blogs.map((blog, index) => (
        <Typography
          sx={{
            mb: '0.1rem',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {color: theme.palette.primary.main}
          }}
          key={index}
          onClick={() => getBlogDetail(blog)}
        >
          {blog.title}
        </Typography>
      ))
    }
  }

  return (
    <>
      {!hideAvatar && (
        <Card>
          <CardMedia sx={{height: '75px', backgroundColor: 'rgb(128,113,144, 0.24)'}} image=''/>
          <CardContent sx={{pt: 0, mt: -10}}>
            <Avatar
              src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(user?.code)}`}
              sx={{height: 80, width: 80, margin: 'auto'}}
            />
            <Box sx={{textAlign: 'center', mt: 2}}>
              <Typography variant={'subtitle1'}>
                <strong>{user?.fullName}</strong>
              </Typography>
              <Typography variant={'subtitle1'}>{user?.functionRole}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card sx={{pt: 0, mt: 4}}>
        <CardHeader title={t('Blogs')} sx={{pb: '0.5rem'}}/>
        <CardContent sx={{pb: 0}}>{!isLoadingDataBlogs && renderBlog()}</CardContent>

        <Button onClick={getBlogsList} size={'small'} sx={{float: 'right'}} className={'transformIcon'}>
          <Typography variant={'subtitle1'}>
            {loading ? (
              t('Loading')
            ) : (
              <Tooltip title={t('See_more')}>
                <Icon icon='material-symbols:arrows-more-down-rounded'/>
              </Tooltip>
            )}
          </Typography>
        </Button>
      </Card>
    </>
  )
}

export default LeftColumn
