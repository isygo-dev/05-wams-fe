import React from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import CalPreviewCard from "../../../../views/apps/calendarPreview/eventPreview/CalPreviewCard";
import CalendarApis from "cms-shared/@core/api/cms/calendar";
import {useTranslation} from "react-i18next";

const CalendarView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query
  const {
    data: CalendarDetail,
    isError,
    isLoading
  } = useQuery(['CalendarDetail', id], () => CalendarApis(t).getCalendarById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !CalendarDetail) {
    return <div>Error loading events data</div>
  }

  return <CalPreviewCard calendarDetail={CalendarDetail}/>

}

export default CalendarView
