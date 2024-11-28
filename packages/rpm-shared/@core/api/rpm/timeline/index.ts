import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import {ResumeTypes} from "rpm-shared/@core/types/rpm/ResumeTypes";
import {TFunction} from "i18next";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import rpmApiUrls from "../../../../configs/rpm_apis";

const TimeLineApis = (t: TFunction) => {
    const permission = PermissionPage.TIMELINE

    const findTimeline = async (resume: ResumeTypes) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_TimeLine_EndPoint}/${resume.code}/${resume.domain}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    return {
        findTimeline
    }
}

export default TimeLineApis
