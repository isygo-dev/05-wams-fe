import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,

  Box,
  Tooltip,
  Typography,
  useTheme,

} from '@mui/material';
import { Icon } from '@iconify/react';
import { DashboardLayout } from "../../../types/Dashboard";
import {useTranslation} from "react-i18next";

interface DashboardControlsProps {
  layout: DashboardLayout;
  setLayout: (layout: DashboardLayout) => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: (element: HTMLElement | null) => void;
  setCustomizeOpen: (open: boolean) => void;
  onCustomizeClick: () => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  layout,
  setLayout,
  anchorEl,
  setAnchorEl,
  onCustomizeClick
}) => {
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleCustomizeClick = () => {
    onCustomizeClick();
    handleClose();
  }

  const toggleDenseMode = () => {
    const newLayout = {
      ...layout,
      denseMode: !layout.denseMode
    };

    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box>
        <Typography variant="h4" sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1
        }}>
          {t('Dashboard')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('Aperçu des statistiques et activités récentes')}
        </Typography>
      </Box>

      <Box>
        <Tooltip title={t("Personnaliser le tableau de bord")}>
          <IconButton
            onClick={handleClick}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
                transform: 'rotate(30deg)',
                transition: 'transform 0.3s ease'
              }
            }}
            aria-label="Paramètres du tableau de bord"
          >
            <Icon icon="mdi:cog-outline" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 320,
              maxWidth: '100%',
              mt: 1,
              boxShadow: theme.shadows[6]
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleCustomizeClick} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon
                icon="mdi:view-dashboard-edit"
                width={20}
                color={theme.palette.text.secondary}
              />
            </ListItemIcon>
            <ListItemText
              primary={t("Personnaliser la disposition")}
              secondary={t("Gérer les widgets et les statistiques")}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardControls;
