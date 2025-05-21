import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import {JobTemplate} from 'rpm-shared/@core/types/rpm/jobOfferTemplateTypes'
import {TFunction} from "i18next";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import toast from "react-hot-toast";

const JobOfferTemplateApis = (t: TFunction) => {
    const permission = PermissionPage.JOB_OFFER_TEMPLATE

    const getJobOfferTemplates = async () => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_Template_EndPoint}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
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

    const deleteJobOfferTemplateById = async (id: number) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_Template_EndPoint}?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'jobTemplate/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.template_deleted_successfully'))
        }

        return id
    }

    const updateJobOfferTemplate = async (jobTemplate: FormData) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_Template_EndPoint}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: jobTemplate
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.template_updated_successfully'))
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

    const addJobOfferTemplate = async (jobTemplate: JobTemplate) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_Template_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },

            body: JSON.stringify(jobTemplate)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.template_added_successfully'))
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
        getJobOfferTemplates,
        deleteJobOfferTemplateById,
        updateJobOfferTemplate,
        addJobOfferTemplate
    }
}

export default JobOfferTemplateApis
