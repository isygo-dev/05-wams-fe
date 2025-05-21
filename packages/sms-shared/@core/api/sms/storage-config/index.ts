import {StorageConfigTypeRequest, StorageConfigTypes} from 'sms-shared/@core/types/sms/storageTypes'
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import smsApiUrls from "../../../../configs/sms_apis"

const StorageConfigApis = (t: TFunction) => {
    const permission = PermissionPage.STORAGE_CONFIG

    const getStorageConfigurations = async () => {
        if (!checkPermission(PermissionApplication.SMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${smsApiUrls.apiUrl_SMS_StorageConfig_EndPoint}`, {
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

    const deleteStorageConfigurationById = async (id: number) => {
        if (!checkPermission(PermissionApplication.SMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${smsApiUrls.apiUrl_SMS_StorageConfig_EndPoint}?id=${id}`, {
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
            toast.success(t('Storage configuration_deleted_successfully'))
        }

        return id
    }

    const updateStorageConfiguration = async (storageConfig: StorageConfigTypes) => {
        if (!checkPermission(PermissionApplication.SMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${smsApiUrls.apiUrl_SMS_StorageConfig_EndPoint}?id=${storageConfig.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(storageConfig)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Storage configuration_updated_successfully'))
        }

        return response.json()
    }

    const addStorageConfiguration = async (storageConfig: StorageConfigTypeRequest) => {
        if (!checkPermission(PermissionApplication.SMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${smsApiUrls.apiUrl_SMS_StorageConfig_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(storageConfig)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Storage configuration_added_successfully'))
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
        getStorageConfigurations,
        deleteStorageConfigurationById,
        updateStorageConfiguration,
        addStorageConfiguration
    }
}

export default StorageConfigApis
