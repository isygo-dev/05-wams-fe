import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import apiUrls from 'template-shared/configs/apiUrl'
import toast from 'react-hot-toast'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  AddEventCalendarType,
  AddEventType,
  CalendarsStoreType,
  EventCalendarType,
  EventType
} from 'template-shared/@core/types/helper/calendarTypes'

const EventApis = (t: TFunction) => {
  const permission = PermissionPage.VEVENT

  const getEventsByDomainAndCalendar = async (domain: string, name: string) => {
    if (!checkPermission(PermissionApplication.CMS, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${apiUrls.apiUrl_CMS_Calendar_EventByDomainAndCalendarName_EndPoint}/${domain}/${name}`,
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

    const eventsList: EventType[] = []
    const dataRes = await response.json()
    dataRes.forEach(e => {
      const event: EventType = {
        id: e.id,
        url: '',
        title: e.name,
        allDay: false,
        end: e.endDate,
        start: e.startDate,
        domain: e.domain,
        calendarName: e.calendar,
        extendedProps: {
          calendar: e.type
        }
      }
      eventsList.push(event)
    })

    const calendarsStoreType: CalendarsStoreType = {
      events: eventsList,
      selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC', 'INTERVIEW'],
      selectedEvent: {},
      secondEvent: []
    }

    return calendarsStoreType
  }

  const addEvent = async (event: AddEventType) => {
    if (!checkPermission(PermissionApplication.CMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const newEvent: AddEventCalendarType = {
      domain: event.domain,
      calendar: event.calendarName,
      name: event.title,
      title: event.title,
      type: event.extendedProps.calendar,
      startDate: event.start,
      endDate: event.end
    }

    const response = await AppQuery(`${apiUrls.apiUrl_CMS_Calendar_Event_EndPoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(newEvent)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Calendar.event_added_successfully'))
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

  const updateEvent = async (event: EventType) => {
    if (!checkPermission(PermissionApplication.CMS, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const editEvent: EventCalendarType = {
      id: event.id,
      domain: event.domain,
      calendar: event.calendarName,
      name: event.title,
      title: event.title,
      type: event.extendedProps.calendar,
      startDate: event.start,
      endDate: event.end
    }

    const response = await AppQuery(`${apiUrls.apiUrl_CMS_Calendar_Event_EndPoint}?id=${event.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(editEvent)
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Calendar.event_updated_successfully'))
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

  const deleteEvent = async (id: number) => {
    if (!checkPermission(PermissionApplication.CMS, permission, PermissionAction.DELETE)) {
      console.warn('Permission denied on delete ' + t(permission))

      return
    }

    const response = await AppQuery(`${apiUrls.apiUrl_CMS_Calendar_Event_EndPoint}?id=${id}`, {
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
      toast.success(t('Calendar.event_deleted_successfully'))
    }

    return id
  }

  return {
    getEventsByDomainAndCalendar,
    addEvent,
    updateEvent,
    deleteEvent
  }
}

export default EventApis
