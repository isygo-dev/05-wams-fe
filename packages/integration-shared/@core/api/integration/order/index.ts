// ** Redux Imports
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import integrationApiUrls from "integration-shared/configs/integration_apis";
import toast from 'react-hot-toast'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {IntegrationOrderType} from "integration-shared/@core/types/integration/IntegrationOrderTypes";

const IntegrationOrderApis = (t: TFunction) => {
    const permission = PermissionPage.INTEGRATION_ORDER

    const getIntegrationOrders = async () => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_EndPoint}`, {
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

    const addIntegrationOrder = async (integrationOrderData: FormData) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_FileCreate_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: integrationOrderData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('IntegrationOrder.added_successfully'))
        }

        return await response.json()
    }

    const updateIntegrationOrder = async (data: IntegrationOrderType) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('serviceName', data.serviceName)
        formData.append('mapping', data.mapping)
        formData.append('domain', data.domain)
        formData.append('integrationOrder', data.integrationOrder)

        const file = data.file
        if (file != null || file != undefined) {
            formData.append('file', data.file)
            formData.append('originalFileName', file.name)
            formData.append('extension', file.name.split('.').pop() || 'unknown')
            formData.append('type', file.type)
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_FileUpdate_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('IntegrationOrder.updated_successfully'))
        }

        return await response.json()
    }

    const deleteIntegrationOrder = async (id: number) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_EndPoint}?id=${id}`, {
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
            toast.success(t('IntegrationOrder.deleted_successfully'))
        }

        return id
    }

    const getIntegrationOrderById = async (id: number) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_EndPoint}/${id}`, {
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

    const downloadIntegrationOrderFile = async (data: { id: number; originalFileName: string }) => {
        if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${integrationApiUrls.apiUrl_INTEGRATION_Order_FileDownload_EndPoint}?id=${data.id}&version=1`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (response.ok) {
            return await response.json()
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = data.originalFileName
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }
    }

    return {
        getIntegrationOrders,
        addIntegrationOrder,
        updateIntegrationOrder,
        deleteIntegrationOrder,
        getIntegrationOrderById,
        downloadIntegrationOrderFile
    }
}

export default IntegrationOrderApis