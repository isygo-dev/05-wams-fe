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

        // Handle 204 No Content or empty body
        if (response.status === 204) {
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
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

        // Handle 204 No Content or empty body
        if (response.status === 204) {
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
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

        // Handle 204 No Content or empty body
        if (response.status === 204) {
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
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

        // Handle 204 No Content or empty body
        if (response.status === 204) {
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
    }

    return {
        loginByDomainAndUserName,
        loginByEmail,
        resetPassword,
        resendOtpCode
    }
}

export default AuthApis
