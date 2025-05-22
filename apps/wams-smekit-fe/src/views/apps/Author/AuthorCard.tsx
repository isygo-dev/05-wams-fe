import {useTranslation} from "react-i18next";
import Card from "@mui/material/Card";
import {AuthorType} from "../../../types/author";
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
import {Avatar, CardContent, Divider, Stack, Typography, useTheme} from "@mui/material";
import React from "react";

interface CardItem {
  data: AuthorType | undefined;
  onDeleteClick: (rowId: number) => void | undefined;
  onViewClick: (author: AuthorType) => void;
  imageUrl: string;
  onPreviewClick: (item: AuthorType) => void;
}

const AuthorCard = (props: CardItem) => {
  const {data, onDeleteClick, onViewClick, imageUrl, onPreviewClick} = props;
  const {t} = useTranslation();
  const theme = useTheme();

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
          : 'rgba(255, 255, 255, 0.04)',
        p: 2,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
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
                <Icon icon="tabler:edit"/>
              </IconButton>
            </Tooltip>
          )}
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
        <Avatar
          src={data.imagePath ? `${imageUrl}/${data.id}` : ''}
          sx={{
            width: 100,
            height: 100,
            boxShadow: theme.shadows[2]
          }}
        />

        <Box sx={{textAlign: 'center'}}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5
            }}
          >
            {data.firstname} {data.lastname}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
            {data.code}
          </Typography>
        </Box>

        <Stack spacing={1} width="100%">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{fontWeight: 600}}>Domain:</Typography>
            <Typography variant="body2" color="text.secondary">{data.domain || 'N/A'}</Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{fontWeight: 600}}>Email:</Typography>
            <Typography variant="body2" color="text.secondary">{data.email || 'N/A'}</Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{fontWeight: 600}}>Phone:</Typography>
            <Typography variant="body2" color="text.secondary">{data.phone || 'N/A'}</Typography>
          </Box>
        </Stack>
      </CardContent>

      <Box sx={{
        flex: '0 0 auto'
      }}>
        <Divider/>
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


        </Box>
      </Box>
    </Card>
  )
}

export default AuthorCard
