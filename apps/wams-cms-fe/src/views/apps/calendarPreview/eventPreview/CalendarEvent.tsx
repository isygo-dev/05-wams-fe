import React, {useEffect, useRef} from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {CalendarEventType, EventType} from "template-shared/@core/types/helper/calendarTypes";

const blankEvent: EventType = {
  id: null,
  domain: '',
  title: '',
  calendarName: '',
  start: '',
  end: '',
  allDay: false
}

const Calendar = (props: CalendarEventType) => {
  // ** Props
  const {
    store,
    direction,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    lock
  } = props

  // ** Refs
  const calendarRef = useRef(null)

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi, setCalendarApi])

  if (store) {
    const calendarOptions = {
      events: store?.events?.length ? store?.events : [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
        }
      },

      /*
    Enable dragging and resizing event
    ? Docs: https://fullcalendar.io/docs/editable
  */
      editable: true,

      /*
    Enable resizing event from start
    ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
  */
      eventResizableFromStart: true,

      /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
      dragScroll: true,

      /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
      dayMaxEvents: 2,

      /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
      navLinks: true,

      eventClassNames({event: calendarEvent}: any) {
        // @ts-ignore
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

        return [
          // Background Color
          `bg-${colorName}`
        ]
      },

      eventClick({event: clickedEvent}: any) {
        if (clickedEvent !== null) {
          const selectedEvent: EventType = {
            id: clickedEvent.id,
            url: clickedEvent.url,
            title: clickedEvent.title,
            allDay: clickedEvent.allDay,
            end: new Date(
              clickedEvent._instance.range.end.getFullYear(),
              clickedEvent._instance.range.end.getMonth(),
              clickedEvent._instance.range.end.getDate(),
              clickedEvent._instance.range.end.getHours() - 1,
              clickedEvent._instance.range.end.getMinutes()
            ),

            start: new Date(
              clickedEvent._instance.range.start.getFullYear(),
              clickedEvent._instance.range.start.getMonth(),
              clickedEvent._instance.range.start.getDate(),
              clickedEvent._instance.range.start.getHours() - 1,
              clickedEvent._instance.range.start.getMinutes()
            ),

            domain: clickedEvent.extendedProps.domain,
            calendarName: clickedEvent.extendedProps.calendarName,

            extendedProps: {
              calendar: clickedEvent.extendedProps.calendar
            }
          }

          handleSelectEvent(selectedEvent)

          if (!lock) {
            handleAddEventSidebarToggle()
          }

        } else {
          handleSelectEvent(null)
        }

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)

        // isAddNewEventSidebarActive.value = true
      },

      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          }
        }
      },

      dateClick(info: any) {
        const ev = {...blankEvent}
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true

        handleSelectEvent(ev)
        handleAddEventSidebarToggle()
      },

      /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
      eventDrop({event: droppedEvent}: any) {
        console.log('droppedEvent', droppedEvent)

        // const modifiedEvent: EventType = {
        //   id: droppedEvent.id,
        //   url: droppedEvent.url,
        //   title: droppedEvent.title,
        //   allDay: droppedEvent.allDay,
        //   end: new Date(droppedEvent._instance.range.end.getFullYear(),
        //     droppedEvent._instance.range.end.getMonth(),
        //     droppedEvent._instance.range.end.getDate(),
        //     droppedEvent._instance.range.end.getHours() - 1,
        //     droppedEvent._instance.range.end.getMinutes()),
        //
        //   start: new Date(droppedEvent._instance.range.start.getFullYear(),
        //     droppedEvent._instance.range.start.getMonth(),
        //     droppedEvent._instance.range.start.getDate(),
        //     droppedEvent._instance.range.start.getHours() - 1,
        //     droppedEvent._instance.range.start.getMinutes()),
        //
        //   domain: droppedEvent.extendedProps.domain,
        //   calendarName: droppedEvent.extendedProps.calendarName,
        //
        //   extendedProps: {
        //     calendar: droppedEvent.extendedProps.calendar,
        //   }
        // }

        // dispatch(updateEvent(modifiedEvent))

        // updateEvent()
      },

      /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
      eventResize({event: resizedEvent}: any) {
        // dispatch(updateEvent(resizedEvent))
        console.log(resizedEvent)

        // updateEvent()
      },

      ref: calendarRef,

      // Get direction from app state (store)
      direction
    }

    // @ts-ignore
    return <FullCalendar {...calendarOptions} />
  } else {
    const calendarOptions = {
      events: [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
        }
      },

      /*
    Enable dragging and resizing event
    ? Docs: https://fullcalendar.io/docs/editable
  */
      editable: true,

      /*
    Enable resizing event from start
    ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
  */
      eventResizableFromStart: true,

      /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
      dragScroll: true,

      /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
      dayMaxEvents: 2,

      /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
      navLinks: true,

      eventClassNames({event: calendarEvent}: any) {
        // @ts-ignore
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

        return [
          // Background Color
          `bg-${colorName}`
        ]
      },

      eventClick({event: clickedEvent}: any) {
        if (clickedEvent !== null) {
          const selectedEvent: EventType = {
            id: clickedEvent.id,
            url: clickedEvent.url,
            title: clickedEvent.title,
            allDay: clickedEvent.allDay,
            end: new Date(
              clickedEvent._instance.range.end.getFullYear(),
              clickedEvent._instance.range.end.getMonth(),
              clickedEvent._instance.range.end.getDate(),
              clickedEvent._instance.range.end.getHours() - 1,
              clickedEvent._instance.range.end.getMinutes()
            ),

            start: new Date(
              clickedEvent._instance.range.start.getFullYear(),
              clickedEvent._instance.range.start.getMonth(),
              clickedEvent._instance.range.start.getDate(),
              clickedEvent._instance.range.start.getHours() - 1,
              clickedEvent._instance.range.start.getMinutes()
            ),

            domain: clickedEvent.extendedProps.domain,
            calendarName: clickedEvent.extendedProps.calendarName,

            extendedProps: {
              calendar: clickedEvent.extendedProps.calendar
            }
          }

          handleSelectEvent(selectedEvent)
          handleAddEventSidebarToggle()
        } else {
          handleSelectEvent(null)
        }

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)

        // isAddNewEventSidebarActive.value = true
      },

      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          }
        }
      },

      dateClick(info: any) {
        const ev = {...blankEvent}
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true

        handleSelectEvent(ev)
        handleAddEventSidebarToggle()
      },

      /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
      eventDrop({event: droppedEvent}: any) {
        console.log('droppedEvent', droppedEvent)

        // const modifiedEvent: EventType = {
        //   id: droppedEvent.id,
        //   url: droppedEvent.url,
        //   title: droppedEvent.title,
        //   allDay: droppedEvent.allDay,
        //   end: new Date(droppedEvent._instance.range.end.getFullYear(),
        //     droppedEvent._instance.range.end.getMonth(),
        //     droppedEvent._instance.range.end.getDate(),
        //     droppedEvent._instance.range.end.getHours() - 1,
        //     droppedEvent._instance.range.end.getMinutes()),
        //
        //   start: new Date(droppedEvent._instance.range.start.getFullYear(),
        //     droppedEvent._instance.range.start.getMonth(),
        //     droppedEvent._instance.range.start.getDate(),
        //     droppedEvent._instance.range.start.getHours() - 1,
        //     droppedEvent._instance.range.start.getMinutes()),
        //
        //   domain: droppedEvent.extendedProps.domain,
        //   calendarName: droppedEvent.extendedProps.calendarName,
        //
        //   extendedProps: {
        //     calendar: droppedEvent.extendedProps.calendar,
        //   }
        // }

        // dispatch(updateEvent(modifiedEvent))

        // updateEvent()
      },

      /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
      eventResize({event: resizedEvent}: any) {
        // dispatch(updateEvent(resizedEvent))
        console.log(resizedEvent)

        // updateEvent()
      },

      ref: calendarRef,

      // Get direction from app state (store)
      direction
    }

    // @ts-ignore
    return <FullCalendar {...calendarOptions} />
  }
}

export default Calendar
