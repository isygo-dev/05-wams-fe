import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import integrationApiUrls from "integration-shared/configs/integration_apis";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'

const IntegrationFlowApis = (t: TFunction) => {
    const permission = PermissionPage.INTEGRATION_FLOW

    const getIntegrationFlowsCount = async () => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_Count_EndPoint}`, {
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

    const getIntegrationFlowsByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_EndPoint}/${page}/${size}`, {
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

    const createIntegrationFlow = async (data: FormData) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_FileCreate_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: data
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('IntegrationFlow.added_successfully'))
        }

        return await response.json()
    }

    const deleteIntegrationFlow = async (id: number) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_EndPoint}?id=${id}`, {
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
            toast.success(t('IntegrationFlow.deleted_successfully'))
        }

        return id
    }

    const updateIntegrationFlow = async ({formData, id}: { formData: FormData; id: number }) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await fetch(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_FileCreate_EndPoint}?id=${id}`, {
            method: 'PUT',
            body: formData // No need for headers if using FormData
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Update failed:', errorText)
            throw new Error(`Failed to update: ${errorText}`)
        }

        if (!response.ok) {
            return
        } else {
            toast.success(t('IntegrationFlow.updated_successfully'))
        }

        return await response.json()
    }

    const getIntegrationFlowById = async (id: number) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Flow_EndPoint}/${id}`, {
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

    return {
        getIntegrationFlowsCount,
        getIntegrationFlowsByPage,
        createIntegrationFlow,
        deleteIntegrationFlow,
        updateIntegrationFlow,
        getIntegrationFlowById
    }
}

export default IntegrationFlowApis
