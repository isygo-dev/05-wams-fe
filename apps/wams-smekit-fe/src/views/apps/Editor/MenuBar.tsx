import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  ButtonGroup,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Chip,
  Avatar,

  Snackbar,
  Alert,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Undo,
  Redo,
  Comment as CommentIcon,
  Send,
  Close,
  Person,
} from '@mui/icons-material';
import { Editor } from '@tiptap/react';
import TableControls from './TableControls';
import { v4 as uuidv4 } from 'uuid';
import { postComment } from '../../../api/DocumentComment';
import { DocCommentPayload, IEnumDocCommentsStaus } from '../../../types/DocComment';
import { useQuery } from 'react-query';
import { getUserConnect } from '../../../api/template';
import { DocumentType } from '../../../types/document';
import SpellCheckIcon from '@mui/icons-material/Spellcheck';

import { useEffect } from 'react';

export interface MenuBarProps {
  editor: Editor;
  document: DocumentType | null;
}

interface CommentDialogState {
  open: boolean;
  selectedText: string;
  selectionRange: { from: number; to: number } | null;
}

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const headingLevels = [1, 2, 3, 4, 5, 6];
const fontFamilies = ['Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Verdana'];
const fontSizes = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '24pt'];

const MenuBar: React.FC<MenuBarProps> = ({ editor, document }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [commentDialog, setCommentDialog] = useState<CommentDialogState>({
    open: false,
    selectedText: '',
    selectionRange: null,
  });
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedGrammarError, setSelectedGrammarError] = useState<{
    message: string;
    replacements: string[];
    offset: number;
    length: number;
  } | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('grammar-error')) {
        const message = target.getAttribute('data-message') || '';
        const offset = parseInt(target.getAttribute('data-offset') || '0', 10);
        const length = parseInt(target.getAttribute('data-length') || '0', 10);
        const replacements = target.getAttribute('data-replacements')?.split('||') || [];

        setSelectedGrammarError({ message, offset, length, replacements });
        setAnchorEl(target);
      } else {
        setAnchorEl(null);
        setSelectedGrammarError(null);
      }
    };

    window.document.addEventListener('click', handleClick);

    return () => {
      window.document.removeEventListener('click', handleClick);
    };
  }, []);


  const { data: userData, isLoading: isLoadingUserData } = useQuery('userData', getUserConnect);

  const openFilePicker = () => fileInputRef.current?.click();

  const showNotification = (message: string, severity: NotificationState['severity'] = 'info') => {
    setNotification({ open: true, message, severity });
  }

  const handleGrammarCheck = () => {
    if (!editor) return;

    if ('checkGrammar' in editor.commands) {
      (editor.commands as any).checkGrammar();
    }
  };



  const handleAddComment = async () => {
    if (!editor) return;

    const { from, to, empty } = editor.state.selection;

    if (empty) {
      showNotification('Veuillez sélectionner un texte avant d\'ajouter un commentaire.', 'warning');

      return;
    }

    if (!document?.id || (typeof document.id !== 'number' && isNaN(Number(document.id)))) {
      showNotification('Document non valide ou non chargé.', 'error');
      console.error('Document invalide:', { document, documentId: document?.id });

      return;
    }

    if (isLoadingUserData) {
      showNotification('Chargement des données utilisateur...', 'info');

      return;
    }

    if (!userData) {
      showNotification('Impossible de récupérer vos informations utilisateur.', 'error');

      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText.trim()) {
      showNotification('Le texte sélectionné est vide.', 'warning');

      return;
    }

    console.log('Préparation du commentaire:', {
      selectedText: selectedText.trim(),
      from,
      to,
      selectionLength: to - from,
      documentId: document.id,
      userData: userData
    });

    setCommentDialog({
      open: true,
      selectedText: selectedText.trim(),
      selectionRange: { from, to }
    });
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !commentDialog.selectionRange) {
      showNotification('Veuillez saisir un commentaire.', 'warning');

      return;
    }

    if (!document?.id) {
      showNotification('Document non valide.', 'error');

      return;
    }

    setIsSubmittingComment(true);

    try {
      const commentId = uuidv4();
      const { from, to } = commentDialog.selectionRange;

      const userName = userData?.username ||
        (userData?.firstname && userData?.lastname
          ? `${userData.firstname} ${userData.lastname}`
          : userData?.email || 'Utilisateur anonyme');

      const payload: DocCommentPayload = {
        text: commentText.trim(),
        user: userName,
        type: IEnumDocCommentsStaus.OPEN,
        document: {
          id: Number(document.id)
        },
        startOffset: Number(from),
        endOffset: Number(to),
        textCommented: commentDialog.selectedText.trim(),

      };

      console.log('Payload commentaire (avant envoi):', {
        ...payload,
        documentId: document.id,
        selectionLength: to - from,
        textLength: commentDialog.selectedText.length
      });

      const result = await postComment(payload);

      if (result) {
        editor.chain().focus().setMark('commentMark', {
          commentId: result.id || commentId,
          user: payload.user,
        }).run();

        setCommentDialog({ open: false, selectedText: '', selectionRange: null });
        setCommentText('');

        showNotification(' Commentaire ajouté avec succès !', 'success');
      } else {
        throw new Error('Aucune réponse reçue du serveur');
      }
    } catch (error: any) {
      console.error(' Erreur lors de l\'envoi du commentaire :', error);

      let errorMessage = 'Erreur lors de l\'ajout du commentaire.';

      if (error?.response?.status === 400) {
        errorMessage = 'Données invalides. Vérifiez votre sélection et réessayez.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Vous n\'êtes pas autorisé à ajouter des commentaires.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Permissions insuffisantes pour ajouter un commentaire.';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (error?.message) {
        errorMessage = `Erreur: ${error.message}`;
      }

      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCloseCommentDialog = () => {
    if (!isSubmittingComment) {
      setCommentDialog({ open: false, selectedText: '', selectionRange: null });
      setCommentText('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      showNotification('Veuillez sélectionner un fichier image valide.', 'warning');

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('L\'image est trop volumineuse. Taille maximale : 5MB.', 'warning');

      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
      showNotification('Image ajoutée avec succès !', 'success');
    };
    reader.onerror = () => {
      showNotification('Erreur lors du chargement de l\'image.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const setLink = () => {
    const url = window.prompt('URL du lien :');
    if (url?.trim()) {
      try {
        new URL(url);
        editor.chain().focus().setLink({ href: url }).run();
        showNotification('Lien ajouté avec succès !', 'success');
      } catch {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        try {
          new URL(fullUrl);
          editor.chain().focus().setLink({ href: fullUrl }).run();
          showNotification('Lien ajouté avec succès !', 'success');
        } catch {
          showNotification('URL invalide. Veuillez vérifier le format.', 'warning');
        }
      }
    }
  };

  if (!editor) return null;

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 1,
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
        }}
      >
        <ButtonGroup size="small">
          <Tooltip title="Annuler (Ctrl+Z)">
            <IconButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rétablir (Ctrl+Y)">
            <IconButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
              <Redo />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />
        <Select
          size="small"
          value={editor.isActive('heading') ? editor.getAttributes('heading').level : 0}
          onChange={(e) => {
            const level = parseInt(e.target.value as string, 10);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: level as any }).run();
            }
          }}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={0}>Paragraphe</MenuItem>
          {headingLevels.map((level) => (
            <MenuItem key={level} value={level}>Titre {level}</MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem />
        <Select
          size="small"
          value={editor.getAttributes('textStyle').fontFamily || 'Calibri'}
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          sx={{ minWidth: 140 }}
        >
          {fontFamilies.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={editor.getAttributes('textStyle').fontSize || '11pt'}
          onChange={(e) =>
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()
          }
          sx={{ minWidth: 100 }}
        >
          {fontSizes.map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem />
        <ButtonGroup size="small">
          <Tooltip title="Gras">
            <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italique">
            <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Souligné">
            <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive('underline') ? 'primary' : 'default'}>
              <FormatUnderlined />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />
        <ButtonGroup size="small">
          <Tooltip title="Gauche">
            <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()} color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}>
              <FormatAlignLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Centré">
            <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()} color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}>
              <FormatAlignCenter />
            </IconButton>
          </Tooltip>
          <Tooltip title="Droite">
            <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()} color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}>
              <FormatAlignRight />
            </IconButton>
          </Tooltip>
          <Tooltip title="Justifié">
            <IconButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}>
              <FormatAlignJustify />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />
        <ButtonGroup size="small">
          <Tooltip title="Liste à puces">
            <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          <Tooltip title="Liste numérotée">
            <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />
        <ButtonGroup size="small">
          <Tooltip title="Lien">
            <IconButton onClick={setLink} color={editor.isActive('link') ? 'primary' : 'default'}>
              <Link />
            </IconButton>
          </Tooltip>
          <Tooltip title="Image">
            <IconButton onClick={openFilePicker}>
              <Image />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <TableControls editor={editor} />
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />
        <Tooltip title="Ajouter un commentaire">
          <IconButton
            onClick={handleAddComment}
            disabled={isLoadingUserData}
            color="default"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              }
            }}
          >
            <CommentIcon />
          </IconButton>
        </Tooltip>

      </Box>

      <Dialog
        open={commentDialog.open}
        onClose={handleCloseCommentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1
        }}>
          <CommentIcon color="primary" />
          Ajouter un commentaire
          <IconButton
            onClick={handleCloseCommentDialog}
            sx={{ ml: 'auto' }}
            disabled={isSubmittingComment}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Texte sélectionné :
            </Typography>
            <Chip
              label={commentDialog.selectedText}
              variant="outlined"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  padding: '8px 12px',
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              Commentaire de : {userData?.username ||
              (userData?.firstname && userData?.lastname
                ? `${userData.firstname} ${userData.lastname}`
                : userData?.email || 'Utilisateur anonyme')}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Saisissez votre commentaire..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmittingComment}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseCommentDialog}
            disabled={isSubmittingComment}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isSubmittingComment}
            variant="contained"
            startIcon={isSubmittingComment ? undefined : <Send />}
            sx={{
              minWidth: 120,
            }}
          >
            {isSubmittingComment ? 'Envoi en cours...' : 'Publier'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuBar;
