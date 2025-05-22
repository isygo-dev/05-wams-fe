import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CustomChip from 'template-shared/@core/components/mui/chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Icon from 'template-shared/@core/components/icon'
import { format } from 'date-fns'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import Styles from 'template-shared/style/style.module.css'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import WebOutlinedIcon from '@mui/icons-material/WebOutlined'
import { JobOfferType } from 'rpm-shared/@core/types/rpm/jobOfferTypes'

interface CardItem {
  data: JobOfferType
  onDeleteClick: (rowId: number) => void
  onViewClick: (item: JobOfferType) => void
  isTemplate: (code: string) => boolean
  handlePrint: (id: number) => void
  handleRowOptionsClick: (event: React.MouseEvent<HTMLElement>, row: JobOfferType) => void
  anchorEls: null | HTMLElement[]
  handleRowOptionsClose: () => void
  menuOpen: number | null
  handleSetTemplate: (data: JobOfferType) => void
}

const JobOfferTypeCard = (props: CardItem) => {
  const {
    data,
    onDeleteClick,
    onViewClick,
    isTemplate,
    handlePrint,
    handleRowOptionsClick,
    anchorEls,
    handleRowOptionsClose,
    menuOpen,
    handleSetTemplate
  } = props
  let timeLeft
  if (data.details.jobInfo && data.details.jobInfo.deadline) {
    const differenceInMilliseconds = Number(new Date(data.details.jobInfo.deadline)) - +new Date()
    timeLeft = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24))
  }
  let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'error'

  if (timeLeft > 10) {
    chipColor = 'success'
  } else if (timeLeft >= 0 && timeLeft <= 9) {
    chipColor = 'warning'
  }

  let label

  if (timeLeft < 0) {
    label = '0 days left'
  } else {
    label = `${timeLeft} days left`
  }
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
              {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.DELETE) && (
                <Tooltip title={t('Action.Delete') as string}>
                  <IconButton onClick={() => onDeleteClick(data.id)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  size='small'
                  component={Link}
                  sx={{ color: 'text.secondary' }}
                  href={`/apps/jobOffer/view/${data.id}`}
                  onClick={() => onViewClick(data)}
                >
                  <Icon icon='fluent:slide-text-edit-24-regular' />
                </IconButton>
              </Tooltip>

              {isTemplate(data.code)
                ? checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.READ) && (
                    <Tooltip
                      title={t('Action.View') as string}
                      onClick={() => {
                        handlePrint(data.id)
                      }}
                    >
                      <IconButton sx={{ color: 'text.secondary' }}>
                        <Icon icon='fluent:eye-lines-48-filled' />
                      </IconButton>
                    </Tooltip>
                  )
                : null}

              {!isTemplate(data.code) ? (
                <IconButton
                  aria-controls={`menu-actions-${data.id}`}
                  aria-haspopup='true'
                  onClick={event => handleRowOptionsClick(event, data)}
                  className={Styles.sizeIcon}
                  sx={{ color: 'text.secondary' }}
                >
                  <Icon icon='tabler:dots-vertical' />
                </IconButton>
              ) : null}

              <Menu
                className={Styles.sizeListItem}
                key={`menu-actions-${data.id}`}
                anchorEl={anchorEls[data.id]}
                open={data.id === menuOpen}
                onClose={handleRowOptionsClose}
              >
                {checkPermission(
                  PermissionApplication.RPM,
                  PermissionPage.JOB_OFFER_TEMPLATE,
                  PermissionAction.WRITE
                ) && (
                  <MenuItem
                    onClick={() => {
                      handleSetTemplate(data)
                    }}
                  >
                    <Tooltip title={t('Mark as Template') as string}>
                      <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }}>
                        <WebOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    {t('Mark as Template') as string}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handlePrint(data.id)
                  }}
                >
                  <Tooltip title={t('Action.View') as string}>
                    <IconButton sx={{ color: 'text.secondary' }}>
                      <Icon icon='fluent:eye-lines-48-filled' />
                    </IconButton>
                  </Tooltip>
                  {t('Action.View') as string}
                </MenuItem>
              </Menu>
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent className={Styles.cardContentStyle}>
        <Typography className={Styles.cardTitle} variant='h6'>
          {data.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>{data.owner}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{data.customer}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ mr: 1, fontWeight: 500 }}>{t('Industrie')} :</Typography>{' '}
          <Box sx={{ display: 'flex' }}>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '14px'
              }}
            >
              {data.industry}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              {format(new Date(data.details.jobInfo && data.details.jobInfo.startDate), 'dd/MM/yyyy')}
            </Typography>
            <Typography variant='h5' sx={{ ml: 1, mr: 1, marginTop: '-5px', color: 'text.secondary' }}>
              {' '}
              -{' '}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              {format(new Date(data.details.jobInfo && data.details.jobInfo.endDate), 'dd/MM/yyyy')}
            </Typography>
          </Box>
        </Box>

        {data.details.jobInfo && data.details.jobInfo.position ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography sx={{ mr: 1, fontWeight: 500 }}>{t('Job.Positions')} : </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {' '}
              {data.details.jobInfo && data.details.jobInfo.position}
            </Typography>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ mr: 1, fontWeight: 500 }}>{t('Experience')} : </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {data.details.experienceMin} - {data.details.experienceMax}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ mr: 1, fontWeight: 500 }}>{t('Job.deadline')} : </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {format(new Date(data.details.jobInfo && data.details.jobInfo.deadline), 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </CardContent>
      <Divider className={Styles.dividerStyle} />
      <CardContent className={Styles.cardActionFooterStyle}>
        <Box sx={{ mb: 3, alignItems: 'center', textAlign: 'right' }}>
          <Typography variant='body2'>20% {t('Job.Completed')}</Typography>
        </Box>
        <LinearProgress
          color='primary'
          variant='determinate'
          sx={{ mb: 3, height: 10 }}
          value={Math.round((2 / 10) * 100)}
        />
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <CustomChip rounded size='small' skin='light' color={chipColor} label={label} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AvatarGroup className='pull-up' max={5}>
                <Tooltip title='Olivia Sparks'>
                  <Avatar src='/images/avatars/4.png' alt='Olivia Sparks' />
                </Tooltip>
                <Tooltip title='Howard Lloyd'>
                  <Avatar src='/images/avatars/5.png' alt='Howard Lloyd' />
                </Tooltip>
                <Tooltip title='Hallie Richards'>
                  <Avatar src='/images/avatars/6.png' alt='Hallie Richards' />
                </Tooltip>
                <Tooltip title='Alice Cobb'>
                  <Avatar src='/images/avatars/8.png' alt='Alice Cobb' />
                </Tooltip>
                <Tooltip title='Jeffery Warner'>
                  <Avatar src='/images/avatars/7.png' alt='Jeffery Warner' />
                </Tooltip>
                <Tooltip title='Jeffery Warner'>
                  <Avatar src='/images/avatars/7.png' alt='Jeffery Warner' />
                </Tooltip>
              </AvatarGroup>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default JobOfferTypeCard
