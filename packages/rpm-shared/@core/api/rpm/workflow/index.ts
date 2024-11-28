import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {TFunction} from "i18next";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import toast from "react-hot-toast";
import {WorkflowData, WorkflowsType} from "rpm-shared/@core/types/rpm/workflowTypes";

const WorkflowApis = (t: TFunction) => {
    const permission = PermissionPage.WORKFLOW

    const getWorkflows = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_EndPoint}`, {
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

    const addWorkflow = async (data: WorkflowData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_EndPoint}`, {
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
            toast.success(t('Workflow.added_successfully'))
        }

        return await response.json()
    }

    const deleteWorkFlow = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_EndPoint}?id=${id}`, {
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
            toast.success(t('Workflow.deleted_successfully'))
        }

        return id
    }

    const updateWorkFlow = async (data: WorkflowsType) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_EndPoint}?id=${data.id}`, {
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
            toast.success(t('Workflow.updated_successfully'))
        }

        return await response.json()
    }

    const getWorkflowById = async (id: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_EndPoint}/${id}`, {
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

    const getUnassociatedWorkflows = async () => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_Workflow_Unassociated_EndPoint}`, {
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
        getWorkflows,
        addWorkflow,
        deleteWorkFlow,
        updateWorkFlow,
        getWorkflowById,
        getUnassociatedWorkflows
    }
}

export default WorkflowApis
