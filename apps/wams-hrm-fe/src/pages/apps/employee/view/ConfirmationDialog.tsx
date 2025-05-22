import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { useMutation, useQueryClient } from 'react-query'
import { EmployeeStatus, RequestEmployeeStatus } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { useTranslation } from 'react-i18next'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'

const ConfirmationDialog = ({ open, setOpen, selectedRowId, status }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const mutation = useMutation(EmployeeApis(t).updateEmployeeStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('employee')
      setOpen(false)
    },
    onError: error => {
      console.error('Error updating employee status:', error)
    }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    const data: RequestEmployeeStatus = {
      id: selectedRowId,
      newStatus: status == true ? EmployeeStatus.DISABLED : EmployeeStatus.ENABLED
    }
    console.log(data)
    console.log(status, data)
    mutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='confirmation-dialog-title'
      aria-describedby='confirmation-dialog-description'
    >
      <DialogTitle id='confirmation-dialog-title'>Confirmer l'action</DialogTitle>
      <DialogContent>
        <DialogContentText id='confirmation-dialog-description'>
          {t('Are_you_sure_you_want_to')} + {status == false ? 'activate' : 'deactivate'} + {t('The employee')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          {t('Cancel')}
        </Button>
        <Button onClick={handleConfirm} color='primary' autoFocus>
          {t('Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
