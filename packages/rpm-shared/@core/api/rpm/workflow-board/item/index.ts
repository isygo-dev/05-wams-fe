import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import rpmApiUrls from 'rpm-shared/configs/rpm_apis'
import { InterviewEventType } from 'rpm-shared/@core/types/rpm/jobApplicationType'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import toast from 'react-hot-toast'
import { BpmEventRequest } from 'rpm-shared/@core/types/rpm/itemTypes'

const WorkflowBoardItemApis = (t: TFunction) => {
  const permission = PermissionPage.WORKFLOW_BOARD

  const getWorkflowBoardItems = async (wbCode: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Items_EndPoint}?wbCode=${wbCode}`, {
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
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getWorkflowBoardItemEvent = async (code: string, id: number) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Event_EndPoint}/${code}/${id} `, {
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
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getWorkflowBoardItemEvents = async (code: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Candidate_EndPoint}/${code}`, {
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
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const addWorkflowBoardItemEvent = async (event: InterviewEventType, code: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Event_EndPoint}/${event.type}/${code}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(event)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('WorkflowBoard.added_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const updateWorkflowBoardItemEvent = async (event: InterviewEventType, code: string) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Event_EndPoint}/${event.type}/${code}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(event)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('WorkflowBoard.added_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const addWorkflowBoardItem = async (item: BpmEventRequest) => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_Item_EndPoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('WorkflowBoard.item_added_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getWorkflowBoardItemTypes = async () => {
    if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${rpmApiUrls.apiUrl_RPM_WorkflowBoard_ItemTypes_EndPoint}`, {
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
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  return {
    getWorkflowBoardItems,
    getWorkflowBoardItemEvent,
    getWorkflowBoardItemEvents,
    addWorkflowBoardItemEvent,
    updateWorkflowBoardItemEvent,
    addWorkflowBoardItem,
    getWorkflowBoardItemTypes
  }
}

export default WorkflowBoardItemApis
