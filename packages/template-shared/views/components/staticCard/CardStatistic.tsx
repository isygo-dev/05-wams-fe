import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Icon} from '@iconify/react';
import CustomAvatar from 'template-shared/@core/components/mui/avatar';
import Styles from "template-shared/style/style.module.css"
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import {useTranslation} from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface StatisticCardProps {
    title: string;
    value?: number | Date;
    avatarColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    avatarIcon?: string; // Assuming you're using a string identifier for the icon
    loading?: boolean;
    description?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
                                                         title,
                                                         value = 0,
                                                         avatarColor = 'primary',
                                                         avatarIcon,
                                                         loading = false,
                                                         description,
                                                     }) => {
    const {t} = useTranslation()

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                sx={{padding: '0px'}}
                action={
                    <Tooltip title={t(description)}>
                        <IconButton
                            className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                            <Icon icon='tabler:info-circle'/>
                        </IconButton>
                    </Tooltip>
                }
            />
            <CardContent sx={{padding: '0px 1rem 24px 1rem !important'}}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'nowrap'
                }}>
                    <Box>
                        <CustomAvatar
                            skin='light'
                            variant='rounded'
                            color={avatarColor}
                            sx={{width: 42, height: '100%', minHeight: 42}}
                        >
                            {avatarIcon && <Icon icon={avatarIcon} fontSize={22}/>}
                        </CustomAvatar>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2"
                                    sx={{color: 'rgba(51, 48, 60, 0.6)', fontWeight: '500', marginLeft: '8px'}}>
                            {t(title)}
                        </Typography>

                        <Typography variant='body2' sx={{color: 'rgb(67 64 80)', fontWeight: '600', marginLeft: '8px'}}>
                            {value} </Typography>
                        {loading && (
                            <CircularProgress size={12} sx={{ml: 1.5}}/>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

}

export default StatisticCard;
