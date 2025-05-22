import React, { ReactNode } from 'react'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import Grid from '@mui/material/Grid'
import ContentLoginRegister from 'template-shared/@core/components/contentLoginRegister'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const ComingSoon = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container spacing={3} minHeight={'100vh'} mt={0}>
      <Grid
        item
        md={6}
        sm={6}
        xs={12}
        xl={7}
        sx={{ backgroundColor: 'background.paper', minHeight: '100vh', height: '100%' }}
      >
        <ContentLoginRegister hidden={hidden} />
      </Grid>
      <Grid
        item
        md={hidden ? 12 : 6}
        sm={hidden ? 12 : 6}
        xs={hidden ? 12 : 12}
        xl={hidden ? 12 : 5}
        sx={{ background: 'white' }}
      >
        <RightWrapper sx={{ margin: 'auto', height: '100%' }}>
          <Box
            sx={{
              p: [6, 12],
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <img
                src='/images/favicon-horizontal-logo.png'
                alt='favicon-horizontal-logo.png'
                width={216}
                height={'100%'}
              />
              <Box sx={{ my: 6 }}>
                <Typography variant='h4' sx={{ mb: 1.5 }}>
                  We are launching soon
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  We're creating something awesome. Please subscribe to get notified when it's ready!
                </Typography>
              </Box>

              <form noValidate autoComplete='off' /*onSubmit={handleSubmit(onSubmit)}*/>
                <TextField
                  autoFocus
                  size='small'
                  type='email'
                  placeholder='Enter your email'
                  sx={{
                    '& .MuiInputBase-input': { py: 1.875 },
                    '& .MuiInputBase-root': {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      backgroundColor: 'background.paper'
                    }
                  }}
                />
                <Button type='submit' variant='contained' sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                  {t('Notify')}
                </Button>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Grid>
    </Grid>
  )
}

ComingSoon.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ComingSoon
