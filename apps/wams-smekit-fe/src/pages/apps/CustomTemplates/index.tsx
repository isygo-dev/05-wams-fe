import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import Icon from 'template-shared/@core/components/icon'
import { getPinnedTemplates, toggleTemplatePin } from '../../../api/FavoriteTemplate'
import TemplateCard from '../../../views/apps/Template/TemplateCard'

// interface TemplateCardProps {
//   data: CategoryTemplateType;
//   onPinToggle?: (templateId: number) => Promise<void>;
//   isPinned?: boolean;
// }

const PinnedTemplatesView = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: pinnedTemplates = [], isLoading, error, refetch } = useQuery('pinnedTemplates', getPinnedTemplates)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleTogglePin = async (templateId: number) => {
    try {
      await toggleTemplatePin(templateId)
      await refetch()
    } catch (error) {
      console.error('Failed to toggle pin:', error)
    }
  }

  const renderEmptyState = (icon: string, title: string, description: string, action?: React.ReactNode) => (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
        borderRadius: 2,
        minHeight: 300,
        border: `1px dashed ${theme.palette.divider}`
      }}
    >
      <Avatar
        sx={{
          width: 72,
          height: 72,
          mb: 3,
          backgroundColor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
          color: theme.palette.primary.main
        }}
      >
        <Icon icon={icon} fontSize='2.5rem' />
      </Avatar>
      <Typography variant='h5' gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 450, mb: 4 }}>
        {description}
      </Typography>
      {action}
    </Paper>
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return renderEmptyState(
      'mdi:alert-circle-outline',
      t('Error loading pinned templates'),
      t('We encountered an issue while loading your pinned templates. Please try again later.'),
      <Button variant='contained' onClick={handleRefresh} startIcon={<Icon icon='mdi:refresh' />} sx={{ mt: 2 }}>
        {t('Retry')}
      </Button>
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }}>
                  <Icon icon='mdi:pin' />
                </Box>
                <Typography variant='h5' component='h1'>
                  {t('Pinned Templates')}
                </Typography>
                {pinnedTemplates.length > 0 && (
                  <Chip label={pinnedTemplates.length} color='primary' size='small' sx={{ ml: 2 }} />
                )}
              </Box>
            }
            action={
              <Tooltip title={t('Refresh')}>
                <span>
                  <IconButton onClick={handleRefresh} disabled={isRefreshing} size='large'>
                    <Box
                      sx={{
                        fontSize: '1.5rem',
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          from: { transform: 'rotate(0deg)' },
                          to: { transform: 'rotate(360deg)' }
                        }
                      }}
                    >
                      <Icon icon={isRefreshing ? 'mdi:refresh-circle' : 'mdi:refresh'} />
                    </Box>
                  </IconButton>
                </span>
              </Tooltip>
            }
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-action': {
                alignSelf: 'center'
              }
            }}
          />

          <Box sx={{ p: 4 }}>
            {pinnedTemplates.length === 0 ? (
              renderEmptyState(
                'mdi:pin-off',
                t('No pinned templates yet'),
                t('Pin your favorite professional templates to access them quickly from here'),
                <Button
                  variant='outlined'
                  color='primary'
                  startIcon={<Icon icon='mdi:pin-outline' />}
                  onClick={() => {
                    /* Naviguer vers les templates */
                  }}
                  sx={{ mt: 2 }}
                >
                  {t('Browse Templates')}
                </Button>
              )
            ) : (
              <Grid container spacing={4}>
                {pinnedTemplates.map(template => (
                  <Grid item key={template.id} xs={12} sm={6} md={4} lg={3}>
                    <TemplateCard data={template} onPinToggle={handleTogglePin} isPinned={true} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PinnedTemplatesView
