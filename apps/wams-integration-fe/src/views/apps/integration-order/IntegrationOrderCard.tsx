import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import { CardHeader } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import Divider from '@mui/material/Divider'
import Styles from 'template-shared/style/style.module.css'
import { IntegrationOrderType } from 'integration-shared/@core/types/integration/IntegrationOrderTypes'

interface CardItem {
  data: IntegrationOrderType
  onDeleteClick: (rowId: number) => void
  onEditClick: (row) => void
  handleDownload: (row) => void
}

const IntegrationOrderCard = (props: CardItem) => {
  const { data, onDeleteClick, onEditClick, handleDownload } = props
  const { t } = useTranslation()

  return (
    <Card className={Styles.customCard}>
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
              {checkPermission(
                PermissionApplication.INTEGRATION,
                PermissionPage.INTEGRATION_ORDER,
                PermissionAction.DELETE
              ) ? (
                <Tooltip title={t('Action.Delete')}>
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onDeleteClick(data.id ?? 0)}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              ) : null}
              {checkPermission(
                PermissionApplication.INTEGRATION,
                PermissionPage.INTEGRATION_ORDER,
                PermissionAction.WRITE
              ) ? (
                <Tooltip title={t('Action.Edit')}>
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onEditClick(data)}>
                    <Icon icon='tabler:edit' />
                  </IconButton>
                </Tooltip>
              ) : null}
              {checkPermission(
                PermissionApplication.INTEGRATION,
                PermissionPage.INTEGRATION_ORDER,
                PermissionAction.WRITE
              ) ? (
                <Tooltip title={t('Action.Download')}>
                  <IconButton
                    size='small'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => {
                      handleDownload(data)
                    }}
                  >
                    <Icon icon='material-symbols:download' />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent>
        <Box className={Styles.cardContentStyle}>
          <Typography className={Styles.cardTitle} variant='h6'>
            {data.name}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.domain}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.code}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.integrationOrder}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.serviceName}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.mapping}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default IntegrationOrderCard
