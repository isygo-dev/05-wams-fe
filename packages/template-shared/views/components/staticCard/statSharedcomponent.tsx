import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Icon } from '@iconify/react'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import Box from '@mui/material/Box'

interface StatItemProps {
  title: string
  value: number
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  icon: string
  loading: boolean
}

const StatItem: React.FC<StatItemProps> = ({ title, value, color, icon, loading }) => (
  <Grid container spacing={1}>
    <Grid item>
      <CustomAvatar skin='light' variant='rounded' color={color} sx={{ mb: 3.5, width: 42, height: 42 }}>
        {icon && <Icon icon={icon} fontSize={24} />}
      </CustomAvatar>
    </Grid>
    <Grid item>
      <Box>{loading ? <CircularProgress size={12} /> : <Chip label={value} color={color} />}</Box>
      <Box>
        <Typography
          variant='subtitle2'
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      </Box>
    </Grid>
  </Grid>
)

export default StatItem
