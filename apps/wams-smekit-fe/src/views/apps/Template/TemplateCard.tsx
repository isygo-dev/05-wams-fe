import React, { useEffect, useState } from "react";
import {
  Card, Box, Tooltip, IconButton, Menu, MenuItem, Divider,
  CardContent, Typography, Accordion, AccordionSummary, AccordionDetails,
  Switch, CardActions, FormControlLabel, Stack, Avatar, Chip, useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Icon from "template-shared/@core/components/icon";
import CustomChip from "template-shared/@core/components/mui/chip";
import PinIcon from "../FavoriteTemplate/PinIcon";
import { checkPermission } from "template-shared/@core/api/helper/permission";
import {
  PermissionAction, PermissionApplication, PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {
  CategoryTemplateType, IEnumDocTempStatus, IEnumTemplateVisibility
} from "../../../types/categoryTemplateType";
import { getTemplatePreview2, fetchTemplateHtmlContent } from "../../../api/template";
import toast from "react-hot-toast";

interface CardItem {
  data: CategoryTemplateType | undefined;
  onDeleteClick: (rowId: number) => void;
  onViewClick: (template: CategoryTemplateType) => void;
  onDownloadClick: (item: CategoryTemplateType) => void;
  onSwitchStatus: (data: CategoryTemplateType, status: boolean) => void;
  onPreviewClick?: (item: CategoryTemplateType) => void;
  onPinToggle?: (templateId: number, newStatus: boolean) => void;
  onCreateDoc?: (templateId: number, name: string, content: string) => void;
}

const TemplateCard: React.FC<CardItem> = ({
                                            data,
                                            onDeleteClick,
                                            onViewClick,
                                            onDownloadClick,
                                            onSwitchStatus,
                                            onPreviewClick,
                                            onPinToggle,
                                            onCreateDoc
                                          }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [, setPreviewUrl] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchorEl);

  const extension = data?.extension?.toLowerCase();

  useEffect(() => {
    const fetchPreview = async () => {
      if (!data?.id || !extension) return;
      if (["pdf", "doc", "docx"].includes(extension)) {
        try {
          const blob = await getTemplatePreview2(data.id, data.version || 1);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        } catch (err) {
          console.error("Erreur lors du chargement de l’aperçu :", err);
        }
      }
    };
    fetchPreview();
  }, [data?.id, extension, data?.version]);

  const handlePinToggle = (newStatus: boolean) => {
    if (data?.id) onPinToggle?.(data.id, newStatus);
  };

  const handleCreateDoc = async () => {
    if (!data) return;
    try {
      const html = await fetchTemplateHtmlContent(data.id, data.version || 1);
      if (html?.trim()) {
        onCreateDoc?.(data.id, data.name, html);
      } else {
        toast.error(t("Le contenu du template est vide."));
      }
    } catch (err: any) {
      toast.error(t("Erreur") + " : " + err.message);
    } finally {
      setMenuAnchorEl(null);
    }
  };

  const getFileTypeIcon = () => {
    switch (extension) {
      case "pdf": return "mdi:file-pdf-box";
      case "doc": case "docx": return "mdi:file-word-outline";
      case "xls": case "xlsx": return "mdi:file-excel-outline";
      case "ppt": case "pptx": return "mdi:file-powerpoint-outline";
      default: return "mdi:file-outline";
    }
  };

  const getFileTypeColor = () => {
    switch (extension) {
      case "pdf": return "error.main";
      case "doc": case "docx": return "primary.main";
      case "xls": case "xlsx": return "success.main";
      case "ppt": case "pptx": return "warning.main";
      default: return "text.secondary";
    }
  };

  const getStatusColor = (): 'warning' | 'success' | 'error' | 'secondary' => {
    switch (data?.typeTs) {
      case IEnumDocTempStatus.EDITING: return 'warning';
      case IEnumDocTempStatus.VALIDATING: return 'success';
      case IEnumDocTempStatus.REJECTED: return 'error';
      default: return 'secondary';
    }
  };

  const isPublic = data?.typeTv === IEnumTemplateVisibility.PB;
  const hasWritePermission = checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE);
  const hasDeletePermission = checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE);

  if (!data) return null;

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] }
    }}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.04)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'transparent', color: getFileTypeColor() }}>
            <Icon icon={getFileTypeIcon()} />
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PinIcon templateId={data.id} isPinned={!!data.isFavorite} onToggle={handlePinToggle} tooltipPlacement="left" />
            {hasWritePermission && (
              <Tooltip title={t("Modifier")}>
                <IconButton onClick={() => onViewClick(data)}><Icon icon="fluent:slide-text-edit-24-regular" /></IconButton>
              </Tooltip>
            )}
            {data.originalFileName && (
              <Tooltip title={t("Télécharger")}>
                <IconButton onClick={() => onDownloadClick(data)}><Icon icon="material-symbols:download" /></IconButton>
              </Tooltip>
            )}
            <Tooltip title={t("Actions")}>
              <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}><Icon icon="mdi:dots-vertical" /></IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, py: 2, px: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="h6" noWrap>{data.name}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`v${data.version || '1.0'}`} size="small" />
          <Chip label={data.typeTl} size="small" />
        </Stack>
        <Typography variant="body2" color="text.secondary"><strong>{t('Domaine')}:</strong> {data.domain}</Typography>
        <Typography variant="body2" color="text.secondary"><strong>{t('Category')}:</strong> {data.category?.name}</Typography>
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<Icon icon="tabler:chevron-down" />}>
            <Typography>{t("Description")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">{data.description || t("No description")}</Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <CustomChip rounded size="small" skin="light" color={getStatusColor()} label={t(data.typeTs)} />
          <CustomChip rounded size="small" skin="light" color={isPublic ? 'primary' : 'error'} label={t(data.typeTv)} />
        </Stack>
        <FormControlLabel
          control={<Switch checked={isPublic} onChange={(e) => onSwitchStatus(data, e.target.checked)} disabled={!hasWritePermission} size="small" />}
          label=""
          sx={{ m: 0 }}
        />
      </CardActions>

      <Menu anchorEl={menuAnchorEl} open={open} onClose={() => setMenuAnchorEl(null)} PaperProps={{ style: { minWidth: 180 } }}>
        <MenuItem onClick={() => { setMenuAnchorEl(null); onPreviewClick?.(data); }}>
          <Icon icon="solar:document-bold" style={{ marginRight: 8 }} /> {t("Aperçu")}
        </MenuItem>
        {hasWritePermission && (
          <MenuItem onClick={() => { setMenuAnchorEl(null); window.location.href = `/apps/editor/view/edit/${data.id}/${data.version || '1'}`; }}>
            <Icon icon="mdi:file-document-edit-outline" style={{ marginRight: 8 }} /> {t("Modifier le document")}
          </MenuItem>
        )}
        <MenuItem onClick={handleCreateDoc}>
          <Icon icon="mdi:file-document-plus" style={{ marginRight: 8 }} /> {t("Créer document")}
        </MenuItem>
        <MenuItem onClick={() => { setMenuAnchorEl(null); onDownloadClick(data); }}>
          <Icon icon="material-symbols:download" style={{ marginRight: 8 }} /> {t("Télécharger")}
        </MenuItem>
        {hasDeletePermission && (
          <MenuItem onClick={() => { setMenuAnchorEl(null); onDeleteClick(data.id); }}>
            <Icon icon="tabler:trash" style={{ marginRight: 8 }} /> {t("Supprimer")}
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default TemplateCard;
