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

import {CategoryTemplateType} from "../../../types/categoryTemplateType";
import apiUrls from "../../../config/apiUrl";


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
  templatePreview: CategoryTemplateType
}

const TemplatePreviewDialog = (props: DialogProps) => {
  const {open, onCloseClick, templatePreview} = props
  const {t} = useTranslation()

  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        <Typography variant='h6' component='span'>
          {t('Template.Template')}
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
                uri: `${apiUrls.apiUrl_smekit_Template_Count_Endpoint}?id=${templatePreview.id}&version=1`,
                fileType: templatePreview.extension
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

export default TemplatePreviewDialog
