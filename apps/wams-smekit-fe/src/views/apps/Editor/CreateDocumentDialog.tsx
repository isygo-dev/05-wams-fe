import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { createDocumentFromTemplate } from "../../../api/Document"
import { DocumentType } from "../../../types/document"

interface CreateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  defaultName?: string;
  templateId: number;
  content: string;
}

const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     defaultName = '',
                                                                     templateId,
                                                                     content
                                                                   }) => {
  const [docName, setDocName] = useState<string>(defaultName)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    if (open) {
      if (!content || content.trim() === "") {
        toast.error("Le contenu est vide, impossible de créer un document.")

        onClose()

        return
      }

      setDocName(defaultName)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, defaultName, content, onClose])

  const handleCreate = async (shouldEdit: boolean) => {
    const trimmed = docName.trim()
    if (!trimmed || saving) return

    setSaving(true)
    try {
      const documentType: DocumentType = await createDocumentFromTemplate(templateId, trimmed, content)

      toast.success('Document créé avec succès')
      onClose()

      if (shouldEdit) {
        router.push(`/apps/editor/view/edit/${documentType.id}/${documentType.version || 1}`)
      } else {
        router.push('/apps/document')
      }
    } catch (error: any) {
      toast.error(error.message || 'Échec de la création du document')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCreate(true)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer un nouveau document</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          autoFocus
          fullWidth
          label="Nom du document"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          margin="normal"
          onKeyDown={handleKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button onClick={() => handleCreate(false)} disabled={saving}>
          Créer
        </Button>
        <Button
          variant="contained"
          onClick={() => handleCreate(true)}
          disabled={saving}
        >
          Créer et éditer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDocumentDialog
