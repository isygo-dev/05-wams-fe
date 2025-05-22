import React, {useEffect, useState} from "react";
import {TreeItem, treeItemClasses, TreeView} from "@mui/lab";
import {ChevronRight, ExpandMore} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import {fetchAll} from "../../../api/category";
import {getTemplatesByCategory} from "../../../api/template";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {CategoryType} from "../../../types/category";
import {CategoryTemplateType} from "../../../types/categoryTemplateType";
import PinIcon from "../FavoriteTemplate/PinIcon";

interface TreeViewCategoriesTemplatesProps {
  onDeleteClick?: (template: CategoryTemplateType) => void;
  onUpdateClick?: (template: CategoryTemplateType) => void;
  onDownload?: (template: CategoryTemplateType) => void;
  onPreviewClick?: (template: CategoryTemplateType) => void;
  onCategoryClick?: (category: CategoryType) => void;
  categories?: (CategoryType & { templates?: CategoryTemplateType[] })[];
  templates?: CategoryTemplateType[];
}

const PremiumTreeItem = styled(TreeItem)(({theme}) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: '8px 12px',
    borderRadius: theme.shape.borderRadius,
    marginBottom: 4,
    transition: 'all 0.2s ease-out',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: 'translateX(2px)'
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 500,
      padding: 0
    },
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
    [`& .${treeItemClasses.label}`]: {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 24,
    borderLeft: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
    paddingLeft: 16,
  },
}));

