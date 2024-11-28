import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Icon from 'template-shared/@core/components/icon'
import {DialogContent} from '@mui/material'
import IconButton, {IconButtonProps} from '@mui/material/IconButton'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {styled} from '@mui/material/styles'
import Box from "@mui/material/Box";
import DocViewer, {DocViewerRenderers} from 'react-doc-viewer'
import {MiniResume} from "rpm-shared/@core/types/rpm/ResumeTypes";


const CustomCloseButton = styled(IconButton)<IconButtonProps>(({theme}) => ({
  top: 20,
  right: 20,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[6],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translate(7px, -5px)'
  }
}))

interface DialogProps {
  open: boolean
  onCloseClick: () => void
  resumePreview: MiniResume
}

const ResumeDialog = (props: DialogProps) => {
  const {open, onCloseClick, resumePreview} = props
  const {t} = useTranslation()

  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        <Typography variant='h6' component='span'>
          {t('Resume.Resume')}
        </Typography>
        <CustomCloseButton
          aria-label='close'
          onClick={() => {
            onCloseClick()
          }}
        >
          <Icon icon='tabler:x'/>
        </CustomCloseButton>
      </DialogTitle>
      <DialogContent>

        <Box textAlign='center'>

          <DocViewer
            key={Date.now()}
            pluginRenderers={DocViewerRenderers}
            documents={[
              {
                uri: `${rpmApiUrls.apiUrl_RPM_Resume_FileDownload_EndPoint}?id=${resumePreview.id}&version=1`,
                fileType: resumePreview.extension
              }
            ]}
            config={{
              header: {
                disableHeader: true,
                disableFileName: false,
                retainURLParams: false
              }
            }}
          />
        </Box>

      </DialogContent>
    </Dialog>
  )
}

export default ResumeDialog
