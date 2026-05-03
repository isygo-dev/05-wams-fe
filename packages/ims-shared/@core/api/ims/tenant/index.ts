import imsApiUrls from 'ims-shared/configs/ims_apis'
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import {RequestStatus} from 'template-shared/@core/types/helper/userTypes'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {AdminTenantRequest, TenantDetail} from '../../../types/ims/tenantTypes'

const TenantApis = (t: TFunction) => {
    const permission = PermissionPage.TENANT

    const getTenants = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_EndPoint}`, {
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

    const getTenantsCount = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_Count_EndPoint}`, {
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

    const getTenantsByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_EndPoint}/${page}/${size}`, {
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

    const getTenantById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_EndPoint}/${id}`, {
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

    const deleteTenantById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_EndPoint}?id=${id}`, {
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
            toast.success(t('Tenant_deleted_successfully'))
        }

        return id
    }

    const updateTenant = async (tenant: TenantDetail) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_EndPoint}?id=${tenant.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(tenant)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Tenant_updated_successfully'))
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

    const updateTenantSocial = async (id: number, social: string, link: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${imsApiUrls.apiUrl_IMS_Tenant_Social_EndPoint}?id=${id}&social=${social}&link=${encodeURIComponent(link)}`,
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
            toast.success(t('Tenant_social_updated_successfully'))
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

    const addTenant = async (tenant: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_Image_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: tenant
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Tenant_added_successfully'))
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

    const updateTenantImage = async (data: { id: number; file: Blob }) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const formData = new FormData()
        formData.append('file', data.file as File)
        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_ImageUpload_EndPoint}/${data.id}`, {
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
            toast.success(t('Tenant_image_updated_successfully'))
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

    const addTenantAdmin = async (data: AdminTenantRequest, tenant: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_AccountAdminTenant_EndPoint}?tenant=${tenant}`, {
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
            toast.success(t('Tenant_admin_added_successfully'))
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

    const getTenantsNameList = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Tenant_Names_EndPoint}`, {
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

    const updateTenantStatus = async (data: RequestStatus) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${imsApiUrls.apiUrl_IMS_Tenant_UpdateStatus_EndPoint}?id=${data.id}&newStatus=${data.newReqStatus}`,
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
            toast.success(t('Tenant_status_updated_successfully'))
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
        getTenants: getTenants,
        getTenantsCount: getTenantsCount,
        getTenantsByPage: getTenantsByPage,
        getTenantById: getTenantById,
        deleteTenantById: deleteTenantById,
        updateTenant: updateTenant,
        updateTenantSocial: updateTenantSocial,
        updateTenantImage: updateTenantImage,
        addTenant: addTenant,
        addTenantAdmin: addTenantAdmin,
        getTenantsNameList: getTenantsNameList,
        updateTenantStatus: updateTenantStatus
    }
}

export default TenantApis
