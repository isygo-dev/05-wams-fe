import React, {useEffect, useState, useCallback, useMemo} from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';

import Icon from 'template-shared/@core/components/icon';
import TiptapEditor from '../../../../../views/apps/Editor/TiptapEditor';
import { getDocumentHtmlWithMetadata, updateDocument} from '../../../../../api/Document';

const EditDocumentPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: rawId, version: rawVersion , permission: rawPermission} = router.query;
  const [document, setDocument] = useState<DocumentType | null>(null);
  const isReadOnly = useMemo(() => rawPermission === 'READ', [rawPermission]);

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const documentId = useMemo(() => Number(Array.isArray(rawId) ? rawId[0] : rawId), [rawId]);
  const version = useMemo(() => Number(Array.isArray(rawVersion) ? rawVersion[0] : rawVersion), [rawVersion]);

  useEffect(() => {
    if (!router.isReady || !documentId || !version) return;

    const load = async () => {
      try {
        const { document, html } = await getDocumentHtmlWithMetadata(documentId, version);

        setDocument(document);

        let extractedHtml = html || '';

        if (extractedHtml.includes('<body>')) {
          const start = extractedHtml.indexOf('<body>') + 6;
          const end = extractedHtml.indexOf('</body>');
          extractedHtml = extractedHtml.substring(start, end);
        }

        const clean = DOMPurify.sanitize(extractedHtml, {
          ALLOWED_TAGS: [
            'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'img', 'table', 'tr', 'td', 'th', 'div', 'span'
          ],
          ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style', 'width', 'height'
          ],
          ALLOWED_URI_REGEXP: /^(https?|ftp|mailto|data:image\/[a-z]+;base64,)/i
        });

        setHtmlContent(clean);
      } catch (e: any) {
        console.error('Erreur chargement document :', e);
        setError(e?.message || t('Failed to load document'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, documentId, version, t]);

  const handleSave = useCallback(async () => {
    if (saving || !htmlContent.trim()) return;

    setSaving(true);
    try {
      await updateDocument(documentId, { html: htmlContent });

      toast.success(t('Document updated successfully'));
      router.push('/apps/document');
    } catch (err: any) {
      console.error('Erreur de sauvegarde :', err);
      toast.error(err.message || t('Failed to update document'));
    } finally {
      setSaving(false);
    }
  }, [saving, htmlContent, documentId, router, t]);

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <IconButton onClick={() => router.back()}>
          <Icon icon="mdi:arrow-left" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{
        mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={t('Back')}>
            <IconButton onClick={() => router.back()}>
              <Icon icon="mdi:arrow-left" />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" fontWeight={600}>
            {t('Edit Document')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving || isReadOnly}
          startIcon={saving ? <CircularProgress size={20} /> : <Icon icon="mdi:content-save" />}
        >
          {saving ? t('Saving...') : t('Save')}
        </Button>

      </Box>

      <TiptapEditor
        content={htmlContent}
        onChange={setHtmlContent}
        readOnly={saving || isReadOnly}
        documentData={document ?? null}
      />

    </Box>
  );
};

export default EditDocumentPage;
