import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'
let apiUrl_HRM: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
    apiUrl_HRM = 'https://hrm.dev.wams.isygoit.eu'

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
    apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
    apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
    apiUrl_HRM = 'http://127.0.0.1:40408'

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
    apiUrl_HRM = 'https://hrm.dev.wams.isygoit.eu'

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
} else {
    apiUrl_HRM = 'https://hrm.dev.wams.isygoit.eu'

    // apiUrl_HRM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/hrm`
}

const hrmApiUrls = {
    apiUrl_HRM,
    apiUrl_HRM_Employee_EndPoint: apiUrl_HRM + api_version + '/private/employee',
    apiUrl_HRM_Employee_CreateAccount_EndPoint: apiUrl_HRM + api_version + '/private/employee/create/account',
    apiUrl_HRM_Employee_Count_EndPoint: apiUrl_HRM + api_version + '/private/employee/count',
    apiUrl_HRM_Employee_StatisticGlobal_EndPoint: apiUrl_HRM + api_version + '/private/employee/stat/global',
    apiUrl_HRM_Employee_StatisticObject_EndPoint: apiUrl_HRM + api_version + '/private/employee/stat/object',
    apiUrl_HRM_Employee_ByDomain_EndPoint: apiUrl_HRM + api_version + '/private/employee/domain',
    apiUrl_HRM_Employee_ByCode_EndPoint: apiUrl_HRM + api_version + '/private/employee/code',
    apiUrl_HRM_Employee_Image_EndPoint: apiUrl_HRM + api_version + '/private/employee/image',
    apiUrl_HRM_Employee_ImageDownload_EndPoint: apiUrl_HRM + api_version + '/private/employee/image/download',
    apiUrl_HRM_Employee_ImageUpload_EndPoint: apiUrl_HRM + api_version + '/private/employee/image/upload',
    apiUrl_HRM_Employee_MultiFilesDownload_EndPoint: apiUrl_HRM + api_version + '/private/employee/multi-files/download',
    apiUrl_HRM_Employee_MultiFilesUpload_EndPoint: apiUrl_HRM + api_version + '/private/employee/multi-files/upload',
    apiUrl_HRM_Employee_MultiFilesDelete_EndPoint: apiUrl_HRM + api_version + '/private/employee/multi-files',
    apiUrl_HRM_Contract_EndPoint: apiUrl_HRM + api_version + '/private/contract',
    apiUrl_HRM_Contract_Count_EndPoint: apiUrl_HRM + api_version + '/private/contract/count',
    apiUrl_HRM_Contract_FileDownload_EndPoint: apiUrl_HRM + api_version + '/private/contract/file/download',
    apiUrl_HRM_Contract_FileUpload_EndPoint: apiUrl_HRM + api_version + '/private/contract/file/upload',
    apiUrl_HRM_Absence_EndPoint: apiUrl_HRM + api_version + '/private/leaveStatus',
    apiUrl_HRM_Vacation_EndPoint: apiUrl_HRM + api_version + '/private/vacation',
    apiUrl_HRM_Contract_UpdateStatus_EndPoint: apiUrl_HRM + api_version + '/private/contract/updateContractStatus',
    apiUrl_HRM_IdentityDoc_Image_EndPoint: apiUrl_HRM + api_version + '/private/cin/image',
    apiUrl_HRM_IdentityDoc_ImageDownload_EndPoint: apiUrl_HRM + api_version + '/private/cin/image/download',
    apiUrl_HRM_TravelDoc_Image_EndPoint: apiUrl_HRM + api_version + '/private/passport/image',
    apiUrl_HRM_TravelDoc_ImageDownload_EndPoint: apiUrl_HRM + api_version + '/private/passport/image/download',
    apiUrl_HRM_InsuranceDoc_Image_EndPoint: apiUrl_HRM + api_version + '/private/security/image',
    apiUrl_HRM_InsuranceDoc_ImageDownload_EndPoint: apiUrl_HRM + api_version + '/private/security/image/download',
    apiUrl_HRM_Employee_Status_EndPoint: apiUrl_HRM + api_version + '/private/employee/updateStatusEmployee',
    apiUrl_HRM_PaymentSchedule_EndPoint: apiUrl_HRM + api_version + '/private/payment-Schedule',
    apiUrl_HRM_PaymentScheduleBonus_EndPoint: apiUrl_HRM + api_version + '/private/payment-Schedule/bonus',
    apiUrl_HRM_PaymentScheduleBonusCalculate_EndPoint:
        apiUrl_HRM + api_version + '/private/payment-Schedule/bonus/calculate',
    apiUrl_HRM_PaymentScheduleCalculate_EndPoint: apiUrl_HRM + api_version + '/private/payment-Schedule/calculate',
}

export default hrmApiUrls
