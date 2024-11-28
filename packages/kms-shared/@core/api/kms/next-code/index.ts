// ** Redux Imports
import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import kmsApiUrls from "kms-shared/configs/kms_apis"
import toast from 'react-hot-toast'
import {TFunction} from "i18next";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {CodificationData} from "ims-shared/@core/types/ims/nextCodeTypes";

const NextCodeApis = (t: TFunction) => {
    const permission = PermissionPage.APP_NEXT_CODE

    const getNextCodes = async () => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on read " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_Codification_EndPoint}`, {
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

    const addNextCode = async (data: CodificationData) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on add " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_Codification_EndPoint}`, {
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
            toast.success(t('NextCode.configuration_added_successfully'))
        }

        return await response.json()
    }

    const updateNextCode = async (data: any) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on read " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_Codification_EndPoint}?id=${data.id}`, {
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
            toast.success(t('NextCode.configuration_updated_successfully'))
        }

        return await response.json()
    }

    const deleteNextCode = async (id: number) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on read " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_Codification_EndPoint}?id=${id}`, {
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
            toast.success(t('NextCode.configuration_deleted_successfully'))
        }

        return id
    }

    return {
        getNextCodes,
        addNextCode,
        updateNextCode,
        deleteNextCode
    }
}

export default NextCodeApis