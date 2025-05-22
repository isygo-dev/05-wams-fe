import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'

import { TokenConfigTypes, TokenData } from 'kms-shared/@core/types/kms/tokenConfig'
import toast from 'react-hot-toast'
import kmsApiUrls from 'kms-shared/configs/kms_apis'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'

const TokenConfigApis = (t: TFunction) => {
  const permission = PermissionPage.TOKEN_CONFIG

  const getTokenConfigurations = async () => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigToken_EndPoint}`, {
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

  const addTokenConfiguration = async (data: TokenData) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigToken_EndPoint}`, {
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
      toast.success(t('Token configuration_added_successfully'))
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

  const updateTokenConfiguration = async (data: TokenConfigTypes) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigToken_EndPoint}?id=${data.id}`, {
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
      toast.success(t('Token configuration_updated_successfully'))
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

  const deleteTokenConfiguration = async (id: number) => {
    if (!checkPermission(PermissionApplication.KMS, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${kmsApiUrls.apiUrl_KMS_ConfigToken_EndPoint}?id=${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Token configuration_deleted_successfully'))
    }

    return id
  }

  return {
    getTokenConfigurations,
    addTokenConfiguration,
    updateTokenConfiguration,
    deleteTokenConfiguration
  }
}

export default TokenConfigApis
