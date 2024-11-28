import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import imsApiUrls from "ims-shared/configs/ims_apis"
import {authRequestType} from 'ims-shared/@core/types/ims/auth/authRequestTypes'
import {ChangePasswordRequest} from 'template-shared/context/types'
import toast from 'react-hot-toast'
import {TFunction} from 'i18next'

const AuthApis = (t: TFunction) => {
    const loginByDomainAndUserName = async (data: authRequestType) => {
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_UserAccount_AuthType_EndPoint}`, {
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
        }

        return await response.json()
    }

    const loginByEmail = async (email: string) => {
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_UserAccounts_EndPoint}?email=${email}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const resetPassword = async (data: ChangePasswordRequest) => {
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_RestPasswordViaToken_EndPoint}`, {
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
            toast.success(t('Auth.Reset_password_request_sent_successfully'))
        }

        return await response.json()
    }

    const resendOtpCode = async (data: any) => {
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_UserAccount_AuthType_EndPoint}`, {
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
            toast.success(t('Auth.OTP_code_resent_successfully'))
        }

        return await response.json()
    }

    return {
        loginByDomainAndUserName,
        loginByEmail,
        resetPassword,
        resendOtpCode
    }
}

export default AuthApis