const TreeViewWrapper = styled(Box)(() => ({
  padding: '20px',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const TreeViewCategoriesTemplates: React.FC<TreeViewCategoriesTemplatesProps> = ({
                                                                                   onDeleteClick,
                                                                                   onUpdateClick,
                                                                                   onDownload,
                                                                                   onPreviewClick,
                                                                                   onCategoryClick,
                                                                                   categories: propCategories
                                                                                 }) => {
  const theme = useTheme();
  const [categories, setCategories] = useState<(CategoryType & {
    templates: CategoryTemplateType[],
    icon: string
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedItem] = useState<string | null>(null);

  const getCategoryIcon = (categoryName: string): string => {
    const categoryIcons: Record<string, string> = {
      'finance': 'mdi:finance',
      'legal': 'mdi:scale-balance',
      'hr': 'mdi:account-group',
      'marketing': 'mdi:bullhorn',
      'technical': 'mdi:cog',
      'default': 'mdi:folder-outline'
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lowerName.includes(key)) return icon;
    }

    return categoryIcons.default;
  };

  const getFileTypeIcon = (extension?: string): string => {
    if (!extension) return "mdi:file-outline";
    const ext = extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return "mdi:file-pdf-box";
      case "doc":
      case "docx":
        return "mdi:file-word-outline";
      case "xls":
      case "xlsx":
        return "mdi:file-excel-outline";
      case "ppt":
      case "pptx":
        return "mdi:file-powerpoint-outline";
      case "txt":
        return "mdi:file-document-outline";
      case "jpg":
      case "jpeg":
      case "png":
        return "mdi:image-outline";
      case "zip":
      case "rar":
        return "mdi:folder-zip-outline";
      default:
        return "mdi:file-outline";
    }
  };

  const getFileTypeColor = (extension?: string): string => {
    if (!extension) return theme.palette.text.secondary;
    const ext = extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return theme.palette.error.main;
      case "doc":
      case "docx":
        return "#1E88E5";
      case "xls":
      case "xlsx":
        return theme.palette.success.main;
      case "ppt":
      case "pptx":
        return theme.palette.warning.main;
      case "jpg":
      case "jpeg":
      case "png":
        return theme.palette.secondary.main;
      case "zip":
      case "rar":
        return theme.palette.grey[600];
      default:
        return theme.palette.text.secondary;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesToUse = propCategories || await fetchAll();

        const categoriesWithTemplates = await Promise.all(
          categoriesToUse.map(async (category) => {
            try {
              const templates = await getTemplatesByCategory(category.id)

              return {
                ...category,
                templates: templates || [],
                icon: getCategoryIcon(category.name)
              };
            } catch (err) {
              console.error(`Error fetching templates for category ${category.id}:`, err)

              return {
                ...category,
                templates: [],
                icon: getCategoryIcon(category.name)
              };
            }
          })
        );

        const nonEmptyCategories = categoriesWithTemplates.filter(cat => cat.templates.length > 0);
        setCategories(nonEmptyCategories);

        if (nonEmptyCategories.length > 0) {
          setExpandedNodes([String(nonEmptyCategories[0].id)]);
        }
      } catch (error) {
        console.error("Error fetching categories and templates:", error);
        setError(error.message || "Failed to load document library");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propCategories]);

  const handleNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpandedNodes(nodeIds);
  };

  const handleItemSelect = (nodeId: string) => {
    setSelectedItem(nodeId);
  };

  const handleRefresh = () => {
    setError(null);
    setLoading(true);
  };

  const renderTemplateActions = (template: CategoryTemplateType) => {
    return (
      <Box sx={{
        display: 'flex',
        gap: 0.5,
        ml: 'auto',
        pr: 1
      }}>
        {template.updateDate && (
          <Typography variant="caption" sx={{
            color: 'text.secondary',
            alignSelf: 'center',
            mr: 1,
            fontSize: '0.7rem'
          }}>
            {new Date(template.updateDate).toLocaleDateString()}
          </Typography>
        )}
        <PinIcon
          templateId={template.id}
          size="small"
          onToggle={(newStatus) => {
            console.log(`Template ${template.id} pin status changed to:`, newStatus);
          }}
        />
        {onPreviewClick && (
          <Tooltip title="Preview" arrow>
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onPreviewClick(template);
              }}
            >
              <Icon icon="mdi:eye-outline" fontSize="1rem"/>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Download" arrow>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'success.main',
                backgroundColor: alpha(theme.palette.success.main, 0.05)
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(template);
            }}
            disabled={!template.originalFileName}
          >
            <Icon icon="mdi:download-outline" fontSize="1rem"/>
          </IconButton>
        </Tooltip>

        {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
          <Tooltip title="Edit" arrow>
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'info.main',
                  backgroundColor: alpha(theme.palette.info.main, 0.05)
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateClick?.(template);
              }}
            >
              <Icon icon="mdi:pencil-outline" fontSize="1rem"/>
            </IconButton>
          </Tooltip>
        )}

        {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: alpha(theme.palette.error.main, 0.05)
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(template);
              }}
            >
              <Icon icon="mdi:delete-outline" fontSize="1rem"/>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  const renderTemplate = (template: CategoryTemplateType) => {
    const fileExtension = template.originalFileName?.split('.').pop();
    const icon = getFileTypeIcon(fileExtension);
    const color = getFileTypeColor(fileExtension);

    return (
      <PremiumTreeItem
        key={template.id}
        nodeId={`template-${template.id}`}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: theme.shape.borderRadius,
              transition: 'all 0.2s ease-out',

            }}
            onClick={() => handleItemSelect(`template-${template.id}`)}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                marginRight: 12,
                bgcolor: color,
                color: theme.palette.getContrastText(color),
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Icon icon={icon} fontSize="1.2rem"/>
            </Avatar>

            <Box sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  mb: 0.5
                }}
              >
                {template.name}
              </Typography>
              {template.description && (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.3
                  }}
                >
                  {template.description}
                </Typography>
              )}
            </Box>

            {renderTemplateActions(template)}
          </Box>
        }
      />
    );
  };

  const renderEmptyState = (icon: string, title: string, message: string, action?: React.ReactNode) => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      textAlign: 'center',
      p: 4
    }}>
      <Icon icon={icon} fontSize="3.5rem" color="disabled" style={{
        marginBottom: 16,
        opacity: 0.6
      }}/>
      <Typography variant="h6" color="textSecondary" sx={{
        mb: 1,
        fontWeight: 500
      }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{
        mb: 3,
        color: 'text.secondary',
        maxWidth: '360px'
      }}>
        {message}
      </Typography>
      {action}
    </Box>
  );

  if (loading) {
    return (
      <TreeViewWrapper>
        <Typography variant="h6" sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary'
        }}>
          <Skeleton variant="circular" width={24} height={24} sx={{mr: 1.5}}/>
          <Skeleton width={160} height={24}/>
        </Typography>

        {[...Array(3)].map((_, index) => (
          <React.Fragment key={index}>
            <Box sx={{px: 2, py: 1}}>
              <Skeleton variant="rectangular" width="100%" height={48} sx={{borderRadius: 1}}/>
            </Box>
            {[...Array(2)].map((_, subIndex) => (
              <Box key={subIndex} sx={{px: 4, py: 0.5}}>
                <Skeleton variant="rectangular" width="100%" height={64} sx={{borderRadius: 1}}/>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </TreeViewWrapper>
    );
  }

  if (error) {
    return (
      <TreeViewWrapper>
        {renderEmptyState(
          "mdi:alert-circle-outline",
          "Loading Error",
          error,
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Icon icon="mdi:reload"/>}
            onClick={handleRefresh}
            sx={{
              mt: 2,
              px: 3,
              py: 1,
              borderRadius: '6px'
            }}
          >
            Refresh Documents
          </Button>
        )}
      </TreeViewWrapper>
    );
  }

  if (categories.length === 0) {
    return (
      <TreeViewWrapper>
        {renderEmptyState(
          "mdi:folder-open-outline",
          "No Documents Found",
          "Your document library is currently empty. Start by creating your first category or uploading documents."
        )}
      </TreeViewWrapper>
    );
  }

  return (
    <TreeViewWrapper>
      <Typography variant="h6" sx={{
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        fontWeight: 500
      }}>

        Document Library
      </Typography>

      <Box sx={{
        flex: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 3,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.4),
          }
        }
      }}>
        <TreeView
          aria-label="document-library"
          defaultCollapseIcon={
            <ExpandMore sx={{
              color: 'text.secondary',
              fontSize: '1.6rem'
            }}/>
          }
          defaultExpandIcon={
            <ChevronRight sx={{
              color: 'text.secondary',
              fontSize: '1.6rem'
            }}/>
          }
          expanded={expandedNodes}
          onNodeToggle={handleNodeToggle}
        >
          {categories.map((category) => (
            <PremiumTreeItem
              key={category.id}
              nodeId={String(category.id)}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    transition: 'all 0.2s ease-out',
                    cursor: 'pointer',

                  }}
                  onClick={() => {
                    handleItemSelect(String(category.id));
                    onCategoryClick?.(category);
                  }}
                >
                  <Icon
                    icon={category.icon}
                    style={{
                      fontSize: '1.6rem',
                      marginRight: 12,
                      color: expandedNodes.includes(String(category.id)) ?
                        theme.palette.primary.main : theme.palette.text.secondary
                    }}
                  />
                  <Typography variant="subtitle1" sx={{
                    flex: 1,
                    fontWeight: expandedNodes.includes(String(category.id)) ?
                      600 : 500,
                    color: expandedNodes.includes(String(category.id)) ?
                      theme.palette.primary.main : theme.palette.text.primary
                  }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={category.templates?.length || 0}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: expandedNodes.includes(String(category.id)) ?
                        alpha(theme.palette.primary.light, 0.15) :
                        alpha(theme.palette.action.selected, 0.2),
                      color: expandedNodes.includes(String(category.id)) ?
                        theme.palette.primary.main : theme.palette.text.secondary,
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 22
                    }}
                  />
                </Box>
              }
            >
              {category.templates.map(renderTemplate)}
            </PremiumTreeItem>
          ))}
        </TreeView>
      </Box>
    </TreeViewWrapper>
  );
};

export default TreeViewCategoriesTemplates
