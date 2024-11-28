import React, {useCallback, useEffect, useState} from 'react'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import {QuizType} from 'quiz-shared/@core/types/quiz/quizTypes'
import {useTranslation} from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Card from '@mui/material/Card'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import TableHeader from 'template-shared/views/table/TableHeader'
import {useRouter} from 'next/router'
import AddQuizDrawer from '../../../views/apps/quiz/list/AddQuizDrawer'
import PlayQuizDialog from '../../../views/apps/quiz/play-quiz/PlayQuizDialog'
import localStorageKeys from '../../../configs/localeStorage'
import Chip from '@mui/material/Chip'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/system'
import QuizCard from '../../../views/apps/quiz/list/QuizCard'
import {format} from 'date-fns'
import Moment from 'react-moment'
import themeConfig from "../../../configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import PaginationCard from "../card-pagination";
import AccountApis from "ims-shared/@core/api/ims/account";
import QuizApis from "quiz-shared/@core/api/quiz/quiz";
import QuizCandidateApis from "quiz-shared/@core/api/quiz/candidate";

const CommonQuizList = () => {
    const {t} = useTranslation()
    const queryClient = useQueryClient()

    interface CellType {
        row: QuizType
    }

    const [value, setValue] = useState<string>('')
    const dataGridApiRef = React.useRef<GridApi>()
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    }, [])

    const [addQuizOpen, setAddQuizOpen] = useState<boolean>(false)
    const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
    const [paginationPage, setPaginationPage] = useState<number>(0)
    const [paginationModel, setPaginationModel] =
        useState<GridPaginationModel>({
                page: paginationPage,
                pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
                Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
                    Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
            }
        )

    const {data: countQuiz, isLoading: isLoadingCountQuiz} = useQuery(`countQuiz`, () => QuizApis(t).getQuizsCount())
    const toggleAddQuizDrawer = () => setAddQuizOpen(!addQuizOpen)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [selectedRowId, setSelectedRowId] = useState<number>(0)
    const [deleteCandidateDialogOpen, setDeleteCandidateDialogOpen] = useState<boolean>(false)
    const [selectedCandidateRowId, setSelectedCandidateRowId] = useState<number>(0)
    const [resetActiveSection, setResetActiveSection] = useState<boolean>(false)

    const {
        data: QuizList,
        isLoading
    } = useQuery(`quiz`, () => QuizApis(t).getQuizsByPage(paginationModel.page, paginationModel.pageSize))
    const router = useRouter()
    const [playQuizOpen, setPlayQuizOpen] = useState(false)
    const [quizCode, setQuizCode] = useState<string>('')

    const userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
    const [viewMode, setViewMode] = useState('auto')
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const renderViewBasedOnMode = () => {
        if (isMobile && viewMode === 'auto') {
            return cardView
        } else if (!isMobile && viewMode === 'auto') {
            return gridView
        } else if (viewMode === 'grid') {
            return gridView
        } else if (viewMode === 'card') {
            return cardView
        }
    }

    useEffect(() => {
        const getPage = localStorage.getItem(localStorageKeys.paginationSize)
        if (!getPage || Number(getPage) < 9) {
            localStorage.removeItem(localStorageKeys.paginationSize)
            localStorage.setItem(localStorageKeys.paginationSize, '20')
        } else {
            setPaginationModel({
                page: paginationPage,
                pageSize: Number(localStorage.getItem(localStorageKeys.paginationSize))
            })
        }
    }, [setPaginationModel])
    const toggleViewMode = () => {
        if (isMobile && viewMode === 'auto') {
            setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
        } else if (!isMobile && viewMode === 'auto') {
            setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
        } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
    }
    const handleOpenDeleteDialog = (id: number) => {
        setDeleteDialogOpen(true)
        setSelectedRowId(id)
    }

    const handleOpenDeleteCandidateDialog = (code: string) => {
        const quizExistx = quizCandidate?.find(candidate => candidate.quizCode === code)
        if (quizExistx !== undefined) {
            setDeleteCandidateDialogOpen(true)
            setSelectedCandidateRowId(quizExistx.id)
        }
    }
    const handleView = (id: number) => {
        router.push(`/apps/quiz/view/QuizView/${id}`)
    }
    const mutationDelete = useMutation({
        mutationFn: (id: number) => QuizApis(t).deleteQuizById(id),
        onSuccess: (id: number) => {
            console.log(id)
            if (id) {
                setDeleteDialogOpen(false)
                setResetActiveSection(true)

                const updatedItems = QuizList.filter(q => q.id !== id)
                queryClient.setQueryData('quiz', updatedItems)
            }
        },
        onError: err => {
            console.log(err)
        }
    })

    function onDelete(id: number) {
        mutationDelete.mutate(id)
    }

    function onDeleteCQ(id: number) {
        mutationDeleteCandidateQuiz.mutate(id)
    }

    const mutationStartQuizCandidate = useMutation({
        mutationFn: (data: {
            code: string;
            accountCode: string
        }) => QuizCandidateApis(t).quizCandidateStart(data.code, data.accountCode),
        onSuccess: (res: any) => {
            if (res) {
                queryClient.invalidateQueries('quizCandidate')
            }
        }
    })
    const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
        'profileUser',
        AccountApis(t).getAccountProfile
    )

    const {data: quizCandidate} = useQuery(['quizCandidate'], () => QuizCandidateApis(t).getQuizCandidates(), {})

    const handlePlayQuiz = (data: QuizType) => {
        const quizExist = quizCandidate?.find(candidate => candidate.quizCode === data.code && candidate.startDate !== null)

        if (quizExist === undefined || resetActiveSection) {
            mutationStartQuizCandidate.mutate({code: data.code, accountCode: userData.userName})
            setPlayQuizOpen(true)
            setQuizCode(data.code)
        } else {
            setPlayQuizOpen(true)
            setQuizCode(data.code)
        }
    }

    const mutationDeleteCandidateQuiz = useMutation({
        mutationFn: (id: number) => QuizCandidateApis(t).deleteQuizCandidateById(id),
        onSuccess: (id: number) => {
            if (id) {
                setDeleteCandidateDialogOpen(false)
                setResetActiveSection(true)
                queryClient.setQueryData<any[]>('quizCandidate', prevData => {
                    return prevData.filter(candidate => candidate.id !== id)
                })
            }
        }
    })

    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
        createDate: false,
        createdBy: false,
        updateDate: false,
        updatedBy: false
    })

    const defaultColumns: GridColDef[] = [
        /*Domain column*/
        {
            field: 'domain',
            headerName: t('domain') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
        },

        /*Code column*/
        {
            field: 'code',
            headerName: t('Code') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
        },

        /*Name column*/
        {
            field: 'name',
            headerName: t('Name') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
        },

        /*Category column*/
        {
            field: 'category',
            headerName: t('Category') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.category}</Typography>
        },

        /*Tags column*/
        {
            field: 'tags',
            headerName: t('Tags') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => (
                <Typography sx={{color: 'text.secondary'}}>
                    {row.tags.length > 0 && row.tags.map((el: string, index: number) => <Chip key={index} label={el}/>)}
                </Typography>
            )
        },

        /*Start date column*/
        {
            field: 'startDate',
            headerName: t('Quiz.Start_Date') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => (
                <Typography sx={{color: 'text.secondary'}}>
                    {row.startDate ? format(new Date(row.startDate), 'yy-MM-dd HH:mm') : null}
                </Typography>
            )
        },

        /*Submit date column*/
        {
            field: 'submitDate',
            headerName: t('Quiz.Submit_Date'),
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => (
                <Typography sx={{color: 'text.secondary'}}>
                    {row.submitDate ? format(new Date(row.submitDate), 'yy-MM-dd HH:mm') : null}
                </Typography>
            )
        },

        /*Score column*/
        {
            field: 'score',
            headerName: t('Quiz.Score') as string,
            type: 'string',
            flex: 1,
            renderCell: ({row}: CellType) => {
                const score = row.scale !== 0 ? Math.floor((row.score / row.scale) * 100) : null

                return <Typography sx={{color: 'text.secondary'}}>{score ? `${score} %` : null}</Typography>
            }
        },

        /*create Date column*/
        {
            field: 'createDate',
            minWidth: 140,
            flex: 0.15,
            headerName: t('AuditInfo.createDate') as string,
            renderCell: ({row}: CellType) => {
                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap sx={{color: 'text.secondary'}}>
                            <Moment format='DD-MM-YYYY'>{row.createDate}</Moment>
                        </Typography>
                    </Box>
                )
            }
        },

        /*createdBy column*/
        {
            field: 'createdBy',
            minWidth: 140,
            flex: 0.15,
            headerName: t('AuditInfo.createdBy') as string,
            renderCell: ({row}: CellType) => {
                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap sx={{color: 'text.secondary'}}>
                            {row.createdBy}
                        </Typography>
                    </Box>
                )
            }
        },

        /*Last update Date column*/
        {
            field: 'updateDate',
            flex: 0.15,
            minWidth: 140,
            headerName: t('AuditInfo.updateDate') as string,
            renderCell: ({row}: CellType) => {
                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap sx={{color: 'text.secondary'}}>
                            <Moment format='DD-MM-YYYY'>{row.updateDate}</Moment>
                        </Typography>
                    </Box>
                )
            }
        },

        /*updatedBy column*/
        {
            field: 'updatedBy',
            flex: 0.15,
            minWidth: 140,
            headerName: t('AuditInfo.updatedBy') as string,
            renderCell: ({row}: CellType) => {
                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap sx={{color: 'text.secondary'}}>
                            {row.updatedBy}
                        </Typography>
                    </Box>
                )
            }
        }
    ]

    const columns: GridColDef[] = [
        ...defaultColumns,
        {
            field: 'actions',
            headerName: '' as string,
            align: 'right',
            flex: 1,
            renderCell: ({row}: CellType) => {
                const foundCQ = quizCandidate?.find(
                    candidate => candidate.quizCode === row.code && candidate.startDate !== null
                )

                const candidateQuizExist = !!foundCQ

                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Tooltip title={t(row.description)}>
                            <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                <Icon icon='tabler:info-circle'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Action.Delete')}>
                            <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                                        onClick={() => handleOpenDeleteDialog(row.id)}>
                                <Icon icon='tabler:trash'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Action.Edit')}>
                            <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                                        onClick={() => handleView(row.id)}>
                                <Icon icon='fluent:slide-text-edit-24-regular'/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('Quiz.Play_Quiz')}>
                            <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                                        onClick={() => handlePlayQuiz(row)}>
                                <Icon icon='tabler:play'/>
                            </IconButton>
                        </Tooltip>
                        {candidateQuizExist ? (
                            <Tooltip title={t('reset')}>
                                <IconButton
                                    className={Styles.sizeIcon}
                                    sx={{color: 'text.secondary'}}
                                    onClick={() => handleOpenDeleteCandidateDialog(row.code)}
                                >
                                    <Icon icon='mynaui:undo'/>
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </Box>
                )
            }
        }
    ]

    const onChangePagination = async (item: any) => {
        if (item.pageSize !== paginationModel.pageSize) {
            setPaginationModel(item)
            localStorage.removeItem(localStorageKeys.paginationSize)
            localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
            const apiList = await QuizApis(t).getQuizsByPage(0, item.pageSize)
            queryClient.removeQueries('QuizList')
            queryClient.setQueryData('QuizList', apiList)
            setPaginationPage(0)
            setPaginationModel({page: 0, pageSize: item.pageSize})
            setDisabledNextBtn(false)
        }
    }

    const onChangePage = async (item) => {
        let newPagination: GridPaginationModel
        if (item === 'backIconButtonProps') {
            newPagination = {
                page: paginationModel.page - 1,
                pageSize: paginationModel.pageSize
            }
            const apiList = await QuizApis(t).getQuizsByPage(newPagination.page, newPagination.pageSize)
            if (apiList && apiList.length > 0) {
                queryClient.removeQueries('QuizList')
                queryClient.setQueryData('QuizList', apiList)
                setPaginationPage(newPagination.page)
                setPaginationModel(newPagination)
            }
            setDisabledNextBtn(false)
        } else if (item === 'nextIconButtonProps') {
            newPagination = {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize
            }
            const apiList = await QuizApis(t).getQuizsByPage(newPagination.page, newPagination.pageSize)
            if (apiList && apiList.length > 0) {
                queryClient.removeQueries('QuizList')
                queryClient.setQueryData('QuizList', apiList)
                setPaginationPage(newPagination.page)
                setPaginationModel(newPagination)
            } else {
                setDisabledNextBtn(true)
            }
        }

    }

    const gridView = (

        <Box className={Styles.boxTable}>
            <DataGrid
                getRowId={row => row.id}
                autoHeight
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={QuizList || []}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={onChangePagination}
                slotProps={{
                    pagination: {
                        count: countQuiz,
                        page: paginationPage,
                        labelDisplayedRows: ({page, count}) =>
                            `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`

                        ,
                        labelRowsPerPage: t('Rows_per_page'),
                        nextIconButtonProps: {
                            'onClick': () => onChangePage('nextIconButtonProps'),
                            disabled: disabledNextBtn || QuizList?.length < paginationModel.pageSize,

                        },
                        backIconButtonProps: {
                            'onClick': () => onChangePage('backIconButtonProps'),
                            disabled: paginationModel.page === 0,
                        }
                    },
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {debounceMs: 500}
                    }
                }}
                apiRef={dataGridApiRef}
            />
        </Box>

    )

    const cardView = (
        <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
            {QuizList &&
                Array.isArray(QuizList) &&
                QuizList.map((item, index) => {
                    return (
                        <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
                            <QuizCard
                                data={item}
                                onDeleteClick={handleOpenDeleteDialog}
                                onPlayQuiz={handlePlayQuiz}
                                onDeleteCandidateQuizClick={handleOpenDeleteCandidateDialog}
                                quizCandidate={quizCandidate}
                            />
                        </Grid>
                    )
                })}{' '}
            <PaginationCard paginationModel={paginationModel}
                            onChangePagination={onChangePagination}
                            paginationPage={paginationPage}
                            countList={countQuiz}
                            disabledNextBtn={disabledNextBtn}
                            ListLength={QuizList?.length}
                            onChangePage={onChangePage}
            />
        </Grid>
    )

    return !isLoading ? (
        <Grid container spacing={6.5}>
            <Grid item xs={12}>
                <Card>
                    <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
                        <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode}
                                           aria-label='text alignment'>
                            <ToggleButton value='grid' aria-label='left aligned'>
                                <Icon icon='ic:baseline-view-list'/>
                            </ToggleButton>
                            <ToggleButton value='card' aria-label='center aligned'>
                                <Icon icon='ic:baseline-view-module'/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <TableHeader
                        dataGridApi={dataGridApiRef}
                        value={value}
                        handleFilter={handleFilter}
                        toggle={toggleAddQuizDrawer}
                        permissionApplication={PermissionApplication.QUIZ}
                        permissionPage={PermissionPage.QUIZ}
                        permissionAction={PermissionAction.WRITE}
                    />
                    {renderViewBasedOnMode()}
                </Card>
            </Grid>

            {!isLoadingProfileUser && addQuizOpen &&
                <AddQuizDrawer open={addQuizOpen} domain={profileUser?.domain} toggle={toggleAddQuizDrawer}/>}

            <DeleteCommonDialog
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                selectedRowId={selectedRowId}
                item='Quiz'
                onDelete={onDelete}
            />

            <DeleteCommonDialog
                open={deleteCandidateDialogOpen}
                setOpen={setDeleteCandidateDialogOpen}
                selectedRowId={selectedCandidateRowId}
                item='CandidateQuiz'
                onDelete={onDeleteCQ}
            />
            <PlayQuizDialog
                open={playQuizOpen}
                setOpen={setPlayQuizOpen}
                quizCode={quizCode}
                resetActiveSection={resetActiveSection}
                setResetActiveSection={setResetActiveSection}
            />
        </Grid>
    ) : null
}

export default CommonQuizList
