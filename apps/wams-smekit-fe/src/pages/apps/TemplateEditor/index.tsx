// apps/template/DocxEditorField.tsx
import React, { useEffect, useState } from 'react'
import * as mammoth from 'mammoth'
import HtmlDocx from 'html-docx-js/dist/html-docx'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Box, Typography, Button } from '@mui/material'

interface Props {
  file: File | null
  onChange: (docxFile: File) => void
}

const DocxEditorField: React.FC<Props> = ({ file, onChange }) => {
  const [loaded, setLoaded] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Chargement du fichier .docx...</p>',
  })

  useEffect(() => {
    const loadDocx = async () => {
      if (!file) return
      setLoaded(false)

      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      editor?.commands.setContent(result.value)
    }

    loadDocx().then(() => setLoaded(true))
  }, [file])

  const handleSaveAsDocx = () => {
    if (!editor) return

    const htmlContent = `<!DOCTYPE html><html><body>${editor.getHTML()}</body></html>`
    const blob = HtmlDocx.asBlob(htmlContent)
    const newFile = new File([blob], 'modified.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

    onChange(newFile)
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Modifier le contenu du fichier Word
      </Typography>

      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, minHeight: 200 }}>
        <EditorContent editor={editor} />
      </Box>

      {loaded && (
        <Box mt={2}>
          <Button variant="contained" onClick={handleSaveAsDocx}>
            Sauvegarder les modifications
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default DocxEditorField
