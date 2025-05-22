import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'
import { AnnexType } from 'ims-shared/@core/types/ims/annexTypes'

const AnnexApis = (t: TFunction) => {
  const permission = PermissionPage.ANNEX

  const getAnnexes = async () => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}`, {
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

  const getAnnexesCount = async () => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}/count`, {
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

  const getAnnexesByPage = async (page: number, size: number) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}/${page}/${size}`, {
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

  const deleteAnnexById = async (id: number) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}?id=${id}`, {
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
      toast.success(t('Annex_deleted_successfully'))
    }

    return id
  }

  const addAnnex = async (param: AnnexType) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}`, {
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
      toast.success(t('Annex_added_successfully'))
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

  const updateAnnex = async (param: AnnexType) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_EndPoint}?id=${param.id}`, {
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
      toast.success(t('Annex_updated_successfully'))
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

  const getAnnexByTableCode = async (code: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Annex_ByTableCode_EndPoint}?code=${code}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (!response.ok) {
      return
    } // Handle 204 No Content or empty body
    else if (response.status === 204) {
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

  const getAnnexByTableCodeAndReference = async (code: string, reference: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${imsApiUrls.apiUrl_IMS_Annex_ByTableCodeAndRef_EndPoint}?code=${code}&reference=${reference}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

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

  return {
    getAnnexes,
    getAnnexesCount,
    getAnnexesByPage,
    deleteAnnexById,
    addAnnex,
    updateAnnex,
    getAnnexByTableCodeAndReference,
    getAnnexByTableCode
  }
}

export default AnnexApis
