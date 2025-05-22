import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';

import { Button, Box, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

const DocumentEditor = ({ documentId, initialContent }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialContent) {
      const blocksFromHtml = convertFromHTML(initialContent);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
    setIsLoading(false);
  }, [documentId, initialContent]);



  const handleExport = async () => {
    const content = convertToRaw(editorState.getCurrentContent());
    const htmlContent = stateToHTML(content);
    const docx = await htmlToDocx(htmlContent);

    const blob = new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${documentId}.docx`;
    link.click();
  };

  if (isLoading) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'image'],
          image: {
            uploadCallback: uploadImageCallBack,
            previewImage: true,
          },
        }}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Exporter en DOCX
        </Button>
      </Box>
    </Box>
  );
};

const uploadImageCallBack = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => resolve({ data: { link: data.imageUrl } }))
      .catch((error) => reject(error));
  });
};

export default DocumentEditor;
