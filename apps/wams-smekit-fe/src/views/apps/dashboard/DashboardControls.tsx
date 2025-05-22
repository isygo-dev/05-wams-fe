import React from 'react'
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { Icon } from '@iconify/react'
import { DashboardLayout } from '../../../types/Dashboard'
import { useTranslation } from 'react-i18next'

interface DashboardControlsProps {
  layout: DashboardLayout
  setLayout: (layout: DashboardLayout) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (element: HTMLElement | null) => void
  setCustomizeOpen: (open: boolean) => void
  onCustomizeClick: () => void
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  layout,
  setLayout,
  anchorEl,
  setAnchorEl,
  // setCustomizeOpen,
  onCustomizeClick
}) => {
  const theme = useTheme()
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCustomizeClick = () => {
    onCustomizeClick()
    handleClose()
  }

  const toggleDenseMode = () => {
    setLayout({
      ...layout,
      denseMode: !layout.denseMode
    })
  }

  const changeStatsColumns = (columns: number) => {
    setLayout({
      ...layout,
      statsColumns: columns
    })
  }

  // const handleOpenCustomizeDialog = () => {
  //   setCustomizeOpen(true);
  //   handleClose();
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1
          }}
        >
          {t('Dashboard')}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          {t('Aperçu des statistiques et activités récentes')}
        </Typography>
      </Box>

      <Box>
        <Tooltip title={t('Personnaliser le tableau de bord')}>
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
            aria-label='Paramètres du tableau de bord'
          >
            <Icon icon='mdi:cog-outline' />
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
              <Icon icon='mdi:view-dashboard-edit' width={20} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText
              primary={t('Personnaliser la disposition')}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
          </MenuItem>

          <MenuItem sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon icon='mdi:arrow-collapse' width={20} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText primary={t('Mode compact')} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
            <Switch
              checked={layout.denseMode}
              onChange={toggleDenseMode}
              edge='end'
              inputProps={{ 'aria-label': 'Basculer mode compact' }}
            />
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon icon='mdi:view-grid-outline' width={20} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText
              primary={t('Colonnes des stats')}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
            <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
              {[2, 3, 4].map(col => (
                <IconButton
                  key={col}
                  size='small'
                  onClick={() => changeStatsColumns(col)}
                  sx={{
                    bgcolor: layout.statsColumns === col ? theme.palette.primary.main : theme.palette.action.hover,
                    color:
                      layout.statsColumns === col ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    '&:hover': {
                      bgcolor: layout.statsColumns === col ? theme.palette.primary.dark : theme.palette.action.selected
                    },
                    minWidth: 32,
                    height: 32
                  }}
                  aria-label={`${col} colonnes`}
                >
                  {col}
                </IconButton>
              ))}
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}

export default DashboardControls
