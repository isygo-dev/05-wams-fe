import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import {PaymentBonusSchedule, PaymentSchedule} from 'hrm-shared/@core/types/hrm/contractType'
import {TFunction} from "i18next";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import toast from "react-hot-toast";

const PaymentScheduleApis = (t: TFunction) => {
    const permission = PermissionPage.CONTRACT_PAYMENT_SCHEDULE

    const getPaymentScheduleById = async (contractId: number) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_PaymentScheduleCalculate_EndPoint}/${contractId}`, {
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

    const getBonusPaymentScheduleById = async (contractId: number) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_PaymentScheduleBonusCalculate_EndPoint}/${contractId}`, {
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

    const updatePaymentSchedule = async (data: PaymentSchedule) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_PaymentSchedule_EndPoint}?id=${data.id}`, {
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
            toast.success(t('PaymentSchedule.updated_successfully'))
        }

        return await response.json()
    }

    const updatePaymentBonusSchedule = async (data: PaymentBonusSchedule) => {
        if (!checkPermission(PermissionApplication.HRM, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${hrmApiUrls.apiUrl_HRM_PaymentScheduleBonus_EndPoint}?id=${data.id}`, {
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
            toast.success(t('PaymentSchedule.updated_successfully'))
        }

        return await response.json()
    }

    return {
        getPaymentScheduleById,
        getBonusPaymentScheduleById,
        updatePaymentSchedule,
        updatePaymentBonusSchedule
    }
}

export default PaymentScheduleApis
