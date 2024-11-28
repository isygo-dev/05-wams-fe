import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from "i18next";
import {checkPermission} from "template-shared/@core/api/helper/permission";

const EmployeeStatApis = (t: TFunction) => {
    const permission = PermissionPage.EMPLOYEE

    const getGlobalStatistics = async (statType: any) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_StatisticGlobal_EndPoint}?statType=${statType}`, {
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

    const getStatisticsByCode = async (code: any) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_Employee_StatisticObject_EndPoint}?code=${code}`, {
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

    return {
        getGlobalStatistics,
        getStatisticsByCode
    }
}

export default EmployeeStatApis
