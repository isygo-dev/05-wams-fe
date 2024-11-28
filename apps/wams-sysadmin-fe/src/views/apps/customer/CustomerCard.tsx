// ** Next Import
// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import Switch from '@mui/material/Switch'
import {CardHeader} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useTranslation} from 'react-i18next'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import {CustomerDetailType} from "ims-shared/@core/types/ims/customerTypes";
import Divider from "@mui/material/Divider";
import Styles from "template-shared/style/style.module.css";

interface CardItem {
  data: CustomerDetailType
  onDeleteClick: (rowId: number) => void
  onViewClick: (rowId: number) => void
  handleLinkedUser: (row: CustomerDetailType) => void
  onSwitchStatus: (rowId: number, status: boolean) => void
  imageUrl: string
}

const CustomerCard = (props: CardItem) => {
  const {data, onDeleteClick, onViewClick, handleLinkedUser, onSwitchStatus, imageUrl} = props

  const {t} = useTranslation()

  return (
    <Card className={Styles.customCard}>
      <CardHeader
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 'initial',
          '& .MuiCardHeader-avatar': {mr: 2}
        }}
        subheader={
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}
          ></Box>
        }
        action={
          <>
            <Box sx={{display: 'flex', alignItems: 'flex-end', padding: '.05rem'}}>
              <Tooltip title={t('Action.Delete')}>
                <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => onDeleteClick(data.id)}>
                  <Icon icon='tabler:trash'/>
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Action.Edit')}>
                <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => onViewClick(data.id)}>
                  <Icon icon='fluent:slide-text-edit-24-regular'/>
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Action.LinkToUser')}>
                <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => handleLinkedUser(data)}>
                  <Icon icon='tabler:link-plus'/>
                </IconButton>
              </Tooltip>
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle}/>
      <CardContent>
        <Box className={Styles.cardContentStyle}>
          <Avatar
            sx={{width: '81px', height: '81px'}}
            src={data.imagePath ? `${imageUrl}/${data.id}` : ''}
            alt={data.name}
          />

          <Typography className={Styles.cardTitle} variant='h6'>
            {' '}
            {data.name}{' '}
          </Typography>

          <Typography>{data.domain}</Typography>
          <Typography sx={{color: 'text.secondary'}}>{data.url}</Typography>

          <Accordion sx={{textAlign: 'left', boxShadow: 'none !important', width: '100%'}}>
            <AccordionSummary
              sx={{padding: '0px'}}
              id='panel-header-1'
              aria-controls='panel-content-1'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down'/>}
            >
              <Typography>{t('Description')}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{padding: '0px'}}>
              {data.description && data.description.length > 0 ? (
                <Typography sx={{mt: 2, color: 'text.secondary'}}>{data.description}</Typography>
              ) : (
                <Typography sx={{mt: 2, color: 'text.secondary'}}>{t('No description')}</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

      </CardContent>
      <Divider className={Styles.dividerStyle}/>
      <CardContent className={Styles.cardActionFooterStyle}>

        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Switch
            checked={data.adminStatus === 'ENABLED'}
            onChange={() => onSwitchStatus(data.id, data.adminStatus != 'ENABLED')}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CustomerCard
