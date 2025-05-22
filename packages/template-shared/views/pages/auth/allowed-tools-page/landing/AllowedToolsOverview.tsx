import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../../../../hooks/useAuth'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'template-shared/@core/components/icon'
import React, { ChangeEvent, useRef, useState } from 'react'
import { ApplicationType } from 'ims-shared/@core/types/ims/applicationTypes'
import { styled } from '@mui/material/styles'
import { Tab, Tabs } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import { useTranslation } from 'react-i18next'
import imsApiUrls from 'ims-shared/configs/ims_apis'

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff'
  }
})

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff'
  }
}))

interface StyledTabProps {
  label: string
}

const AllowedToolsOverview = () => {
  const auth = useAuth()
  const application = auth.user?.applications
  const { t } = useTranslation()
  const [query, setQuery] = useState<string>('')
  const [filteredTools, setFilteredTools] = useState<ApplicationType[]>([])

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (application !== null) {
      const searchFilterFunction = (appl: ApplicationType) =>
        appl.title.trim().toLowerCase().includes(e.target.value.toLowerCase())

      const filteredToolsArr = application?.filter(searchFilterFunction)

      setFilteredTools(filteredToolsArr)
    }
  }

  const [antValue, setAntValue] = useState(0)

  const [activeCategory, setActiveCategory] = useState(null)
  const categoryRefs = useRef([])

  const renderArticles = () => {
    if (application && application.length) {
      const arrToMap = query.length && filteredTools.length ? filteredTools : application

      const allCategories = arrToMap?.map(app => app.category)
      const uniqueCat: string[] = Array.from(new Set(allCategories))

      const filteredApps = []

      arrToMap.forEach(app => {
        uniqueCat.forEach(category => {
          if (category === app.category) {
            filteredApps.push(app)
          }
        })
      })

      const handleAntChange = (event, newValue) => {
        setAntValue(newValue)
        setActiveCategory(uniqueCat[newValue])
        categoryRefs.current[newValue].scrollIntoView({ behavior: 'smooth' })
      }

      return (
        <>
          <TextField
            fullWidth
            size='small'
            value={query}
            onChange={handleFilter}
            placeholder='Search for tool...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, padding: '21px 3px 15px 2px !important' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon icon='tabler:search' fontSize={20} />
                </InputAdornment>
              )
            }}
          />

          {query.length > 0 && filteredTools.length <= 0 ? (
            <ListItem sx={{ marginLeft: 5 }}>
              <Typography sx={{ color: 'text.secondary' }}>{t('No_Applications_Found')}</Typography>
            </ListItem>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <AntTabs value={antValue} onChange={handleAntChange} aria-label='ant example' sx={{ flexWrap: 'wrap' }}>
                  {uniqueCat &&
                    uniqueCat.map((res, indexAnt) => (
                      <AntTab sx={{ minWidth: '120px', fontSize: '1.3rem' }} key={indexAnt} label={res} />
                    ))}
                </AntTabs>
                <Box sx={{ mt: 6 }}>
                  {uniqueCat.map((category, index) => (
                    <Box
                      key={index}
                      sx={{ mb: 4 }}

                      //ref={el => (categoryRefs.current[index] = el)} // to be tested
                    >
                      <Typography
                        variant='h6'
                        sx={{ mb: 2, color: activeCategory === category ? '#1890ff' : 'inherit' }}
                      >
                        {category}
                      </Typography>
                      <Grid container spacing={2}>
                        {filteredApps
                          .filter(app => app.category === category)
                          .map(app => (
                            <Grid item key={app.code} xs={12} sm={6} md={3}>
                              <Tooltip title={app.description}>
                                <a
                                  className={'default-link'}
                                  href={
                                    app.adminStatus === 'ENABLED'
                                      ? `${app.url}?accessToken=${app.token.type}_${app.token.token}`
                                      : undefined
                                  }
                                  target='_blank'
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Box
                                    className={'link-card'}
                                    sx={{
                                      backgroundColor:
                                        app.adminStatus === 'ENABLED' ? 'inherit' : 'rgba(51, 48, 60, 0.04) !important'
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        mb: 1.5,
                                        minHeight: 58,
                                        display: 'flex'
                                      }}
                                    >
                                      <img
                                        height='58'
                                        src={
                                          app.imagePath
                                            ? `${imsApiUrls.apiUrl_IMS_Application_ImageDownload_EndPoint}/${app.id}`
                                            : '/images/favicon_vertical.png'
                                        }
                                        alt={app.title}
                                      />
                                    </Box>

                                    <Typography variant='h6' sx={{ mb: 1.5 }}>
                                      {app.title}
                                    </Typography>
                                  </Box>
                                </a>
                              </Tooltip>
                            </Grid>
                          ))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </>
      )
    } else {
      return null
    }
  }

  return (
    <Grid container spacing={6} sx={{ justifyContent: 'center', marginLeft: 'inherit' }}>
      {renderArticles()}
    </Grid>
  )
}

export default AllowedToolsOverview
