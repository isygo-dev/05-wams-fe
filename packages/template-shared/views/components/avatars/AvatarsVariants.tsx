// ** MUI Imports
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'template-shared/@core/components/mui/avatar'

const AvatarsVariants = () => {
  return (
    <Box className='demo-space-x' sx={{ display: 'flex' }}>
      <CustomAvatar variant='square'>
        <Icon icon='tabler:bell' />
      </CustomAvatar>
      <CustomAvatar color='success' variant='rounded'>
        <Icon icon='tabler:device-floppy' />
      </CustomAvatar>
      <CustomAvatar skin='light' variant='square'>
        <Icon icon='tabler:bell' />
      </CustomAvatar>
      <CustomAvatar skin='light' color='success' variant='rounded'>
        <Icon icon='tabler:device-floppy' />
      </CustomAvatar>
    </Box>
  )
}

export default AvatarsVariants
