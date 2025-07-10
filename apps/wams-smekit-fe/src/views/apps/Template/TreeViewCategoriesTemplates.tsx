import React, { useEffect, useState } from "react";
import { TreeView, TreeItem, treeItemClasses } from "@mui/lab";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Chip,
  Avatar,
  Skeleton,
  Menu,
  MenuItem, alpha
} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import { fetchAll } from "../../../api/category";
import { getTemplatesByCategory, fetchTemplateHtmlContent } from "../../../api/template";

import { CategoryType } from "../../../types/category";
import { CategoryTemplateType } from "../../../types/categoryTemplateType";
import PinIcon from "../FavoriteTemplate/PinIcon";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/navigation";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";

interface TreeViewCategoriesTemplatesProps {
  onDeleteClick?: (template: CategoryTemplateType) => void;
  onUpdateClick?: (template: CategoryTemplateType) => void;
  onDownload?: (template: CategoryTemplateType) => void;
  onPreviewClick?: (template: CategoryTemplateType) => void;
  onCreateDoc?: (id: number, name: string, content: string) => void;
  onEditDoc?: (id: number, version: number) => void;
  onCategoryClick?: (category: CategoryType) => void;
  categories?: (CategoryType & { templates?: CategoryTemplateType[] })[];
}

const PremiumTreeItem = styled(TreeItem)(({ theme }) => ({
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
                                                                                   onDownload,
                                                                                   onPreviewClick,
                                                                                   onCreateDoc,
                                                                                   onEditDoc,
                                                                                   onCategoryClick,
                                                                                   categories: propCategories
                                                                                 }) => {
  const theme = useTheme();
  const [categories, setCategories] = useState<(CategoryType & { templates: CategoryTemplateType[], icon: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedItem] = useState<string | null>(null);
  const { t } = useTranslation();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTemplate, setActiveTemplate] = useState<CategoryTemplateType | null>(null);
  const router = useRouter()

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
      case "pdf": return "mdi:file-pdf-box";
      case "doc": case "docx": return "mdi:file-word-outline";
      case "xls": case "xlsx": return "mdi:file-excel-outline";
      case "ppt": case "pptx": return "mdi:file-powerpoint-outline";
      case "txt": return "mdi:file-document-outline";
      case "jpg": case "jpeg": case "png": return "mdi:image-outline";
      case "zip": case "rar": return "mdi:folder-zip-outline";
      default: return "mdi:file-outline";
    }
  };

  const getFileTypeColor = (extension?: string): string => {
    if (!extension) return theme.palette.text.secondary;
    const ext = extension.toLowerCase();
    switch (ext) {
      case "pdf": return theme.palette.error.main;
      case "doc": case "docx": return "#1E88E5";
      case "xls": case "xlsx": return theme.palette.success.main;
      case "ppt": case "pptx": return theme.palette.warning.main;
      case "jpg": case "jpeg": case "png": return theme.palette.secondary.main;
      case "zip": case "rar": return theme.palette.grey[600];
      default: return theme.palette.text.secondary;
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
              const templates = await getTemplatesByCategory(category.id);

              return {
                ...category,
                templates: templates || [],
                icon: getCategoryIcon(category.name)
              };
            } catch (err) {
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
        setError((error as Error).message || "Failed to load document library");
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
  const handleUpdateClick = (CategoryTemplate: CategoryTemplateType | null | undefined) => {
    if (!CategoryTemplate || !CategoryTemplate.id) {
      toast.error("Impossible d'éditer ce template (ID manquant)");

      return;
    }

    router.push(`/apps/template/view/update/${CategoryTemplate.id}`);
  }
  const openMenu = (event: React.MouseEvent<HTMLElement>, template: CategoryTemplateType) => {
    setActiveTemplate(template);
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
    setActiveTemplate(null);
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemSelect(`template-${template.id}`)}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: color,
                  color: theme.palette.getContrastText(color),
                  mr: 2,
                }}
              >
                <Icon icon={icon} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" noWrap>{template.name}</Typography>
                <Typography variant="caption" noWrap>{template.description}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {template.description && (
                <Tooltip title={t(template.description)} placement="top">
                  <IconButton
                    size="small"
                    sx={{ color: 'text.secondary' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon icon="tabler:info-circle" />
                  </IconButton>
                </Tooltip>
              )}
              {/* Pin */}
              <PinIcon templateId={template.id} isPinned={!!template.isFavorite} />
              {checkPermission(PermissionApplication.SMEKIT, PermissionPage.TEMPLATE, PermissionAction.WRITE) && (

              <Tooltip title={t("Modifier le template")} placement="top">
                <IconButton
                  size="small"
                  sx={{ color: 'text.secondary' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateClick(template);
                  }}
                >
                  <Icon icon="tabler:edit" />
                </IconButton>
              </Tooltip>
            )}
              {/* Télécharger */}
              <Tooltip title={t("Télécharger")}>
                <IconButton size="small" onClick={() => onDownload?.(template)}>
                  <Icon icon="material-symbols:download" />
                </IconButton>
              </Tooltip>

              {/* Menu actions supplémentaires */}
              <Tooltip title={t("Actions")}>
                <IconButton size="small" onClick={(e) => openMenu(e, template)}>
                  <Icon icon="mdi:dots-vertical" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
      />
    );

  };

  return loading ? <Skeleton height={200} /> : (
    <TreeViewWrapper>
      <Typography variant="h6" sx={{ mb: 2 }}>{t('Document Library')}</Typography>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TreeView
          aria-label="document-library"
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          expanded={expandedNodes}
          onNodeToggle={handleNodeToggle}
        >
          {categories.map(category => (
            <PremiumTreeItem key={category.id} nodeId={String(category.id)} label={
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }} onClick={() => { handleItemSelect(String(category.id)); onCategoryClick?.(category); }}>
                <Icon icon={category.icon} style={{ fontSize: '1.6rem', marginRight: 12 }} />
                <Typography variant="subtitle1" sx={{ flex: 1 }}>{category.name}</Typography>
                <Chip label={category.templates.length} size="small" />
              </Box>
            }>
              {category.templates.map(renderTemplate)}
            </PremiumTreeItem>
          ))}
        </TreeView>
      </Box>

      {activeTemplate && (
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu} PaperProps={{ style: { minWidth: 200 } }}>
          <MenuItem onClick={async () => {
            closeMenu();
            try {
              const html = await fetchTemplateHtmlContent(activeTemplate.id, activeTemplate.version || 1);
              if (!html || html.trim() === '') {
                toast.error(t('Le contenu du template est vide.'));

                return;
              }
              onCreateDoc?.(activeTemplate.id, activeTemplate.name, html);
            } catch (err: any) {
              toast.error(t("Erreur") + ": " + err.message);
            }
          }}><Icon icon="mdi:file-document-plus-outline" style={{ marginRight: 8 }} />{t("Créer document")}</MenuItem>
          <MenuItem onClick={() => { closeMenu(); onEditDoc?.(activeTemplate.id, activeTemplate.version || 1); }}><Icon icon="mdi:file-document-edit-outline" style={{ marginRight: 8 }} />{t("Modifier le document")}</MenuItem>
          <MenuItem onClick={() => { closeMenu(); onPreviewClick?.(activeTemplate); }}><Icon icon="mdi:eye-outline" style={{ marginRight: 8 }} />{t("Aperçu")}</MenuItem>
          {checkPermission(PermissionApplication.SMEKIT, PermissionPage.TEMPLATE, PermissionAction.DELETE) && (

          <MenuItem onClick={() => { closeMenu(); onDeleteClick?.(activeTemplate); }}>
            <Icon icon="tabler:trash" style={{ marginRight: 8 }} />{t("Supprimer")}
          </MenuItem>
            )}
        </Menu>
      )}
    </TreeViewWrapper>
  );
};

export default TreeViewCategoriesTemplates;
