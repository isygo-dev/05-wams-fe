// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

const ButtonsIcons = () => {
  return (
    <div className='demo-space-x'>
      <IconButton aria-label='capture screenshot'>
        <Icon icon='tabler:aperture' />
      </IconButton>
      <IconButton aria-label='capture screenshot' color='primary'>
        <Icon icon='tabler:aperture' />
      </IconButton>
      <IconButton aria-label='capture screenshot' color='secondary'>
        <Icon icon='tabler:aperture' />
      </IconButton>
      <IconButton aria-label='capture screenshot' disabled>
        <Icon icon='tabler:aperture' />
      </IconButton>
    </div>
  )
}

export default ButtonsIcons
