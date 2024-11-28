// ** React Imports
import React, {useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import {styled, useTheme} from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, {FormControlLabelProps} from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Layout Import
// ** Hooks
// ** Demo Imports
import Grid from '@mui/material/Grid'
import ContentLoginRegister from 'template-shared/@core/components/contentLoginRegister'

const RightWrapper = styled(Box)<BoxProps>(({theme}) => ({
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

const LinkStyled = styled(Link)(({theme}) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({theme}) => ({
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.75),
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const AuthStepRegister = () => {
    // ** States
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // ** Hooks
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
                sx={{backgroundColor: 'background.paper', minHeight: '100vh', height: '100%'}}
            >
                <ContentLoginRegister hidden={hidden}/>
            </Grid>
            <Grid
                item
                md={hidden ? 12 : 6}
                sm={hidden ? 12 : 6}
                xs={hidden ? 12 : 12}
                xl={hidden ? 12 : 5}
                sx={{background: 'white'}}
            >
                <RightWrapper sx={{margin: 'auto', height: '100%'}}>
                    <Box
                        sx={{
                            p: [6, 12],
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box sx={{width: '100%', maxWidth: 400}}>
                            <img src='/images/favicon-logo.png' alt='apple-touch-icon.png' width={216} height={'100%'}/>
                            <Box sx={{my: 6}}>
                                <Typography sx={{mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385}}>
                                    Adventure starts here 🚀
                                </Typography>
                                <Typography sx={{color: 'text.secondary'}}>Make your app management easy and
                                    fun!</Typography>
                            </Box>
                            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                                <TextField autoFocus fullWidth sx={{mb: 4}} label='Username' placeholder='johndoe'/>
                                <TextField fullWidth label='Email' sx={{mb: 4}} placeholder='user@email.com'/>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='auth-login-v2-password'>Password</InputLabel>
                                    <OutlinedInput
                                        label='Password'
                                        id='auth-login-v2-password'
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <Icon
                                                        icon={
                                                            showPassword
                                                                ? 'fluent:slide-text-edit-24-regular'
                                                                : 'fluent:slide-text-edit-24-regular-off'
                                                        }
                                                        fontSize={20}
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>

                                <FormControlLabel
                                    control={<Checkbox/>}
                                    sx={{mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': {fontSize: '0.875rem'}}}
                                    label={
                                        <>
                                            <Typography variant='body2' component='span'>
                                                I agree to{' '}
                                            </Typography>
                                            <LinkStyled href='/' onClick={e => e.preventDefault()}>
                                                privacy policy & terms
                                            </LinkStyled>
                                        </>
                                    }
                                />
                                <Button fullWidth size='large' type='submit' variant='contained' sx={{mb: 4}}>
                                    Sign up
                                </Button>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography sx={{color: 'text.secondary', mr: 2}}>Already have an
                                        account?</Typography>
                                    <Typography variant='body2'>
                                        <LinkStyled href='/login' sx={{fontSize: '1rem'}}>
                                            Sign in instead
                                        </LinkStyled>
                                    </Typography>
                                </Box>
                                <Divider
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: 'text.disabled',
                                        '& .MuiDivider-wrapper': {px: 6},
                                        my: theme => `${theme.spacing(6)} !important`
                                    }}
                                >
                                    or
                                </Divider>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconButton href='/' component={Link} sx={{color: '#497ce2'}}
                                                onClick={e => e.preventDefault()}>
                                        <Icon icon='mdi:facebook'/>
                                    </IconButton>
                                    <IconButton href='/' component={Link} sx={{color: '#1da1f2'}}
                                                onClick={e => e.preventDefault()}>
                                        <Icon icon='mdi:twitter'/>
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        onClick={e => e.preventDefault()}
                                        sx={{color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300')}}
                                    >
                                        <Icon icon='mdi:github'/>
                                    </IconButton>
                                    <IconButton href='/' component={Link} sx={{color: '#db4437'}}
                                                onClick={e => e.preventDefault()}>
                                        <Icon icon='mdi:google'/>
                                    </IconButton>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </RightWrapper>
            </Grid>
        </Grid>
    )
}

export default AuthStepRegister
