import React, {useContext} from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'
import {useTranslation} from 'react-i18next'
import Icon from 'template-shared/@core/components/icon'
import {LeaveStatusContext} from '../../../../pages/apps/leaveStatus/view/[id]'
import {IEnumStatusType} from 'hrm-shared/@core/types/hrm/leaveStatusType'
import {useMutation} from 'react-query'
import VaccationApis from "hrm-shared/@core/api/hrm/leaveStatus/vacation";

const TableBasic = ({refetch, onLeaveTakenUpdate}) => {
  const {t} = useTranslation()
  const LeaveStatus = useContext(LeaveStatusContext)
  const LeaveData = LeaveStatus.LeaveStatusData
  const mutation = useMutation(VaccationApis(t).updateVacation)
  const deleteMutation = useMutation(VaccationApis(t).deleteVacationById)
  const handleStatusUpdate = async (id, newStatus) => {
    const updatedData = LeaveData?.vacation?.find(updatedVacation => updatedVacation.id === id)
    console.log(LeaveData?.vacation?.find(updatedVacation => updatedVacation.id === id))
    console.log(id)
    console.log(LeaveData.vacation)
    if (updatedData != undefined) {
      updatedData.status = newStatus
    }
    try {
      await mutation.mutateAsync(updatedData)
      if (newStatus === IEnumStatusType.ACCEPTED || newStatus === IEnumStatusType.REJECTED) {
        console.log(updatedData)
        onLeaveTakenUpdate(updatedData)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      refetch()
    } catch (error) {
      console.error('Error delete vacation:', error)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{t('LeaveStatus.StartDate')}</TableCell>
            <TableCell>{t('LeaveStatus.EndDate')}</TableCell>
            <TableCell>{t('LeaveStatus.Absence')}</TableCell>
            <TableCell>{t('LeaveStatus.leaveTaken')}</TableCell>
            <TableCell>{t('LeaveStatus.status')}</TableCell>
            <TableCell>{t('Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {LeaveData.vacation.map(row => (
            <TableRow
              key={row.name}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
              <TableCell>{row.absence}</TableCell>
              <TableCell>{row.leaveTaken}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                {(row.status === IEnumStatusType.CREATED || row.status === IEnumStatusType.REJECTED) && (
                  <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => handleDelete(row.id)}>
                    <Icon icon='tabler:trash'/>
                  </IconButton>
                )}
                {row.status === IEnumStatusType.CREATED && (
                  <IconButton
                    size='small'
                    sx={{color: 'text.secondary'}}
                    onClick={() => handleStatusUpdate(row.id, IEnumStatusType.PENDING)}
                  >
                    <Icon icon='tabler:send'/>
                  </IconButton>
                )}
                {(row.status === IEnumStatusType.PENDING || row.status === IEnumStatusType.REJECTED) && (
                  <IconButton
                    size='small'
                    sx={{color: 'text.secondary'}}
                    onClick={() => handleStatusUpdate(row.id, IEnumStatusType.ACCEPTED)}
                  >
                    <Icon icon='tabler:check'/>
                  </IconButton>
                )}
                {(row.status === IEnumStatusType.ACCEPTED || row.status === IEnumStatusType.ACCEPTED) && (
                  <IconButton
                    size='small'
                    sx={{color: 'text.secondary'}}
                    onClick={() => handleStatusUpdate(row.id, IEnumStatusType.REJECTED)}
                  >
                    <Icon icon='tabler:x'/>
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableBasic
