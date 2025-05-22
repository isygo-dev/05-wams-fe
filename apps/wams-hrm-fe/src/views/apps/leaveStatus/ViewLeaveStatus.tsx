import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useFormContext } from 'react-hook-form'
import { LeaveStatusContext } from '../../../pages/apps/leaveStatus/view/[id]'
import { IEnumAbsenceType, IEnumStatusType, LeaveStatusType } from 'hrm-shared/@core/types/hrm/leaveStatusType'
import { EmployeeType } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { VacationAbsenceInformation } from './component/vacationAbsenceInformation'
import MyCalendar from './component/AbsenceRequests'
import TableBasic from './component/AbsenceTable'
import { useRouter } from 'next/router'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'
import LeaveStatusApis from 'hrm-shared/@core/api/hrm/leaveStatus'
import { useTranslation } from 'react-i18next'

export const ViewLeaveStatusDrawer = ({ refetch }) => {
  const { t } = useTranslation()
  const { handleSubmit, getValues } = useFormContext<LeaveStatusType>()
  const router = useRouter()
  const LeaveStatus = useContext(LeaveStatusContext)
  const LeaveData = LeaveStatus.LeaveStatusData
  const queryClient = useQueryClient()
  const [msgError, setMsgError] = useState<boolean>(false)
  const { data: employee, isLoading } = useQuery<EmployeeType>(['employeeData', LeaveData?.codeEmployee], () =>
    EmployeeApis(t).getEmployeeByCode(LeaveData?.codeEmployee)
  )

  const updateLeaveStatusMutation = useMutation({
    mutationFn: (params: any) => LeaveStatusApis(t).updateLeaveStatus(params, LeaveData.id),
    onSuccess: async (res: LeaveStatusType) => {
      const cachedLeaveStatus: LeaveStatusType[] = queryClient.getQueryData('leaveStatus') || []
      const index = cachedLeaveStatus.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedLeaveStatus = [...cachedLeaveStatus]
        updatedLeaveStatus[index] = res
        queryClient.setQueryData('leaveStatus', updatedLeaveStatus)
      }
      await refetch()
    }
  })

  const handleLeaveTakenUpdate = newVacation => {
    console.log(LeaveData)
    console.log(newVacation)
    if (newVacation.status === IEnumStatusType.ACCEPTED) {
      if (newVacation.absence === IEnumAbsenceType.RECOVERY_HOLIDAY) {
        LeaveData.recoveryLeaveTaken = LeaveData.recoveryLeaveTaken + newVacation.recoveryLeaveTaken
      } else {
        LeaveData.leaveTakenCount = LeaveData.leaveTakenCount + newVacation.leaveTaken
      }
    }
    if (newVacation.status === IEnumStatusType.REJECTED) {
      if (newVacation.absence === IEnumAbsenceType.RECOVERY_HOLIDAY) {
        LeaveData.recoveryLeaveTaken = LeaveData.recoveryLeaveTaken - newVacation.recoveryLeaveTaken
      } else {
        LeaveData.leaveTakenCount = LeaveData.leaveTakenCount - newVacation.leaveTaken
      }
    }
    onSubmit(LeaveData)
  }

  const SubmitError = errorMsg => {
    setMsgError(errorMsg)
  }

  const onSubmit = async (data: LeaveStatusType) => {
    const vacationArray = Array.isArray(data.vacation) ? data.vacation : [data.vacation]
    const updatedVacationList = vacationArray.concat(LeaveData.vacation)
    const updatedData = {
      ...LeaveData,
      ...data,
      vacation: updatedVacationList
    }
    updateLeaveStatusMutation.mutate(updatedData)
  }

  const handleReset = () => {
    router.push('/apps/leaveStatus')
  }

  const handleSave = () => {
    onSubmit(getValues())
  }

  return (
    <>
      <Grid container direction='column' justifyContent='space-between' alignItems='stretch'>
        <HeaderCardView
          title={'Contract.contract'}
          btnSave={true}
          btnCancel={true}
          multiBtn={false}
          ITEM_HEIGHT={0}
          listItems={[]}
          handleReset={handleReset}
          handleChange={null}
          onSubmit={handleSave}
          disableCancel={false}
          disableSubmit={msgError}
        />
        <Card>
          <CardContent>
            <Grid container direction='column' justifyContent='space-between' alignItems='stretch'>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} justifyContent='space-between' alignItems='stretch'>
                  {!isLoading && (
                    <Grid item xs={12} sm={6} md={2}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent
                          className='container'
                          sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                        >
                          <Typography variant='h6'>
                            {employee?.firstName} {employee?.lastName}
                          </Typography>
                          <Avatar
                            src={`${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${employee?.id}`}
                            variant='rounded'
                            sx={{ width: 250, height: 250 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={10}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent className='container' />
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 16 }}>
                <Grid item xs={12} sm={12}>
                  <VacationAbsenceInformation refetch={refetch} />
                </Grid>
              </div>
              <Grid>
                <div style={{ marginBottom: 16 }}>
                  <MyCalendar SubmitError={SubmitError} />
                </div>
              </Grid>
            </form>
            <TableBasic refetch={refetch} onLeaveTakenUpdate={handleLeaveTakenUpdate} />
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
