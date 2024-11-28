// ** Redux Imports
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import mmsApiUrls from "mms-shared/configs/mms_apis"
import {MailSenderConfigData} from 'mms-shared/@core/types/mms/mailSenderConfigTypes'
import toast from 'react-hot-toast'
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";

const MailSenderConfigApis = (t: TFunction) => {
    const permission = PermissionPage.SENDER_CONFIG

    const getMailSenderConfigurations = async () => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailSenderConfig_EndPoint}`, {
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

    // ** Add Config
    const addMailSenderConfiguration = async (data: MailSenderConfigData) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailSenderConfig_EndPoint}`, {
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
            toast.success(t('Mail sender configuration_added_successfully'))
        }

        return await response.json()
    }

    // **Update Config
    const updateMailSenderConfiguration = async (data: MailSenderConfigData) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailSenderConfig_EndPoint}?id=${data.id}`, {
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
            toast.success(t('Mail sender configuration_updated_successfully'))
        }

        return await response.json()
    }

    // ** Delete Config
    const deleteMailSenderConfiguration = async (id: number) => {
        if (!checkPermission(PermissionApplication.MMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${mmsApiUrls.apiUrl_MMS_MailSenderConfig_EndPoint}?id=${id}`, {
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
            toast.success(t('Mail sender configuration_deleted_successfully'))
        }

        return id
    }

    return {
        deleteMailSenderConfiguration,
        updateMailSenderConfiguration,
        addMailSenderConfiguration,
        getMailSenderConfigurations
    }
}

export default MailSenderConfigApis
