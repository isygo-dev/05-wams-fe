// ** React Imports
// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'


// ** Demo Imports
import {useTranslation} from "react-i18next";
import FooterIllustrations from "../misc/FooterIllustrations";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        width: '90vw'
    }
}))


const Img = styled('img')(({theme}) => ({
    [theme.breakpoints.down('lg')]: {
        height: 450,
        marginTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
        height: 400
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        maxWidth: 497,
        height: 'auto',
        maxHeight: 400
    },
    [theme.breakpoints.up('lg')]: {
        marginTop: theme.spacing(20)
    }
}))

const InfoView = () => {
    const {t} = useTranslation();

    return (
        <Box className='content-center'>
            <Box sx={{p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <BoxWrapper>
                    <Typography variant='h4' sx={{mb: 1.5}}>
                        {t('Password reset info.title')}
                    </Typography>
                    <Typography sx={{mb: 6, color: 'text.secondary'}}>
                        {t('Password reset info.body')}
                    </Typography>
                    <Button href='/' component={Link} variant='contained'>
                        {t('Back to Home')}
                    </Button>
                </BoxWrapper>
                <Img height='500' alt='under-maintenance-illustration' src='/images/pages/misc-under-maintenance.png'/>
            </Box>
            <FooterIllustrations/>
        </Box>
    )
}

export default InfoView;
