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
  Chip
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
                                                               // setCustomizeOpen,
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

  // Logique de cycle automatique : 2 → 3 → 4 → 2...
  const handleStatsColumnsClick = () => {
    const nextColumns = layout.statsColumns === 4 ? 2 : layout.statsColumns + 1;
    const newLayout = {
      ...layout,
      statsColumns: nextColumns
    };

    setLayout(newLayout);

    // Sauvegarder dans localStorage
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));

    handleClose();
  };

  const toggleDenseMode = () => {
    setLayout({
      ...layout,
      denseMode: !layout.denseMode
    });
  };

  const changeStatsColumns = (columns: number) => {
    setLayout({
      ...layout,
      statsColumns: columns
    });
  };

  // const handleOpenCustomizeDialog = () => {
  //   setCustomizeOpen(true);
  //   handleClose();
  // };

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
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
          </MenuItem>

          {/*<MenuItem sx={{ py: 1.5 }}>*/}
          {/*  <ListItemIcon sx={{ minWidth: 40 }}>*/}
          {/*    <Icon*/}
          {/*      icon="mdi:arrow-collapse"*/}
          {/*      width={20}*/}
          {/*      color={theme.palette.text.secondary}*/}
          {/*    />*/}
          {/*  </ListItemIcon>*/}
          {/*  <ListItemText*/}
          {/*    primary={t("Mode compact")}*/}
          {/*    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}*/}
          {/*  />*/}
          {/*  <Switch*/}
          {/*    checked={layout.denseMode}*/}
          {/*    onChange={toggleDenseMode}*/}
          {/*    edge="end"*/}
          {/*    inputProps={{ 'aria-label': 'Basculer mode compact' }}*/}
          {/*  />*/}
          {/*</MenuItem>*/}

          <MenuItem onClick={handleStatsColumnsClick} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon
                icon="mdi:view-column"
                width={20}
                color={theme.palette.text.secondary}
              />
            </ListItemIcon>
            <ListItemText
              primary={t("Gérer les colonnes")}
              secondary={t("Widgets et disposition")}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
            />
            <Icon
              icon="mdi:chevron-right"
              width={16}
              style={{ marginLeft: 'auto', color: theme.palette.text.secondary }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardControls;
