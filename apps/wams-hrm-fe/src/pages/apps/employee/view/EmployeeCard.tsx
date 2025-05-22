import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Link from 'next/link'
import Icon from 'template-shared/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import { useTranslation } from 'react-i18next'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import { MinEmployeeType } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { format } from 'date-fns'
import Badge from '@mui/material/Badge'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import CustomChip from 'template-shared/@core/components/mui/chip'

interface CardItem {
  data: MinEmployeeType
  onDeleteClick: (rowId: number) => void
  onViewClick: (item: MinEmployeeType) => void
}

const EmployeeCard = (props: CardItem) => {
  const { t } = useTranslation()
  const { data, onDeleteClick, onViewClick } = props

  return (
    <Card sx={{ position: 'relative', height: '100%' }}>
      <CardHeader
        sx={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '& .MuiCardHeader-avatar': { marginRight: 2 }
        }}
        title={
          <Typography variant='body2' color={'rgb(51 48 60)'}>
            {data.domain} {data.code}
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.DELETE) && (
              <Tooltip title={t('Action.Delete')}>
                <IconButton onClick={() => onDeleteClick(data.id)} size='small'>
                  <Icon icon='tabler:trash' fontSize={'1.2rem'} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                size='small'
                component={Link}
                href={`/apps/employee/view/${data.id}`}
                onClick={() => onViewClick(data)}
              >
                <Icon icon='fluent:slide-text-edit-24-regular' fontSize={'1.2rem'} />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent sx={{ padding: '1rem' }}>
        <Box sx={{ display: 'block', alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            src={`${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${data.id}`}
            variant='circular'
            sx={{ width: 48, height: 48, marginRight: 'auto', marginLeft: 'auto' }}
          />
          <Typography variant='body2' mt={1}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant='body2'> {data.email}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, justifyContent: 'center', width: '105%' }}>
          <Box sx={{ marginRight: '0.8rem' }}>
            {data.numberActiveContracts !== undefined && (
              <Tooltip placement={'bottom-end'} title={t('Active Contracts')}>
                <Badge showZero={true} badgeContent={data.numberActiveContracts} color='warning'></Badge>
              </Tooltip>
            )}
          </Box>
          <CustomChip
            rounded
            label={format(new Date(data.createDate), 'yyyy-MM-dd')}
            skin='light'
            color='info'
            sx={{ mr: 1, fontSize: '12px' }}
          />
          <CustomChip
            rounded
            label={format(new Date(data.updateDate), 'yyyy-MM-dd')}
            skin='light'
            color='success'
            sx={{ fontSize: '12px' }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default EmployeeCard
