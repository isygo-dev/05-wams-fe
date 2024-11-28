import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {Avatar, Box, Card, CardContent, Container, Grid, Typography} from '@mui/material';
import {useMutation} from 'react-query';
import localStorageKeys from '../../../../configs/localeStorage';
import Styles from '../../../../style/style.module.css';
import {authRequestType} from 'ims-shared/@core/types/ims/auth/authRequestTypes';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "template-shared/@core/components/icon";
import AuthApis from "ims-shared/@core/api/ims/auth";
import {useTranslation} from "react-i18next";
import imsApiUrls from "ims-shared/configs/ims_apis"

const imageUrl = imsApiUrls.apiUrl_IMS_Domain_ImageDownload_EndPoint;

const DomainsPage = () => {
    const {t} = useTranslation()
    const router = useRouter();
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const rememberMe = true;

    const [filteredTools, setFilteredTools] = useState<any[]>([])
    const [query, setQuery] = useState<string>('')

    const onLoginMutation = useMutation({
        mutationFn: (data: authRequestType) => AuthApis(t).loginByDomainAndUserName(data),
        onSuccess: (res, data) => {
            const {domain, userName} = data;
            sessionStorage.setItem(localStorageKeys.domain, domain);
            sessionStorage.setItem(localStorageKeys.userName, userName);
            sessionStorage.setItem(localStorageKeys.rememberMe, String(rememberMe));

            localStorage.setItem(localStorageKeys.domain, data.domain)
            localStorage.setItem(localStorageKeys.userName, data.userName)

            switch (res.authTypeMode) {
                case 'OTP':
                    sessionStorage.setItem(localStorageKeys.authType, 'OTP');
                    router.replace('/auth-step-otp-validation/');
                    break;
                case 'PWD':
                    sessionStorage.setItem(localStorageKeys.authType, 'PWD');
                    router.replace('/auth-step-password-validation/');
                    break;
                case 'QRC':
                    sessionStorage.setItem(localStorageKeys.authType, 'QRC');
                    sessionStorage.setItem(localStorageKeys.token, res.qrCodeToken);
                    router.replace('/auth-step-qrc-validation/');
                    break;
                default:
                    break;
            }
        },
    });

    useEffect(() => {
        if (router.query.list) {
            try {
                const parsedList = JSON.parse(router.query.list as string);
                setList(parsedList);
                setFilteredTools(parsedList)
            } catch (error) {
                setError('Failed to parse list');
            }
        }
    }, [router.query.list]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleCardClick = (domain, userName) => {
        const data = {domain, userName};
        onLoginMutation.mutate(data);
    };

    const handleFilter = (e: string) => {
        setQuery(e)
        if (list !== null) {
            const filtered = list?.filter(
                row =>
                    row.domain.toLowerCase().includes(e.trim().toLowerCase()) ||
                    row.fullName.toLowerCase().includes(e.trim().toLowerCase()) ||
                    row.code.toLowerCase().includes(e.trim().toLowerCase())
            )

            setFilteredTools(filtered)
        }
    }

    const renderArticles = () => {
        if (list && list.length) {
            return (
                <Grid container>
                    <Grid item md={12} xs={12} sm={12}>
                        <TextField
                            fullWidth
                            size='small'
                            value={query}
                            onChange={(e) => handleFilter(e.target.value)}
                            placeholder='Search for tool...'
                            sx={{'& .MuiInputBase-root': {borderRadius: 2}, padding: '21px 3px 15px 29px !important'}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' sx={{color: 'text.secondary'}}>
                                        <Icon icon='tabler:search' fontSize={20}/>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Box mt={4}>
                            <Container maxWidth="lg">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    {filteredTools.length === 0 ? (
                                        <Typography variant="body1">Loading...</Typography>
                                    ) : (
                                        <Grid container spacing={3} justifyContent="center">
                                            {filteredTools.map((data, index) => (
                                                <Grid item xs={12} sm={6} md={3} key={index} mt={3}>
                                                    <Card
                                                        className={'default-link , link-card'}
                                                        sx={{cursor: 'pointer'}}
                                                        onClick={() => handleCardClick(data.domain, data.code)}
                                                    >
                                                        <CardContent sx={{padding: '16px'}}>
                                                            <Box className={Styles.cardContentStyle}>
                                                                <Avatar
                                                                    sx={{width: '81px', height: '81px'}}
                                                                    src={`${imageUrl}/${data.domainId}`}
                                                                    alt={data.name}
                                                                />
                                                                <Typography className={Styles.cardTitle}
                                                                            variant="subtitle1">
                                                                    {data.domain}
                                                                </Typography>
                                                                <Typography sx={{color: 'text.secondary'}}
                                                                            variant="body2">
                                                                    {data.code}
                                                                </Typography>
                                                                <Typography sx={{color: 'text.secondary'}}
                                                                            variant="body2">
                                                                    {data.functionRole}
                                                                </Typography>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            </Container>
                        </Box>
                    </Grid>
                </Grid>
            )
        }
    }


    return (
        <Grid sx={{justifyContent: 'center'}}>
            {renderArticles()}
        </Grid>
    );
};

export default DomainsPage;
