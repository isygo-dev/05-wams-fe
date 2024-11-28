import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import JobOfferTemplateApis from "rpm-shared/@core/api/rpm/job-offer/template";
import AccountApis from "ims-shared/@core/api/ims/account";
import CustomerApis from "ims-shared/@core/api/ims/customer";
import JobOfferApis from "rpm-shared/@core/api/rpm/job-offer";
import {JobOfferType} from "rpm-shared/@core/types/rpm/jobOfferTypes";

interface SidebarAddJobType {
    open: boolean
    toggle: () => void
    domain: string
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    domain: yup.string().required(),
    title: yup.string().required(),
    owner: yup.string(),
    industry: yup.string().required(),
    customer: yup.string()
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            width: 250,
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        }
    }
}
const SidebarAddJob = (props: SidebarAddJobType) => {
    const {t} = useTranslation()
    const queryClient = useQueryClient()
    const {open, toggle, domain} = props
    const [selectedDomain, setSelectedDomain] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState<any>()
    const {data: template} = useQuery('jobTemplates', () => JobOfferTemplateApis(t).getJobOfferTemplates())
    const {data: domains} = useQuery('domains', DomainApis(t).getDomainsNameList)
    const {data: emails} = useQuery(['emails', selectedDomain], () => AccountApis(t).getAccountEmailsByDomain(), {
        enabled: !!selectedDomain
    })

    const {data: customers} = useQuery(`customers`, () => CustomerApis(t).getCustomers())

    const handleChangeDomain = (event: any) => {
        setSelectedDomain(event.target.value)
    }
    const handleChangeTemplate = (event: any) => {
        setSelectedTemplate(event.target.value)
        if (event.target.value) {
            setSelectedDomain(event.target.value.jobOffer.domain)
            reset(event.target.value.jobOffer)
        }
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<JobOfferType>({
        defaultValues: {
            title: '',
            owner: '',
            domain: domain,
            industry: '',
            customer: ''
        },
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: JobOfferType) => {
        data.id = null
        data.code = null
        const dataDetails = data.details
        const dataDetailFile = data.additionalFiles
        if (dataDetails) {
            data.details.id = null
            if (dataDetails.contractInfo) {
                data.details.contractInfo.id = null
            }
            if (dataDetails.jobInfo) {
                data.details.jobInfo.id = null
            }
            if (dataDetails.hardSkills) {
                data.details.hardSkills = data.details.hardSkills.map(item => ({...item, id: null}))
            }
            if (dataDetails.softSkills) {
                data.details.softSkills = data.details.softSkills.map(item => ({...item, id: null}))
            }
            if (dataDetailFile) {
                data.additionalFiles = []
            }
        }
        jobMutationAdd.mutate(data)
    }

    const jobMutationAdd = useMutation({
        mutationFn: (data: JobOfferType) => JobOfferApis(t).addJobOffer(data),
        onSuccess: (res: JobOfferType) => {
            const cachedData = (queryClient.getQueryData('jobs') as any[]) || []
            const updatedData = [...cachedData]
            updatedData.push(res)
            queryClient.setQueryData('jobs', updatedData)
            handleClose()
        }
    })

    const handleClose = () => {
        toggle()
        reset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
        >
            <Header>
                <Typography variant='h6'>{t('Action.Add')}</Typography>
                <IconButton
                    size='small'
                    onClick={handleClose}
                    sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
                >
                    <Icon icon='tabler:x' fontSize='1.125rem'/>
                </IconButton>
            </Header>
            <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Domain.Domain')}</InputLabel>
                        <Controller
                            name='domain'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <Select
                                    disabled={checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                                    size='small'
                                    label={t('Domain.Domain')}
                                    name='domain'
                                    defaultValue=''
                                    onChange={e => {
                                        onChange(e)
                                        handleChangeDomain(e)
                                    }}
                                    value={value}
                                >
                                    <MenuItem value=''>
                                        <em>{t('None')}</em>
                                    </MenuItem>
                                    {domains?.map((domain, index) => (
                                        <MenuItem key={index} value={domain}>
                                            {domain}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.domain &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{'Template'}</InputLabel>
                        <Select
                            size='small'
                            label={t('Template.Template')}
                            name='jobTemplates'
                            defaultValue=''
                            value={selectedTemplate}
                            onChange={e => {
                                handleChangeTemplate(e)
                            }}
                        >
                            <MenuItem value=''>
                                <em>{t('None')}</em>
                            </MenuItem>
                            {template?.map((template, index) => (
                                <MenuItem key={index} value={template}>
                                    {template.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <Controller
                            name='title'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    size='small'
                                    value={value}
                                    label={t('Title') as string}
                                    onChange={onChange}
                                    placeholder={t('Enter_job_title') as string}
                                    error={Boolean(errors.title)}
                                />
                            )}
                        />
                        {errors.title &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.title.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Owner')}</InputLabel>
                        <Controller
                            name='owner'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <Select
                                    size='small'
                                    label={t('Job.Owner')}
                                    value={value}
                                    MenuProps={MenuProps}
                                    onChange={event => {
                                        const selectedEmail = event.target.value
                                        onChange(selectedEmail)
                                    }}
                                >
                                    {selectedDomain &&
                                        emails?.map((email, index) => (
                                            <MenuItem key={index} value={email}>
                                                {email}
                                            </MenuItem>
                                        ))}
                                </Select>
                            )}
                        />
                        {errors.owner &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.owner.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Customer.Customer')}</InputLabel>
                        <Controller
                            name='customer'
                            control={control}
                            render={({field: {value, onChange}}) => (
                                <Select size='small' label={t('Customer.Customer')} name='customer' onChange={onChange}
                                        value={value}>
                                    <MenuItem value=''>
                                        <em>{t('None')}</em>
                                    </MenuItem>
                                    {customers?.map(customer => (
                                        <MenuItem key={customer.id} value={customer.name}>
                                            {customer.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <Controller
                            name='industry'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    size='small'
                                    value={value}
                                    label={t('Job.Industry')}
                                    onChange={onChange}
                                    placeholder='industry'
                                    error={Boolean(errors.industry)}
                                />
                            )}
                        />
                        {errors.industry &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.industry.message}</FormHelperText>}
                    </FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Button type='submit' variant='contained' sx={{mr: 3}}>
                            {t('Submit')}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            {t('Cancel')}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    )
}

export default SidebarAddJob
