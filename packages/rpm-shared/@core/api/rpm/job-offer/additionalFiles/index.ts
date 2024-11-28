import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {TFunction} from "i18next";
import toast from "react-hot-toast";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";

const JobOfferAdditionalFilesApis = (t: TFunction) => {
    const permission = PermissionPage.EMPLOYEE

    const uploadAdditionalFiles = async (data: { parentId: number; files: Blob[] }) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on upload ' + t(permission))

            return
        }

        const formData = new FormData()
        for (const key of Object.keys(data.files)) {
            formData.append('files', data.files[key])
        }
        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_MultiFilesUpload_EndPoint}?parentId=${data.parentId}`, {
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
            toast.success(t('JobOffer.File_uploaded_successfully'))
        }

        return await response.json()
    }

    const downloadAdditionalFile = async (data: {
        parentId: number;
        fileId: number;
        version: number;
        originalFileName: string
    }) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${rpmApiUrls.apiUrl_RPM_JobOffer_MultiFilesDownload_EndPoint}?parentId=${data.parentId}&fileId=${data.fileId}&version=${data.version}`, {
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

    const deleteAdditionalFile = async (data: { parentId: number; fileId: number }) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${rpmApiUrls.apiUrl_RPM_JobOffer_MultiFilesDelete_EndPoint}?parentId=${data.parentId}&fileId=${data.fileId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.file_deleted_successfully'))
        }

        return data.fileId
    }

    return {
        uploadAdditionalFiles,
        downloadAdditionalFile,
        deleteAdditionalFile
    }
}

export default JobOfferAdditionalFilesApis
