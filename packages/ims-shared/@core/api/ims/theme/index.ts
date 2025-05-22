import imsApiUrls from 'ims-shared/configs/ims_apis'
import { Theme, ThemeRequest } from 'template-shared/@core/context/settingsContext'
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import { TFunction } from 'i18next'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'

const ThemeApis = (t: TFunction) => {
  const permission = PermissionPage.THEME

  const updateThemeById = async (theme: Theme) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Theme_EndPoint}?id=${theme.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(theme)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Theme_updated_successfully'))
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

  const updateThemeByCode = async (theme: ThemeRequest) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Theme_EndPoint}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(theme)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Theme_updated_successfully'))
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

  const findThemeByCode = async (theme: ThemeRequest) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${imsApiUrls.apiUrl_IMS_Theme_EndPoint}/find/${theme.domainCode}/${theme.accountCode}`,
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
    updateThemeById,
    updateThemeByCode,
    findThemeByCode
  }
}

export default ThemeApis
