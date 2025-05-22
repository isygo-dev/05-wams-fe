import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_LINK: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_LINK = 'https://lnk.dev.wams.isygoit.eu'

  // apiUrl_LINK = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/link`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_LINK = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/link`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_LINK = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/link`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_LINK = 'http://127.0.0.1:40413'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_LINK = 'https://lnk.dev.wams.isygoit.eu'

  // apiUrl_LINK = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/link`
} else {
  apiUrl_LINK = 'https://lnk.dev.wams.isygoit.eu'
}

const linkApiUrls = {
  apiUrl_LINK,

  // Blog apis
  apiUrl_LINK_Blog_EndPoint: apiUrl_LINK + api_version + '/private/blog',
  apiUrl_LINK_Post_Blog_EndPoint: apiUrl_LINK + api_version + '/private/post/blog',
  apiUrl_LINK_Blog_Full_EndPoint: apiUrl_LINK + api_version + '/private/blog/full',
  apiUrl_LINK_Blog_Talk_EndPoint: apiUrl_LINK + api_version + '/private/blog/talk',
  apiUrl_LINK_Blog_TalkById_EndPoint: apiUrl_LINK + api_version + '/private/blog/talk/blogId',

  // Post apis
  apiUrl_LINK_Post_EndPoint: apiUrl_LINK + api_version + '/private/post',
  apiUrl_LINK_Post_Count_EndPoint: apiUrl_LINK + api_version + '/private/post/count',
  apiUrl_LINK_Post_Image_EndPoint: apiUrl_LINK + api_version + '/private/post/image',
  apiUrl_LINK_Post_Comment_EndPoint: apiUrl_LINK + api_version + '/private/comment',
  apiUrl_LINK_Post_UserLiked_EndPoint: apiUrl_LINK + api_version + '/private/post/like',
  apiUrl_LINK_Post_UserDisliked_EndPoint: apiUrl_LINK + api_version + '/private/post/dislike',
  apiUrl_LINK_Post_CommentUserLiked_EndPoint: apiUrl_LINK + api_version + '/private/comment/like',
  apiUrl_LINK_Post_CommentUserDisliked_EndPoint: apiUrl_LINK + api_version + '/private/comment/dislike',
  apiUrl_LINK_Post_ImageDownload_EndPoint: apiUrl_LINK + api_version + '/private/post/image/download',
  apiUrl_LINK_Post_ImageUpload_EndPoint: apiUrl_LINK + api_version + '/private/post/image/upload',
  apiUrl_LINK_Post_FileCreate_EndPoint: apiUrl_LINK + api_version + '/private/post/file',
  apiUrl_LINK_Post_FileUpdate_EndPoint: apiUrl_LINK + api_version + '/private/post/file',
  apiUrl_LINK_Post_FileDownload_EndPoint: apiUrl_LINK + api_version + '/private/post/file/download',
  apiUrl_LINK_Post_FileUpload_EndPoint: apiUrl_LINK + api_version + '/private/post/file/upload'
}

export default linkApiUrls
