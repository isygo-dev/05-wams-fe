import React, { createContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { LeaveStatusType } from 'hrm-shared/@core/types/hrm/leaveStatusType'
import { ViewLeaveStatusDrawer } from '../../../../views/apps/leaveStatus/ViewLeaveStatus'
import LeaveStatusApis from 'hrm-shared/@core/api/hrm/leaveStatus'
import { useTranslation } from 'react-i18next'

export const LeaveStatusContext = createContext(null)

const LeaveStatusView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const {
    data: leaveData,
    isError,
    isLoading,
    refetch
  } = useQuery<LeaveStatusType>(['LeaveStatusData', id], () => LeaveStatusApis(t).getLeaveStatusById(id), {
    onSuccess: data => {
      updateData(data)
    }
  })

  const [contextData, setContextData] = useState<LeaveStatusType>(leaveData)
  const methods = useForm()
  const updateData = (newData: LeaveStatusType) => {
    setContextData(newData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !leaveData) {
    return <div>Error loading leaveStatus data</div>
  }

  return (
    <LeaveStatusContext.Provider value={{ LeaveStatusData: contextData, updateData }}>
      <FormProvider {...methods}>
        <ViewLeaveStatusDrawer refetch={refetch} />
      </FormProvider>
    </LeaveStatusContext.Provider>
  )
}

export default LeaveStatusView
