import React, { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import MenuBar from './MenuBar';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { CommentMark } from '../documentComment/commentMark';
import { DocumentType } from '../../../types/document';
import {getCommentsByDocumentId, updateCommentType,} from '../../../api/DocumentComment';
import {DocCommentType as ImportedDocCommentType, IEnumDocCommentsStaus} from '../../../types/DocComment';

interface DocCommentType {
  id: number;
  document?: any;
  startOffset?: number;
  endOffset?: number;
  createdBy?: any;
  user?: string;
  textCommented?: string;
  type?: IEnumDocCommentsStaus;
  [key: string]: any;
}
import CommentSidebar from '../documentComment/CommentSidebar';
import toast from "react-hot-toast";
import {GrammarChecker, GrammarMark} from "./grammarMark";

interface TiptapEditorProps {
  content: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  documentData: DocumentType | null;
  currentUser?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
                                                     content,
                                                     onChange,
                                                     readOnly = false,
                                                     documentData,
                                                     currentUser,
                                                   }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<DocCommentType[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [suggestionPopup, setSuggestionPopup] = useState<{
    x: number;
    y: number;
    suggestions: string[];
    position: number;
    message: string
  } | null>(null);

  const isInitialContent = useRef(true);
  const lastContentRef = useRef(content);
  const clickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const globalClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  const editor = useEditor({
    content,
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TextStyle,
      Color,
      FontFamily.configure({ types: ['textStyle'] }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      CommentMark,
      GrammarMark,
      GrammarChecker.configure({
        debounceTime: 1500,
        enabledTypes: ['spelling', 'grammar', 'conjugation'],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'ProseMirror prose focus:outline-none max-w-none',
        style: 'font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5;',
      },
      transformPastedHTML(html) {
        return DOMPurify.sanitize(html, {
          ALLOWED_TAGS: [
            'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'img', 'table', 'tr', 'td', 'th', 'div', 'span',
          ],
          ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style',
            'width', 'height', 'align', 'data-comment-id', 'data-user',
          ],
          ALLOWED_URI_REGEXP: /^(https?|ftp|mailto|data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,)/i,
        });
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && isInitialContent.current) {
      editor.commands.setContent(content, false);
      isInitialContent.current = false;
      lastContentRef.current = content;
    }
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target && target.dataset.grammarError) {
        e.preventDefault();
        e.stopPropagation();

        const rawSuggestions = target.dataset.suggestions || '';
        const suggestions = rawSuggestions.length > 0 ? rawSuggestions.split('||').filter(Boolean) : [];
        const message = target.dataset.message || '';
        const offset = parseInt(target.dataset.offset || '0');

        setSuggestionPopup(null);

        setTimeout(() => {
          setSuggestionPopup({
            x: e.clientX,
            y: e.clientY,
            suggestions,
            position: offset,
            message,
          });
        }, 10);
      } else {
        setSuggestionPopup(null);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[data-suggestion-popup]')) {
        return;
      }

      if (target.dataset.grammarError) {
        return;
      }

      setSuggestionPopup(null);
    };

    clickHandlerRef.current = handleClick;
    globalClickHandlerRef.current = handleGlobalClick;

    dom.addEventListener('click', handleClick);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      if (clickHandlerRef.current) {
        dom.removeEventListener('click', clickHandlerRef.current);
      }
      if (globalClickHandlerRef.current) {
        document.removeEventListener('click', globalClickHandlerRef.current);
      }
    };
  }, [editor]);

  const loadComments = async () => {
    if (!editor || !documentData?.id) return;

    try {
      const fetchedComments: ImportedDocCommentType[] = await getCommentsByDocumentId(documentData.id);
      const convertedComments: DocCommentType[] = fetchedComments.map(comment => ({
        ...comment,
        id: comment.id || 0,
      }));
      setComments(convertedComments);

      convertedComments.forEach(comment => {
        if (
          comment.startOffset != null &&
          comment.endOffset != null &&
          comment.id &&
          comment.textCommented
        ) {
          const docSize = editor.state.doc.content.size;
          if (comment.startOffset >= 0 && comment.endOffset <= docSize) {
            editor
              .chain()
              .setTextSelection({ from: comment.startOffset, to: comment.endOffset })
              .setMark('commentMark', {
                commentId: comment.id,
                user: comment.user || 'Anonyme',
              })
              .run();
          }
        }
      });
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [editor, documentData?.id]);

  const scrollToComment = (comment: DocCommentType) => {
    if (!editor || comment.startOffset == null || comment.endOffset == null) return;

    try {
      editor.commands.setTextSelection({
        from: comment.startOffset,
        to: comment.endOffset
      });

      editor.commands.focus();

      const selection = editor.view.dom.querySelector('.ProseMirror-selectednode') ||
        editor.view.dom.querySelector('[data-comment-id="' + comment.id + '"]');

      if (selection) {
        selection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } catch (error) {
      console.error('Erreur lors du scroll vers le commentaire:', error);
    }
  };

  const handleStatusChange = async (commentId: number, newType: IEnumDocCommentsStaus) => {
    try {
      await updateCommentType(commentId, newType);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId ? { ...comment, type: newType } : comment
        )
      );

      toast.success('Statut du commentaire mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire :', error);
      toast.error('Échec de la mise à jour du statut');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestionPopup && editor) {
      if ('acceptSuggestion' in editor.commands) {
        (editor.commands as any).acceptSuggestion(suggestionPopup.position, suggestion);
      } else {
        const { from, to } = editor.state.selection;
        editor.chain().focus().deleteRange({ from, to }).insertContent(suggestion).run();
      }
      setSuggestionPopup(null);
    }
  };

  const handleIgnoreError = () => {
    if (suggestionPopup && editor) {
      if ('ignoreError' in editor.commands) {
        (editor.commands as any).ignoreError(suggestionPopup.position);
      }
      setSuggestionPopup(null);
    }
  };

  if (!editor) return <Box>{t('Loading editor...')}</Box>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        backgroundColor: '#fff',
        height: '90vh',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <MenuBar editor={editor} document={documentData} />
      </Box>

      {comments.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowSidebar(!showSidebar)}
            sx={{
              minWidth: 'auto',
              padding: '0.25rem 0.75rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            title={showSidebar ? 'Masquer les commentaires' : 'Afficher les commentaires'}
          >
            {showSidebar ? '📤' : '📥'}
            <Box
              component="span"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '12px',
                px: 1,
                py: 0.25,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {comments.length}
            </Box>
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            transition: 'width 0.3s ease',
            width: showSidebar && comments.length > 0 ? 'calc(100% - 340px)' : '100%',
            '& .ProseMirror': {
              minHeight: '200px',
              outline: 'none',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
              fontFamily: 'Calibri, Arial, sans-serif',
              fontSize: '11pt',
              lineHeight: 1.5,
              color: '#111',
              '& p': { margin: '0 0 1rem 0' },
              '& ul, & ol': { padding: '0 0 0 2rem', margin: '0 0 1rem 0' },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '1rem 0',
                display: 'block',
              },
              '& a': {
                color: '#1976d2',
                textDecoration: 'underline',
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1rem',
              },
              '& th, & td': {
                border: '1px solid #ccc',
                padding: '0.5rem',
                textAlign: 'left',
              },
              '& .tiptap-comment': {
                backgroundColor: '#fff3cd',
                borderBottom: '2px solid #ffc107',
                cursor: 'pointer',
                position: 'relative',
                padding: '1px 2px',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#ffeaa7',
                  borderBottomColor: '#f39c12',
                },
                '&::after': {
                  content: '"💬"',
                  position: 'absolute',
                  top: '-18px',
                  right: '-8px',
                  fontSize: '12px',
                  opacity: 0.7,
                },
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>

        {showSidebar && (
          <CommentSidebar
            comments={comments}
            onCommentClick={scrollToComment}
            onStatusChange={handleStatusChange}
            currentUser={currentUser}
          />
        )}
      </Box>

      {suggestionPopup && (
        <Box
          data-suggestion-popup
          sx={{
            position: 'fixed',
            top: suggestionPopup.y + 5,
            left: suggestionPopup.x + 5,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            padding: 1,
            zIndex: 2000,
            minWidth: '200px',
            maxWidth: '300px',
          }}
        >
          <Box sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.875rem' }}>
            {suggestionPopup.message}
          </Box>

          {suggestionPopup.suggestions.length > 0 ? (
            suggestionPopup.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="small"
                fullWidth
                variant="text"
                sx={{
                  justifyContent: 'flex-start',
                  mb: 0.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))
          ) : (
            <Box sx={{ fontStyle: 'italic', color: '#999', fontSize: '0.875rem' }}>
              Aucune suggestion disponible
            </Box>
          )}

          <Button
            size="small"
            color="secondary"
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              textTransform: 'none',
              fontSize: '0.875rem',
            }}
            onClick={handleIgnoreError}
          >
            Ignorer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TiptapEditor;
