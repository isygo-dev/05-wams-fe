import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import {Controller, useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useTranslation} from 'react-i18next'
import Button from '@mui/material/Button'
import {yupResolver} from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import {Accordion, Slider} from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import {GridExpandMoreIcon} from '@mui/x-data-grid'
import SkillForm from './components/addSkill'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'
import Icon from 'template-shared/@core/components/icon'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import ViewAdditionalFile from './components/ViewAdditionalFile'
import ShareJobDrawer from './components/ShareDrawer'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useFetchProperties} from 'template-shared/hooks/useFetchProperties'
import TemplateJobDrawer from './components/JobTemplateDrawer'
import {propertyName} from 'template-shared/configs/propertyConstantName'
import CardHeader from '@mui/material/CardHeader'
import GenerateDetail from './GenerateDetail'
import {ListItemsMenuType} from 'quiz-shared/@core/types/quiz/quizTypes'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import AnnexApis from 'ims-shared/@core/api/ims/annex'
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";
import {MuiChipsInput} from 'mui-chips-input'
import StatisticsByJobContainer from './components/ViewStaticsByJobOffer'
import AdditionalInfoJobCard from './components/AdditionalInfoJobCard'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import CustomerApis from "ims-shared/@core/api/ims/customer";
import JobOfferApis from "rpm-shared/@core/api/rpm/job-offer";
import {JobOfferType} from "rpm-shared/@core/types/rpm/jobOfferTypes";

interface JobDetailsDataProps {
    jobDetailsData: JobOfferType
}

const schema = yup.object().shape({
    domain: yup.string(),
    code: yup.string(),
    industry: yup.string(),
    title: yup.string(),
    description: yup.string(),
    experienceMin: yup.number(),
    experienceMax: yup.number(),
    salaryMax: yup.number(),
    salaryMin: yup.number(),
    customer: yup.string(),
    owner: yup.string(),
    type: yup.string(),
    availability: yup.string(),
    contract: yup.string(),
    location: yup.string(),
    startDate: yup.date()

    //endDate: yup.date().required().min(yup.ref('startDate'), "End date must be greater or equal to start date"),
})
const marks = [
    {
        value: 1,
        label: '1'
    },
    {
        value: 5,
        label: '5'
    },
    {
        value: 10,
        label: '10'
    },
    {
        value: 20,
        label: '20'
    }
]
const markssalary = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 20,
        label: '20'
    },
    {
        value: 30,
        label: '30'
    },
    {
        value: 40,
        label: '40'
    },
    {
        value: 50,
        label: '50'
    },
    {
        value: 60,
        label: '60'
    },
    {
        value: 70,
        label: '70'
    },
    {
        value: 80,
        label: '80'
    },
    {
        value: 90,
        label: '90'
    },
    {
        value: 100,
        label: '100'
    }
]

const minDistance = 1
const minDistancesalary = 0

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {ssr: false})

