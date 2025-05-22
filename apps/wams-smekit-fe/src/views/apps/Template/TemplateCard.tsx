import {useTranslation} from "react-i18next";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage,
} from "template-shared/@core/types/helper/apiPermissionTypes";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Icon from "template-shared/@core/components/icon";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  CardActions,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  useTheme
} from "@mui/material";
import React from "react";
import CustomChip from "template-shared/@core/components/mui/chip";
import {
  CategoryTemplateType,
  IEnumDocTempStatus,
  IEnumTemplateLanguage,
  IEnumTemplateVisibility
} from "../../../types/categoryTemplateType";
import PinIcon from "../FavoriteTemplate/PinIcon";

// import {useQuery} from "react-query";
// import {fetchAllTemplate, getTemplatesByCategory} from "../../../api/template";

interface CardItem {
  data: CategoryTemplateType | undefined;
  onDeleteClick?: (rowId: number) => void | undefined;
  onViewClick?: (template: CategoryTemplateType) => void;
  onDownloadClick?: (item: CategoryTemplateType) => void;
  onSwitchStatus?: (data: CategoryTemplateType, status: boolean) => void;
  onPreviewClick?: (item: CategoryTemplateType) => void;
  onPinToggle?: (templateId: number, newStatus: boolean) => void;
  isPinned?: boolean;

}

