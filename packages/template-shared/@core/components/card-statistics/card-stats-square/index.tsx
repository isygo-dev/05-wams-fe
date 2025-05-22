// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Import
import { CardStatsSquareProps } from '../types'

// ** Custom Component Import
import Icon from 'template-shared/@core/components/icon'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import React from 'react'

const CardStatsSquare = (props: CardStatsSquareProps) => {
  // ** Props
  const { sx, icon, stats, title, iconSize = 24, avatarSize = 42, avatarColor = 'primary' } = props

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CustomAvatar skin='light' color={avatarColor} sx={{ mb: 2, width: avatarSize, height: avatarSize }}>
          <Icon icon={icon} fontSize={iconSize} />
        </CustomAvatar>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {stats}
        </Typography>
        <Typography variant='body2'>{title}</Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsSquare
