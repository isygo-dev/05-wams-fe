// index.ts or index.tsx
import 'dotenv/config' // Import and load dotenv

let apiUrl_SMEKIT: string | undefined
const api_version = '/api/v1'


console.log('process.env.NEXT_PUBLIC_PROFILE ', process.env.NEXT_PUBLIC_PROFILE)
if (process.env.NEXT_PUBLIC_PROFILE === 'docker') {
  apiUrl_SMEKIT = 'https://sms.dev.prm.novobit.eu'

} else if (process.env.NEXT_PUBLIC_PROFILE === 'production') {
  apiUrl_SMEKIT = 'https://sms.prod.prm.novobit.eu'

} else if (process.env.NEXT_PUBLIC_PROFILE === 'quality') {
  apiUrl_SMEKIT = 'https://sms.qa.prm.novobit.eu'

} else if (process.env.NEXT_PUBLIC_PROFILE === 'development') {
  apiUrl_SMEKIT = 'https://sms.dev.prm.novobit.eu'

} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_SMEKIT = 'http://127.0.0.1:40416'

} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_SMEKIT = 'https://gateway.dev.prm.novobit.eu'

} else {
  apiUrl_SMEKIT = 'https://gateway.dev.prm.novobit.eu'
}

const apiUrls = {
  apiUrl_SMEKIT,
  apiUrl_smekit_Category_StorageConfigEndpoint: apiUrl_SMEKIT + '/api/v1/private/category',
  apiUrl_smekit_Template_StorageConfigEndpoint: apiUrl_SMEKIT + '/api/v1/private/template',
  apiUrl_smekit_Author_Image_Endpoint: apiUrl_SMEKIT + '/api/v1/private/Author/image',
  apiUrl_smekit_Author_StorageConfigEndpoint: apiUrl_SMEKIT + '/api/v1/private/Author',
  apiUrl_smekit_Author_ImageDownload_Endpoint: apiUrl_SMEKIT + api_version + '/private/Author/image/download'

}

export default apiUrls
