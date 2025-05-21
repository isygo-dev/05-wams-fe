import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import {ShareJobRequestDto} from 'ims-shared/@core/types/ims/accountTypes'
import {JobOfferType} from 'rpm-shared/@core/types/rpm/jobOfferTypes'
import {TFunction} from "i18next";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import toast from "react-hot-toast";

const JobOfferApis = (t: TFunction) => {
    const permission = PermissionPage.JOB_OFFER

    const getJobOffersByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}/${page}/${size}`, {
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

    const getJobOffersCount = async () => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_Count_EndPoint}`, {
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

    const getJobOffers = async () => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}`, {
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

    const addJobOffer = async (data: JobOfferType) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.added_successfully'))
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

    const getJobOffersNotAssignedToResume = async (resumeCode: string) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobApplication_EndPoint}/not-applied/${resumeCode}`, {
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

    const updateJobOffer = async (data: JobOfferType) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        data.industry
        console.log(data)

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}?id=${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.updated_successfully'))
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

    const deleteJobOffer = async (id: number) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}?id=${id}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.deleted_successfully'))
        }

        return id
    }

    const shareJobOffer = async (data: { id: number; request: ShareJobRequestDto }) => {
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER_SHARE_INFO, PermissionAction.WRITE)) {
            console.warn('Permission denied on share ' + t(PermissionPage.JOB_OFFER_SHARE_INFO))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_ShareInfo_EndPoint}/${data.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.request)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('JobOffer.shared_successfully'))
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

    const getJobOfferById = async (id: number) => {
        if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_JobOffer_EndPoint}/${id}`, {
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
        getJobOffersByPage,
        getJobOffersCount,
        getJobOffers,
        getJobOffersNotAssignedToResume,
        addJobOffer,
        updateJobOffer,
        deleteJobOffer,
        shareJobOffer,
        getJobOfferById
    }
}

export default JobOfferApis
