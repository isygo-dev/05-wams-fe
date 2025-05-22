import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import { RoleTypes } from 'ims-shared/@core/types/ims/roleTypes'

import { CardHeader } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import { useTranslation } from 'react-i18next'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import Divider from '@mui/material/Divider'
import Styles from 'template-shared/style/style.module.css'

interface CardItem {
  data: RoleTypes | undefined
  onDeleteClick: (rowId: number) => void | undefined
  onViewClick: (rowId: number) => void
}

const RoleCard = (props: CardItem) => {
  const { data, onDeleteClick, onViewClick } = props

  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 'initial',
          '& .MuiCardHeader-avatar': { mr: 2 }
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end', padding: '.05rem' }}>
              {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
                <Tooltip title={t('Action.Delete')}>
                  <IconButton
                    size='small'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => onDeleteClick(data?.id ?? 0)}
                  >
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              )}
              {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.READ) && (
                <Tooltip title={t('Action.Edit')}>
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onViewClick(data?.id ?? 0)}>
                    <Icon icon='fluent:slide-text-edit-24-regular' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent>
        <Box className={Styles.cardContentStyle}>
          <Typography className={Styles.cardTitle} variant='h6'>
            {data?.name ?? undefined}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data?.code ?? undefined}</Typography>
          <Accordion sx={{ textAlign: 'left', boxShadow: 'none !important', width: '100%' }}>
            <AccordionSummary
              sx={{ padding: '0px' }}
              id='panel-header-1'
              aria-controls='panel-content-1'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
            >
              <Typography>{t('Description')}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0px' }}>
              {data?.description && data?.description.length > 0 ? (
                <Typography sx={{ color: 'text.secondary' }}>{data?.description ?? undefined}</Typography>
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>{t('No description')}</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RoleCard
