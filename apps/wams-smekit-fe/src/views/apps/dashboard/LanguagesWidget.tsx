import React from 'react'
import { alpha, Box, Card, Chip, Typography, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

interface LanguagesWidgetProps {
  languages: Record<string, number>
  denseMode: boolean
}

const LanguagesWidget: React.FC<LanguagesWidgetProps> = ({ languages, denseMode }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const getLanguageLabel = (lang: string): string => {
    const labels: Record<string, string> = {
      FR: t('Français'),
      EN: t('Anglais'),
      AR: t('Arabe'),
      DE: t('Allemand'),
      SPA: t('Espagnol'),
      ITA: t('Italien')
    }

    return labels[lang] || lang
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
        {t('Langues Disponibles')}
      </Typography>

      {Object.entries(languages).length > 0 ? (
        <Box>
          {Object.entries(languages).map(([lang, count]) => (
            <Box
              key={lang}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.action.hover,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: theme.palette.action.selected
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  icon='mdi:translate'
                  width={24}
                  style={{
                    color: theme.palette.primary.main,
                    marginRight: 12
                  }}
                />
                <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                  {getLanguageLabel(lang)}
                </Typography>
              </Box>
              <Chip
                label={t('template_with_count', {
                  count,
                  template: count === 1 ? t('template_one') : t('template_other')
                })}
                size='small'
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  borderRadius: 1
                }}
              />
            </Box>
          ))}
        </Box>
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
            icon='mdi:translate-off'
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
            {t('Aucune langue disponible')}
          </Typography>
        </Box>
      )}
    </Card>
  )
}

export default LanguagesWidget
