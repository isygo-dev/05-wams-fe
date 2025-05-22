import React, { Fragment, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'

const ViewCertificationLinkPopUp = props => {
  const { certif, index, open, setOpen, handleCertificationChange } = props
  const [tempLink, setTempLink] = useState(certif.link || '')
  const { t } = useTranslation()

  const handleClose = () => {
    setTempLink(certif.link || '') // Reset to the original value on cancel
    setOpen(false)
  }

  const handleSaveAndClose = () => {
    handleCertificationChange(index, 'link', tempLink) // Apply the changes on confirmation
    handleClose()
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>t{'Certification link'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>{/* Add any additional text content if needed */}</DialogContentText>
          <TextField
            id='name'
            autoFocus
            fullWidth
            type='text'
            label='Certification Link'
            value={tempLink}
            onChange={e => setTempLink(e.target.value)} // Store changes locally
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSaveAndClose} color='primary'>
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ViewCertificationLinkPopUp
