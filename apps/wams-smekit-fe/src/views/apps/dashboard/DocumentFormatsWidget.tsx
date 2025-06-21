import React from 'react';
import {
  Card,
  Grid,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  alpha,
  Chip,
  Paper,
  Fade
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";

interface DocumentFormatsWidgetProps {
  formats: Record<string, number>;
  totalTemplates: number;
  denseMode: boolean;
}

const DocumentFormatsWidget: React.FC<DocumentFormatsWidgetProps> = ({
  formats,
  totalTemplates,
  denseMode
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const formatCardStyle = {
    p: denseMode ? 2 : 2.5,
    borderRadius: 2,
    height: '100%',
    bgcolor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(8px)',
    boxShadow: `0 6px 18px 0 ${alpha(theme.palette.common.black, 0.04)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 25px 0 ${alpha(theme.palette.common.black, 0.06)}`,
      '& .format-icon': {
        transform: 'scale(1.1)',
      }
    }
  };

  const getFormatIcon = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'pdf': return 'mdi:file-pdf-box';
      case 'docx': case 'doc': return 'mdi:file-word';
      case 'xlsx': case 'xls': return 'mdi:file-excel';
      case 'pptx': case 'ppt': return 'mdi:file-powerpoint';
      case 'txt': return 'mdi:file-document-outline';
      case 'zip': case 'rar': return 'mdi:folder-zip-outline';
      default: return 'mdi:file-document-outline';
    }
  };

  const getFormatColor = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'pdf': return theme.palette.error.main;
      case 'docx': case 'doc': return theme.palette.info.main;
      case 'xlsx': case 'xls': return theme.palette.success.main;
      case 'pptx': case 'ppt': return theme.palette.warning.main;
      case 'txt': return theme.palette.secondary.main;
      case 'zip': case 'rar': return theme.palette.grey[700];
      default: return theme.palette.primary.main;
    }
  };

  const getFormatGradient = (format: string): string => {
    const color = getFormatColor(format);
    return `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`;
  };

  return (
    <Card sx={{
      p: denseMode ? 2.5 : 3,
      borderRadius: 3,
      backgroundImage: `radial-gradient(at 90% 0%, ${alpha(theme.palette.primary.light, 0.05)} 0, transparent 50%)`,
      boxShadow: `0 10px 30px 0 ${alpha(theme.palette.common.black, 0.06)}`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)}, transparent 70%)`,
        borderTopRightRadius: 12,
        zIndex: 0
      }
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600
            }}
          >
            {t('Formats de Documents')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Répartition des formats dans la bibliothèque')}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Icon icon="mdi:file-document-multiple-outline" width={24} />
        </Box>
      </Box>

      {Object.entries(formats).length > 0 ? (
        <Grid container spacing={2}>
          {Object.entries(formats).map(([format, count], index) => {
            const percentage = totalTemplates > 0 ?
              (count / totalTemplates) * 100 : 0;

            const animationDelay = `${index * 0.1}s`;

            return (
              <Fade
                key={format}
                in={true}
                style={{ transitionDelay: animationDelay }}
                timeout={500}
              >
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...formatCardStyle,
                      background: getFormatGradient(format)
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Box
                        className="format-icon"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: getFormatColor(format),
                          color: '#fff',
                          mr: 2,
                          boxShadow: `0 6px 15px 0 ${alpha(getFormatColor(format), 0.3)}`,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <Icon
                          icon={getFormatIcon(format)}
                          fontSize={24}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                            {format.toUpperCase()}
                          </Typography>
                          <Chip
                            label={`${percentage.toFixed(1)}%`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: '0.625rem',
                              fontWeight: 500,
                              bgcolor: alpha(getFormatColor(format), 0.1),
                              color: getFormatColor(format),
                              borderColor: alpha(getFormatColor(format), 0.3)
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{
                          color: theme.palette.text.secondary
                        }}>
                          {t('template_with_count', {
                            count,
                            template: count === 1 ? t('template_one') : t('template_other')
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 0.5
                      }}>
                        <Typography variant="caption" sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 500
                        }}>
                          {count}/{totalTemplates}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: alpha(getFormatColor(format), 0.15),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            bgcolor: getFormatColor(format),
                            backgroundImage: `linear-gradient(90deg, ${alpha(getFormatColor(format), 0.8)} 0%, ${getFormatColor(format)} 100%)`,
                            boxShadow: `0 4px 8px ${alpha(getFormatColor(format), 0.3)}`
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Fade>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.default, 0.7),
          border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
          backdropFilter: 'blur(4px)'
        }}>
          <Icon
            icon="mdi:file-question-outline"
            width={64}
            style={{
              color: alpha(theme.palette.text.disabled, 0.6),
              marginBottom: 16
            }}
          />
          <Typography variant="body1" sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1
          }}>
            {t('Aucun format de document disponible')}
          </Typography>
          <Typography variant="body2" sx={{
            color: alpha(theme.palette.text.disabled, 0.8)
          }}>
            {t('Ajoutez des documents pour voir leur répartition par format')}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default DocumentFormatsWidget;
