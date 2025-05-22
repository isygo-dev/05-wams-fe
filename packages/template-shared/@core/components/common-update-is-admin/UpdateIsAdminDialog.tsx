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
import { AccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import AccountApis from 'ims-shared/@core/api/ims/account'
import { RequestIsAdmin } from '../../types/helper/userTypes'

type Item = 'Account'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  setSelectedRowId: number | undefined
  newStatus: boolean | undefined
  item: Item | undefined
}
const UpdateIsAdminDialog = (props: Props) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  // ** Props
  const { open, setOpen, setSelectedRowId, newStatus } = props

  // ** States
  const [userInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const mutationAccount = useMutation({
    mutationFn: (data: RequestIsAdmin) => AccountApis(t).updateAccountIsAdminFlag(data),
    onSuccess: (res: RequestIsAdmin) => {
      const cachedData: AccountDto | undefined = queryClient.getQueryData('profile')
      if (cachedData != undefined) {
        cachedData.isAdmin = res.newStatus
        queryClient.setQueryData('profile', cachedData)
      }
      handleClose()
      const cachedAccounts: AccountDto[] = queryClient.getQueryData('accounts') || []
      const index = cachedAccounts.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedAccounts = [...cachedAccounts]
        updatedAccounts[index].isAdmin = res.newStatus
        queryClient.setQueryData('accounts', updatedAccounts)
        console.log('res.newStatus', queryClient.getQueryData('accounts'))
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const handleUpdateStatusConfirmation = () => {
    const data: RequestIsAdmin = { id: setSelectedRowId ?? 0, newStatus: newStatus }
    mutationAccount.mutate(data)
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

            <Typography>{t('You_are_making_this_user_as_an_admin_on_his_domain')}</Typography>
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
            {t('OK')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UpdateIsAdminDialog
