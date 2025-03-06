import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";


type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  handleClose: () => void
  handleConfirmation: () => void
}
const UpdateStatus = (props: Props) => {
  const { open, setOpen, handleClose, handleConfirmation} = props;

  const { t } = useTranslation();

  return (
    <>

      <Dialog fullWidth open={open} onClose={handleClose}
              sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 512}}}>
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
              '& svg': {mb: 8, color: 'warning.main'}
            }}
          >
             <Typography variant='h4' sx={{mb: 5, color: 'text.secondary'}}>
               Are you sure you want to change this status ?
             </Typography>
           </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{mr: 2}} onClick={() => handleConfirmation()}
                   >
            {t('Change ')}
          </Button>
          <Button variant='outlined' color='secondary' onClick={() =>
            handleClose()} >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      </>
)
}

export default UpdateStatus
