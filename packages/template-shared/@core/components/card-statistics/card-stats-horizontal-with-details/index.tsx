// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Import
import { CardStatsHorizontalWithDetailsProps } from '../types'

// ** Custom Component Import
import Icon from 'template-shared/@core/components/icon'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import React from 'react'

const CardStatsHorizontalWithDetails = (props: CardStatsHorizontalWithDetailsProps) => {
  // ** Props
  const {
    sx,
    icon,
    stats,
    title,
    subtitle,
    trendDiff,
    iconSize = 24,
    avatarSize = 38,
    trend = 'positive',
    avatarColor = 'primary'
  } = props

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>{title}</Typography>
          <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='h5'>{stats}</Typography>
            <Typography
              sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}
            >{`(${trendDiff})%`}</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>{subtitle}</Typography>
        </Box>
        <CustomAvatar skin='light' variant='rounded' color={avatarColor} sx={{ width: avatarSize, height: avatarSize }}>
          <Icon icon={icon} fontSize={iconSize} />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default CardStatsHorizontalWithDetails
