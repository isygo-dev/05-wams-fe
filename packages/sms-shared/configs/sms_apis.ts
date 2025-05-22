import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_SMS: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_SMS = 'https://sms.dev.wams.isygoit.eu'

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_SMS = 'http://127.0.0.1:40400'

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_SMS = 'https://sms.dev.wams.isygoit.eu'

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
} else {
  apiUrl_SMS = 'https://sms.dev.wams.isygoit.eu'

  // apiUrl_SMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/sms`
}

const smsApiUrls = {
  apiUrl_SMS,
  apiUrl_SMS_StorageConfig_EndPoint: apiUrl_SMS + api_version + '/private/storage/config'
}

export default smsApiUrls
