import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
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
  CardHeader,
  Divider,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  CardActions, FormControlLabel
} from "@mui/material";
import React from "react";
import Styles from "template-shared/style/style.module.css";
import CustomChip from "template-shared/@core/components/mui/chip";
import {CategoryTemplateType, IEnumTemplateVisibility} from "../../../types/categoryTemplateType";
import {MiniResume} from "rpm-shared/@core/types/rpm/ResumeTypes";
import template from "../../../pages/apps/template";

interface CardItem {
  data: CategoryTemplateType | undefined;
  onDeleteClick: (rowId: number) => void | undefined;
  onViewClick: (template: CategoryTemplateType) => void;
  onDownloadClick: (item: CategoryTemplateType) => void
  onSwitchStatus: (data: CategoryTemplateType, status: boolean) => void;
}

const TemplateCard = (props: CardItem) => {
  const { data, onDeleteClick, onViewClick, onSwitchStatus,onDownloadClick } = props;
  const { t } = useTranslation();



  if (!data) {
    return null;
  }

  const isPublic = data.typeTv === IEnumTemplateVisibility.PB;
  const hasWritePermission = checkPermission(
    PermissionApplication.IMS,
    PermissionPage.ACCOUNT,
    PermissionAction.WRITE
  );

  return (
    <Card>
      <CardHeader
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "initial",
          "& .MuiCardHeader-avatar": { mr: 2 },
        }}
        subheader={
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          ></Box>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "flex-end", padding: ".05rem" }}>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
              <Tooltip title={t("Action.Delete")}>
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
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
                  sx={{ color: "text.secondary" }}
                  onClick={() => onViewClick(data)}
                >
                  <Icon icon="fluent:slide-text-edit-24-regular" />
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.READ) && (
              <Tooltip title={t('Action.Download') as string}>
              <IconButton size='small' sx={{color: 'text.secondary'}}
                          onClick={() => onDownloadClick(data)}>
                <Icon icon='material-symbols:download'/>
              </IconButton>
            </Tooltip>
            )}
          </Box>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent>
        <Box className={Styles.cardContentStyle}>

          <Typography className={Styles.cardTitle} variant="h6">
            {data?.name || 'No name provided'}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {data?.domain || 'Domain not specified'}
          </Typography>

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
        </Box>
      </CardContent>
      <Divider className={Styles.dividerStyle} />
      <CardActions className={Styles.cardActionFooterStyle}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          px: 2,
          pb: 1
        }}>
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={isPublic ? 'success' : 'error'}
            label={t(data.typeTv)}
          />

          <Tooltip title={t(data.typeTv)}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => onSwitchStatus(data, e.target.checked)}
                  color={isPublic ? 'success' : 'error'}
                  disabled={!hasWritePermission}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default TemplateCard;
