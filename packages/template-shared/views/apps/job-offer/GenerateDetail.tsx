import React, {useEffect, useRef, useState} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import {useMutation, useQuery} from 'react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'
import TableCell, {TableCellBaseProps} from '@mui/material/TableCell'
import {styled, useTheme} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import List from '@mui/material/List'
import {ListItem} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import html2canvas from 'html2canvas'
import {jsPDF} from 'jspdf'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import {JobApplicationType} from 'rpm-shared/@core/types/rpm/jobApplicationType'
import process from 'process'
import JobOfferApis from "rpm-shared/@core/api/rpm/job-offer";
import ResumeApis from "rpm-shared/@core/api/rpm/resume";

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    id: number
}

const GenerateDetail = (props: Props) => {
    const {t} = useTranslation()
    const {open, setOpen, id} = props
    const [appName] = useState<string>(process.env.NEXT_PUBLIC_APP_NAME)
    const {
        data: jobData,
        isLoading: isLoadingJobDetail
    } = useQuery(['jobData', id], () => JobOfferApis(t).getJobOfferById(id), {})
    const [jobApplied, setJobApplied] = useState<boolean>(false)

    const theme = useTheme()
    const handleClose = () => {
        setOpen(false)
        setJobApplied(false)
    }

    const pdfRef = useRef()

    const handleDownload = () => {
        const input = document.getElementById('divToDownload')
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4', true)
            const pdfWidth = 200
            const pdfHeight = 250
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = 10
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
            pdf.save(`jobDetail.pdf`)
        })
    }

    const MUITableCell = styled(TableCell)<TableCellBaseProps>(({theme}) => ({
        borderBottom: 0,
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        '&:not(:last-child)': {
            paddingRight: `${theme.spacing(2)} !important`
        }
    }))

    const JobApplicationMutation = useMutation({
        mutationFn: (data: JobApplicationType) => ResumeApis(t).applyForJobOffer(data),
        onSuccess: () => {
            handleClose()
        }
    })

    const resumeCode = window.localStorage.getItem('resumeCode')
    const handleApply = async () => {
        const data: JobApplicationType = {
            jobOffer: {code: jobData?.code},
            resume: {code: resumeCode}
        }
        JobApplicationMutation.mutate(data)
    }
    console.log('codeJob', jobData?.code)
    const {data: jobOfferList} = useQuery([`jobOfferList`, resumeCode], () =>
        JobOfferApis(t).getJobOffersNotAssignedToResume(resumeCode)
    )

    useEffect(() => {
        if (jobOfferList && jobData) {
            const jobExist = jobOfferList.find(jobOffer => jobOffer.code === jobData?.code)

            if (jobExist === undefined) {
                setJobApplied(true)
            }
        }
    }, [jobOfferList, jobData])

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} fullScreen={true} maxWidth='xl'>
            <DialogTitle id='full-screen-dialog-title'>
                <Grid container item md={12}>
                    <IconButton
                        aria-label='close'
                        onClick={handleClose}
                        sx={{top: 10, right: 20, position: 'absolute', color: 'grey.500'}}
                    >
                        <Icon icon='tabler:x'/>
                    </IconButton>
                    <Tooltip title='Download' sx={{top: 10, right: 70, position: 'absolute', color: 'grey.500'}}>
                        <IconButton aria-label='download' color='primary' onClick={handleDownload}>
                            <Icon icon='tabler:download'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {!isLoadingJobDetail ? (
                    <div>
                        <Card className='pdfPage'>
                            <CardContent id='divToDownload' ref={pdfRef}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <img src='/images/favicon-logo.png' width='169px' alt='logo'/>
                                    </Grid>
                                </Grid>
                                <Divider/>

                                <Grid container>
                                    <Grid item xs={12} sx={{mt: 4}}>
                                        <Typography className='title-pdf-job' sx={{display: 'flex'}}>
                                            {jobData.title} |
                                            <Typography className='subtitle-pdf-job' sx={{ml: 2}}>
                                                {' '}
                                                {jobData.category}{' '}
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{mt: 4}}>
                                        <Typography className='subtitle-pdf-job'
                                                    sx={{display: 'flex', alignItems: 'center'}}>
                                            <Icon
                                                icon='tabler:circle-filled'
                                                color='black'
                                                height='9px'
                                                style={{marginRight: '6px'}}
                                            ></Icon>{' '}
                                            {t('Description')}{' '}
                                        </Typography>
                                        <Typography
                                            dangerouslySetInnerHTML={{__html: jobData?.details?.description}}
                                            className='subtitle-pdf-job'
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {jobData?.details?.responsibility?.length > 0 ? (
                                            <List component='nav' aria-label=''>
                                                <Typography className='subtitle-pdf-job'
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Icon
                                                        icon='tabler:circle-filled'
                                                        color='black'
                                                        height='9px'
                                                        style={{marginRight: '6px'}}
                                                    ></Icon>
                                                    {t('Job.Responsibility')}{' '}
                                                </Typography>
                                                {jobData?.details?.responsibility?.map((responsibility, index) => (
                                                    <ListItem key={index} className='list-items'>
                                                        <ListItemIcon>
                                                            <Icon icon='tabler:check'></Icon>
                                                        </ListItemIcon>
                                                        <ListItemText primary={responsibility}/>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : null}
                                    </Grid>
                                    <Grid item xs={12} sx={{mt: 4}}>
                                        {jobData?.details?.hardSkills.length > 0 || jobData?.details?.softSkills.length > 0 ? (
                                            <Typography className='subtitle-pdf-job'
                                                        sx={{display: 'flex', alignItems: 'center'}}>
                                                <Icon
                                                    icon='tabler:circle-filled'
                                                    color='black'
                                                    height='9px'
                                                    style={{marginRight: '6px'}}
                                                ></Icon>
                                                {t('Skills')}{' '}
                                            </Typography>
                                        ) : null}

                                        {jobData?.details?.hardSkills.length > 0 ? (
                                            <List component='nav' aria-label='' sx={{ml: 3}}>
                                                <Typography className='subtitle-pdf-job' sx={{mb: 2}}>
                                                    {t('Job.Hard_Skills')}{' '}
                                                </Typography>
                                                <Grid container item md={12}>
                                                    {jobData?.details?.hardSkills.map(skill => (
                                                        <Grid item md={4} key={skill.id}>
                                                            <ListItem className='list-items'>
                                                                <ListItemIcon>
                                                                    <Icon icon='tabler:check'></Icon>
                                                                </ListItemIcon>
                                                                <ListItemText className='text-pdf-job'>
                                                                    {skill.name} : {skill.level}
                                                                </ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </List>
                                        ) : null}

                                        {jobData?.details?.softSkills.length > 0 ? (
                                            <List component='nav' aria-label='' sx={{ml: 3}}>
                                                <Typography className='subtitle-pdf-job' sx={{mb: 2}}>
                                                    {t('Job.Soft_Skills')}{' '}
                                                </Typography>
                                                <Grid container item md={12}>
                                                    {jobData?.details?.softSkills.map(skill => (
                                                        <Grid item md={4} key={skill.id}>
                                                            <ListItem className='list-items'>
                                                                <ListItemIcon>
                                                                    <Icon icon='tabler:check'></Icon>
                                                                </ListItemIcon>
                                                                <ListItemText className='text-pdf-job'>
                                                                    {skill.name} : {skill.level}
                                                                </ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </List>
                                        ) : null}
                                    </Grid>

                                    <Grid item xs={12} sx={{mt: 4}}>
                                        <Typography className='subtitle-pdf-job'
                                                    sx={{display: 'flex', alignItems: 'center'}}>
                                            <Icon
                                                icon='tabler:circle-filled'
                                                color='black'
                                                height='9px'
                                                style={{marginRight: '6px'}}
                                            ></Icon>
                                            {t('Job.Contract_info')}{' '}
                                        </Typography>

                                        <Table>
                                            <TableBody
                                                sx={{'& .MuiTableCell-root': {py: `${theme.spacing(1)} !important`}}}>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Working_Mode')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.workingMode}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Availability')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.availability}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                    </Grid>
                                                </TableRow>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Contract_Type')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.contract}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Location')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.location}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                    </Grid>
                                                </TableRow>
                                                {jobData?.details?.contractInfo?.salaryMin || jobData?.details?.contractInfo?.salaryMax ? (
                                                    <Typography
                                                        className='subtitle-pdf-job'
                                                        sx={{display: 'flex', alignItems: 'center', mt: 3}}
                                                    >
                                                        <Icon
                                                            icon='tabler:circle-filled'
                                                            color='black'
                                                            height='9px'
                                                            style={{marginRight: '6px'}}
                                                        ></Icon>
                                                        {t('Job.Salary')}
                                                    </Typography>
                                                ) : null}

                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        {jobData?.details?.contractInfo?.salaryMin ? (
                                                            <Grid item md={6}>
                                                                <MUITableCell>
                                                                    <Typography
                                                                        className='subtitle-pdf-job'>{t('Job.Salary_Min')} :</Typography>
                                                                </MUITableCell>
                                                                <MUITableCell>
                                                                    <Typography className='text-pdf-job'>
                                                                        {jobData?.details?.contractInfo?.salaryMin}
                                                                    </Typography>
                                                                </MUITableCell>
                                                            </Grid>
                                                        ) : null}
                                                        {jobData?.details?.contractInfo?.salaryMax ? (
                                                            <Grid item md={6}>
                                                                <MUITableCell>
                                                                    <Typography
                                                                        className='subtitle-pdf-job'>{t('Job.Salary_Max')} :</Typography>
                                                                </MUITableCell>
                                                                <MUITableCell>
                                                                    <Typography className='text-pdf-job'>
                                                                        {jobData?.details?.contractInfo?.salaryMax}
                                                                    </Typography>
                                                                </MUITableCell>
                                                            </Grid>
                                                        ) : null}
                                                    </Grid>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Grid>

                                    <Grid item xs={12} sx={{mt: 4}}>
                                        <Typography className='subtitle-pdf-job'
                                                    sx={{display: 'flex', alignItems: 'center'}}>
                                            <Icon
                                                icon='tabler:circle-filled'
                                                color='black'
                                                height='9px'
                                                style={{marginRight: '6px'}}
                                            ></Icon>
                                            {t('Job.Job_Info')}{' '}
                                        </Typography>

                                        <Table>
                                            <TableBody
                                                sx={{'& .MuiTableCell-root': {py: `${theme.spacing(1)} !important`}}}>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Customer')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='text-pdf-job'>{jobData.customer}</Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Owner')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='text-pdf-job'>{jobData.owner}</Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                    </Grid>
                                                </TableRow>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Contract_Type')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.contract}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Location')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.contractInfo?.location}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                    </Grid>
                                                </TableRow>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        {jobData?.details?.jobInfo?.startDate ? (
                                                            <Grid item md={4}>
                                                                <MUITableCell>
                                                                    <Typography
                                                                        className='subtitle-pdf-job'>{t('start_date')} :</Typography>
                                                                </MUITableCell>
                                                                <MUITableCell>
                                                                    <Typography className='text-pdf-job'>
                                                                        {new Date(jobData?.details?.jobInfo?.startDate).toLocaleDateString()}
                                                                    </Typography>
                                                                </MUITableCell>
                                                            </Grid>
                                                        ) : null}

                                                        {jobData?.details?.jobInfo?.endDate ? (
                                                            <Grid item md={4}>
                                                                <MUITableCell>
                                                                    <Typography
                                                                        className='subtitle-pdf-job'>{t('end_date')} :</Typography>
                                                                </MUITableCell>
                                                                <MUITableCell>
                                                                    <Typography className='text-pdf-job'>
                                                                        {new Date(jobData?.details?.jobInfo?.endDate).toLocaleDateString()}
                                                                    </Typography>
                                                                </MUITableCell>
                                                            </Grid>
                                                        ) : null}

                                                        {jobData?.details?.jobInfo?.deadline ? (
                                                            <Grid item md={4}>
                                                                <MUITableCell>
                                                                    <Typography
                                                                        className='subtitle-pdf-job'>{t('deadline')} :</Typography>
                                                                </MUITableCell>
                                                                <MUITableCell>
                                                                    <Typography className='text-pdf-job'>
                                                                        {new Date(jobData?.details?.jobInfo?.deadline).toLocaleDateString()}
                                                                    </Typography>
                                                                </MUITableCell>
                                                            </Grid>
                                                        ) : null}
                                                    </Grid>
                                                </TableRow>
                                                <TableRow>
                                                    <Grid container md={12} sx={{ml: 4, mt: 2}}>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Positions')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='text-pdf-job'>{jobData?.details?.jobInfo?.position}</Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <MUITableCell>
                                                                <Typography
                                                                    className='subtitle-pdf-job'>{t('Job.Experience')} :</Typography>
                                                            </MUITableCell>
                                                            <MUITableCell>
                                                                <Typography className='text-pdf-job'>
                                                                    {jobData?.details?.experienceMin} - {jobData?.details?.experienceMax}
                                                                </Typography>
                                                            </MUITableCell>
                                                        </Grid>
                                                    </Grid>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </CardContent>

                            {appName === 'prm-cfo' ? (
                                <CardActions sx={{justifyContent: 'center', mt: 2}}>
                                    {jobApplied ? (
                                        <Typography className='subtitle-pdf-job'>
                                            <IconButton size='small' sx={{backgroundColor: 'green', color: 'white'}}>
                                                <Icon icon='tabler:check'/>
                                            </IconButton>{' '}
                                            {t('Job.Job_applied_notification')} {new Date(jobData?.createDate).toLocaleDateString()}
                                        </Typography>
                                    ) : (
                                        <Button size='large' variant='contained' color='primary' onClick={handleApply}>
                                            Apply
                                        </Button>
                                    )}
                                </CardActions>
                            ) : null}
                        </Card>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export default GenerateDetail
