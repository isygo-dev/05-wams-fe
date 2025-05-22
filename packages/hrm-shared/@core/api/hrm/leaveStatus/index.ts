import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'
import { LeaveStatusType } from 'hrm-shared/@core/types/hrm/leaveStatusType'

const LeaveStatusApis = (t: TFunction) => {
  const permission = PermissionPage.LEAVE_SUMMARY

  const getLeaveStatus = async () => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Absence_EndPoint}`, {
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

  const updateLeaveStatus = async (param: LeaveStatusType, id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Absence_EndPoint}?id=${id}`, {
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
      toast.success(t('LeaveStatus.updated_successfully'))
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

  const getLeaveStatusById = async (id: string | string[]) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Absence_EndPoint}/${id}`, {
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

  return {
    getLeaveStatus,
    updateLeaveStatus,
    getLeaveStatusById
  }
}

export default LeaveStatusApis