const TemplateCard = (props: CardItem) => {
  const {data, onDeleteClick, onViewClick, onSwitchStatus, onDownloadClick, onPreviewClick, onPinToggle} = props;
  const {t} = useTranslation();
  const theme = useTheme();

  // const [selectedCategory] = useState<number | null>(null)

  // const [categories, setCategories] = useState<any[]>([])

  const getStatusColor = () => {
    switch (data?.typeTs) {
      case IEnumDocTempStatus.EDITING:
        return 'warning';
      case IEnumDocTempStatus.VALIDATING:
        return 'success';
      case IEnumDocTempStatus.REJECTED:
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getLanguageLabel = () => {
    switch (data?.typeTl) {
      case IEnumTemplateLanguage.EN:
        return 'English';
      case IEnumTemplateLanguage.FR:
        return 'French';
      case IEnumTemplateLanguage.AR:
        return 'Arabic';
      case IEnumTemplateLanguage.DE:
        return 'German';
      case IEnumTemplateLanguage.SPA:
        return 'Spanish';
      case IEnumTemplateLanguage.ITA:
        return 'Italian';
      default:
        return data?.typeTl;
    }
  };

  const getFileTypeIcon = () => {
    if (!data?.extension) return "mdi:file-outline";

    const ext = data.extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return "mdi:file-pdf-box";
      case "doc":
        return "mdi:file-word-outline";
      case "docx":
        return "mdi:file-word-outline";
      case "xls":
        return "mdi:file-excel-outline";
      case "xlsx":
        return "mdi:file-excel-outline";
      case "ppt":
        return "mdi:file-powerpoint-outline";
      case "pptx":
        return "mdi:file-powerpoint-outline";
      case "txt":
        return "mdi:file-document-outline";

      default:
        return "mdi:file-outline";
    }
  }

  const getFileTypeColor = () => {
    if (!data?.extension) return "text.secondary";

    const ext = data.extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return "error.main";
      case "doc":
        return "primary.main";
      case "docx":
        return "primary.main";
      case "xls":
        return "success.main";
      case "xlsx":
        return "success.main";
      case "ppt":
        return "warning.main";
      case "pptx":
        return "warning.main";
      default:
        return "text.secondary";
    }
  }

  if (!data) {
    return null;
  }
  const handlePinToggle = (newStatus: boolean) => {
    if (onPinToggle && data) {
      onPinToggle(data.id, newStatus);
    }
  }


  const isPublic = data.typeTv === IEnumTemplateVisibility.PB;
  const hasWritePermission = checkPermission(
    PermissionApplication.IMS,
    PermissionPage.ACCOUNT,
    PermissionAction.WRITE
  )


  // const { data: categoryTemplate, isLoading } = useQuery(
  //   ['categoryTemplate', selectedCategory],
  //   () => selectedCategory ? getTemplatesByCategory(selectedCategory) : fetchAllTemplate(),
  //   {
  //     select: (data) => {
  //       if (Array.isArray(data)) {
  //         return data.map(item => ({
  //           ...item,
  //           author: item.author || null,
  //           category: item.category || null
  //         }))
  //       }
  //
  //       return data
  //     }
  //   }
  // )

  return (

    // <CategorySelector
    //   selectedCategory={selectedCategory}
    //   setSelectedCategory={setSelectedCategory}
    //   categories={categories || []}
    // />
    //
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8]
      }
    }}>


      <Box sx={{
        flex: '0 0 auto',
        backgroundColor: theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, 0.02)'
          : 'rgba(255, 255, 255, 0.04)'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'transparent',
              color: getFileTypeColor(),
              '& .MuiSvgIcon-root': {fontSize: '3rem'},
              '& svg': {fontSize: '2.2rem'}
            }}
          >
            <Icon icon={getFileTypeIcon()} fontSize="large"/>
          </Avatar>

          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>

            <PinIcon
              templateId={data?.id || 0}
              isPinned={Boolean(data?.isFavorite)}
              onToggle={handlePinToggle}
              tooltipPlacement="left"
            />

            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
              <Tooltip title={t("Action.Delete")}>
                <IconButton
                  size="small"
                  sx={{
                    color: "text.secondary",
                    '&:hover': {color: 'error.main'}
                  }}
                  onClick={() => onDeleteClick(data?.id ?? 0)}
                >
                  <Icon icon="tabler:trash"/>
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.READ) && (
              <Tooltip title={t("Action.Edit")}>
                <IconButton
                  size="small"
                  sx={{
                    color: "text.secondary",
                    '&:hover': {color: 'primary.main'}
                  }}
                  onClick={() => onViewClick(data)}
                >
                  <Icon icon="fluent:slide-text-edit-24-regular"/>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('Action.Preview') as string}>
              <IconButton
                size='small'
                sx={{
                  color: 'text.secondary',
                  '&:hover': {color: 'info.main'},
                  '&:disabled': {opacity: 0.5}
                }}
                onClick={() => onPreviewClick?.(data)}
                disabled={!data.originalFileName}
              >
                <Icon icon='solar:document-bold'/>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{
        flex: '1 1 auto',
        py: 2,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data?.name || 'No name provided'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{mb: 1.5}}>
            <Chip
              label={`v${data.version || '1.0'}`}
              size="small"
              color="default"
              variant="outlined"
            />
            <Chip
              label={getLanguageLabel()}
              size="small"
              color="default"
              variant="outlined"
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
            <Box component="span" sx={{fontWeight: 600}}>Domain:</Box> {data.domain || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{fontWeight: 600}}>Category:</Box> {data.category?.name || 'N/A'}
          </Typography>
        </Box>

        <Accordion sx={{textAlign: "left", boxShadow: "none !important", width: "100%"}}>
          <AccordionSummary
            sx={{padding: "0px"}}
            id="panel-header-1"
            aria-controls="panel-content-1"
            expandIcon={<Icon fontSize="1.25rem" icon="tabler:chevron-down"/>}
          >
            <Typography>{t("Description")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{padding: "0px"}}>
            {data?.description && data.description.length > 0 ? (
              <Typography sx={{color: "text.secondary"}}>{data.description}</Typography>
            ) : (
              <Typography sx={{color: "text.secondary"}}>{t("No description")}</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <Box sx={{flex: '0 0 auto'}}>
        <Divider/>
        <CardActions sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2
        }}>
          <Stack direction="row" spacing={1}>
            <CustomChip
              rounded
              size='small'
              skin='light'
              color={getStatusColor()}
              label={t(data.typeTs)}
            />
            <CustomChip
              rounded
              size='small'
              skin='light'
              color={isPublic ? 'primary' : 'error'}
              label={t(data.typeTv)}
            />
          </Stack>

          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Tooltip title={t('Action.Download') as string}>
              <IconButton
                size='small'
                sx={{
                  color: 'text.secondary',
                  '&:hover': {color: 'primary.main'},
                  '&:disabled': {opacity: 0.5}
                }}
                onClick={() => onDownloadClick(data)}
                disabled={!data.originalFileName}
              >
                <Icon icon='material-symbols:download'/>
              </IconButton>
            </Tooltip>

            <Tooltip title={t(data.typeTv)}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(e) => onSwitchStatus(data, e.target.checked)}
                    color={isPublic ? 'success' : 'error'}
                    disabled={!hasWritePermission}
                    size="small"
                  />
                }
                label=""
                sx={{m: 0}}
              />
            </Tooltip>
          </Box>
        </CardActions>

        <Box sx={{
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.02)'
            : 'rgba(255, 255, 255, 0.04)'
        }}>
          <Typography variant="caption" color="text.secondary">
            {t('By')}: <Box component="span" sx={{fontWeight: 500}}>{data.updatedBy || t('Unknown')}</Box>
          </Typography>
          {data.updateDate && (
            <Typography variant="caption" color="text.secondary">
              {new Date(data.updateDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default TemplateCard
