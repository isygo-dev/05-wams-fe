// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/ViewTimeline'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Import
import OptionsMenu from 'template-shared/@core/components/option-menu'

// Styled ViewTimeline component
const ViewTimeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimeline = () => {
  return (
    <Card>
      <CardHeader
        title='Activity ViewTimeline'
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
        avatar={<Icon fontSize='1.25rem' icon='tabler:list-details' />}
        action={
          <OptionsMenu
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
            options={['Share timeline', 'Suggest edits', { divider: true }, 'Report bug']}
          />
        }
      />
      <CardContent>
        <ViewTimeline sx={{ my: 0, py: 0 }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='warning' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Client Meeting</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  Today
                </Typography>
              </Box>
              <Typography sx={{ mb: 3, color: 'text.secondary' }}>Project meeting with john @10:15am</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src='/images/avatars/3.png' sx={{ mr: 3, width: 38, height: 38 }} />
                <div>
                  <Typography sx={{ fontWeight: 500 }}>Lester McCarthy (Client)</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>CEO of Infibeam</Typography>
                </div>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Create a new project for client</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  2 Days Ago
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>Add files to new design folder</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Shared 2 New Project Files</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  6 Days Ago
                </Typography>
              </Box>
              <Typography sx={{ mb: 3, color: 'text.secondary' }}>Sent by Mollie Dixon</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { color: 'warning.main' }
                  }}
                >
                  <Icon fontSize='1.25rem' icon='tabler:file-text' />
                  <Typography sx={{ ml: 2, fontWeight: 500 }}>App Guidelines</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
                  <Icon fontSize='1.25rem' icon='tabler:table' />
                  <Typography sx={{ ml: 2, fontWeight: 500 }}>Testing Results</Typography>
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='secondary' />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Project status updated</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  10 Days Ago
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>Woocommerce iOS App Completed</Typography>
            </TimelineContent>
          </TimelineItem>
        </ViewTimeline>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
