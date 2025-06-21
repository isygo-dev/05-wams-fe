import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import DOMPurify from 'dompurify';
import TiptapEditor from '../../../../../../views/apps/Editor/TiptapEditor';
import {fetchTemplateHtmlContent, updatefileTemplate} from '../../../../../../api/template';
import toast from "react-hot-toast";

const EditorPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, version } = router.query;

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id || !version) return;

      try {
        setLoading(true);
        setError(null);

        const templateId = parseInt(id as string, 10);
        const templateVersion = parseInt(version as string, 10);

        const content = await fetchTemplateHtmlContent(templateId, templateVersion);

        let processedContent = content;
        if (content.includes('<body>')) {
          const bodyStart = content.indexOf('<body>') + 6;
          const bodyEnd = content.indexOf('</body>');
          processedContent = content.substring(bodyStart, bodyEnd);
        }

        const cleanHtml = DOMPurify.sanitize(processedContent, {
          ALLOWED_TAGS: [
            'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'img', 'table', 'tr', 'td', 'th', 'div', 'span'
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'width', 'height'],
          ALLOWED_URI_REGEXP: /^(https?|ftp|mailto|data:image\/[a-z]+;base64,)/i,
        });

        if (!cleanHtml || cleanHtml.trim() === '') {
          throw new Error(t('Empty or invalid template content'));
        }

        setHtmlContent(cleanHtml);
      } catch (err: any) {
        console.error('Error loading template:', err);
        setError(err.message || t('Failed to process template content'));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, version, t]);

  const handleSave = async (updatedHtml: string) => {
    if (saving || !id) return;

    setSaving(true);
    try {
      await updatefileTemplate(Number(id), { content: updatedHtml });
      console.log(updatedHtml);
      toast.success(t('Template updated successfully'));
      router.push('/apps/template');

    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || t('Failed to update document'));
    } finally {
      setSaving(false);
    }
  };

  const handleReload = () => {
    router.replace(router.asPath);
  };

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={40} color="primary" />
        <Typography variant="h6" color="text.secondary">
          {t('Loading content…')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={handleReload}
        >
          {t('Retry')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            {t('Template Editor')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &nbsp; {t('Version')}: {version}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(htmlContent)}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : undefined}
        >
          {saving ? t('Saving...') : t('Save')}
        </Button>



      </Box>

      {!loading && htmlContent && (
        <TiptapEditor
          content={htmlContent}
          onChange={setHtmlContent}
          documentData={null}
        />
      )}
    </Box>
  );
};

export default EditorPage;
