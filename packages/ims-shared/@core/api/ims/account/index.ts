import kmsApiUrls from "kms-shared/configs/kms_apis"
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import {RequestIsAdmin, RequestStatus} from 'template-shared/@core/types/helper/userTypes'
import {TFunction} from "i18next";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import {AccountDetails, AccountDto} from "ims-shared/@core/types/ims/accountTypes";
import imsApiUrls from "ims-shared/configs/ims_apis"

const AccountApis = (t: TFunction) => {
    const permission = PermissionPage.ACCOUNT

    const getAccountsByDomain = async (domain: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_UsersByDomain_EndPoint}?domain=${domain}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const updateAccountLanguage = async (id: number, language: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const uppercaseLanguage = language.toUpperCase()
        const response = await AppQuery(
            `${imsApiUrls.apiUrl_IMS_Account_UpdateLanguage_EndPoint}?id=${id}&language=${uppercaseLanguage}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.language_updated_successfully'))
        }

        return await response.json()
    }

    const getAccountDetails = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_Info_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getAccountProfile = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_MyProfile_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const updateAccountAdminStatus = async (data: RequestStatus) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${imsApiUrls.apiUrl_IMS_Account_UpdateStatus_EndPoint}?id=${data.id}&newStatus=${data.newReqStatus}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.admin_status_updated_successfully'))
        }

        return await response.json()
    }

    const updateAccountIsAdminFlag = async (data: RequestIsAdmin) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${imsApiUrls.apiUrl_IMS_Account_UpdateIsAdmin_EndPoint}?id=${data.id}&newStatus=${data.newStatus}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.admin_flag_updated_successfully'))
        }

        return await response.json()
    }

    const getAccountsSessionStatus = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AccountsStatusByDomain_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getAccountEmailsByDomain = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_Emails_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getAccounts = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getAccountsCount = async () => {
        if (!(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return []
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_Count_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getAccountsByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return []
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}/${page}/${size}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const resendAccountCredentialsEmail = async id => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_ResendEmailCredentials_EndPoint}/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.credentials_email_resent_successfully'))
        }

        return id
    }

    const deleteAccountById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}?id=${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.deleted_successfully'))
        }

        return id
    }

    const addAccount = async (data: AccountDto) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.added_successfully'))
        }

        return await response.json()
    }

    const updateAccount = async (data: AccountDto) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.email_updated_successfully'))
        }

        return await response.json()
    }

    const updateAccountPicture = async (data: { id: number; file: Blob }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const formData = new FormData()
        formData.append('file', data.file as File)
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_ImageUpload_EndPoint}/${data.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.picture_updated_successfully'))
        }

        return await response.json()
    }

    const getAccountById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_EndPoint}/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const updateAccountDetails = async (data: AccountDetails) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_Details_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.updated_successfully'))
        }

        return await response.json()
    }

    const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ChangePassword_EndPoint}?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Accept: 'application/json',
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.password_updated_Successfully'))
        }

        return await response.json()
    }

    const updateAuthType = async (data: { domain: string; userName: string }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AccountUpdateAuthType_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.auth_type_updated_Successfully'))
        }

        return await response.json()
    }

    const uploadPicture = async (data: { id: number; file: Blob }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const formData = new FormData()
        formData.append('file', data.file as File)
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_ImageUpload_EndPoint}/${data.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.picture_updated_Successfully'))
        }

        return await response.json()
    }

    const updateProfile = async (data: AccountDto) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_MyProfile_EndPoint}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.profile_updated_Successfully'))
        }

        return await response.json()
    }

    const updateUserAccount = async (data: { account: AccountDto; id: number }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Account_UpdateAccount_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.account)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Account.updated_Successfully'))
        }

        return await response.json()
    }

    return {
        getAccountsCount,
        getAccounts,
        getAccountsByPage,
        getAccountById,
        getAccountsByDomain,
        getAccountDetails,
        getAccountProfile,
        getAccountsSessionStatus,
        getAccountEmailsByDomain,
        updateAccountLanguage,
        updateAccountAdminStatus,
        updateAccountIsAdminFlag,
        addAccount,
        updateAccount,
        updateAccountDetails,
        updateAccountPicture,
        deleteAccountById,
        resendAccountCredentialsEmail,
        changePassword,
        updateAuthType,
        uploadPicture,
        updateProfile,
        updateUserAccount
    }
}

export default AccountApis