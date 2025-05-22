import React, {useEffect, useRef, useState} from 'react';
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {Icon} from '@iconify/react';
import {DashboardLayout} from "../../../types/Dashboard";
import {useTranslation} from "react-i18next";

interface CustomizeDialogProps {
  open: boolean;
  onClose: () => void;
  layout: DashboardLayout;
  setLayout: (layout: DashboardLayout) => void;
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
                                                           setLayout
                                                         }) => {
  const theme = useTheme();
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>(layout.widgets as Widget[]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (open) {
      setWidgets([...layout.widgets] as Widget[]);
    }
  }, [open, layout.widgets]);

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? {...widget, visible: !widget.visible} : widget
    );
    setWidgets(updatedWidgets);
  };

  const handleDragStart = (index: number, widgetId: string) => {
    dragItem.current = index;
    setDraggedWidget(widgetId);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const draggedItemIndex = dragItem.current;
    const targetIndex = dragOverItem.current;

    if (draggedItemIndex === targetIndex) {
      handleDragEnd()

      return;
    }

    const widgetsCopy = [...widgets];
    const draggedWidget = widgetsCopy.splice(draggedItemIndex, 1)[0];
    widgetsCopy.splice(targetIndex, 0, draggedWidget);
    setWidgets(widgetsCopy);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleApply = () => {
    setLayout({
      ...layout,
      widgets: widgets
    });
    onClose();
  };

  const getWidgetIcon = (widgetId: string) => {
    const iconMap: { [key: string]: string } = {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px 0 rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
          <Icon
            icon="mdi:view-dashboard-edit"
            width={28}
            style={{color: theme.palette.primary.main}}
          />
          <Typography variant="h6" sx={{fontWeight: 600}}>
            {t('Personnaliser la disposition')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{
          bgcolor: alpha(theme.palette.action.hover, 0.5),
          '&:hover': {bgcolor: alpha(theme.palette.action.hover, 0.8)}
        }}>
          <Icon icon="mdi:close"/>
        </IconButton>
      </DialogTitle>

      <Box sx={{
        px: 3,
        py: 2,
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.action.hover, 0.1)
          : alpha(theme.palette.action.hover, 0.05),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Typography variant="body2" color="text.secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <Icon icon="mdi:information-outline" width={18} style={{color: theme.palette.info.main}}/>
          {t('Faites glisser les widgets pour réorganiser et activez/désactivez leur visibilité')}
        </Typography>
      </Box>

      <DialogContent sx={{p: 0}}>
        <List sx={{py: 0}}>
          {widgets.map((widget, index) => (
            <React.Fragment key={widget.id}>
              <ListItem
                draggable
                onDragStart={() => handleDragStart(index, widget.id)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                sx={{
                  p: 0,
                  cursor: 'grab',
                  bgcolor: draggedWidget === widget.id
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'inherit',
                  transition: 'background-color 0.2s'
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    p: 2,
                    px: 3,
                    my: 0.5,
                    mx: 2,
                    borderRadius: 2,
                    alignItems: 'center',
                    border: `1px solid ${widget.visible ?
                      alpha(theme.palette.primary.main, 0.2) :
                      alpha(theme.palette.divider, 0.1)
                    }`,
                    bgcolor: widget.visible ?
                      alpha(theme.palette.background.paper, 1) :
                      alpha(theme.palette.action.disabledBackground, 0.1),
                    '&:hover': {
                      bgcolor: alpha(widget.visible ?
                        theme.palette.primary.main :
                        theme.palette.action.hover, 0.07
                      )
                    }
                  }}
                >
                  <Tooltip title={t("Glisser pour réorganiser")}>
                    <ListItemIcon sx={{
                      minWidth: 'auto',
                      mr: 2,
                      cursor: 'grab',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.action.hover, 0.2),
                      color: theme.palette.text.secondary
                    }}>
                      <Icon icon="mdi:drag" width={20}/>
                    </ListItemIcon>
                  </Tooltip>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flex: 1,
                    opacity: widget.visible ? 1 : 0.6
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: widget.visible ?
                        alpha(theme.palette.primary.main, 0.1) :
                        alpha(theme.palette.action.hover, 0.2),
                      color: widget.visible ?
                        theme.palette.primary.main :
                        theme.palette.text.secondary
                    }}>
                      <Icon icon={getWidgetIcon(widget.id)} width={22}/>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" sx={{
                        fontWeight: 600,
                        color: widget.visible ?
                          theme.palette.text.primary :
                          theme.palette.text.secondary
                      }}>
                        {widget.title}
                      </Typography>
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
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        },
                      }}
                    />
                  </Tooltip>
                </Paper>
              </ListItem>
              {index < widgets.length - 1 && (
                <Divider variant="middle" sx={{opacity: 0.6, mx: 4}}/>
              )}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.8),
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<Icon icon="mdi:close"/>}
          sx={{
            borderRadius: 1.5,
            px: 2,
            borderColor: alpha(theme.palette.divider, 0.5),
            color: theme.palette.text.secondary
          }}
        >
          {t('Annuler')}
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          startIcon={<Icon icon="mdi:check"/>}
          sx={{
            borderRadius: 1.5,
            px: 3,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
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
