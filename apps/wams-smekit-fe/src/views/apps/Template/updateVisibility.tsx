import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { Theme } from "@mui/material/styles";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  handleClose: () => void;
  handleConfirmation: () => void;
};

const UpdateVisibility = (props: Props) => {
  const { open, setOpen, handleClose, handleConfirmation } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: 512,
          borderRadius: (theme: Theme) => theme.shape.borderRadius
        }
      }}
    >
      <DialogContent
        sx={{
          px: (theme: Theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: (theme: Theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              mb: 8,
              color: 'warning.main',
              fontSize: '5rem'
            }
          }}
        >
          <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
            {t('Are you sure you want to change the visibility?')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: (theme: Theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: (theme: Theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button
          variant='contained'
          sx={{ mr: 2 }}
          onClick={handleConfirmation}
        >
          {t('Change')}
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleClose}
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateVisibility;
