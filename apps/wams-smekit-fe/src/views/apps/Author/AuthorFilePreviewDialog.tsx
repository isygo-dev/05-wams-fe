import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Icon from 'template-shared/@core/components/icon';
import { DialogContent } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

import { AuthorType } from "../../../types/author";
import {downloadAuthorFile} from "../../../api/author";

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
    transform: 'translate(7px, -5px)'
  }
}));

interface DialogProps {
  open: boolean;
  onCloseClick: () => void;
  author: AuthorType;
}

const AuthorFilePreviewDialog = (props: DialogProps) => {
  const { open, onCloseClick, author } = props;
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && author?.id && author?.path) {
      loadPreview();
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, author]);

  const loadPreview = async () => {
    if (!author?.id) return;

    setLoading(true);
    try {
      const blob = await downloadAuthorFile(author.id);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      toast.error(t('Failed to load CV preview'));
      console.error('Preview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    onCloseClick();
  };

  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        <Typography variant='h6' component='span'>
          {t('CV Preview')} - {author?.firstname} {author?.lastname}
        </Typography>
        <CustomCloseButton
          aria-label='close'
          onClick={handleClose}
        >
          <Icon icon='tabler:x' />
        </CustomCloseButton>
      </DialogTitle>
      <DialogContent>
        <Box textAlign='center'>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : previewUrl ? (
            <DocViewer
              key={Date.now()}
              pluginRenderers={DocViewerRenderers}
              documents={[
                {
                  uri: previewUrl,
                  fileType: author?.extension || 'pdf'
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
          ) : (
            <Typography color="text.secondary">
              {t('No CV available for preview')}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorFilePreviewDialog;
