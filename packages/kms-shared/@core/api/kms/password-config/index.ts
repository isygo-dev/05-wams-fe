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
import { PasswordConfigData, PasswordConfigType } from 'kms-shared/@core/types/kms/passwordConfigTypes'

const PasswordConfigApis = (t: TFunction) => {
  const permission = PermissionPage.PASSWORD_CONFIG

  const getPasswordConfigurations = async () => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigPassword_EndPoint}`, {
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

  const addPasswordConfiguration = async (data: PasswordConfigData) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigPassword_EndPoint}`, {
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
      toast.success(t('PasswordConfiguration.added_added_successfully'))
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

  const deletePasswordConfiguration = async (id: number) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigPassword_EndPoint}?id=${id}`, {
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
      toast.success(t('PasswordConfiguration.deleted_added_successfully'))
    }

    return id
  }

  const updatePasswordConfiguration = async (data: PasswordConfigType) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigPassword_EndPoint}?id=${data.id}`, {
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
      toast.success(t('PasswordConfiguration.updated_added_successfully'))
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

  return {
    getPasswordConfigurations,
    addPasswordConfiguration,
    deletePasswordConfiguration,
    updatePasswordConfiguration
  }
}

export default PasswordConfigApis
