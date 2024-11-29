import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_MMS: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
    apiUrl_MMS = 'https://mms.dev.wams.isygoit.eu'

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
    apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
    apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
    apiUrl_MMS = 'http://127.0.0.1:40404'

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
    apiUrl_MMS = 'https://mms.dev.wams.isygoit.eu'

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
} else {
    apiUrl_MMS = 'https://mms.dev.wams.isygoit.eu'

    // apiUrl_MMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/mms`
}

const mmsApiUrls = {
    apiUrl_MMS,
    apiUrl_MMS_MailTemplate_EndPoint: apiUrl_MMS + api_version + '/private/mail/template',
    apiUrl_MMS_MailTemplate_Count_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/count',
    apiUrl_MMS_MailTemplate_FileCreate_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/file',
    apiUrl_MMS_MailTemplate_FileUpdate_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/file',
    apiUrl_MMS_MailTemplate_FileDownload_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/file/download',
    apiUrl_MMS_MailTemplate_FileUpload_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/file/upload',
    apiUrl_MMS_MailSenderConfig_EndPoint: apiUrl_MMS + api_version + '/private/config/mail',
    apiUrl_MMS_ChatFrom_EndPoint: apiUrl_MMS + api_version + '/private/chat/from',
    apiUrl_MMS_ChatAccount_EndPoint: apiUrl_MMS + api_version + '/private/chat/account',
    apiUrl_MMS_ChatSendWithWebSocket_EndPoint: apiUrl_MMS + api_version + '/private/ws/user/send',
    apiUrl_MMS_SocketChat_EndPoint: apiUrl_MMS + '/socket/chat',
    apiUrl_MMS_templateByNames_EndPoint: apiUrl_MMS + api_version + '/private/mail/template/names',
}

export default mmsApiUrls
