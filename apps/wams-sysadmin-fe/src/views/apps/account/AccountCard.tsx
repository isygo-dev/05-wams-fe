// ** Next Import
// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'template-shared/@core/components/mui/chip'
import React from 'react'
import { CardHeader } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import Switch from '@mui/material/Switch'
import CardActions from '@mui/material/CardActions'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import Divider from '@mui/material/Divider'
import Styles from 'template-shared/style/style.module.css'
import { AccountDto } from 'ims-shared/@core/types/ims/accountTypes'

interface CardItem {
  data: AccountDto
  onDeleteClick: (rowId: number) => void
  onViewClick: (rowId: number) => void
  onSwitchStatus: (rowId: number, status: boolean) => void
  imageUrl: string
  handleResendEmailCreation: (rowId: number) => void
}

const AccountCard = (props: CardItem) => {
  const { data, onDeleteClick, onSwitchStatus, onViewClick, imageUrl, handleResendEmailCreation } = props
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
              {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.DELETE) ? (
                <Tooltip title={t('Action.Delete')}>
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onDeleteClick(data.id ?? 0)}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              ) : null}
              {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.READ) ? (
                <Tooltip title={t('Action.Edit')}>
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onViewClick(data.id ?? 0)}>
                    <Icon icon='fluent:slide-text-edit-24-regular' />
                  </IconButton>
                </Tooltip>
              ) : null}
              {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
                <Tooltip title={t('Action.ResetPassword')}>
                  <IconButton
                    size='small'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => {
                      data.id && handleResendEmailCreation(data.id)
                    }}
                  >
                    <Icon icon='tabler:mail-forward' width={'0.88em'} />
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
          <Avatar
            sx={{ width: '81px', height: '81px' }}
            src={`${imageUrl}/${data.id}`}
            alt={data.accountDetails?.firstName}
          />
          <Typography className={Styles.cardTitle} variant='h6'>
            {data.accountDetails?.firstName} {data.accountDetails?.lastName}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.domain}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{data.code}</Typography>
        </Box>
      </CardContent>
      <Divider className={Styles.dividerStyle} />
      <CardActions className={Styles.cardActionFooterStyle}>
        <Box sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%' }}>
          <CustomChip rounded size='small' skin='light' color='warning' label={data.systemStatus} />
          <Tooltip title={t('Admin_Status')}>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch
                checked={data.adminStatus === 'ENABLED'}
                onChange={() => onSwitchStatus(data.id ?? 0, data.adminStatus != 'ENABLED')}
              />
            ) : (
              <Switch checked={data.adminStatus === 'ENABLED'} />
            )}
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  )
}

export default AccountCard
