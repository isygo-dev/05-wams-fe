import React, { useState, useMemo } from 'react';
import { IEnumDocCommentsStaus } from "../../../types/DocComment";
import {Menu, MenuItem} from "@mui/material";
import {useTranslation} from "react-i18next";

interface DocCommentType {
  id: number;
  user: string;
  text: string;
  textCommented?: string;
  type: IEnumDocCommentsStaus;
  createDate: string | Date;
  resolved?: boolean;
}

interface Props {
  comments: DocCommentType[];
  onCommentClick?: (comment: DocCommentType) => void;
  onCommentDelete?: (commentId: number) => void;
  onStatusChange?: (commentId: number, newStatus: IEnumDocCommentsStaus) => void;
  onResolveToggle?: (commentId: number) => void;
  currentUser?: string;
}

const CommentSidebar: React.FC<Props> = ({
                                           comments,
                                           onCommentClick,
                                           onCommentDelete,
                                           onStatusChange,
                                           onResolveToggle,
                                           currentUser
                                         }) => {
  const [filter, setFilter] = useState<'all' | IEnumDocCommentsStaus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const { t } = useTranslation();

  const sidebarStyle: React.CSSProperties = {
    width: `${sidebarWidth}px`,
    maxWidth: '380px',
    borderLeft: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    transition: 'width 0.2s ease',

    height: '100%',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };
  const [isResizing, setIsResizing] = useState(false);

  const displayComments = useMemo(() => comments, [comments]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCommentId, setMenuCommentId] = useState<number | null>(null);
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 260 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const emptyStateStyle: React.CSSProperties = {
    ...sidebarStyle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafbfc',
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };

  const handleChangeType = (newType: IEnumDocCommentsStaus) => {
    if (menuCommentId !== null && onStatusChange) {
      onStatusChange(menuCommentId, newType);
    }
    handleMenuClose();
  };

  const getCommentTypeConfig = (type: IEnumDocCommentsStaus) => {
    const configs = {
      [IEnumDocCommentsStaus.OPEN]: {
        icon: '💬',
        label: 'OPEN',
        color: '#3b82f6',
        bgColor: '#dbeafe',
        textColor: '#1e40af',
      },
      [IEnumDocCommentsStaus.VALIDATED]: {
        icon: '✅',
        label: 'Validé',
        color: '#10b981',
        bgColor: '#d1fae5',
        textColor: '#047857',
      },
      [IEnumDocCommentsStaus.CLOSED]: {
        icon: '🔒',
        label: 'Fermé',
        color: '#ef4444',
        bgColor: '#fecaca',
        textColor: '#dc2626',
      },
    };

    return configs[type] || configs[IEnumDocCommentsStaus.OPEN];
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Hier';
      if (diffDays < 7) return `Il y a ${diffDays} jours`;

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };
  const filteredAndSortedComments = useMemo(() => {
    const filtered = displayComments.filter(comment => {
      const matchesFilter =
        filter === 'all' || comment.type === filter;

      const matchesSearch =
        searchTerm === '' ||
        comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.textCommented?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      return matchesFilter && matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        case 'oldest':
          return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
        case 'type':
          return a.type.toString().localeCompare(b.type.toString());

        default:
          return 0;
      }
    });

    return filtered;
  }, [displayComments, filter, sortBy, searchTerm]);

  const stats = useMemo(() => {
    const total = displayComments.length;
    const resolved = displayComments.filter(c => c.resolved).length;
    const byType = displayComments.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;

      return acc;
    }, {} as Record<IEnumDocCommentsStaus, number>);

    return { total, resolved, unresolved: total - resolved, byType };
  }, [displayComments]);

  if (displayComments.length === 0) {
    return (
      <aside style={{ ...sidebarStyle, position: 'relative' }}>
        <div style={emptyContentStyle}>
          <div style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}}>💬</div>
          <h3 style={{margin: '0 0 0.5rem 0', color: '#374151'}}>{t('Aucun commentaire')}</h3>
          <p style={{margin: 0, color: '#6b7280', fontSize: '0.875rem'}}>
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            cursor: 'ew-resize',
            zIndex: 100,
          }}
          onMouseDown={() => setIsResizing(true)}
        />

      </aside>
    );
  }

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
            💬 Commentaires
          </h3>
          <div style={statsStyle}>
            <span style={statBadgeStyle}>{stats.total}</span>
            {stats.byType[IEnumDocCommentsStaus.OPEN] > 0 && (
              <span style={{...statBadgeStyle, backgroundColor: '#dbeafe', color: '#1e40af'}}>
                {stats.byType[IEnumDocCommentsStaus.OPEN]} ouverts
              </span>
            )}
            {stats.byType[IEnumDocCommentsStaus.VALIDATED] > 0 && (
              <span style={{...statBadgeStyle, backgroundColor: '#d1fae5', color: '#047857'}}>
                {stats.byType[IEnumDocCommentsStaus.VALIDATED]} validés
              </span>
            )}
            {stats.byType[IEnumDocCommentsStaus.CLOSED] > 0 && (
              <span style={{...statBadgeStyle, backgroundColor: '#fecaca', color: '#dc2626'}}>
                {stats.byType[IEnumDocCommentsStaus.CLOSED]} fermés
              </span>
            )}
          </div>
        </div>

        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Rechercher dans les commentaires..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <span style={searchIconStyle}>🔍</span>
        </div>

        <div style={filtersStyle}>
          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Filtrer par statut :</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | IEnumDocCommentsStaus)}
              style={selectStyle}
            >
              <option value="all">Tous ({stats.total})</option>
              <option value={IEnumDocCommentsStaus.OPEN}>
                💬 Ouverts ({stats.byType[IEnumDocCommentsStaus.OPEN] || 0})
              </option>
              <option value={IEnumDocCommentsStaus.VALIDATED}>
                ✅ Validés ({stats.byType[IEnumDocCommentsStaus.VALIDATED] || 0})
              </option>
              <option value={IEnumDocCommentsStaus.CLOSED}>
                🔒 Fermés ({stats.byType[IEnumDocCommentsStaus.CLOSED] || 0})
              </option>
            </select>
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Trier :</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'type')}
              style={selectStyle}
            >
              <option value="newest">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="type">Par statut</option>
            </select>
          </div>
        </div>
      </div>

      <div style={commentsListStyle}>
        {filteredAndSortedComments.length === 0 ? (
          <div style={noResultsStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>🔍</div>
            <p style={{ margin: 0, color: '#6b7280' }}>Aucun commentaire trouvé</p>
          </div>
        ) : (
          filteredAndSortedComments.map((comment) => {
            const typeConfig = getCommentTypeConfig(comment.type);
            const isOwnComment = currentUser === comment.user;

            return (
              <div
                key={comment.id}
                style={{
                  ...commentCardStyle,
                  borderLeft: `4px solid ${typeConfig.color}`,
                  opacity: comment.resolved ? 0.8 : 1,
                  backgroundColor: comment.resolved ? '#f8f9fa' : '#ffffff',
                }}
                onClick={() => onCommentClick?.(comment)}
                onMouseEnter={(e) => {
                  if (!comment.resolved) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={commentHeaderStyle}>
                  <div style={authorInfoStyle}>
                    <div style={{
                      ...avatarStyle,
                      backgroundColor: isOwnComment ? '#3b82f6' : '#6b7280'
                    }}>
                      {comment.user[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={authorNameStyle}>
                        {comment.user}
                        {isOwnComment && <span style={youBadgeStyle}>Vous</span>}
                      </div>
                      <div style={dateStyle}>{formatDate(comment.createDate)}</div>
                    </div>
                  </div>

                  <div style={actionsStyle}>
                    {isOwnComment && onStatusChange && !comment.resolved ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(comment.id, IEnumDocCommentsStaus.OPEN);
                          }}
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: comment.type === IEnumDocCommentsStaus.OPEN ? '#dbeafe' : 'transparent',
                            color: '#1e40af',
                          }}
                          title="Marquer comme Ouvert"
                        >
                          💬
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(comment.id, IEnumDocCommentsStaus.VALIDATED);
                          }}
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: comment.type === IEnumDocCommentsStaus.VALIDATED ? '#d1fae5' : 'transparent',
                            color: '#047857',
                          }}
                          title="Marquer comme Validé"
                        >
                          ✅
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(comment.id, IEnumDocCommentsStaus.CLOSED);
                          }}
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: comment.type === IEnumDocCommentsStaus.CLOSED ? '#fecaca' : 'transparent',
                            color: '#dc2626',
                          }}
                          title="Marquer comme Fermé"
                        >
                          🔒
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleMenuOpen(e, comment.id)}
                        style={{
                          ...typeBadgeStyle,
                          backgroundColor: typeConfig.bgColor,
                          color: typeConfig.textColor,
                          cursor: 'pointer',
                          border: 'none',
                          fontSize: '0.75rem',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '8px',
                          fontWeight: '500',
                        }}
                        title="Changer le statut"
                      >
                        {typeConfig.icon} {typeConfig.label} ⌄
                      </button>

                    )}


                    <div style={buttonGroupStyle}>
                      {onResolveToggle && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveToggle(comment.id);
                          }}
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: comment.resolved ? '#d1fae5' : '#f3f4f6',
                            color: comment.resolved ? '#047857' : '#6b7280',
                          }}
                          title={comment.resolved ? 'Marquer comme non résolu' : 'Marquer comme résolu'}
                        >
                          {comment.resolved ? '✓' : '○'}
                        </button>
                      )}

                      {onCommentDelete && isOwnComment && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCommentDelete(comment.id);
                          }}
                          style={{
                            ...actionButtonStyle,
                            color: '#ef4444',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Supprimer le commentaire"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {comment.textCommented && (
                  <div style={targetTextStyle}>
                    <div style={targetTextLabelStyle}>📌 Texte ciblé</div>
                    <div style={targetTextContentStyle}>
                      "{comment.textCommented}"
                    </div>
                  </div>
                )}

                <div style={commentContentStyle}>
                  {comment.text ? (
                    <div>
                      {comment.text.split('\n').map((line, index) => (
                        <div key={index} style={{ marginBottom: index < comment.text.split('\n').length - 1 ? '0.5rem' : '0' }}>
                          {line || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Aucun contenu</span>
                  )}
                </div>

                {comment.resolved && (
                  <div style={resolvedBadgeStyle}>
                    ✓ Résolu
                  </div>
                )}
              </div>
            );
          })
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {Object.values(IEnumDocCommentsStaus).map((type) => {
            const config = getCommentTypeConfig(type);

            return (
              <MenuItem
                key={type}
                onClick={() => handleChangeType(type)}
                selected={
                  comments.find((c) => c.id === menuCommentId)?.type === type
                }
              >
                {config.icon} {config.label}
              </MenuItem>
            );
          })}
        </Menu>

      </div>
    </aside>
  );
};




const emptyContentStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
};

const headerStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '1.5rem 1rem',
  zIndex: 10,
};

const titleStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const statBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  backgroundColor: '#e5e7eb',
  color: '#374151',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontWeight: '500',
};

const searchContainerStyle: React.CSSProperties = {
  position: 'relative',
  marginBottom: '1rem',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 2.5rem 0.75rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.875rem',
  backgroundColor: '#f9fafb',
  boxSizing: 'border-box',
};

const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#6b7280',
  pointerEvents: 'none',
};

const filtersStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
};

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  flex: 1,
  minWidth: '120px',
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#374151',
};

const selectStyle: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
};

const commentsListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: '#fafbfc',
};

const noResultsStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
  color: '#6b7280',
};

const commentCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '1.25rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  marginBottom: '0.5rem',
};

const commentHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '0.75rem',
};

const authorInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const avatarStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#6b7280',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  fontWeight: 'bold',
  flexShrink: 0,
  border: '2px solid #ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const authorNameStyle: React.CSSProperties = {
  fontWeight: '600',
  color: '#111827',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.25rem',
};

const youBadgeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '0.125rem 0.375rem',
  borderRadius: '8px',
  fontWeight: '500',
};

const dateStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280',
  marginTop: '0.125rem',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexShrink: 0,
};

const typeBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  padding: '0.375rem 0.75rem',
  borderRadius: '8px',
  fontWeight: '500',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.25rem',
};

const actionButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '0.375rem',
  borderRadius: '6px',
  fontSize: '0.875rem',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '28px',
  height: '28px',
};

const targetTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#4b5563',
  marginBottom: '1rem',
  backgroundColor: '#f8fafc',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  borderLeft: '3px solid #3b82f6',
};

const targetTextLabelStyle: React.CSSProperties = {
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#374151',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const targetTextContentStyle: React.CSSProperties = {
  fontStyle: 'italic',
  color: '#1f2937',
  wordBreak: 'break-word',
  lineHeight: 1.5,
  backgroundColor: '#ffffff',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  fontSize: '0.9rem',
};

const commentContentStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#111827',
  lineHeight: 1.6,
  wordBreak: 'break-word',
  backgroundColor: '#f9fafb',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #f3f4f6',
  minHeight: '2.5rem',
};

const resolvedBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0.75rem',
  right: '0.75rem',
  fontSize: '0.7rem',
  color: '#047857',
  backgroundColor: '#d1fae5',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontWeight: '500',
  border: '1px solid #10b981',
};

export default CommentSidebar;
