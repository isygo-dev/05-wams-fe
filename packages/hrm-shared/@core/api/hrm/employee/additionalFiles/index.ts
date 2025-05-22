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

const EmployeeAdditionalFilesApis = (t: TFunction) => {
  const permission = PermissionPage.EMPLOYEE

  const uploadAdditionalFiles = async (data: { parentId: number; files: Blob[] }) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on upload ' + t(permission))

      return
    }

    const formData = new FormData()
    for (const key of Object.keys(data.files)) {
      formData.append('files', data.files[key])
    }

    const response = await AppQuery(
      `${hrmApiUrls.apiUrl_HRM_Employee_MultiFilesUpload_EndPoint}?parentId=${data.parentId}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: formData
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.File_uploaded_successfully'))
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

  const downloadAdditionalFile = async (data: {
    parentId: number
    fileId: number
    version: number
    originalFileName: string
  }) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on download ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${hrmApiUrls.apiUrl_HRM_Employee_MultiFilesDownload_EndPoint}?parentId=${data.parentId}&fileId=${data.fileId}&version=${data.version}`,
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
      console.log(blob)
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

  const deleteAdditionalFile = async (data: { parentId: number; fileId: number }) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${hrmApiUrls.apiUrl_HRM_Employee_MultiFilesDelete_EndPoint}?parentId=${data.parentId}&fileId=${data.fileId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.File_deleted_successfully'))
    }

    return data
  }

  return {
    uploadAdditionalFiles,
    downloadAdditionalFile,
    deleteAdditionalFile
  }
}

export default EmployeeAdditionalFilesApis
