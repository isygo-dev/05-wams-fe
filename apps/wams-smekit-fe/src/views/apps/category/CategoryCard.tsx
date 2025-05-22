import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import { CategoryType, IEnumCategoryType } from "../../../types/category";
import Box from "@mui/material/Box";
import { checkPermission } from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage,
} from "template-shared/@core/types/helper/apiPermissionTypes";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Icon from "template-shared/@core/components/icon";
import {
  Divider,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  CardActions,
  FormControlLabel,
  Stack,
  Avatar,
  useTheme
} from "@mui/material";
import CustomChip from "template-shared/@core/components/mui/chip";
import apiUrls from "../../../config/apiUrl";


interface CardItem {
  data: CategoryType | undefined;
  onDeleteClick: (rowId: number) => void | undefined;
  onViewClick: (category: CategoryType) => void;
  onSwitchStatus: (data: CategoryType, status: boolean) => void;
  imageUrl: string;
}


const CategoryCard = (props: CardItem) => {
  const { data, onDeleteClick, onViewClick, onSwitchStatus, imageUrl } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const status = data?.type === 'ENABLED';

  const getTypeConfig = (type: IEnumCategoryType) => {
    switch(type) {
      case IEnumCategoryType.ENABLED:
        return {
          color: 'success' as const,
          label: t('Enabled'),
        };
      case IEnumCategoryType.DISABLED:
        return { color: 'error' as const, label: t('Disabled') };
      default:
        return { color: 'secondary' as const, label: type };
    }
  };

  const typeConfig = getTypeConfig(data?.type ?? IEnumCategoryType.DISABLED);
  const hasWritePermission = checkPermission(
    PermissionApplication.IMS,
    PermissionPage.ACCOUNT,
    PermissionAction.WRITE
  );

  if (!data) {
    return null;
  }

  return (
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


          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
              <Tooltip title={t("Action.Delete")}>
                <IconButton
                  size="small"
                  sx={{
                    color: "text.secondary",
                    '&:hover': { color: 'error.main' }
                  }}
                  onClick={() => onDeleteClick(data?.id ?? 0)}
                >
                  <Icon icon="tabler:trash" />
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.READ) && (
              <Tooltip title={t("Action.Edit")}>
                <IconButton
                  size="small"
                  sx={{
                    color: "text.secondary",
                    '&:hover': { color: 'primary.main' }
                  }}
                  onClick={() => onViewClick(data)}
                >
                  <Icon icon="fluent:slide-text-edit-24-regular" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
      <CardContent sx={{
        flex: '1 1 auto',
        py: 3,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              boxShadow: theme.shadows[2]
            }}
            src={data?.imagePath ? `${apiUrls.apiUrl_smekit_Category_ImageDownload_Endpoint}/${data.id}` : ''}
          >
            {!data?.imagePath && <Icon icon="mdi:folder-outline" fontSize="large" />}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data?.name || t('Unnamed Category')}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>{t('Domaine')}:</Box> {data.domain || t('N/A')}
          </Typography>
        </Box>

        <Accordion sx={{ textAlign: "left", boxShadow: "none !important", width: "100%" }}>
          <AccordionSummary
            sx={{ padding: "0px" }}
            id="panel-header-2"
            aria-controls="panel-content-2"
            expandIcon={<Icon fontSize="1.25rem" icon="tabler:chevron-down" />}
          >
            <Typography>{t("Tags")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "0px" }}>
            {data?.tagName && data.tagName.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {data.tagName.map((tag, index) => (
                  <CustomChip
                    key={index}
                    label={tag.tagName}
                    color="primary"
                    size="small"
                    skin='light'
                    rounded
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>{t("No tags assigned")}</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ textAlign: "left", boxShadow: "none !important", width: "100%" }}>
          <AccordionSummary
            sx={{ padding: "0px" }}
            id="panel-header-1"
            aria-controls="panel-content-1"
            expandIcon={<Icon fontSize="1.25rem" icon="tabler:chevron-down" />}
          >
            <Typography>{t("Description")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "0px" }}>
            {data?.description && data.description.length > 0 ? (
              <Typography sx={{ color: "text.secondary" }}>{data.description}</Typography>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>{t("No description")}</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <Box sx={{ flex: '0 0 auto' }}>
        <Divider />
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
              color={typeConfig.color}
              label={typeConfig.label}
            />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={status ? t('Disable Category') : t('Enable Category')}>
              <FormControlLabel
                control={
                  <Switch
                    checked={status}
                    onChange={(e) => onSwitchStatus(data, e.target.checked)}
                    color={status ? 'success' : 'error'}
                    disabled={!hasWritePermission}
                    size="small"
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Tooltip>
          </Box>
        </CardActions>

        {data.updatedBy && (
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
              {t('By')}: <Box component="span" sx={{ fontWeight: 500 }}>{data.updatedBy || t('Unknown')}</Box>
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
        )}
      </Box>
    </Card>
  );
};

export default CategoryCard;