const ViewJobOfferDrawer: React.FC<JobDetailsDataProps> = props => {
    const queryClient = useQueryClient()
    const {t} = useTranslation()
    const {
        reset,
        control,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues: props.jobDetailsData,
        mode: 'onChange',

        resolver: yupResolver(schema)
    })
    const [dialogShare, setDialogShare] = useState<boolean>(false)

    const [editedData, setEditedData] = useState<JobOfferType>(props.jobDetailsData)
    const [description, setDescription] = useState(props.jobDetailsData.details?.description || '')
    const [responsibilities, setResponsibilities] = useState(props.jobDetailsData.details?.responsibility || [''])
    const [experienceRange, setExperienceRange] = useState<[number, number]>([
        props.jobDetailsData?.details?.experienceMin ?? 1,
        props.jobDetailsData?.details?.experienceMax ?? 2
    ])
    const [salaryRange, setSalaryRange] = useState<[number, number]>([
        props.jobDetailsData?.details?.contractInfo?.salaryMin ?? 0,
        props.jobDetailsData?.details?.contractInfo?.salaryMax ?? 100
    ])
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedEmployer, setSelectedEmployer] = useState('');

    const [dialogSetTemplate, setDialogSetTemplate] = useState<boolean>(false)
    const {data: dataResponsibilities, isLoading: isLoadingResponsibility} = useFetchProperties({
        key: 'Responsibility',
        guiName: 'JobView',
        name: `${propertyName.responsibility}`
    })
    const {data: CurrencyAmount, isLoading: isLoadingCurrency} = useQuery('CurrencyAmount', () =>
        AnnexApis(t).getAnnexByTableCode(IEnumAnnex.CURRENCY_AMOOUNT)
    )
    const {data: industry, isLoading: isLoadingindustry} = useQuery('industry', () =>
        AnnexApis(t).getAnnexByTableCode(IEnumAnnex.JOB_INDUSTRY)
    )
    const {data: eduaction, isLoading: isLoadingeducation} = useQuery('education', () =>
        AnnexApis(t).getAnnexByTableCode(IEnumAnnex.EDUCATION_LEVEL)
    )
    console.log(selectedIndustry)
    console.log(selectedEmployer)
    const {data: employerType, isLoading: isLoadingEmployer} = useQuery(
        ['employerType', selectedIndustry],
        () => AnnexApis(t).getAnnexByTableCodeAndReference(IEnumAnnex.EMPLOYER_TYPE, selectedIndustry),
        {
            enabled: !!selectedIndustry,
        }
    )
    const {data: jobFunctionType, isLoading: isLoadingJobFunction} = useQuery(
        ['jobFunctionType', selectedEmployer],
        () => AnnexApis(t).getAnnexByTableCodeAndReference(IEnumAnnex.JOB_FUNCTION, selectedEmployer),
        {
            enabled: !!selectedEmployer,
        }
    )

    console.log('CurrencyAmount', CurrencyAmount)
    const {data: dataSkills, isLoading: isLoadingSkills} = useFetchProperties({
        key: 'Skills',
        guiName: 'JobView',
        name: `${propertyName.skills}`
    })
    const {handleSaveChangeWithName} = useUpdateProperty({
        guiName: 'JobView'
    })

    const {data: customers} = useQuery(`customers`, () => CustomerApis(t).getCustomers())

    const handleClose = () => {
        setDialogSetTemplate(false)
    }

    const handleInputChange = (field: string, value: any) => {
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)) {

            setEditedData({
                ...editedData,
                [field]: value
            })
        }
    }

    const handleDeleteResponsibility = (index: number) => {
        const updatedResponsibilities = [...responsibilities]
        updatedResponsibilities.splice(index, 1)
        setResponsibilities(updatedResponsibilities)
    }

    const handleAddResponsibility = () => {
        setResponsibilities([...responsibilities, ''])
        handleInputChange('editedData.details.responsibility', [...responsibilities, ''])
    }
    const [skills, setSkills] = useState({
        hardSkills: props.jobDetailsData.details?.hardSkills || [],
        softSkills: props.jobDetailsData.details?.softSkills || []
    })

    const handleSkillsData = (skillsData: any) => {
        // console.log('hello skillsData', skillsData)
        setSkills(skillsData)
    }
    const onSubmit = async (data: JobOfferType) => {
        console.log('data', skills)
        if (data) {
            data.details = {
                ...data.details,
                description: description,
                responsibility: responsibilities.filter(r => r?.length > 0),
                experienceMin: experienceRange[0],
                experienceMax: experienceRange[1],
                softSkills: skills.softSkills,
                hardSkills: skills.hardSkills,
                contractInfo: {
                    ...data.details.contractInfo,
                    salaryMin: salaryRange[0],
                    salaryMax: salaryRange[1]
                }
            }
            jobMutationEdit.mutate(data)
        }
    }

    const jobMutationEdit = useMutation({
        mutationFn: (data: JobOfferType) => JobOfferApis(t).updateJobOffer(data),
        onSuccess: (res: JobOfferType) => {
            const cachedJobs: any[] = queryClient.getQueryData('jobs') || []
            const index = cachedJobs.findIndex(obj => obj.id === res.id)
            if (index !== -1) {
                const updatedJobs = [...cachedJobs]
                updatedJobs[index] = res
                queryClient.setQueryData('jobs', updatedJobs)
            }
        }
    })
    const [showGeneratePPF, setShowGeneratePPF] = useState<boolean>(false)

    const handlePrint = () => {
        console.log('Print button clicked')

        setShowGeneratePPF(true)
    }
    const handleShare = () => {
        setDialogShare(true)

    }
    const handleSetTemplate = () => {
        setDialogSetTemplate(true)

    }

    const handleDataFromChild = data => {
        console.log(data)
        const updatedData = {...editedData}
        updatedData.details = {
            ...updatedData.details
        }
        updatedData.additionalFiles = data
        setEditedData(updatedData)
    }

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{header: 1}, {header: 2}],
            [{list: 'ordered'}, {list: 'bullet'}],
            [{script: 'sub'}, {script: 'super'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{direction: 'rtl'}],
            [{size: ['small', false, 'large', 'huge']}],
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            [{color: []}, {background: []}],
            [{font: []}],
            [{align: []}],
            ['link', 'image'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false
        }
    }
    const {refetch} = useQuery('shareJob', JobOfferApis(t).getJobOffers)

    const setJobSharedInfo = () => {
        refetch()
    }
    const handleReset = () => {
        reset()
    }


    const ITEM_HEIGHT = 48


    const handleSave = () => {
        onSubmit(getValues())
    }

    const getListItems = () => {
        const newListItems: ListItemsMenuType[] = []


        if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Share',
                    name: 'Job.Share'
                }
            )
        }
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.READ)) {
            newListItems.push({
                    title: 'Print',
                    name: 'Job.Print'
                }
            )
        }
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER_TEMPLATE, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Template',
                    name: 'Job.Mark_as_Template'
                }
            )
        }

        return newListItems
    }


    const handleChange = (item?: ListItemsMenuType) => {
        const itemClick = getListItems()?.find(d => d.name === item.name)
        switch (itemClick.title) {
            case 'Template':
                handleSetTemplate()
                break
            case 'Share':
                handleShare()
                break
            case 'Print':
                handlePrint()
                break
        }
    }


    return !isLoadingResponsibility && !isLoadingSkills ? (
        <>
            <Grid container>
                <HeaderCardView
                    title={'Job.Job'}
                    btnSave={checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                    btnCancel={checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                    multiBtn={getListItems()?.length > 0}
                    ITEM_HEIGHT={ITEM_HEIGHT}
                    listItems={getListItems()}
                    handleReset={handleReset}
                    handleChange={handleChange}
                    onSubmit={handleSave}
                    disableCancel={false}
                    disableSubmit={false}
                />
                <Grid container spacing={2} mb={2}>
                    <Grid item sm={12} xs={12} md={2}>
                        <AdditionalInfoJobCard/>
                    </Grid>
                    <Grid item md={10} sm={12}>
                        <StatisticsByJobContainer codeJob={editedData.code}/>
                    </Grid>
                </Grid>

                <Grid item md={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader className={'title-card'} title={t('Job.General_informations')}/>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='domain'
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        label={t('Domain.Domain')}
                                                        fullWidth
                                                        {...field}
                                                        variant='outlined'
                                                        size='small'
                                                        onChange={e => {
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                                                            field.onChange(e);
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && handleInputChange('domain', e.target.value)
                                                        }}
                                                        disabled={true}
                                                    />)}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='department'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <TextField
                                                        label={t('Department')}
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                        value={value}
                                                        onChange={(e) => {
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && onChange(e);
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                                                            handleInputChange('department', e.target.value);
                                                        }
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='code'
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        label={t('Code')}
                                                        {...field}
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                        InputProps={{readOnly: true}}
                                                        disabled={true}

                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='title'
                                                control={control}
                                                render={({field: {value}}) => (
                                                    <TextField
                                                        label={t('Title')}
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                        value={value}
                                                        onChange={(e) =>
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                                                            handleInputChange('title', e.target.value)
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='industry'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel>{t('Industry')}</InputLabel>
                                                        <Select size='small'
                                                                disabled={!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                                                                value={value} onChange={(e) => {
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && onChange(e);
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && setSelectedIndustry(e.target.value);
                                                        }} label='Industry'>
                                                            {!isLoadingindustry
                                                                ? industry?.map(res => (
                                                                    <MenuItem key={res.id} value={res.value}>
                                                                        {res.value}
                                                                    </MenuItem>
                                                                ))
                                                                : null}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='employerType'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel>{t('EmployerType')}</InputLabel>
                                                        <Select size='small'
                                                                disabled={!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                                                                value={value} onChange={(e) => {
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                                                            onChange(e.target.value);
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && setSelectedEmployer(e.target.value);
                                                        }} label='EmployerType'>
                                                            {!isLoadingEmployer
                                                                ? employerType?.map(res => (
                                                                    <MenuItem key={res.id} value={res.value}>
                                                                        {res.value}
                                                                    </MenuItem>
                                                                ))
                                                                : null}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth sx={{mb: 4}}>
                                            <Controller
                                                name='jobFunction'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel>{t('Job Function')}</InputLabel>
                                                        <Select
                                                            disabled={!checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE)}
                                                            size='small' value={value}
                                                            onChange={checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && onChange}
                                                            label='Job Function'>
                                                            {!isLoadingJobFunction
                                                                ? jobFunctionType?.map(res => (
                                                                    <MenuItem key={res.id} value={res.value}>
                                                                        {res.value}
                                                                    </MenuItem>
                                                                ))
                                                                : null}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{mb: 2}}>{t('Description')}</Typography>
                                        <QuillNoSSRWrapper
                                            theme='snow'
                                            value={description}
                                            onChange={checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && setDescription}
                                            modules={modules}
                                            style={{marginBottom: '16px'}}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Accordion
                            onChange={(e, expended) => handleSaveChangeWithName(expended, `${propertyName.responsibility}`)}
                            defaultExpanded={dataResponsibilities?.value.toLowerCase() == 'true'}
                        >
                            <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
                                <Typography className={'title-card'}>{t('Job.Responsibility')}</Typography>
                            </AccordionSummary>
                            <Divider sx={{m: '0 !important'}}/>
                            <AccordionDetails>
                                <Grid container>
                                    {responsibilities.map((responsibility, index) => (
                                        <Grid item xs={12} sm={12} md={6} key={index}>
                                            <Card
                                                key={index}
                                                sx={{
                                                    borderRadius: '5px',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        padding: '10px !important',
                                                        display: 'flex'
                                                    }}
                                                >
                                                    <TextField
                                                        name={`details.responsibility[${index}].name`}
                                                        size='small'
                                                        label={`Responsibility ${index + 1}`}
                                                        fullWidth
                                                        variant='outlined'
                                                        value={responsibility}
                                                        onChange={e => {
                                                            const updatedResponsibilities = [...responsibilities]
                                                            updatedResponsibilities[index] = e.target.value
                                                            checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && setResponsibilities(updatedResponsibilities)
                                                        }}
                                                    />
                                                    {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&

                                                        <IconButton size='small'
                                                                    onClick={() => handleDeleteResponsibility(index)}>
                                                            <Icon icon='tabler:x' fontSize='1.25rem'/>
                                                        </IconButton>}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sx={{mt: 2}}>
                                        {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                                            <Button onClick={handleAddResponsibility} variant='contained'
                                                    className={'button-padding-style'}
                                                    color='primary' size={'small'}>
                                                <Icon icon='tabler:plus'
                                                      style={{marginRight: '6px'}}/> {t('Job.Add_Responsibility')}
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>


                        <Accordion
                            onChange={(e, expended) => handleSaveChangeWithName(expended, `${propertyName.skills}`)}
                            defaultExpanded={dataSkills?.value?.toLowerCase() == 'true'}
                        >
                            <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
                                <Typography className={'title-card'}>{t('Skills')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SkillForm onSkillsData={handleSkillsData} existingSkills={editedData.details}/>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion defaultExpanded={false}>
                            <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
                                <Typography sx={{fontWeight: '600'}}>{t('Job.Job_Info')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Customer.Customer')}</InputLabel>
                                            <Controller
                                                name='customer'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <Select
                                                        size='small'
                                                        label={t('Customer.Customer')}
                                                        name='customer'
                                                        onChange={onChange}
                                                        value={value}
                                                    >
                                                        {customers?.map(customer => (
                                                            <MenuItem key={customer.id} value={customer.name}>
                                                                {customer.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.customer && (
                                                <FormHelperText
                                                    sx={{color: 'error.main'}}>{errors.customer.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name='owner'
                                                control={control}
                                                render={({field}) => (
                                                    <TextField label={t('Owner')} {...field} fullWidth
                                                               variant='outlined' size='small'/>
                                                )}
                                            />

                                            {errors.owner && (
                                                <FormHelperText
                                                    sx={{color: 'error.main'}}>{errors.owner.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name='details.jobInfo.startDate'
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <DatePickerWrapper>
                                                    <DatePicker
                                                        selected={value ? new Date(value) : null}
                                                        dateFormat='dd/MM/yyyy'
                                                        onChange={date => onChange(date)}
                                                        customInput={<TextField size='small' fullWidth
                                                                                label={t('start date')}/>}
                                                    />
                                                </DatePickerWrapper>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name='details.jobInfo.endDate'
                                            control={control}
                                            rules={{required: true}}
                                            render={({field: {value, onChange}}) => (
                                                <DatePickerWrapper>
                                                    <DatePicker
                                                        selected={value ? new Date(value) : null}
                                                        dateFormat='dd/MM/yyyy'
                                                        onChange={date => onChange(date)}
                                                        customInput={<TextField size='small' fullWidth
                                                                                label={t('end date')}/>}
                                                    />
                                                </DatePickerWrapper>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={4} sx={{mt: 3}}>
                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name='details.jobInfo.deadline'
                                            control={control}
                                            rules={{required: true}}
                                            render={({field: {value, onChange}}) => (
                                                <DatePickerWrapper>
                                                    <DatePicker
                                                        selected={value ? new Date(value) : null}
                                                        dateFormat='dd/MM/yyyy'
                                                        onChange={date => onChange(date)}
                                                        customInput={<TextField size='small' fullWidth
                                                                                label={t('deadline')}/>}
                                                    />
                                                </DatePickerWrapper>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name='details.jobInfo.position'
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        label={t('Job.Positions')}
                                                        {...field}
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <Typography>{t('Experience')}</Typography>
                                            <Slider
                                                disableSwap
                                                marks={marks}
                                                min={1}
                                                max={20}
                                                value={experienceRange}
                                                valueLabelDisplay='auto'
                                                onChange={(_, newValue) => {
                                                    const [min, max] = newValue as [number, number]
                                                    if (max - min < minDistance) {
                                                        if (min !== experienceRange[0]) {
                                                            setExperienceRange([max - minDistance, max])
                                                        } else {
                                                            setExperienceRange([min, min + minDistance])
                                                        }
                                                    } else {
                                                        setExperienceRange([min, max])
                                                    }
                                                }}
                                                aria-labelledby='experience-slider'
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name='details.jobInfo.educationLevel'
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <FormControl fullWidth>
                                                    <InputLabel>{t('educationLevel')}</InputLabel>
                                                    <Select size='small' value={value} onChange={onChange}
                                                            label='educationLevel'>
                                                        {!isLoadingeducation
                                                            ? eduaction?.map(res => (
                                                                <MenuItem key={res.id} value={res.value}>
                                                                    {res.value}
                                                                </MenuItem>
                                                            ))
                                                            : null}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name='details.jobInfo.qualifications'
                                                control={control}
                                                rules={{required: true}}
                                                render={({field: {value, onChange}}) => (
                                                    <MuiChipsInput
                                                        size='small'
                                                        value={value || []}
                                                        label='Qualifications'
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            onChange={(e, expended) => handleSaveChangeWithName(expended, `${propertyName.jobContactInfo}`)}
                            defaultExpanded={dataSkills?.value?.toLowerCase() == 'true'}
                        >
                            <AccordionSummary expandIcon={<GridExpandMoreIcon/>}>
                                <Typography sx={{fontWeight: '600'}}>{t('Contract.contract')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={4} sx={{mt: 4}}>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Job.Working_Mode')}</InputLabel>
                                            <Controller
                                                name='details.contractInfo.workingMode'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <Select
                                                        value={value || ''}
                                                        label='Working Mode'
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                        onChange={onChange}
                                                    >
                                                        <MenuItem value='REMOTE'>{t('REMOTE')}</MenuItem>
                                                        <MenuItem value='HYBRID'>{t('HYBRID')}</MenuItem>
                                                        <MenuItem value='PRESENTIAL'>{t('PRESENTIAL')}</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                            {errors.details?.contractInfo?.workingMode && (
                                                <p>{errors.details?.contractInfo?.workingMode?.message}</p>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Job.Availability')}</InputLabel>
                                            <Controller
                                                name='details.contractInfo.availability'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <Select
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        label='Availability'
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                    >
                                                        <MenuItem value='FULLTIME'>{t('FULLTIME')}</MenuItem>
                                                        <MenuItem value='PARTTIME'>{t('PARTTIME')}</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                            {errors.details?.contractInfo?.availability && (
                                                <p>{errors.details.contractInfo.availability.message}</p>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Job.Contract_Type')}</InputLabel>
                                            <Controller
                                                name='details.contractInfo.contract'
                                                control={control}
                                                render={({field: {value, onChange}}) => (
                                                    <Select
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        label='Contract Type'
                                                        fullWidth
                                                        variant='outlined'
                                                        size='small'
                                                    >
                                                        <MenuItem value='CDI'>CDI</MenuItem>
                                                        <MenuItem value='CDD'>CDD</MenuItem>
                                                        <MenuItem value='INTERNSHIP'>Internship</MenuItem>
                                                        <MenuItem value='INTERIM'>Interim</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                            {errors.details?.contractInfo?.contract && (
                                                <p>{errors.details.contractInfo.contract.message}</p>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name='details.contractInfo.location'
                                                control={control}
                                                render={({field}) => (
                                                    <TextField label='Location' {...field} fullWidth variant='outlined'
                                                               size='small'/>
                                                )}
                                            />
                                            {errors.details?.contractInfo?.location && (
                                                <p>{errors.details.contractInfo?.location?.message}</p>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <FormControl fullWidth>
                                            <Typography>{t('Job.Salary')}</Typography>
                                            <Slider
                                                disableSwap
                                                marks={markssalary}
                                                min={0}
                                                max={100}
                                                value={salaryRange}
                                                valueLabelDisplay='auto'
                                                onChange={(_, newValue) => {
                                                    const [min, max] = newValue as [number, number]
                                                    if (max - min < minDistancesalary) {
                                                        if (min !== salaryRange[0]) {
                                                            setSalaryRange([max - minDistancesalary, max])
                                                        } else {
                                                            setSalaryRange([min, min + minDistancesalary])
                                                        }
                                                    } else {
                                                        setSalaryRange([min, max])
                                                    }
                                                }}
                                                aria-labelledby='salary-slider'
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3} sx={{mt: 2}}>
                                        <Controller
                                            name='details.contractInfo.currency'
                                            control={control}
                                            render={({field: {value, onChange}}) => (
                                                <FormControl fullWidth>
                                                    <InputLabel>{t('Currency')}</InputLabel>
                                                    <Select size='small' value={value} onChange={onChange}
                                                            label='Currency'>
                                                        {!isLoadingCurrency
                                                            ? CurrencyAmount?.map(res => (
                                                                <MenuItem key={res.id} value={res.value}>
                                                                    {res.value}
                                                                </MenuItem>
                                                            ))
                                                            : null}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <ViewAdditionalFile
                            id={editedData.id}
                            additionalFilesDetails={editedData?.additionalFiles}
                            onDataFromChild={handleDataFromChild}
                        />

                        <ShareJobDrawer
                            open={dialogShare}
                            setOpen={setDialogShare}
                            job={editedData}
                            setJob={setJobSharedInfo}
                        />
                        <TemplateJobDrawer
                            open={dialogSetTemplate}
                            setOpen={setDialogSetTemplate}
                            job={editedData}
                            handleRowOptionsClose={handleClose}
                        />
                    </form>
                </Grid>


                {showGeneratePPF &&
                    <GenerateDetail open={showGeneratePPF} setOpen={setShowGeneratePPF} id={editedData.id}/>}
            </Grid>
        </>
    ) : null
}

export default ViewJobOfferDrawer
