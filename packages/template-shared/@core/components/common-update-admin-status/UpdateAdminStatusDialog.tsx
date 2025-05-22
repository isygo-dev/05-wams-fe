import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'template-shared/@core/components/icon'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { AccountDto, AdminStatus } from 'ims-shared/@core/types/ims/accountTypes'
import { ApplicationType } from 'ims-shared/@core/types/ims/applicationTypes'
import { RequestLockedStatus } from '../../types/helper/calendarTypes'
import AccountApis from 'ims-shared/@core/api/ims/account'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import CustomerApis from 'ims-shared/@core/api/ims/customer'
import ApplicationApis from 'ims-shared/@core/api/ims/application'
import CalendarApis from 'cms-shared/@core/api/cms/calendar'
import { RequestStatus } from 'template-shared/@core/types/helper/userTypes'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import { CustomerDetailType } from 'ims-shared/@core/types/ims/customerTypes'

type Item = 'Account' | 'Domain' | 'Customer' | 'Application' | 'Calendar'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  setSelectedRowId: number | undefined
  newStatus: boolean | undefined
  item: Item | undefined
}

const UpdateAdminStatusDialog = (props: Props) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  // ** Props
  const { open, setOpen, setSelectedRowId, item, newStatus } = props

  // ** States
  const [userInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const mutationAccount = useMutation({
    mutationFn: (data: RequestStatus) => AccountApis(t).updateAccountAdminStatus(data),
    onSuccess: (res: RequestStatus) => {
      const cachedData: AccountDto | undefined = queryClient.getQueryData('profile')
      if (cachedData != undefined) {
        cachedData.adminStatus = res.newReqStatus
        queryClient.setQueryData('profile', cachedData)
      }
      handleClose()
      const cachedAccounts: AccountDto[] = queryClient.getQueryData('accounts') || []
      const index = cachedAccounts.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedAccounts = [...cachedAccounts]
        console.log(res.newReqStatus)
        updatedAccounts[index].adminStatus = res.newReqStatus

        queryClient.setQueryData('accounts', updatedAccounts)
      }
    },
    onError: err => {
      console.log(err)
    }
  })
  const mutationDomain = useMutation({
    mutationFn: (data: RequestStatus) => DomainApis(t).updateDomainStatus(data),
    onSuccess: (res: RequestStatus) => {
      handleClose()
      const cachedDomains: DomainType[] = queryClient.getQueryData('domains') || []
      const index = cachedDomains.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedDomains = [...cachedDomains]
        const newStatus: AdminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        updatedDomains[index].adminStatus = newStatus

        queryClient.setQueryData('domains', updatedDomains)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const mutationCustomer = useMutation({
    mutationFn: (data: RequestStatus) => CustomerApis(t).updateCustomerStatus(data),
    onSuccess: res => {
      handleClose()
      const cachedData: CustomerDetailType | undefined = queryClient.getQueryData('customerData')
      if (cachedData != undefined) {
        console.log('cachedData', cachedData)
        cachedData.adminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        queryClient.setQueryData('customerData', cachedData)
      }
      const cachedCustomers: CustomerDetailType[] = queryClient.getQueryData('customers') || []
      const index = cachedCustomers.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedCustomers = [...cachedCustomers]
        const newStatus: AdminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        updatedCustomers[index].adminStatus = newStatus

        queryClient.setQueryData('customers', updatedCustomers)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const mutationApplication = useMutation({
    mutationFn: (data: RequestStatus) => ApplicationApis(t).updateApplicationStatus(data),
    onSuccess: res => {
      handleClose()
      const cachedData: ApplicationType | undefined = queryClient.getQueryData('applicationData')
      if (cachedData != undefined) {
        console.log('cachedData', cachedData)
        cachedData.adminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        queryClient.setQueryData('applicationData', cachedData)
      }
      const cachedApplications: ApplicationType[] = queryClient.getQueryData('applications') || []
      const index = cachedApplications.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedApplications = [...cachedApplications]
        const newStatus: AdminStatus = res.newReqStatus == 'DISABLED' ? AdminStatus.DISABLED : AdminStatus.ENABLED
        updatedApplications[index].adminStatus = newStatus

        queryClient.setQueryData('applications', updatedApplications)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const mutationLockedCalendar = useMutation({
    mutationFn: (data: RequestLockedStatus) => CalendarApis(t).updateCalendarLockedStatus(data),
    onSuccess: (res: any) => {
      handleClose()
      const cachedCalendars: any[] = queryClient.getQueryData('calendars') || []
      const index = cachedCalendars.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedCalendars = [...cachedCalendars]
        updatedCalendars[index].locked = res.locked

        queryClient.setQueryData('calendars', updatedCalendars)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const handleUpdateStatusConfirmation = () => {
    const data: RequestStatus = { id: setSelectedRowId ?? 0, newReqStatus: newStatus ? 'ENABLED' : 'DISABLED' }
    if (item == 'Account') {
      mutationAccount.mutate(data)
    } else if (item == 'Domain') {
      mutationDomain.mutate(data)
    } else if (item == 'Customer') {
      mutationCustomer.mutate(data)
    } else if (item == 'Application') {
      mutationApplication.mutate(data)
    } else if (item == 'Calendar') {
      const dataCalendar: RequestLockedStatus = { id: setSelectedRowId ?? 0, isLocked: newStatus }
      mutationLockedCalendar.mutate(dataCalendar)
    }
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              {t('Are you sure')}
            </Typography>

            <Typography>{t('You want to update the status of this') + ' ' + t(item + '.' + item) + '!'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleUpdateStatusConfirmation()}>
            {t('Update')}
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Suspended!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? 'User has been suspended.' : 'Cancelled Suspension :)'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UpdateAdminStatusDialog
