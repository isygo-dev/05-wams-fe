import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import {JobOfferType} from 'rpm-shared/@core/types/rpm/jobOfferTypes'
import Typography from '@mui/material/Typography'
import AddJobDrawer from '../../../views/apps/job-offer/AddJobOfferDrawer'
import {useTranslation} from 'react-i18next'
import JobOfferTypeCard from '../../../views/apps/job-offer/JobOfferTypeCard'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {useTheme} from '@mui/system'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import WebOutlinedIcon from '@mui/icons-material/WebOutlined'
import TemplateJobDrawer from '../../../views/apps/job-offer/components/JobTemplateDrawer'
import GenerateDetail from '../../../views/apps/job-offer/GenerateDetail'
import TableHeader from 'template-shared/views/table/TableHeader'
import {format} from 'date-fns'
import Moment from 'react-moment'
import themeConfig from "template-shared/configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import JobOfferStatisticsContainer from "./statistics/JobOfferStatisticsContainer";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import JobOfferApis from "rpm-shared/@core/api/rpm/job-offer";
import JobOfferTemplateApis from "rpm-shared/@core/api/rpm/job-offer/template";
import AccountApis from "ims-shared/@core/api/ims/account";

interface CellType {
    row: JobOfferType
}

const CommonJobList = () => {
    const {t} = useTranslation()
    const queryClient = useQueryClient()
    const [paginationPage, setPaginationPage] = useState<number>(0)
    const [value, setValue] = useState<string>('')
    const [paginationModel, setPaginationModel] =
        useState<GridPaginationModel>({
                page: paginationPage,
                pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
                Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
                    Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
            }
        )
    const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
    const [addJobOpen, setAddJobOpen] = useState<boolean>(false)
    const [editedDataJobb, setEditDataJobb] = useState<JobOfferType>()
    const [dialogSetTemplate, setDialogSetTemplate] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<number | null>(null)
    const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>([])
    const [selectedRowId, setSelectedRowId] = useState<number>(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const {
        data: jobs,
        isLoading
    } = useQuery(`jobs`, () => JobOfferApis(t).getJobOffersByPage(paginationModel.page, paginationModel.pageSize))
    const {
        data: countJobs,
        isLoading: isLoadingCountJobs
    } = useQuery(`countJobs`, () => JobOfferApis(t).getJobOffersCount())
    const {
        data: template,
        isLoading: isLoadingTemplate
    } = useQuery(`jobTemplates`, () => JobOfferTemplateApis(t).getJobOfferTemplates())
    const [showGeneratePPF, setShowGeneratePPF] = useState<boolean>(false)
    const [idJobDetail, setIdJobDetail] = useState<number>(null)

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


    const toggleAddJobDrawer = () => setAddJobOpen(!addJobOpen)

    const handlePrint = (id: number) => {
        console.log('first click id', id)
        setShowGeneratePPF(true)
        setIdJobDetail(id)
        console.log('idJobDetail', idJobDetail)
    }

    const handleSetTemplate = (job: JobOfferType) => {
        console.log(job)
        setEditDataJobb(job)
        setDialogSetTemplate(true)
    }

    const jobMutationDelete = useMutation({
        mutationFn: (id: number) => JobOfferApis(t).deleteJobOffer(id),
        onSuccess: (id: number) => {
            if (id) {
                setDeleteDialogOpen(false)
                const updatedItems = ((queryClient.getQueryData('jobs') as any[]) || []).filter(item => item.id !== id)
                queryClient.setQueryData('jobs', updatedItems)
            }
        }
    })

    function onDelete(id: number) {
        jobMutationDelete.mutate(id)
    }

    const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>, row: JobOfferType) => {
        const newAnchorEls = [...anchorEls]
        newAnchorEls[row.id] = event.currentTarget
        setAnchorEls(newAnchorEls)
        setMenuOpen(row.id)
        setEditDataJobb(row)
    }

    const handleRowOptionsClose = () => {
        const newAnchorEls = [...anchorEls]
        newAnchorEls[selectedRowId] = null
        setAnchorEls(newAnchorEls)
        setMenuOpen(null)
    }

    function isTemplate(code: string): boolean {
        if (!Array.isArray(template) || template.length === 0) {
            return false
        }
        const foundObject = template.find(item => item.jobOffer && item.jobOffer.code === code)
        if (foundObject) {
            return true
        } else {
            return false
        }
    }

    const {
        data: profileUser,
        isLoading: isLoadingProfileUser
    } = useQuery('profileUser', AccountApis(t).getAccountProfile)
    const handleOpenDeleteDialog = (rowId: number) => {
        console.log(rowId)
        setDeleteDialogOpen(true), setSelectedRowId(rowId)
    }

    const router = useRouter()
    const handleViewIconClick = (row: JobOfferType) => {
        router.push(`/apps/jobOffer/view/${row.id}`)
    }

    const handleFilter = (val: string) => {
        setValue(val)
    }

    const [viewMode, setViewMode] = useState('auto')

    const toggleViewMode = () => {
        if (isMobile && viewMode === 'auto') {
            setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
        } else if (!isMobile && viewMode === 'auto') {
            setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
        } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
    }
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

    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
        createDate: false,
        createdBy: false,
        updateDate: false,
        updatedBy: false
    })

    const defaultColumns: GridColDef[] = [
        /*Domain column*/
        {
            flex: 0.1,
            field: 'domain',
            minWidth: 100,
            headerName: t('Domain.Domain') as string,
            renderCell: ({row}: CellType) => (
                <>
                    <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
                    {isTemplate(row.domain) ? (
                        <Badge badgeContent={'T'} color='primary'
                               sx={{ml: 4, verticalAlign: 'top', horizontalAlign: 'right'}}/>
                    ) : null}
                </>
            )
        },

        /*Code column*/
        {
            flex: 0.1,
            field: 'code',
            minWidth: 100,
            headerName: t('Code') as string,
            renderCell: ({row}: CellType) => (
                <>
                    <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
                    {isTemplate(row.code) ? (
                        <Badge badgeContent={'T'} color='primary'
                               sx={{ml: 4, verticalAlign: 'top', horizontalAlign: 'right'}}/>
                    ) : null}
                </>
            )
        },

        /*Title column*/
        {
            flex: 0.1,
            field: 'title',
            minWidth: 100,
            headerName: t('Job.Job_Title') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.title}</Typography>
        },

        /*Customer column*/
        {
            flex: 0.1,
            field: 'customer',
            minWidth: 100,
            headerName: t('Job.Customer') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.customer}</Typography>
        },

        /*Owner column*/
        {
            flex: 0.1,
            field: 'owner',
            minWidth: 100,
            headerName: t('Job.Owner') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.owner}</Typography>
        },

        /*DeadLine column*/
        {
            flex: 0.1,
            field: 'deadline',
            minWidth: 100,
            headerName: t('Job.Deadline') as string,
            renderCell: ({row}: CellType) => (
                <Typography sx={{color: 'text.secondary'}}>
                    {row.details?.jobInfo?.deadline && format(new Date(row.details?.jobInfo?.deadline), 'dd/MM/yyyy')}
                </Typography>
            )
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


    const onChangePagination = async (item: any) => {
        if (item.pageSize !== paginationModel.pageSize) {
            setPaginationModel(item)
            localStorage.removeItem(localStorageKeys.paginationSize)
            localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
            const apiList = await JobOfferApis(t).getJobOffersByPage(0, item.pageSize)
            queryClient.removeQueries('jobs')
            queryClient.setQueryData('jobs', apiList)
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
            const apiList = await JobOfferApis(t).getJobOffersByPage(newPagination.page, newPagination.pageSize)
            if (apiList && apiList.length > 0) {
                queryClient.removeQueries('jobs')
                queryClient.setQueryData('jobs', apiList)
                setPaginationPage(newPagination.page)
                setPaginationModel(newPagination)
            }
            setDisabledNextBtn(false)

        } else if (item === 'nextIconButtonProps') {

            newPagination = {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize

            }
            const apiList = await JobOfferApis(t).getJobOffersByPage(newPagination.page, newPagination.pageSize)
            if (apiList && apiList.length > 0) {

                queryClient.removeQueries('jobs')
                queryClient.setQueryData('jobs', apiList)
                setPaginationPage(newPagination.page)
                setPaginationModel(newPagination)
            } else {

                setDisabledNextBtn(true)
            }
        }

    }


    const dataGridApiRef = React.useRef<GridApi>()
    const columns: GridColDef[] = [
        ...defaultColumns,
        {
            flex: 0.1,
            minWidth: 140,
            sortable: false,
            field: 'actions',
            headerName: '' as string,
            align: 'right',
            renderCell: ({row}: CellType) => (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.DELETE) &&
                        <Tooltip title={t('Action.Delete') as string}>
                            <IconButton onClick={() => handleOpenDeleteDialog(row.id)}
                                        className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                <Icon icon='tabler:trash'/>
                            </IconButton>
                        </Tooltip>}
                    <Tooltip title={t('Action.Edit')}>
                        <IconButton
                            className={Styles.sizeIcon}
                            component={Link}
                            sx={{color: 'text.secondary'}}
                            href={`/apps/jobOffer/view/${row.id}`}
                        >
                            <Icon icon='fluent:slide-text-edit-24-regular'/>
                        </IconButton>
                    </Tooltip>
                    {isTemplate(row.code) ? (
                        checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.READ) &&
                        <Tooltip
                            title={t('Action.View') as string}
                            onClick={() => {
                                handlePrint(row.id)
                            }}
                        >
                            <IconButton
                                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                <Icon icon='fluent:eye-lines-48-filled'/>
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    {!isTemplate(row.code) && (
                        <IconButton
                            aria-controls={`menu-actions-${row.id}`}
                            aria-haspopup='true'
                            onClick={event => handleRowOptionsClick(event, row)}

                            className={Styles.sizeIcon}
                            sx={{color: 'text.secondary'}}
                        >
                            <Icon icon='tabler:dots-vertical'/>
                        </IconButton>
                    )}


                    <Menu
                        className={Styles.sizeListItem}
                        key={`menu-actions-${row.id}`}
                        anchorEl={anchorEls[row.id]}
                        open={row.id === menuOpen}
                        onClose={handleRowOptionsClose}
                    >

                        {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER_TEMPLATE, PermissionAction.WRITE) &&
                            <MenuItem
                                onClick={() => {
                                    handleSetTemplate(row)
                                }}
                            >
                                <Tooltip title={t('Mark as Template') as string}>
                                    <IconButton
                                        className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                        <WebOutlinedIcon/>
                                    </IconButton>
                                </Tooltip>
                                {t('Mark as Template') as string}
                            </MenuItem>}
                        <MenuItem
                            onClick={() => {
                                handlePrint(row.id)
                            }}
                        >
                            <Tooltip title={t('Action.View') as string}>
                                <IconButton
                                    className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                    <Icon icon='fluent:eye-lines-48-filled'/>
                                </IconButton>
                            </Tooltip>
                            {t('Action.View') as string}
                        </MenuItem>
                    </Menu>
                </Box>
            )
        }
    ]
    const gridView = (
        <Box className={Styles.boxTable}>
            <DataGrid
                autoHeight
                pagination

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={jobs || []}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}

                paginationModel={paginationModel}
                onPaginationModelChange={onChangePagination}

                slotProps={{

                    pagination: {

                        count: countJobs,
                        page: paginationPage,
                        labelDisplayedRows: ({page, count}) =>
                            `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`

                        ,
                        labelRowsPerPage: t('Rows_per_page'),
                        nextIconButtonProps: {
                            'onClick': () => onChangePage('nextIconButtonProps'),
                            disabled: disabledNextBtn || jobs?.length < paginationModel.pageSize,

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
        <Grid container spacing={3} sx={{padding: '15px'}}>
            {jobs &&
                Array.isArray(jobs) &&
                jobs.map((item, index) => {
                    return (
                        <Grid key={index} item xs={12} md={6} lg={4}>
                            <JobOfferTypeCard data={item}
                                              onDeleteClick={handleOpenDeleteDialog}
                                              onViewClick={handleViewIconClick}
                                              isTemplate={isTemplate}
                                              handlePrint={handlePrint}
                                              handleRowOptionsClick={handleRowOptionsClick}
                                              anchorEls={anchorEls}
                                              menuOpen={menuOpen}
                                              handleRowOptionsClose={handleRowOptionsClose}
                                              handleSetTemplate={handleSetTemplate}

                            />
                        </Grid>
                    )
                })}
        </Grid>
    )

    return !isLoading && !isLoadingTemplate && !isLoadingCountJobs ? (
        <>
            <JobOfferStatisticsContainer/>
            <Grid container>
                <Grid item md={12}>
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
                            value={value}
                            handleFilter={handleFilter}
                            toggle={toggleAddJobDrawer}
                            dataGridApi={dataGridApiRef}
                            permissionApplication={PermissionApplication.RPM}
                            permissionPage={PermissionPage.JOB_OFFER}
                            permissionAction={PermissionAction.WRITE}
                        />
                        {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.READ) && renderViewBasedOnMode()}

                        {!isLoadingProfileUser && checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                            (<AddJobDrawer open={addJobOpen} toggle={toggleAddJobDrawer}
                                           domain={profileUser?.domain}/>)}

                        {checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.DELETE) &&
                            <DeleteCommonDialog
                                open={deleteDialogOpen}
                                setOpen={setDeleteDialogOpen}
                                selectedRowId={selectedRowId}
                                item='Job'
                                onDelete={onDelete}
                            />}
                        {dialogSetTemplate && checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) && (
                            <TemplateJobDrawer
                                open={dialogSetTemplate}
                                setOpen={setDialogSetTemplate}
                                job={editedDataJobb}
                                handleRowOptionsClose={handleRowOptionsClose}
                            />
                        )}

                        {showGeneratePPF && checkPermission(PermissionApplication.RPM, PermissionPage.JOB_OFFER, PermissionAction.WRITE) &&
                            <GenerateDetail open={showGeneratePPF} setOpen={setShowGeneratePPF} id={idJobDetail}/>}

                    </Card>
                </Grid>
            </Grid>
        </>
    ) : null
}

export default CommonJobList
