import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'
let apiUrl_KMS: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_KMS = 'https://kms.dev.wams.isygoit.eu'

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_KMS = 'http://127.0.0.1:40403'

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_KMS = 'https://kms.dev.wams.isygoit.eu'

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
} else {
  apiUrl_KMS = 'https://kms.dev.wams.isygoit.eu'

  // apiUrl_KMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/kms`
}

const kmsApiUrls = {
  apiUrl_KMS,
  apiUrl_KMS_ConfigDigest_EndPoint: apiUrl_KMS + api_version + '/private/config/digest',
  apiUrl_KMS_ConfigPassword_EndPoint: apiUrl_KMS + api_version + '/private/config/password',
  apiUrl_KMS_ConfigPeb_EndPoint: apiUrl_KMS + api_version + '/private/config/peb',
  apiUrl_KMS_ConfigToken_EndPoint: apiUrl_KMS + api_version + '/private/config/token',
  apiUrl_KMS_ChangePassword_EndPoint: apiUrl_KMS + api_version + '/private/password/change-password',
  apiUrl_KMS_Codification_EndPoint: apiUrl_KMS + api_version + '/private/code'
}

export default kmsApiUrls
