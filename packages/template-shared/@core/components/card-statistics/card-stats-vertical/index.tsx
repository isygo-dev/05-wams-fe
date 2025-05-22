// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Import
import { CardStatsVerticalProps } from '../types'

// ** Custom Component Import
import Icon from 'template-shared/@core/components/icon'
import CustomChip from 'template-shared/@core/components/mui/chip'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import React from 'react'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const {
    sx,
    stats,
    title,
    chipText,
    subtitle,
    avatarIcon,
    iconSize = 24,
    avatarSize = 42,
    chipColor = 'primary',
    avatarColor = 'primary'
  } = props

  const RenderChip = chipColor === 'default' ? Chip : CustomChip

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color={avatarColor}
          sx={{ mb: 3.5, width: avatarSize, height: avatarSize }}
        >
          {avatarIcon && <Icon icon={avatarIcon} fontSize={iconSize} />}
        </CustomAvatar>
        <Typography variant='h6' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>{stats}</Typography>
        <RenderChip
          size='small'
          label={chipText}
          color={chipColor}
          {...(chipColor === 'default'
            ? { sx: { borderRadius: '4px', color: 'text.secondary' } }
            : { rounded: true, skin: 'light' })}
        />
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
