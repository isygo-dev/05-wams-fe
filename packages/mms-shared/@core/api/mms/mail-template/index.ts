import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import mmsApiUrls from "mms-shared/configs/mms_apis"
import {templateDetailsDataType, TemplateType, TemplateTypes} from 'mms-shared/@core/types/mms/templateTypes'
import toast from 'react-hot-toast'
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";


const MailTemplateApis = (t: TFunction) => {
    const permission = PermissionPage.MSG_TEMPLATE

    const getMessageTemplates = async () => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailTemplate_EndPoint}`, {
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
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
    }

    const addMessageTemplate = async (data: TemplateTypes) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        if (data.file) {
            const formData = new FormData() // Create a FormData instance
            formData.append('domain', data.domain) // Append data to the form
            formData.append('name', data.name) // Append data to the form
            formData.append('description', data.description) // Append data to the form
            formData.append('language', data.language) // Append language to the form
            formData.append('file', data.file)
            const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailTemplate_FileCreate_EndPoint}`, {
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
                toast.success(t('Message.template_added_successfully'))
            }

            // Handle 204 No Content or empty body
            if (response.status === 204) {
                return []; // or return null, depending on your business logic
            }

            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                console.warn("[API] Expected JSON but received:", contentType);

                return null;
            }

            const result = await response.json();

            return result;
        }
    }

    const updateMessageTemplate = async (data: TemplateType) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const formData = new FormData() // Create a FormData instance
        formData.append('domain', data.domain) // Append data to the form
        formData.append('name', data.name) // Append data to the form
        formData.append('code', data.code)
        formData.append('description', data.description) // Append data to the form
        formData.append('language', data.language)
        if (data.file != null || data.file != undefined) {
            formData.append('file', data.file)
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailTemplate_FileUpdate_EndPoint}?id=${data.id}`, {
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
            toast.success(t('Message.template_updated_successfully'))
        }

        // Handle 204 No Content or empty body
        if (response.status === 204) {
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
    }

    const downloadMessageTemplateFile = async (templateDetailsData: templateDetailsDataType) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on download ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${mmsApiUrls.apiUrl_MMS_MailTemplate_FileDownload_EndPoint}?id=${templateDetailsData.templateDetailsData.id}&version=1`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        return await response.arrayBuffer().then(data => {
            return new TextDecoder().decode(data)
        })
    }

    const handleDownloadMessageTemplateFile = async (data: TemplateType) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on download ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${mmsApiUrls.apiUrl_MMS_MailTemplate_FileDownload_EndPoint}?id=${data.id}&version=1`,
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
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = data.code + '.ftl' // Set the desired download filename
            a.click()
        }
    }

    const deleteMessageTemplate = async (id: number) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailTemplate_EndPoint}?id=${id}`, {
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
            toast.success(t('Message.template_deleted_successfully'))
        }

        return id
    }

    const getMessageTemplateById = async (id: number) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailTemplate_EndPoint}/${id}`, {
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

        return response.json()
    }

    const getMessageTemplateNames = async () => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_templateByNames_EndPoint}`, {
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
            return []; // or return null, depending on your business logic
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn("[API] Expected JSON but received:", contentType);

            return null;
        }

        const result = await response.json();

        return result;
    }

    return {
        getMessageTemplates,
        addMessageTemplate,
        updateMessageTemplate,
        downloadMessageTemplateFile,
        handleDownloadMessageTemplateFile,
        deleteMessageTemplate,
        getMessageTemplateById,
        getMessageTemplateNames
    }
}

export default MailTemplateApis
