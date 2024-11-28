import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import {ContractTypeRequest, RequestContractStatus} from 'hrm-shared/@core/types/hrm/contractType'
import {TFunction} from "i18next";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import toast from "react-hot-toast";

const ContractApis = (t: TFunction) => {
    const permission = PermissionPage.CONTRACT

    const getContractsByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_EndPoint}/${page}/${size}`, {
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

        return await response.json()
    }

    const deleteContractById = async (id: number) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_EndPoint}?id=${id}`, {
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
            toast.success(t('Account.added_successfully'))
        }

        return id
    }

    const addContract = async (param: ContractTypeRequest) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_EndPoint}`, {
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
            toast.success(t('Contract.added_successfully'))
        }

        return await response.json()
    }

    const updateContractById = async (param: ContractTypeRequest, id: number) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_EndPoint}?id=${id}`, {
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
            toast.success(t('Contract.updated_successfully'))
        }

        return await response.json()
    }

    const updateStatusContract = async (data: RequestContractStatus) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_UpdateStatus_EndPoint}?id=${data.id}&isLocked=${data.isLocked}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Contract.status_updated_successfully'))
        }

        return await response.json()
    }

    const getContractById = async (id: string | string[]) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_EndPoint}/${id}`, {
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

        return await response.json()
    }

    const uploadContractFile = async (data: { id: number; file: Blob }) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on upload ' + t(permission))

            return
        }

        const formData = new FormData()
        formData.append('file', data.file as File)
        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_FileUpload_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })
        if (!response.ok) {
            return
        } else {
            toast.success(t('Contract.File_uploaded_successfully'))
        }

        return await response.json()
    }

    const getContractsCount = async () => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Contract_Count_EndPoint}`, {
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

        return await response.json()
    }

    const downloadContractFile = async (data: { id: number; originalFileName: string }) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on download ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${hrmApiUrls.apiUrl_HRM_Contract_FileDownload_EndPoint}?id=${data.id}&version=1`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

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

    return {
        getContractsByPage,
        deleteContractById,
        addContract,
        updateContractById,
        updateStatusContract,
        getContractById,
        uploadContractFile,
        getContractsCount,
        downloadContractFile
    }
}

export default ContractApis
