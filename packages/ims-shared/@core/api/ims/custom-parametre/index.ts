import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import { AppParameterRequest, AppParameterType } from 'ims-shared/@core/types/ims/appParameterTypes'
import toast from 'react-hot-toast'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'

const CustomParameterApis = (t: TFunction) => {
  const permission = PermissionPage.APP_PARAMETER

  const getCustomParameters = async () => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_EndPoint}`, {
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

  const getCustomParametersCount = async () => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_Count_EndPoint}`, {
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

  const getCustomParametersByPage = async (page: number, size: number) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_EndPoint}/${page}/${size}`, {
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

  const deleteCustomParameterById = async (id: number) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_EndPoint}?id=${id}`, {
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
      toast.success(t('Custom-parameter.deleted_successfully'))
    }

    return id
  }

  const updateCustomParameter = async (param: AppParameterType) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_EndPoint}?id=${param.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(param)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Custom-parameter.updated_successfully'))
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

  const addCustomParameter = async (param: AppParameterRequest) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AppParameter_EndPoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(param)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Custom-parameter.added_successfully'))
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
    getCustomParametersCount,
    getCustomParameters,
    deleteCustomParameterById,
    getCustomParametersByPage,
    addCustomParameter,
    updateCustomParameter
  }
}

export default CustomParameterApis
