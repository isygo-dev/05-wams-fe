import React from 'react'
import { alpha, Box, Card, Grid, LinearProgress, Typography, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

interface DocumentFormatsWidgetProps {
  formats: Record<string, number>
  totalTemplates: number
  denseMode: boolean
}

const DocumentFormatsWidget: React.FC<DocumentFormatsWidgetProps> = ({ formats, totalTemplates, denseMode }) => {
  const theme = useTheme()
  const { t } = useTranslation()

  const formatCardStyle = {
    p: denseMode ? 1 : 2,
    borderRadius: 2,
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: '0 2px 10px 0 rgba(0,0,0,0.02)'
  }

  const getFormatIcon = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'mdi:file-pdf-box'
      case 'docx':
      case 'doc':
        return 'mdi:file-word'
      case 'xlsx':
      case 'xls':
        return 'mdi:file-excel'
      case 'pptx':
      case 'ppt':
        return 'mdi:file-powerpoint'
      case 'txt':
        return 'mdi:file-document-outline'
      case 'zip':
      case 'rar':
        return 'mdi:folder-zip-outline'
      default:
        return 'mdi:file-document-outline'
    }
  }

  return (
    <Card
      sx={{
        p: denseMode ? 2 : 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
      }}
    >
      <Typography
        variant='h6'
        sx={{
          mb: 3,
          fontWeight: 600
        }}
      >
        {t('Formats de Documents')}
      </Typography>

      {Object.entries(formats).length > 0 ? (
        <Grid container spacing={2}>
          {Object.entries(formats).map(([format, count]) => {
            const percentage = totalTemplates > 0 ? (count / totalTemplates) * 100 : 0

            return (
              <Grid item xs={12} sm={6} key={format}>
                <Box sx={formatCardStyle}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2
                      }}
                    >
                      <Icon icon={getFormatIcon(format)} fontSize={20} color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        {format.toUpperCase()}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          color: theme.palette.text.secondary
                        }}
                      >
                        {t('template_with_count', {
                          count,
                          template: count === 1 ? t('template_one') : t('template_other')
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.5
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{
                          color: theme.palette.text.secondary
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          color: theme.palette.text.secondary
                        }}
                      >
                        {count}/{totalTemplates}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: theme.palette.action.hover
          }}
        >
          <Icon
            icon='mdi:file-question-outline'
            width={48}
            style={{
              color: theme.palette.text.disabled,
              marginBottom: 16
            }}
          />
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.disabled
            }}
          >
            {t('Aucun format de document disponible')}
          </Typography>
        </Box>
      )}
    </Card>
  )
}

export default DocumentFormatsWidget
