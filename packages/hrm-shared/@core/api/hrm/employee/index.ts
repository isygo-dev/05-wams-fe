import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import { EmployeeType, MinEmployeeType, RequestEmployeeStatus } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import toast from 'react-hot-toast'

const EmployeeApis = (t: TFunction) => {
  const permission = PermissionPage.EMPLOYEE

  const getEmployeesCount = async () => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_Count_EndPoint}`, {
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

  const getEmployeesByPage = async (page: number, size: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_EndPoint}/${page}/${size}`, {
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

  const getEmployees = async () => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_EndPoint}`, {
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

  const addEmployee = async (employee: FormData) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_Image_EndPoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: employee
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.added_successfully'))
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

  const updateEmployeeById = async (data: EmployeeType) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_EndPoint}?id=${data.id}`, {
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
      toast.success(t('Employee.updated_successfully'))
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

  const deleteEmployeeById = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_EndPoint}?id=${id}`, {
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
      toast.success(t('Employee.added_successfully'))
    }

    return id
  }

  const getEmployeeById = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_EndPoint}/${id}`, {
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

  const getEmployeeByCode = async (code: string) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_ByCode_EndPoint}/${code}`, {
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

  const getEmployeesByDomain = async (domain: string) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_ByDomain_EndPoint}/${domain}`, {
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

  const updateEmployeePicture = async (data: { id: number; file: Blob }) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const formData = new FormData()
    formData.append('file', data.file as File)
    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_ImageUpload_EndPoint}/${data.id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.picture_updated_successfully'))
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

  const updateEmployeeIdentityDocImage = async (data: FormData, id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    if (!checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_CIN, PermissionAction.WRITE)) {
      const method = id ? 'PUT' : 'POST'
      const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_IdentityDoc_Image_EndPoint}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: data
      })

      if (!response.ok) {
        return
      } else {
        toast.success(t('Employee.identity_document_updated_successfully'))
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
  }

  const updateEmployeeTravelDocImage = async (data: FormData, id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const method = id ? 'PUT' : 'POST'
    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_TravelDoc_Image_EndPoint}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.travel_document_updated_successfully'))
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

  const updateEmployeeSecurityDocImage = async (data: FormData, id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const method = id ? 'PUT' : 'POST'
    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_InsuranceDoc_Image_EndPoint}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.security_document_updated_successfully'))
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

  const downloadTravelDocImage = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on download ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_TravelDoc_ImageDownload_EndPoint}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `passport_${id}.png` // Adjust file name as needed
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const downloadIdentityDocImage = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on download ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_IdentityDoc_ImageDownload_EndPoint}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cin_${id}.png` // Adjust file name as needed
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const downloadSecurityDocImage = async (id: number) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
      console.warn('Permission denied on download ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_InsuranceDoc_ImageDownload_EndPoint}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `security_${id}.png` // Adjust file name as needed
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const updateEmployeeStatus = async (data: RequestEmployeeStatus) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${hrmApiUrls.apiUrl_HRM_Employee_Status_EndPoint}?id=${data.id}&newStatus=${data.newStatus}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.status_updated_successfully'))
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

  const linkEmployeeToAccount = async (employee: MinEmployeeType) => {
    if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on write ' + t(permission))

      return
    }

    const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_CreateAccount_EndPoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(employee)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Employee.linked_to_account_successfully'))
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
    getEmployeesCount,
    getEmployeesByPage,
    getEmployees,
    addEmployee,
    updateEmployeeById,
    deleteEmployeeById,
    getEmployeeById,
    getEmployeeByCode,
    getEmployeesByDomain,
    updateEmployeePicture,
    updateEmployeeIdentityDocImage,
    updateEmployeeTravelDocImage,
    updateEmployeeSecurityDocImage,
    downloadTravelDocImage,
    downloadIdentityDocImage,
    downloadSecurityDocImage,
    updateEmployeeStatus,
    linkEmployeeToAccount
  }
}

export default EmployeeApis
