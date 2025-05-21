import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {TFunction} from "i18next";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";

const ResumeStatApis = (t: TFunction) => {
    const permission = PermissionPage.RESUME

    const getGlobalStatistics = async statType => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Resume_StatisticGlobal_EndPoint}?statType=${statType}`, {
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

    const getStatisticsByCode = async code => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Resume_StatisticObject_EndPoint}?code=${code}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (response.status === 204) {
            return []
        }

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
        getGlobalStatistics,
        getStatisticsByCode
    }
}

export default ResumeStatApis