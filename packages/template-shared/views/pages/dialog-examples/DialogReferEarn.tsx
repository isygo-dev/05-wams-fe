// ** React Imports
import { forwardRef, ReactElement, Ref, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Config Import
import themeConfig from '../../../configs/themeConfig'

// ** Custom Components Imports
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import { useTranslation } from 'react-i18next'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const FacebookBtn = styled(IconButton)<IconButtonProps>(({ theme }) => {
  return {
    color: theme.palette.common.white,
    backgroundColor: '#3B5998 !important',
    borderRadius: theme.shape.borderRadius
  }
})

const TwitterBtn = styled(IconButton)<IconButtonProps>(({ theme }) => {
  return {
    margin: theme.spacing(0, 3),
    color: theme.palette.common.white,
    backgroundColor: '#55ACEE !important',
    borderRadius: theme.shape.borderRadius
  }
})

const LinkedInBtn = styled(IconButton)<IconButtonProps>(({ theme }) => {
  return {
    color: theme.palette.common.white,
    backgroundColor: '#007BB6 !important',
    borderRadius: theme.shape.borderRadius
  }
})

const DialogReferEarn = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='tabler:gift' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Refer & Earn
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Use Refer & Earn modal to encourage your exiting customers refer their friends & colleague.
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          Show
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Refer & Earn
            </Typography>
            <Typography variant='body2'>
              Invite your friend to vuexy, if thay sign up, you and your friend will get 30 days free trial
            </Typography>
          </Box>
          <Grid container spacing={6} sx={{ mt: 4, textAlign: 'center' }}>
            <Grid item md={4} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar
                  skin='light'
                  color='primary'
                  sx={{
                    mb: 3,
                    width: [70, 100],
                    height: [70, 100],
                    '& svg': { fontSize: ['2.2rem', '2.5rem'] }
                  }}
                >
                  <Icon icon='tabler:message' />
                </CustomAvatar>
                <Typography sx={{ mb: 3, fontWeight: '600' }}>Send Invitation 🤟🏻</Typography>
                <Typography>Send your referral link to your friend</Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar
                  skin='light'
                  color='primary'
                  sx={{
                    mb: 3,
                    width: [70, 100],
                    height: [70, 100],
                    '& svg': { fontSize: ['2.2rem', '2.5rem'] }
                  }}
                >
                  <Icon icon='tabler:clipboard' />
                </CustomAvatar>
                <Typography sx={{ mb: 3, fontWeight: '600' }}>Registration 👩🏻‍💻</Typography>
                <Typography>Let them register to our services</Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar
                  skin='light'
                  color='primary'
                  sx={{
                    mb: 3,
                    width: [70, 100],
                    height: [70, 100],
                    '& svg': { fontSize: ['2.2rem', '2.5rem'] }
                  }}
                >
                  <Icon icon='tabler:award' />
                </CustomAvatar>
                <Typography sx={{ mb: 3, fontWeight: '600' }}>Free Trial 🎉</Typography>
                <Typography>Your friend will get 30 days free trial</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider sx={{ my: '0 !important' }} />
        <DialogContent
          sx={{
            position: 'relative',
            pt: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Invite your friends
            </Typography>
            <InputLabel htmlFor='refer-email' sx={{ mb: 2, display: 'inline-flex', whiteSpace: 'break-spaces' }}>
              {`Enter your friend’s email address and invite them to join ${t(`${themeConfig.templateName}`)} 😍`}
            </InputLabel>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}
            >
              <TextField
                fullWidth
                size='small'
                id='refer-email'
                sx={{ mr: { xs: 0, sm: 4 } }}
                placeholder='johnDoe@email.com'
              />
              <Button variant='contained' sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                Send
              </Button>
            </Box>
          </Box>
          <div>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Share the referral link
            </Typography>
            <InputLabel htmlFor='refer-social' sx={{ mb: 2, display: 'inline-flex', whiteSpace: 'break-spaces' }}>
              You can also copy and send it or share it on your social media. 🥳
            </InputLabel>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: ['wrap', 'nowrap'],
                justifyContent: ['flex-end', 'initial']
              }}
            >
              <OutlinedInput
                fullWidth
                size='small'
                id='refer-social'
                sx={{ pr: 1.25, mr: [0, 4] }}
                placeholder='http://referral.link'
                endAdornment={
                  <InputAdornment position='end'>
                    <Button size='small'>Copy Link</Button>
                  </InputAdornment>
                }
              />
              <Box sx={{ mt: [2, 0], display: 'flex', alignItems: 'center' }}>
                <FacebookBtn>
                  <Icon icon='tabler:brand-facebook' />
                </FacebookBtn>
                <TwitterBtn>
                  <Icon icon='tabler:brand-twitter' />
                </TwitterBtn>
                <LinkedInBtn>
                  <Icon icon='tabler:brand-linkedin' />
                </LinkedInBtn>
              </Box>
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogReferEarn
