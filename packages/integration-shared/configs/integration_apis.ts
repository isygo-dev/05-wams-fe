import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_INTEGRATION: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
    apiUrl_INTEGRATION = 'https://integration.dev.prm.novobit.eu'

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
    apiUrl_INTEGRATION = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
    apiUrl_INTEGRATION = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
    apiUrl_INTEGRATION = 'http://127.0.0.1:40415'

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
    apiUrl_INTEGRATION = 'https://integration.dev.prm.novobit.eu'

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
} else {
    apiUrl_INTEGRATION = 'https://integration.dev.prm.novobit.eu'

    // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/integration`
}

const integrationApiUrls = {
    apiUrl_INTEGRATION,

    // Flow apis
    apiUrl_INTEGRATION_Flow_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/flow',
    apiUrl_INTEGRATION_Flow_Count_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/flow/count',
    apiUrl_INTEGRATION_Flow_FileCreate_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/flow/file',
    apiUrl_INTEGRATION_Flow_FileUpdate_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/flow/file',
    apiUrl_INTEGRATION_Flow_FileDownload_EndPoint:
        apiUrl_INTEGRATION + api_version + '/private/integration/flow/file/download',

    // Order apis
    apiUrl_INTEGRATION_Order_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/order',
    apiUrl_INTEGRATION_Order_Count_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/order/count',
    apiUrl_INTEGRATION_Order_FileCreate_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/order/file',
    apiUrl_INTEGRATION_Order_FileUpdate_EndPoint: apiUrl_INTEGRATION + api_version + '/private/integration/order/file',
    apiUrl_INTEGRATION_Order_FileDownload_EndPoint:
        apiUrl_INTEGRATION + api_version + '/private/integration/order/file/download',
    apiUrl_INTEGRATION_Order_FileUpload_EndPoint:
        apiUrl_INTEGRATION + api_version + '/private/integration/order/file/upload'
}

export default integrationApiUrls
