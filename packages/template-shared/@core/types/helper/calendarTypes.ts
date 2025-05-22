import { Dispatch } from 'redux'
import { ThemeColor } from '../../layouts/types'

export type CalendarFiltersType = 'Personal' | 'Business' | 'Family' | 'Holiday' | 'ETC' | 'INTERVIEW'

export type EventDateType = Date | null | undefined

export type CalendarsType = {
  id?: number
  domain: string
  code?: string
  name: string
  icsPath?: string
  description?: string
  locked?: boolean
}

export type CalendarsTypes = {
  domain: string
  name: string
  icsPath: string
}

export type CalendarColors = {
  ETC: ThemeColor
  Family: ThemeColor
  Holiday: ThemeColor
  Personal: ThemeColor
  Business: ThemeColor
  INTERVIEW: ThemeColor
}

export type CalendarsStoreType = {
  events: EventType[]
  selectedEvent?: any | EventType
  selectedCalendars?: CalendarFiltersType[] | string[]
  secondEvent?: EventType[]
}

export type SingleCalendarCrudType = {
  calendars: CalendarsType
}

export type CalendarsLayoutProps = {
  calendarDetail: CalendarsType
}

export type SidebarEventLeftType = {
  mdAbove: boolean
  calendarApi: any
  dispatch: Dispatch<any>
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  store: CalendarsStoreType
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleAllCalendars: (val: boolean) => void
  handleSelectEvent: (event: null | EventType) => void
  handleCalendarsUpdate: (val: CalendarFiltersType) => void
}

export type EventCalendarType = {
  id: number
  domain: string
  calendar: string
  name: string
  title?: string
  type?: string
  startDate: string | Date
  endDate: string | Date
}

export type AddEventCalendarType = {
  domain: string
  calendar: string
  name: string
  title?: string
  type?: string
  startDate: string | Date
  endDate: string | Date
  allDay?: boolean
}

export type EventType = {
  id?: number
  url?: string
  title?: string
  allDay: boolean
  end: Date | string
  start: Date | string
  domain?: string
  calendarName?: string
  extendedProps?: {
    location?: string
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}

export type AddEventType = {
  url: string
  title: string
  display: string
  allDay: boolean
  end: Date | string
  start: Date | string
  domain: string
  calendarName: string
  extendedProps: {
    calendar: string
    description: string | undefined
    guests: string[] | string | undefined
  }
}

export type SidebarCalLeftType = {
  mdAbove: boolean
  calendarApi: any
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  domain: string
  name: string
  lock: boolean
}

export type CalendarEventType = {
  calendarApi: any
  store: CalendarsStoreType
  direction: 'ltr' | 'rtl'
  calendarsColor: CalendarColors
  setCalendarApi: (val: any) => void
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: EventType) => void
  lock: boolean
}

export type DeleteEvent = {
  id: number
  domain: string
  calendarName: string
}

export type EventStateType = {
  url: string
  title: string
  allDay: boolean
  guests: string[]
  description: string
  endDate: Date | string
  startDate: Date | string
  calendar: CalendarFiltersType | string
}

export type CalendarStoreType = {
  events: EventType[]
  selectedEvent: null | EventType
  selectedCalendars: CalendarFiltersType[] | string[]
}

export type CalendarType = {
  calendarApi: any
  dispatch: Dispatch<any>
  store: CalendarStoreType
  direction: 'ltr' | 'rtl'
  calendarsColor: CalendarColors
  setCalendarApi: (val: any) => void
  handleLeftSidebarToggle: () => void
  updateEvent: (event: EventType) => void
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: EventType) => void
}

export type SidebarLeftType = {
  mdAbove: boolean
  calendarApi: any
  dispatch: Dispatch<any>
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  store: CalendarStoreType
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleAllCalendars: (val: boolean) => void
  handleSelectEvent: (event: null | EventType) => void
  handleCalendarsUpdate: (val: CalendarFiltersType) => void
}

export type AddEventSidebarType = {
  store: CalendarsStoreType
  refetch: () => void
  calendarApi: any
  drawerWidth: number
  handleSelectEvent: (event: null | EventType) => void
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
  domain: string

  name: string

  //dispatch: Dispatch<any>
  //deleteEvent: (id: number) => void
  //addEvent: (event: AddEventType) => void
  //updateEvent: (event: EventType) => void
}

export type RequestLockedStatus = {
  id: number
  isLocked: boolean
}
