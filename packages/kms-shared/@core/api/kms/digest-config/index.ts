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
