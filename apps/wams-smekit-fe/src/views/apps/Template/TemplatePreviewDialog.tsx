import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'

import DocxPreview from './DocxPreview'
import { CategoryTemplateType } from '../../../types/categoryTemplateType'
import apiUrls from '../../../config/apiUrl'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
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
    transform: 'translate(7px, -5px)',
  },
}))

interface TemplateDialogProps {
  open: boolean
  onCloseClick: () => void
  templatePreview: CategoryTemplateType
}

const TemplatePreviewDialog = ({
                                 open,
                                 onCloseClick,
                                 templatePreview,
                               }: TemplateDialogProps) => {
  const { t } = useTranslation()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [docxBuffer, setDocxBuffer] = useState<ArrayBuffer | null>(null)
  const [loading, setLoading] = useState(false)

  const extension = templatePreview.extension?.toLowerCase()

  useEffect(() => {
    if (!open || !templatePreview?.id) return

    const fetchFile = async () => {
      setLoading(true)
      try {
        const url = `${apiUrls.apiUrl_SMEKIT}/api/v1/private/template/file/downloadPreview?id=${templatePreview.id}&version=1`
        const response = await fetch(url)

        if (extension === 'pdf') {
          const blob = await response.blob()
          setPdfUrl(URL.createObjectURL(blob))
        } else if (extension === 'docx') {
          const buffer = await response.arrayBuffer()
          console.log('📦 DOCX buffer size:', buffer.byteLength)
          setDocxBuffer(buffer)

        }
      } catch (err) {
        console.error('Erreur lors du chargement du fichier :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFile()

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
      setDocxBuffer(null)
    }
  }, [open, templatePreview])

  return (
    <Dialog fullScreen open={open} onClose={onCloseClick}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {t('Template.Template')}
        </Typography>
        <CustomCloseButton aria-label='close' onClick={onCloseClick}>
          <Icon icon='tabler:x' />
        </CustomCloseButton>
      </DialogTitle>



      <DialogContent>
        <Box sx={{ height: '90vh' }}>
          {extension === 'pdf' && pdfUrl ? (
            <iframe
              src={pdfUrl}
              width='100%'
              height='100%'
              style={{ border: 'none' }}
              title='Aperçu PDF'
              allowFullScreen
            />
          ) : extension === 'docx' && docxBuffer ? (
            <DocxPreview buffer={docxBuffer} mode="fullscreen" />
          ) : loading ? (
            <Skeleton variant="rectangular" height="100%" />
          ) : (
            <Typography>{t('Fichier non supporté ou introuvable.')}</Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default TemplatePreviewDialog
