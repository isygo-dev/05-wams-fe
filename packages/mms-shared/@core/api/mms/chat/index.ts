import mmsApiUrls from "mms-shared/configs/mms_apis"
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import {TFunction} from 'i18next'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import {checkPermission} from 'template-shared/@core/api/helper/permission'

const ChatAccountApis = (t: TFunction) => {
    const permission = PermissionPage.ACCOUNT

    const getChatsAccounts = async (userId: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${mmsApiUrls.apiUrl_MMS_ChatAccount_EndPoint}?userId=${userId}&page=${1}&size=${10}`,
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

        return await response.json()
    }

    const getChatsFromUser = async (userId: number, fromId: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(
            mmsApiUrls.apiUrl_MMS_ChatFrom_EndPoint + `?userId=${userId}` + `&SenderId=${fromId}` + `&page=${1}` + `&size=${10}`,
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

        return await response.json()
    }

    return {
        getChatsAccounts,
        getChatsFromUser
    }
}

export default ChatAccountApis
