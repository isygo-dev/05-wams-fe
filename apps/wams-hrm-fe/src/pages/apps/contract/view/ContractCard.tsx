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
import { format } from 'date-fns'
import { MinContractType } from 'hrm-shared/@core/types/hrm/contractType'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import CustomChip from 'template-shared/@core/components/mui/chip'

interface CardItem {
  data: MinContractType
  onDeleteClick: (rowId: number) => void
  onViewClick: (item: MinContractType) => void
  employeeFullName: { id: number; fullName: string }[]
}

const ContractCard = (props: CardItem) => {
  const { t } = useTranslation()
  const { data, onDeleteClick, onViewClick, employeeFullName } = props

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
            {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.DELETE) && (
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
                href={`/apps/contract/view/${data.id}`}
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
            {employeeFullName.find(emp => emp.id === data.employee)?.fullName || ''}
          </Typography>
        </Box>
        <Box textAlign={'center'} mt={1}>
          {data.isLocked !== undefined && (
            <Tooltip title={t('Contract Status')}>
              <CustomChip
                rounded
                label={data.isLocked ? t('Yes_locked') : t('Not_locked')}
                color={data.isLocked ? 'error' : 'success'}
                sx={{ fontSize: '12px' }}
              />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, justifyContent: 'center', width: '100%' }}>
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

export default ContractCard
