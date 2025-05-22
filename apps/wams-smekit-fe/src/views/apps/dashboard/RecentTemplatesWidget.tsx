import React from 'react';
import {alpha, Avatar, Box, Card, Chip, IconButton, Tooltip, Typography, useTheme} from '@mui/material';
import {Icon} from '@iconify/react';
import {RecentTemplate} from "../../../types/Dashboard";
import {useTranslation} from "react-i18next";

interface RecentTemplatesWidgetProps {
  templates: RecentTemplate[];
  denseMode: boolean;
  onRefresh: () => void;
}

const RecentTemplatesWidget: React.FC<RecentTemplatesWidgetProps> = ({
                                                                       templates,
                                                                       denseMode,
                                                                       onRefresh
                                                                     }) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const recentItemStyle = {
    p: denseMode ? 1 : 2,
    borderRadius: 2,
    mb: denseMode ? 1 : 2,
    bgcolor: 'background.paper',
    boxShadow: '0 2px 10px 0 rgba(0,0,0,0.02)',
    transition: 'all 0.3s',
    '&:hover': {
      bgcolor: 'action.hover',
      transform: 'translateX(5px)'
    }
  };

  return (
    <Card sx={{
      p: denseMode ? 2 : 3,
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
    }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
        <Typography variant="h6" sx={{fontWeight: 600}}>
          {t('Templates Récents')}
        </Typography>
        <Tooltip title={t("Actualiser")}>
          <IconButton
            size="small"
            onClick={onRefresh}
            sx={{
              bgcolor: theme.palette.action.hover,
              '&:hover': {bgcolor: theme.palette.action.selected}
            }}
          >
            <Icon icon="mdi:refresh"/>
          </IconButton>
        </Tooltip>
      </Box>

      {templates?.length > 0 ? (
        <Box>
          {templates.map((template) => (
            <Box key={template.id} sx={recentItemStyle}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{display: 'flex', alignItems: 'center', flex: 1}}>
                  <Avatar sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    bgcolor: template.status === 'active' ?
                      alpha(theme.palette.success.main, 0.1) :
                      alpha(theme.palette.warning.main, 0.1),
                    color: template.status === 'active' ?
                      theme.palette.success.main :
                      theme.palette.warning.main
                  }}>
                    <Icon
                      icon={template.status === 'active' ? 'mdi:file-check-outline' : 'mdi:file-clock-outline'}
                      fontSize={24}
                    />
                  </Avatar>
                  <Box sx={{flex: 1}}>
                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                      {template.name}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 0.5
                    }}>
                      <Typography variant="caption" sx={{
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Icon icon="mdi:account-outline" width={14} style={{marginRight: 4}}/>
                        {template.author}
                      </Typography>
                      <Typography variant="caption" sx={{
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Icon icon="mdi:calendar-blank" width={14} style={{marginRight: 4}}/>
                        {template.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Chip
                  label={template.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.action.hover}}>
          <Icon icon="mdi:file-document-outline" width={48}
                style={{color: theme.palette.text.disabled, marginBottom: 16}}/>
          <Typography variant="body2" sx={{color: theme.palette.text.disabled}}>
            {t('Aucun template récent')}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default RecentTemplatesWidget;
