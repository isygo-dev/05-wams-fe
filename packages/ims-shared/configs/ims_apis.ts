import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'
let apiUrl_IMS: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_IMS = 'https://ims.dev.wams.isygoit.eu'

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_IMS = 'http://127.0.0.1:40402'

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_IMS = 'https://ims.dev.wams.isygoit.eu'

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
} else {
  apiUrl_IMS = 'https://ims.dev.wams.isygoit.eu'

  // apiUrl_IMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/ims`
}

const imsApiUrls = {
  apiUrl_IMS,
  apiUrl_IMS_Account_EndPoint: apiUrl_IMS + api_version + '/private/account',
  apiUrl_IMS_Account_Count_EndPoint: apiUrl_IMS + api_version + '/private/account/count',
  apiUrl_IMS_MyAccount_EndPoint: apiUrl_IMS + api_version + '/private/account/me',
  apiUrl_IMS_MyProfile_EndPoint: apiUrl_IMS + api_version + '/private/account/profile',
  apiUrl_IMS_RestPasswordViaToken_EndPoint: apiUrl_IMS + api_version + '/private/account/password/reset/token',
  apiUrl_IMS_Account_UpdateLanguage_EndPoint: apiUrl_IMS + api_version + '/private/account/updateLanguage',
  apiUrl_IMS_Account_UpdateAccount_EndPoint: apiUrl_IMS + api_version + '/private/account/update-account',
  apiUrl_IMS_Account_Image_EndPoint: apiUrl_IMS + api_version + '/private/account/image',
  apiUrl_IMS_Account_ImageDownload_EndPoint: apiUrl_IMS + api_version + '/private/account/image/download',
  apiUrl_IMS_Account_ImageUpload_EndPoint: apiUrl_IMS + api_version + '/private/account/image/upload',
  apiUrl_IMS_Account_UpdateStatus_EndPoint: apiUrl_IMS + api_version + '/private/account/updateStatusAccount',
  apiUrl_IMS_Account_UpdateIsAdmin_EndPoint: apiUrl_IMS + api_version + '/private/account/updateIsAdmin',
  apiUrl_IMS_Account_Details_EndPoint: apiUrl_IMS + api_version + '/private/accountDetails',
  apiUrl_IMS_Account_Emails_EndPoint: apiUrl_IMS + api_version + '/private/account/emails',
  apiUrl_IMS_Account_Info_EndPoint: apiUrl_IMS + api_version + '/private/account/accounts-info',
  apiUrl_IMS_Application_EndPoint: apiUrl_IMS + api_version + '/private/application',
  apiUrl_IMS_Application_Count_EndPoint: apiUrl_IMS + api_version + '/private/application/count',
  apiUrl_IMS_Application_Default_EndPoint: apiUrl_IMS + api_version + '/private/application/default',
  apiUrl_IMS_Application_UpdateStatus_EndPoint: apiUrl_IMS + api_version + '/private/application/update-status',
  apiUrl_IMS_Application_Image_EndPoint: apiUrl_IMS + api_version + '/private/application/image',
  apiUrl_IMS_Application_ImageDownload_EndPoint: apiUrl_IMS + api_version + '/private/application/image/download',
  apiUrl_IMS_Application_ImageUpload_EndPoint: apiUrl_IMS + api_version + '/private/application/image/upload',
  apiUrl_IMS_Customer_EndPoint: apiUrl_IMS + api_version + '/private/customer',
  apiUrl_IMS_Customer_Count_EndPoint: apiUrl_IMS + api_version + '/private/customer/count',
  apiUrl_IMS_Customer_Image_EndPoint: apiUrl_IMS + api_version + '/private/customer/image',
  apiUrl_IMS_Customer_ImageDownload_EndPoint: apiUrl_IMS + api_version + '/private/customer/image/download',
  apiUrl_IMS_Customer_ImageUpload_EndPoint: apiUrl_IMS + api_version + '/private/customer/image/upload',
  apiUrl_IMS_Customer_UpdateStatus_EndPoint: apiUrl_IMS + api_version + '/private/customer/update-status',
  apiUrl_IMS_Customer_LinkAccount_EndPoint: apiUrl_IMS + api_version + '/private/customer/link-account',
  apiUrl_IMS_Domain_EndPoint: apiUrl_IMS + api_version + '/private/domain',
  apiUrl_IMS_Domain_Count_EndPoint: apiUrl_IMS + api_version + '/private/domain/count',
  apiUrl_IMS_Domain_UpdateStatus_EndPoint: apiUrl_IMS + api_version + '/private/domain/update-status',
  apiUrl_IMS_RoleInfo_EndPoint: apiUrl_IMS + api_version + '/private/roleInfo',
  apiUrl_IMS_RoleInfo_DomainDefault_EndPoint: apiUrl_IMS + api_version + '/private/roleInfo/default',
  apiUrl_IMS_Domain_Image_EndPoint: apiUrl_IMS + api_version + '/private/domain/image',
  apiUrl_IMS_Domain_ImageDownload_EndPoint: apiUrl_IMS + api_version + '/private/domain/image/download',
  apiUrl_IMS_Domain_ImageUpload_EndPoint: apiUrl_IMS + api_version + '/private/domain/image/upload',
  apiUrl_IMS_Domain_Names_EndPoint: apiUrl_IMS + api_version + '/private/domain/names',
  apiUrl_IMS_Domain_Social_EndPoint: apiUrl_IMS + api_version + '/private/domain/social',
  apiUrl_IMS_AppParameter_EndPoint: apiUrl_IMS + api_version + '/private/appParameter',
  apiUrl_IMS_AppParameter_Count_EndPoint: apiUrl_IMS + api_version + '/private/appParameter/count',
  apiUrl_IMS_Theme_EndPoint: apiUrl_IMS + api_version + '/private/theme',
  apiUrl_IMS_Annex_EndPoint: apiUrl_IMS + api_version + '/private/annex',
  apiUrl_IMS_Annex_ByTableCodeAndRef_EndPoint: apiUrl_IMS + api_version + '/private/annex/byCodeAndRef',
  apiUrl_IMS_Annex_ByTableCode_EndPoint: apiUrl_IMS + api_version + '/private/annex/byCode',
  apiUrl_IMS_Annex_Count_EndPoint: apiUrl_IMS + api_version + '/private/annex/count',
  apiUrl_IMS_PublicUser_EndPoint: apiUrl_IMS + api_version + '/public/user',
  apiUrl_IMS_PasswordForgotten_EndPoint: apiUrl_IMS + api_version + '/public/user/password/forgotten',
  apiUrl_IMS_Login_EndPoint: apiUrl_IMS + api_version + '/public/user/authenticate',
  apiUrl_IMS_UserAccount_AuthType_EndPoint: apiUrl_IMS + api_version + '/public/user/authType',
  apiUrl_IMS_UserAccounts_EndPoint: apiUrl_IMS + api_version + '/public/user/accounts',
  apiUrl_IMS_AccountUpdateAuthType_EndPoint: apiUrl_IMS + api_version + '/public/user/updateAuthType',
  apiUrl_IMS_Register_EndPoint: apiUrl_IMS + '/jwt/register',
  apiUrl_IMS_AccountsBySenderDomain_EndPoint: apiUrl_IMS + api_version + '/private/account/domain/sender',
  apiUrl_IMS_AccountsStatusByDomain_EndPoint: apiUrl_IMS + api_version + '/private/account/chat/domain',
  apiUrl_IMS_ResendEmailCredentials_EndPoint: apiUrl_IMS + api_version + '/private/account/resend/email/creation',
  apiUrl_IMS_AccountStatisticsGlobal_EndPoint: apiUrl_IMS + api_version + '/private/account/stat/global',
  apiUrl_IMS_AccountStatisticsObject_EndPoint: apiUrl_IMS + api_version + '/private/account/stat/object',
  apiUrl_IMS_AccountAdminDomain_EndPoint: apiUrl_IMS + api_version + '/private/account/admin',
  apiUrl_IMS_UsersByDomain_EndPoint: apiUrl_IMS + api_version + '/private/account/domain',
  apiUrl_IMS_Property_Account_Gui_Name_EndPoint: apiUrl_IMS + api_version + '/private/property/account',
  apiUrl_IMS_Property_Account_Gui_All_EndPoint: apiUrl_IMS + api_version + '/private/property/account/all'
}

export default imsApiUrls
