import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {MuiChipsInput} from 'mui-chips-input'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {LevelType, QuizType} from 'quiz-shared/@core/types/quiz/quizTypes'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {InputLabel} from '@mui/material'
import AnnexApis from 'ims-shared/@core/api/ims/annex'
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import Tooltip from "@mui/material/Tooltip";
import DomainApis from "ims-shared/@core/api/ims/domain";
import QuizApis from "quiz-shared/@core/api/quiz/quiz";

const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    category: yup.string().required(),
    tags: yup.array().required(),
    level: yup.string(),
    domain: yup.string().required(),
})

interface SidebarAddQuizType {
    open: boolean
    toggle: () => void
    domain: string
}

const SidebarAddQuiz = (props: SidebarAddQuizType) => {
    const {t} = useTranslation()
    const queryClient = useQueryClient()
    const {open, toggle, domain} = props
    const {data: quizCategory} = useQuery('quizCategory', () => AnnexApis(t).getAnnexByTableCode(IEnumAnnex.QUIZ_CATEGORY))
    const mutationAdd = useMutation({
        mutationFn: (data: QuizType) => QuizApis(t).addQuiz(data),
        onSuccess: (res: QuizType) => {
            handleClose()
            const cachedData: [] = queryClient.getQueryData('quiz') || []
            const updatedData: any = [...cachedData]
            updatedData.push(res)
            queryClient.setQueryData('quiz', updatedData)
        },
        onError: err => {
            console.log(err)
        }
    })
    const {data: domainList, isLoading: isLoadingDomain} = useQuery('domains', DomainApis(t).getDomains)
    const onSubmit = async (data: QuizType) => {
        console.log('data', data)
        mutationAdd.mutate(data)
    }

    let defaultValues: QuizType = {
        name: '',
        description: '',
        category: '',
        tags: [],
        level: '',
        domain: domain
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const handleClose = () => {
        defaultValues = {
            name: '',
            description: '',
            category: '',
            tags: [],
            level: '',
            domain: domain
        }
        toggle()
        reset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{keepMounted: true}}
            sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
        >
            <Header>
                <Typography variant='h6'>{t('Quiz.Add_Quiz')}</Typography>
                <IconButton
                    size='small'
                    onClick={handleClose}
                    sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
                >
                    <Icon icon='tabler:x' fontSize='1.125rem'/>
                </IconButton>
            </Header>
            <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
                <form
                    onSubmit={handleSubmit(row => {
                        onSubmit(row)
                    })}
                >
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
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
                                    onChange={onChange}
                                    value={value}
                                >
                                    {!isLoadingDomain && domainList?.length > 0
                                        ? domainList?.map((domain: DomainType) => (
                                            <MenuItem key={domain.id} value={domain.name}>
                                                {domain.name}
                                            </MenuItem>
                                        ))
                                        : null}
                                </Select>
                            )}
                        />
                        {errors.domain &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <Controller
                            name='name'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    size='small'
                                    value={value}
                                    id='form-props-read-only-input-name'
                                    InputProps={{readOnly: false}}
                                    label={t('Name')}
                                    onChange={onChange}
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 4}}>
                        <Controller
                            name='description'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    size='small'
                                    value={value}
                                    id='form-props-read-only-input-description'
                                    multiline
                                    rows={3}
                                    InputProps={{readOnly: false}}
                                    label={t('Description')}
                                    onChange={onChange}
                                    error={Boolean(errors.description)}
                                />
                            )}
                        />
                        {errors.description && (
                            <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Category')}</InputLabel>
                        <Controller
                            name='category'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <Tooltip title="ANNEX / QIZCAT">
                                    <Select
                                        size='small'
                                        label={t('Category')}
                                        value={value}
                                        onChange={onChange}
                                        error={Boolean(errors.category)}
                                    >
                                        {quizCategory &&
                                            quizCategory?.map(res => (
                                                <MenuItem key={res.id} value={res.value}>
                                                    {res.value}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </Tooltip>
                            )}
                        />
                        {errors.category &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.category.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 4}}>
                        <Controller
                            name='tags'
                            control={control}
                            render={({field: {value, onChange}}) => (
                                <MuiChipsInput
                                    size='small'
                                    value={Array.isArray(value) ? value : []}
                                    onChange={newTags => onChange(newTags)}
                                    label='Tags'
                                    error={Boolean(errors.tags)}
                                />
                            )}
                        />
                        {errors.tags &&
                            <FormHelperText sx={{color: 'error.main'}}>{errors.tags.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Level')}</InputLabel>
                        <Controller
                            name='level'
                            control={control}
                            rules={{required: false}}
                            render={({field: {value, onChange}}) => (
                                <Select size='small' value={value} onChange={onChange} label='Level'>
                                    <MenuItem value={LevelType.BEGINNER}>{t('Beginner')}</MenuItem>
                                    <MenuItem value={LevelType.INTERMEDIATE}>{t('Intermediate')}</MenuItem>
                                    <MenuItem value={LevelType.CONFIRMED}>{t('Confirmed')}</MenuItem>
                                    <MenuItem value={LevelType.EXPERT}>{t('Expert')}</MenuItem>
                                </Select>
                            )}
                        />
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

export default SidebarAddQuiz
