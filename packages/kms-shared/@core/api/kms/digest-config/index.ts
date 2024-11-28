// ** Redux Imports
import {DigestConfigData, DigestConfigType} from 'kms-shared/@core/types/kms/DigestConfig'
import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import kmsApiUrls from "kms-shared/configs/kms_apis"
import toast from 'react-hot-toast'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from "i18next";
import {checkPermission} from "template-shared/@core/api/helper/permission";

const DigesterConfigApis = (t: TFunction) => {
    const permission = PermissionPage.DIGETS_CONFIG

    const getDigestConfigurations = async () => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on read " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigDigest_EndPoint}`, {
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

    const addDigestConfiguration = async (data: DigestConfigData) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.WRITE)) {
            console.warn("Permission denied on read " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigDigest_EndPoint}`, {
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
            toast.success(t('DigestConfiguration.added_successfully'))
        }

        return await response.json()
    }

    const updateDigestConfiguration = async (data: DigestConfigType) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on update " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigDigest_EndPoint}?id=${data.id}`, {
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
            toast.success(t('DigestConfiguration.updated_successfully'))
        }

        return await response.json()
    }

    const deleteDigestConfiguration = async (id: number) => {
        if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
            console.warn("Permission denied on delete " + t(permission))

            return
        }

        const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigDigest_EndPoint}?id=${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('DigestConfiguration.deleted_successfully'))
        }

        return id
    }

    return {
        getDigestConfigurations,
        addDigestConfiguration,
        updateDigestConfiguration,
        deleteDigestConfiguration
    }
}

export default DigesterConfigApis
