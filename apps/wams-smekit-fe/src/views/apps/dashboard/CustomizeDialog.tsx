import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  Box,
  IconButton,
  Divider,
  Switch,
  Tooltip,
  Paper,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Zoom,
  Fade
} from '@mui/material';
import { Icon } from '@iconify/react';
import { DashboardLayout, StatItem } from "../../../types/Dashboard";
import { useTranslation } from "react-i18next";

interface CustomizeDialogProps {
  open: boolean;
  onClose: () => void;
  layout: DashboardLayout;
  setLayout: (layout: DashboardLayout) => void;
  statItems: StatItem[];
}

interface Widget {
  id: string;
  title: string;
  visible: boolean;
  column?: "left" | "right";
  description?: string;
}

const CustomizeDialog: React.FC<CustomizeDialogProps> = ({
  open,
  onClose,
  layout,
  setLayout,
  statItems
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setWidgets([...layout.widgets] as Widget[]);
      setSelectedStats(Array.isArray(layout.statsWidgets) ? [...layout.statsWidgets] : []);
    }
  }, [open, layout.widgets, layout.statsWidgets]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? {...widget, visible: !widget.visible} : widget
    );
    setWidgets(updatedWidgets);
  };

  const handleStatToggle = (statId: string) => {
    setSelectedStats(prev => {
      if (prev.includes(statId)) {
        return prev.filter(id => id !== statId);
      } else {
        return [...prev, statId];
      }
    });
  };

  const handleApply = () => {
    const finalSelectedStats = selectedStats.length > 0
      ? selectedStats
      : ['totalTemplates'];

    const updatedLayout = {
      ...layout,
      widgets: widgets,
      statsWidgets: finalSelectedStats
    };

    setLayout(updatedLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(updatedLayout));
    onClose();
  };

  const getWidgetIcon = (widgetId: string) => {
    const iconMap: {[key: string]: string} = {
      stats: 'mdi:chart-box-outline',
      recent: 'mdi:clock-outline',
      formats: 'mdi:file-document-outline',
      categories: 'mdi:folder-outline',
      languages: 'mdi:translate',
      activity: 'mdi:history',
      chart: 'mdi:chart-line',
      tasks: 'mdi:check-circle-outline',
      calendar: 'mdi:calendar-month',
      notifications: 'mdi:bell-outline',
      default: 'mdi:widgets-outline'
    }

    return iconMap[widgetId] || iconMap.default;
  };

  const getWidgetColor = (widgetId: string) => {
    const colorMap: {[key: string]: string} = {
      stats: 'primary',
      recent: 'info',
      formats: 'success',
      categories: 'warning',
      languages: 'secondary',
      activity: 'error',
      chart: 'info',
      tasks: 'success',
      calendar: 'warning',
      notifications: 'error',
      default: 'primary'
    }

    const color = colorMap[widgetId] || colorMap.default;

    return theme.palette[color].main;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Zoom}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px 0 rgba(0,0,0,0.15)',
          overflow: 'hidden',
          backgroundImage: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(50,50,55,0.9) 0%, rgba(30,30,35,0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,255,0.95) 100%)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Icon
              icon="mdi:view-dashboard-edit"
              width={28}
            />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('Personnaliser la disposition')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('Configurez vos widgets et statistiques')}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
            width: 36,
            height: 36,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.light, 0.15),
              transform: 'rotate(90deg)'
            }
          }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
      </DialogTitle>

      <Box sx={{
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 56,
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              minHeight: 56,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600
              }
            }
          }}
        >
          <Tab
            label={t("Widgets")}
            icon={<Icon icon="mdi:widgets-outline" fontSize="1.25rem" />}
            iconPosition="start"
          />
          <Tab
            label={t("Statistiques")}
            icon={<Icon icon="mdi:chart-box-outline" fontSize="1.25rem" />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {activeTab === 0 && (
          <Fade in={activeTab === 0}>
            <Box>
              <Box sx={{
                px: 3,
                py: 2,
                bgcolor: alpha(theme.palette.info.light, 0.1),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="mdi:information-outline" width={18} style={{ color: theme.palette.info.main }} />
                  {t('Activez ou désactivez la visibilité des widgets de votre tableau de bord')}
                </Typography>
              </Box>

              <List sx={{ py: 2 }}>
                {widgets.map((widget, index) => (
                  <React.Fragment key={widget.id}>
                    <ListItem
                      sx={{
                        p: 0,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: 'flex',
                          width: '100%',
                          p: 2.5,
                          px: 3,
                          my: 0.5,
                          mx: 2,
                          borderRadius: 2,
                          alignItems: 'center',
                          backgroundColor: widget.visible
                            ? alpha(theme.palette.background.paper, 0.7)
                            : alpha(theme.palette.background.paper, 0.3),
                          border: `1px solid ${widget.visible
                            ? alpha(getWidgetColor(widget.id), 0.2)
                            : alpha(theme.palette.divider, 0.05)
                          }`,
                          boxShadow: widget.visible
                            ? `0 4px 20px 0 ${alpha(theme.palette.common.black, 0.05)}`
                            : 'none',
                          backdropFilter: 'blur(8px)',
                          transition: 'all 0.25s ease-in-out',
                          transform: `translateX(${widget.visible ? '0' : '8px'})`,
                          '&:hover': {
                            backgroundColor: widget.visible
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.background.paper, 0.5),
                            transform: 'translateX(0)',
                            boxShadow: widget.visible
                              ? `0 8px 25px 0 ${alpha(theme.palette.common.black, 0.08)}`
                              : `0 4px 15px 0 ${alpha(theme.palette.common.black, 0.03)}`
                          }
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flex: 1,
                          opacity: widget.visible ? 1 : 0.6,
                          transition: 'opacity 0.2s ease'
                        }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: widget.visible
                              ? alpha(getWidgetColor(widget.id), 0.15)
                              : alpha(theme.palette.action.hover, 0.1),
                            color: widget.visible
                              ? getWidgetColor(widget.id)
                              : theme.palette.text.secondary,
                            transition: 'all 0.25s ease'
                          }}>
                            <Icon icon={getWidgetIcon(widget.id)} width={24} />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{
                                fontWeight: 600,
                                color: widget.visible
                                  ? theme.palette.text.primary
                                  : theme.palette.text.secondary
                              }}>
                                {widget.title}
                              </Typography>
                              {widget.visible && (
                                <Chip
                                  label={t("Visible")}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.625rem',
                                    fontWeight: 500,
                                    px: 0.5
                                  }}
                                />
                              )}
                            </Box>
                            {widget.description && (
                              <Typography variant="caption" color="text.secondary">
                                {t(widget.description)}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Tooltip title={widget.visible ? t("Masquer") : t("Afficher")}>
                          <Switch
                            checked={widget.visible}
                            onChange={() => toggleWidgetVisibility(widget.id)}
                            edge="end"
                            size="medium"
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: getWidgetColor(widget.id),
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: alpha(getWidgetColor(widget.id), 0.5),
                              },
                            }}
                          />
                        </Tooltip>
                      </Paper>
                    </ListItem>
                    {index < widgets.length - 1 && (
                      <Divider variant="middle" sx={{ opacity: 0.4, mx: 4 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Fade>
        )}

        {activeTab === 1 && (
          <Fade in={activeTab === 1}>
            <Box sx={{ p: 3 }}>
              <Box sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.light, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                  {t('Choisir les statistiques à afficher')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Sélectionnez les indicateurs que vous souhaitez voir sur votre tableau de bord')}
                </Typography>
              </Box>

              <FormGroup>
                {statItems.map((stat) => (
                  <Paper
                    key={stat.id}
                    elevation={0}
                    sx={{
                      mb: 2,
                      p: 1.5,
                      px: 2,
                      borderRadius: 2,
                      backgroundColor: selectedStats.includes(stat.id)
                        ? alpha(theme.palette[stat.color].light, 0.15)
                        : alpha(theme.palette.background.paper, 0.6),
                      border: `1px solid ${selectedStats.includes(stat.id)
                        ? alpha(theme.palette[stat.color].main, 0.2)
                        : alpha(theme.palette.divider, 0.08)
                      }`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedStats.includes(stat.id)}
                          onChange={() => handleStatToggle(stat.id)}
                          sx={{
                            color: alpha(theme.palette[stat.color].main, 0.6),
                            '&.Mui-checked': {
                              color: theme.palette[stat.color].main
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: selectedStats.includes(stat.id)
                              ? theme.palette[stat.color].main
                              : alpha(theme.palette[stat.color].main, 0.15),
                            color: selectedStats.includes(stat.id)
                              ? 'white'
                              : theme.palette[stat.color].main,
                            transition: 'all 0.2s ease'
                          }}>
                            <Icon
                              icon={stat.icon}
                              fontSize="1.25rem"
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: selectedStats.includes(stat.id) ? 600 : 500,
                                color: selectedStats.includes(stat.id)
                                  ? theme.palette.text.primary
                                  : theme.palette.text.secondary
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stat.trend === 'up'
                                ? t('En hausse')
                                : stat.trend === 'down'
                                  ? t('En baisse')
                                  : t('Stable')}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        m: 0,
                        width: '100%'
                      }}
                    />
                  </Paper>
                ))}
              </FormGroup>

              {selectedStats.length === 0 && (
                <Paper
                  sx={{
                    p: 2.5,
                    mt: 3,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    borderRadius: 2,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.warning.main, 0.15)}`
                  }}
                >
                  <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="mdi:alert-circle-outline" width={22} />
                    {t('Veuillez sélectionner au moins une statistique à afficher')}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Fade>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2.5,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          startIcon={<Icon icon="mdi:close" />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
            borderColor: alpha(theme.palette.divider, 0.2)
          }}
        >
          {t('Annuler')}
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={activeTab === 1 && selectedStats.length === 0}
          startIcon={<Icon icon="mdi:check" />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
            }
          }}
        >
          {t('Appliquer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomizeDialog;
