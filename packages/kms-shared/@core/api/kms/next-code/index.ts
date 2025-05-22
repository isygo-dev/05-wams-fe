// ** Redux Imports
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import kmsApiUrls from 'kms-shared/configs/kms_apis'
import toast from 'react-hot-toast'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { CodificationData } from 'ims-shared/@core/types/ims/nextCodeTypes'

const NextCodeApis = (t: TFunction) => {
  const permission = PermissionPage.APP_NEXT_CODE

  const getNextCodes = async () => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

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

  const addNextCode = async (data: CodificationData) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on add ' + t(permission))

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

  const updateNextCode = async (data: any) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

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

  const deleteNextCode = async (id: number) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

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
