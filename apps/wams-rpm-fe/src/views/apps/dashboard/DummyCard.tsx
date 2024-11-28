import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Icon from 'template-shared/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import {ItemType, MiniBoardEvent} from 'rpm-shared/@core/types/rpm/itemTypes'
import Avatar from '@mui/material/Avatar'
import {format} from 'date-fns'
import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import {t} from 'i18next'

interface CardItem {
  data: ItemType
  openAddEvent: (event: MiniBoardEvent | undefined, item: ItemType) => void
  color?: string
}

const DummyCard = (props: CardItem) => {
  const {data, openAddEvent, color} = props
  const eventIcons = data.events.map(event => (
    <Tooltip key={event.id} title={event.title} placement='top'>
      <IconButton color='primary' onClick={() => openAddEvent(event, data)}>
        <Icon icon='ic:baseline-event'/>
      </IconButton>
    </Tooltip>
  ))

  return (
    <Card
      sx={{
        margin: 'inherit',
        padding: '10px',
        borderLeft: '7px solid',
        borderLeftColor: {color}
      }}
    >
      <CardHeader
        sx={{paddingTop: '0px'}}
        action={
          <>
            {eventIcons}
            <Tooltip title={t('Action.Add')} placement='top'>
              <IconButton aria-label='Add event' color='info' onClick={() => openAddEvent(undefined, data)}>
                <Icon icon='mdi:event-add'/>
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'right'
          }}
        ></Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
          className='center-align'
        >
          <Avatar
            alt={data.itemName}
            src={data.imagePath ? `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${data.itemImage}` : ''}
            sx={{
              width: 100,
              height: 100,
              border: theme => `0.25rem solid ${theme.palette.common.white}`
            }}
          />
          <Typography variant='h6' className='bloc-title-card color-text-card'>
            {data.itemName}
          </Typography>
        </Box>
        <Box
          className='center-align'
          sx={{gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}
        >
          <Typography variant='subtitle2' sx={{whiteSpace: 'nowrap', color: 'text.primary'}}>
            Created on :{format(new Date(data.createDate), 'dd/MM/yyyy')}
          </Typography>
          <Typography variant='subtitle2' sx={{whiteSpace: 'nowrap', color: 'text.primary'}}>
            Updated on :{format(new Date(data.updateDate), 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DummyCard
