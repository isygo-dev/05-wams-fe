import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import { Vacation } from 'hrm-shared/@core/types/hrm/leaveStatusType'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'

const VaccationApis = (t: TFunction) => {
  const permission = PermissionPage.CONTRACT_VACATION

  const updateVacation = async (data: Vacation) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    console.log(data, 'data')
    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Vacation_EndPoint}/${data.id}`, {
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
      toast.success(t('Vacation.added_successfully'))
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

  const deleteVacationById = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Vacation_EndPoint}?id=${id}`, {
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
      toast.success(t('Vacation.deleted_successfully'))
    }

    return id
  }

  return {
    updateVacation,
    deleteVacationById
  }
}

export default VaccationApis
