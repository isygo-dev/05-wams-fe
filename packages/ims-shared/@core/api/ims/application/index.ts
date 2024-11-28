import imsApiUrls from "ims-shared/configs/ims_apis"
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import {RequestStatus} from 'template-shared/@core/types/helper/userTypes'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'

const ApplicationApis = (t: TFunction) => {
    const permission = PermissionPage.APPLICATION

    const getApplications = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Application_EndPoint}`, {
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

    const getApplicationsOfDefaultDomain = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Application_Default_EndPoint}`, {
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

    const deleteApplicationById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Application_EndPoint}?id=${id}`, {
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
            toast.success(t('Application_deleted_successfully'))
        }

        return id
    }

    const updateApplication = async (appData: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Application_Image_EndPoint}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: appData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Application_updated_successfully'))
        }

        return await response.json()
    }

    const addApplication = async (appData: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Application_Image_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: appData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Application_added_successfully'))
        }

        return await response.json()
    }

    const updateApplicationStatus = async (data: RequestStatus) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            imsApiUrls.apiUrl_IMS_Application_UpdateStatus_EndPoint + `?id=${data.id}&newStatus=${data.newReqStatus}`,
            {
                method: 'PUT',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Application status_updated_successfully'))
        }

        return await response.json()
    }

    return {
        updateApplicationStatus,
        getApplications,
        getApplicationsOfDefaultDomain,
        deleteApplicationById,
        updateApplication,
        addApplication
    }
}

export default ApplicationApis
