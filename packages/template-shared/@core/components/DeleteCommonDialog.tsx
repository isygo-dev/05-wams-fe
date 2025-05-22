// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from './icon'
import { useTranslation } from 'react-i18next'

type Item =
  | 'Digest'
  | 'PEB'
  | 'Account'
  | 'Password'
  | 'Role'
  | 'Token'
  | 'Application'
  | 'Domain'
  | 'Quiz'
  | 'Template'
  | 'Config'
  | 'Storage'
  | 'Resume'
  | 'Job'
  | 'WorkflowBoard'
  | 'WorkflowState'
  | 'Workflow'
  | 'Parametre'
  | 'Annex'
  | 'WorkflowTransition'
  | 'Calendar'
  | 'Sections'
  | 'Questions'
  | 'Option'
  | 'Customer'
  | 'Contract'
  | 'Employee'
  | 'UserStory'
  | 'AIJob'
  | 'CandidateQuiz'
  | 'DomainLink'
  | 'Post'
  | 'Comment'
  | 'Event'
  | 'Codification'
  | 'IntegrationOrder'
  | 'flow'
  | 'Category'
  | 'Author'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  selectedRowId: number | undefined | string
  item: Item
  onDelete: (id: number | string) => void
  buttonId?: string
}

const DeleteCommonDialog = (props: Props) => {
  const { t } = useTranslation()

  // ** Props
  const { open, setOpen, onDelete, item, selectedRowId, buttonId } = props

  const [userInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = () => {
    onDelete(selectedRowId ?? 0)
    setOpen(false)
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
            <Typography>{t('You want to delete this') + ' ' + t(item + '.' + item) + '!'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation()} id={buttonId}>
            {t('Action.Delete')}
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleClose()} id={buttonId}>
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
          <Button variant='contained' color='success' onClick={handleSecondDialogClose} id={buttonId}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteCommonDialog
