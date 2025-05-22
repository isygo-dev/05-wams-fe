import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Avatar } from '@mui/material'
import Icon from '../icon'
import { checkPermission } from '../../api/helper/permission'
import { PermissionAction, PermissionPage } from 'template-shared/@core/types/helper/apiPermissionTypes'

interface PictureCardProps {
  photoFile: File
  openImageEdit: () => void
  permissionApplication?: string
  permissionPage?: string
  url: string
}

const PictureCard = (props: PictureCardProps) => {
  const { photoFile, openImageEdit, url, permissionApplication, permissionPage } = props

  return (
    <Card sx={{ height: '100%', padding: 0 }}>
      <CardContent
        className='container'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 !important',
          position: 'relative'
        }}
      >
        <Avatar
          src={photoFile ? URL.createObjectURL(photoFile) : url}
          variant='rounded'
          className={permissionPage === PermissionPage.DOMAIN ? 'cardPicture' : ''}
          sx={{ width: '100%', height: 296 }}
        />
        {checkPermission(permissionApplication, permissionPage, PermissionAction.WRITE) && (
          <Avatar
            variant='rounded'
            className='middle'
            sx={{ width: '100%', height: 296, cursor: 'pointer', position: 'absolute' }}
            onClick={openImageEdit}
          >
            <Icon fontSize='4rem' icon='mingcute:upload-line' />
          </Avatar>
        )}
      </CardContent>
    </Card>
  )
}

export default PictureCard
