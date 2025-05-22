import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Link from 'next/link'
import CustomChip from 'template-shared/@core/components/mui/chip'
import Icon from 'template-shared/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import { useTranslation } from 'react-i18next'
import { ThemeColor } from 'template-shared/@core/layouts/types'
import rpmApiUrls from 'rpm-shared/configs/rpm_apis'
import { useKeenSlider } from 'keen-slider/react'
import { Direction } from '@mui/material'
import Rating from '@mui/material/Rating'
import clsx from 'clsx'
import Divider from '@mui/material/Divider'
import Styles from 'template-shared/style/style.module.css'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import { MiniResume } from 'rpm-shared/@core/types/rpm/ResumeTypes'

interface CardItem {
  data: MiniResume
  onDeleteClick: (rowId: number) => void
  onDownloadClick: (item: MiniResume) => void
  onViewClick: (item: MiniResume) => void
  onPreviewClick: (item: MiniResume) => void
  onRowOptionsClick: (event: React.MouseEvent<HTMLElement>, rowId: number) => void
}

const ResumeCard = (props: CardItem, direction: Direction) => {
  const { data, onDeleteClick, onDownloadClick, onViewClick, onPreviewClick, onRowOptionsClick } = props
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  console.log(currentSlide)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    loop: true,
    slides: {
      perView: 'auto',
      spacing: 20
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  const skillColor: Record<string, ThemeColor> = {
    ANGULAR: 'primary',
    REACT: 'secondary',
    JAVA: 'error',
    SPRING: 'warning',
    SPRINGBOOT: 'info',
    GIT: 'success'
  }

  return (
    <Card sx={{ position: 'relative', height: '100%' }}>
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
              {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.DELETE) && (
                <Tooltip title={t('Action.Delete') as string}>
                  <IconButton onClick={() => onDeleteClick(data.id)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t('Action.Download') as string}>
                <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onDownloadClick(data)}>
                  <Icon icon='material-symbols:download' />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  size='small'
                  component={Link}
                  sx={{ color: 'text.secondary' }}
                  href={`/apps/resume/view/${data.id}`}
                  onClick={() => onViewClick(data)}
                >
                  <Icon icon='fluent:slide-text-edit-24-regular' />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Action.Preview') as string}>
                <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => onPreviewClick(data)}>
                  <Icon icon='solar:document-bold' />
                </IconButton>
              </Tooltip>
              {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE) && (
                <IconButton
                  aria-controls={`menu-actions-${data.id}`}
                  aria-haspopup='true'
                  className={Styles.sizeIcon}
                  onClick={event => onRowOptionsClick(event, data.id)}
                  size='small'
                  sx={{ color: 'text.secondary' }}
                >
                  <Icon icon='tabler:dots-vertical' />
                </IconButton>
              )}
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent sx={{ textAlign: 'center' }}>
        <Box className={Styles.cardContentStyle}>
          <Avatar
            src={`${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${data.id}`}
            variant='circular'
            sx={{ width: 81, height: 81 }}
          />
          <Typography className={Styles.cardTitle} variant='h6'>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>{data.domain}</Typography>
          <Box className='navigation-wrapper'>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                textAlign: 'center'
              }}
              ref={sliderRef}
              className='keen-slider'
            >
              {data?.details?.skills &&
                data.details.skills.map((skill, index) => (
                  <Box
                    className='keen-slider__slide'
                    href='/'
                    key={index}
                    component={Link}
                    onClick={e => e.preventDefault()}
                    sx={{
                      '& .MuiChip-root': { cursor: 'pointer' }
                    }}
                  >
                    {' '}
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={skillColor[skill.name.toUpperCase()]}
                      label={skill.name}
                    />
                  </Box>
                ))}
              {loaded && instanceRef.current && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 10px'
                  }}
                >
                  <Icon
                    style={{ background: 'white' }}
                    icon='tabler:chevron-left'
                    className={clsx('arrow arrow-left')}
                    onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
                  />

                  <Icon
                    style={{ background: 'white' }}
                    icon='tabler:chevron-right'
                    className={clsx('arrow arrow-right')}
                    onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <Box sx={{ display: 'flex', color: 'text.secondary', alignItems: 'center', flexDirection: 'column' }}>
              <Typography>{data.details?.skills?.length || 0}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('Skills')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', color: 'text.secondary', alignItems: 'center', flexDirection: 'column' }}>
              <Typography>{data.details?.profExperiences?.length || 0}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('Exp.')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', color: 'text.secondary', alignItems: 'center', flexDirection: 'column' }}>
              <Typography>{data.details?.educations?.length || 0}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('Edu.')}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Divider className={Styles.dividerStyle} />
      <CardContent className={Styles.cardActionFooterStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          {data.resumeShareInfos && (
            <Rating
              readOnly
              value={data.resumeShareInfos.reduce((sum, item) => sum + item.rate, 0) / data.resumeShareInfos.length}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ResumeCard
