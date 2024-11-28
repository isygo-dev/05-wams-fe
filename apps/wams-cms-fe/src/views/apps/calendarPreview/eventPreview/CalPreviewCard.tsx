// ** Types

import CalendarWrapper from 'template-shared/@core/styles/libs/fullcalendar'
import AddEventSidebar from './AddEventSidebar'
import {useSettings} from 'template-shared/@core/hooks/useSettings'
import {Box, Theme, useMediaQuery} from '@mui/material'
import {useState} from 'react'
import CalendarEvent from './CalendarEvent'
import {useQuery} from 'react-query'
import SidebarLeft from './SidebarLeft'
import {useTranslation} from "react-i18next";
import {CalendarColors, CalendarsLayoutProps, EventType} from "template-shared/@core/types/helper/calendarTypes";
import EventApis from "cms-shared/@core/api/cms/events";

const calendarsColor: CalendarColors = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info',
  INTERVIEW: 'secondary'
}

const CalPreviewCard = ({calendarDetail}: CalendarsLayoutProps) => {
  const {t} = useTranslation()
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)
  console.log('calendarDetail', calendarDetail)
  const {
    data: eventsList,
    isLoading: isLoadingEvent,
    refetch
  } = useQuery(['eventsList', calendarDetail?.domain, calendarDetail?.name], () => EventApis(t).getEventsByDomainAndCalendar(calendarDetail?.domain, calendarDetail?.name))

  const {settings} = useSettings()
  const leftSidebarWidth = 300
  const addEventSidebarWidth = 400
  const {skin, direction} = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)
  const handleSelectEvent = (data: EventType) => {
    // const updatedItems = {...eventsList}
    eventsList.selectedEvent = data
  }

  return (
    <>
      {!isLoadingEvent ? (
        <CalendarWrapper
          className='app-calendar'
          sx={{
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && {border: theme => `1px solid ${theme.palette.divider}`})
          }}
        >
          <SidebarLeft
            mdAbove={mdAbove}
            calendarApi={calendarApi}
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarWidth={leftSidebarWidth}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleAddEventSidebarToggle={handleAddEventSidebarToggle}
            domain={calendarDetail?.domain}
            name={calendarDetail?.name}
            lock={calendarDetail?.locked}
          />
          <Box
            sx={{
              p: 6,
              pb: 0,
              flexGrow: 1,
              borderRadius: 1,
              boxShadow: 'none',
              backgroundColor: 'background.paper',
              ...(mdAbove ? {borderTopLeftRadius: 0, borderBottomLeftRadius: 0} : {})
            }}
          >
            <CalendarEvent
              store={eventsList}
              direction={direction}
              calendarApi={calendarApi}
              calendarsColor={calendarsColor}
              setCalendarApi={setCalendarApi}
              handleSelectEvent={handleSelectEvent}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleAddEventSidebarToggle={handleAddEventSidebarToggle}
              lock={calendarDetail?.locked}
            />
          </Box>
          <AddEventSidebar
            store={eventsList}
            refetch={refetch}
            calendarApi={calendarApi}
            drawerWidth={addEventSidebarWidth}
            handleSelectEvent={handleSelectEvent}
            addEventSidebarOpen={addEventSidebarOpen}
            handleAddEventSidebarToggle={handleAddEventSidebarToggle}
            domain={calendarDetail?.domain}
            name={calendarDetail?.name}
          />
        </CalendarWrapper>
      ) : null}
    </>
  )
}

export default CalPreviewCard
