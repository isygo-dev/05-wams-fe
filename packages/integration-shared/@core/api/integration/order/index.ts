// ** Redux Imports
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import integrationApiUrls from 'integration-shared/configs/integration_apis'
import toast from 'react-hot-toast'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

const IntegrationOrderApis = (t: TFunction) => {
  const permission = PermissionPage.INTEGRATION_ORDER

  const getCountIntegrationOrder = async () => {
    if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }
    const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_EndPoint}/count`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.status == 204) {
      return 0
    }
    const data = await response.json()

    return data
  }

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

    if (response.status == 204) {
      return 0
    }
    const data = await response.json()

    return data
  }

  const getPaginationIntegrationOrders = async (page: number, size: number) => {
    if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_EndPoint}/${page}/${size}`, {
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
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
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

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const updateIntegrationOrder = async ({ formData, id }: { formData: FormData; id: number }) => {
    if (!checkPermission(PermissionApplication.INTEGRATION, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${integrationApiUrls.apiUrl_INTEGRATION_Order_FileUpdate_EndPoint}?id=${id}`, {
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

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
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

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
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
    getCountIntegrationOrder,
    getIntegrationOrders,
    getPaginationIntegrationOrders,
    addIntegrationOrder,
    updateIntegrationOrder,
    deleteIntegrationOrder,
    getIntegrationOrderById,
    downloadIntegrationOrderFile
  }
}

export default IntegrationOrderApis
