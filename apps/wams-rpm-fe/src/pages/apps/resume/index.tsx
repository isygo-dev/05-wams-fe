import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import AddResumeDrawer from '../../../views/apps/resume/list/AddResumeDrawer'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ResumeCard from '../../../views/apps/resume/list/ResumeCard'
import { DialogContent, DialogContentText, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import rpmApiUrls from 'rpm-shared/configs/rpm_apis'
import { useTheme } from '@mui/system'
import useMediaQuery from '@mui/material/useMediaQuery'
import ResumeDialog from '../../../views/apps/resume/list/ResumeDialog'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import TableHeader from 'template-shared/views/table/TableHeader'
import Moment from 'react-moment'
import Styles from 'template-shared/style/style.module.css'
import themeConfig from 'template-shared/configs/themeConfig'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import ResumeStatisticsContainer from './statistics/resumeStatisticsContainer'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps'
import localStorageKeys from 'template-shared/configs/localeStorage'
import PaginationCard from 'template-shared/@core/components/card-pagination'
import AccountApis from 'ims-shared/@core/api/ims/account'
import ResumeApis from 'rpm-shared/@core/api/rpm/resume'
import { MiniResume, ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import ApplicationjobOffer from 'rpm-shared/@core/components/common-resume-view/list/ApplicationJob'
import ShareDrawer from 'rpm-shared/@core/components/common-resume-view/list/ShareDrawer'

interface CellType {
  row: MiniResume
}

const ResumeList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: paginationPage,
    pageSize:
      localStorage.getItem(localStorageKeys.paginationSize) &&
      Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9
        ? Number(localStorage.getItem(localStorageKeys.paginationSize))
        : 20
  })
  const [addResumeOpen, setAddResumeOpen] = useState<boolean>(false)
  const [applicationJobOpen, setApplicationJobOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [selectedResume, setSelectedResume] = useState<ResumeTypes | undefined>(undefined)
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [resume, setResume] = useState<ResumeTypes>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmCreation, setConfirmCreation] = useState(false)
  const [selectedResumeForAccount, setSelectedResumeForAccount] = useState<ResumeTypes | null>(null)

  const { data: resumes, isLoading } = useQuery(`resumes`, () =>
    ResumeApis(t).getResumesByPage(paginationModel.page, paginationModel.pageSize)
  )
  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const { data: countResume, isLoading: isLoadingCountResume } = useQuery(`countResume`, () =>
    ResumeApis(t).getResumesCount()
  )

  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  useEffect(() => {
    ResumeApis(t).getResumes()
    if (confirmCreation) {
      ResumeApis(t).getResumes()
      setConfirmCreation(false)
    }
  }, [confirmCreation])

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

  const defaultColumns: GridColDef[] = [
    /*Photo column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 0.1,
      minWidth: 100,
      renderCell: ({ row }: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={row.imagePath ? `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${row.id}` : undefined}
          alt={row.code}
        />
      )
    },

    /*Domain column*/
    {
      flex: 0.1,
      field: 'domain',
      minWidth: 100,
      headerName: t('Domain.Domain') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },

    /*Code column*/
    {
      flex: 0.1,
      field: 'code',
      minWidth: 100,
      headerName: t('Code') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
    },
    {
      flex: 0.1,
      field: 'code Account',
      minWidth: 100,
      headerName: t('Code Account') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.codeAccount}</Typography>
    },

    /*First name column*/
    {
      flex: 0.1,
      field: 'firstName',
      minWidth: 100,
      headerName: t('Full_Name') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.firstName} {row.lastName}{' '}
        </Typography>
      )
    },

    /*Title column*/
    {
      flex: 0.1,
      field: 'title',
      minWidth: 100,
      headerName: t('Resume.Title') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.title}</Typography>
    },

    /*Email column*/
    {
      flex: 0.1,
      field: 'email',
      minWidth: 100,
      headerName: t('Email') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.email}</Typography>
    },

    /*Phone column*/
    {
      flex: 0.1,
      field: 'Phone',
      minWidth: 100,
      headerName: t('Phone_Number') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.phone}</Typography>
    },

    /*create Date column*/
    {
      field: 'createDate',
      minWidth: 140,
      flex: 0.15,
      headerName: t('AuditInfo.createDate') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
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
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
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
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
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
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.updatedBy}
            </Typography>
          </Box>
        )
      }
    }
  ]

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }

  const toggleJobApplicationDrawer = () => setApplicationJobOpen(!applicationJobOpen)
  const toggleAddResumeDrawer = () => setAddResumeOpen(!addResumeOpen)
  const router = useRouter()

  const handleViewIconClick = (row: MiniResume) => {
    router.push(`/apps/resume/view/${row.id}`)
  }

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
    const newAnchorEls = [...anchorEls]
    newAnchorEls[rowId] = event.currentTarget // Set anchor element for this row
    setAnchorEls(newAnchorEls)
    setMenuOpen(rowId)
  }

  const handleRowOptionsClose = () => {
    const newAnchorEls = [...anchorEls]
    newAnchorEls[selectedRowId] = null // Clear anchor element for this row
    setAnchorEls(newAnchorEls)
    setMenuOpen(null)
  }

  const handelOpenApplication = (data: ResumeTypes) => {
    setApplicationJobOpen(true)
    setSelectedResume(data)
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

  const downloadResumeMutation = useMutation({
    mutationFn: (data: { id: number; originalFileName: string }) => ResumeApis(t).downloadResumeFile(data),
    onSuccess: () => {}
  })

  function onDownload(row) {
    downloadResumeMutation.mutate({ id: row.id, originalFileName: row.originalFileName })
  }

  const [dialogShare, setDialogShare] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('auto')

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const handleFilter = (val: string) => {
    setValue(val)
    if (val.trim() === '') {
    } else {
      const resumesCopie = [...resumes]
      const filtered = resumesCopie.filter(
        row =>
          row.firstName.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.lastName.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.email.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.phone.toLowerCase().includes(val.trim().toLowerCase())
      )
      if (filtered) {
        console.log(filtered)
      }
    }
  }

  const handleShare = (resume: ResumeTypes) => {
    // Add logic here to handle sharing
    setResume(resume)
    console.log('Share button clicked')
    setDialogShare(true)
    handleRowOptionsClose()
  }

  const setResumeSharedInfo = () => {}

  const composeEmailHandler = (row: ResumeTypes) => {
    const mailtoLink = `mailto:${row.email}?subject=${encodeURIComponent(
      'Regarding Your Resume'
    )}&body=${encodeURIComponent(
      'Dear ' +
        row.firstName +
        ',\n\nI am interested in your resume and would like to discuss further. Please let me know your availability for a call or meeting.\n\nBest regards,\n'
    )}`
    window.location.href = mailtoLink
  }

  const [previewOpen, setPreviewOpen] = useState(false)

  const [resumePreview, setResumePreview] = useState<MiniResume>()

  const handleFilePreview = (data: MiniResume) => {
    // getResumeUrlMutation.mutate(data)
    setResumePreview(data)
    setPreviewOpen(true)
  }

  const closeFilePreview = () => {
    setPreviewOpen(false)
  }

  const resumeMutationDelete = useMutation({
    mutationFn: (id: number) => ResumeApis(t).deleteResume(id),
    onSuccess: (id: number) => {
      setDeleteDialogOpen(false)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems = ((queryClient.getQueryData('resumes') as any[]) || []).filter(item => item.id !== id)
        queryClient.setQueryData('resumes', updatedItems)
      }
    }
  })

  const createAccountMutation = useMutation({
    mutationFn: async (row: ResumeTypes) => {
      try {
        const response = await ResumeApis(t).addResumeAccount(row)
        setConfirmCreation(true) // Set confirmCreation to true on success
        console.log(confirmCreation)
        console.log('Account created successfully!', response)
        queryClient.invalidateQueries(['resumes'])
      } catch (error) {
        console.error('Error creating account:', error)
      }
    }
  })

  const onCreateAccount = (resume: ResumeTypes) => {
    setSelectedResumeForAccount(resume)
    setConfirmDialogOpen(true)
  }

  function onDelete(id: number) {
    resumeMutationDelete.mutate(id)
  }

  const handleCreateAccountConfirmation = () => {
    if (selectedResumeForAccount) {
      createAccountMutation.mutate(selectedResumeForAccount)
      setConfirmDialogOpen(false)
    }
  }

  const dataGridApiRef = React.useRef<GridApi>()

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 200,
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete') as string}>
              <IconButton
                onClick={() => handleOpenDeleteDialog(row.id)}
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('Action.Download') as string}>
            <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }} onClick={() => onDownload(row)}>
              <Icon icon='material-symbols:download' />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('Action.Edit')}>
            <IconButton
              className={Styles.sizeIcon}
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/apps/resume/view/${row.id}`}
            >
              <Icon icon='fluent:slide-text-edit-24-regular' />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('Action.Preview') as string}>
            <IconButton
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
              onClick={() => handleFilePreview(row)}
            >
              <Icon icon='solar:document-bold' />
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE) && (
            <IconButton
              aria-controls={`menu-actions-${row.id}`}
              aria-haspopup='true'
              onClick={event => handleRowOptionsClick(event, row.id)}
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
            >
              <Icon icon='tabler:dots-vertical' />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await ResumeApis(t).getResumesByPage(0, item.pageSize)
      queryClient.removeQueries('resumes')
      queryClient.setQueryData('resumes', apiList)
      setPaginationPage(0)
      setPaginationModel({ page: 0, pageSize: item.pageSize })
      setDisabledNextBtn(false)
    }
  }

  const onChangePage = async item => {
    let newPagination: GridPaginationModel
    if (item === 'backIconButtonProps') {
      newPagination = {
        page: paginationModel.page - 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await ResumeApis(t).getResumesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('resumes')
        queryClient.setQueryData('resumes', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await ResumeApis(t).getResumesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('resumes')
        queryClient.setQueryData('resumes', apiList)
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
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={resumes || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}
        slotProps={{
          pagination: {
            count: countResume,
            page: paginationPage,
            labelDisplayedRows: ({ page, count }) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,

            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              onClick: () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || resumes?.length < paginationModel.pageSize
            },
            backIconButtonProps: {
              onClick: () => onChangePage('backIconButtonProps'),
              disabled: paginationModel.page === 0
            }
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 }
          }
        }}
        apiRef={dataGridApiRef}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{ mb: 2, padding: '15px' }}>
      {resumes &&
        Array.isArray(resumes) &&
        resumes.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <ResumeCard
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                onRowOptionsClick={handleRowOptionsClick}
                onViewClick={handleViewIconClick}
                onDownloadClick={onDownload}
                onPreviewClick={handleFilePreview}
              />
            </Grid>
          )
        })}
      <PaginationCard
        paginationModel={paginationModel}
        onChangePagination={onChangePagination}
        paginationPage={paginationPage}
        countList={countResume}
        disabledNextBtn={disabledNextBtn}
        ListLength={resumes?.length}
        onChangePage={onChangePage}
      />
    </Grid>
  )

  return !isLoading && !isLoadingCountResume ? (
    <>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
      >
        <DialogTitle id='confirm-dialog-title'>{t('Confirm Account Creation')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
            {t('Are you sure you want to create an account for this resume?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color='primary'>
            {t('Cancel')}
          </Button>
          <Button onClick={handleCreateAccountConfirmation} color='primary' autoFocus>
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <ResumeStatisticsContainer />

      <Grid container>
        <Grid item md={12}>
          <Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: 2 }}>
              <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
                <ToggleButton value='grid' aria-label='left aligned'>
                  <Icon icon='ic:baseline-view-list' />
                </ToggleButton>
                <ToggleButton value='card' aria-label='center aligned'>
                  <Icon icon='ic:baseline-view-module' />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddResumeDrawer}
              dataGridApi={dataGridApiRef}
              permissionApplication={PermissionApplication.RPM}
              permissionPage={PermissionPage.RESUME}
              permissionAction={PermissionAction.WRITE}
            />
            {resumes?.map(row => (
              <div key={`menu-container-${row.id}`}>
                <Menu
                  className={Styles.sizeListItem}
                  key={`menu-actions-${row.id}`}
                  anchorEl={anchorEls[row.id]}
                  open={row.id === menuOpen}
                  onClose={handleRowOptionsClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleRowOptionsClose() // Close the menu
                      handelOpenApplication(row) // Open the job application
                    }}
                  >
                    <Tooltip title={t('Action.Apply')}>
                      <IconButton size='small' sx={{ color: 'text.secondary' }}>
                        <Icon icon='iconoir:post' />
                      </IconButton>
                    </Tooltip>
                    {t('Apply') as string}
                  </MenuItem>
                  <MenuItem onClick={() => handleShare(row)}>
                    <Tooltip title={t('Action.Share')}>
                      <IconButton size='small' sx={{ color: 'text.secondary' }}>
                        <Icon icon='tabler:share' />
                      </IconButton>
                    </Tooltip>
                    {t('Action.Share') as string}
                  </MenuItem>
                  <MenuItem onClick={() => composeEmailHandler(row)}>
                    <Tooltip title={t('Action.Email') as string}>
                      <IconButton size='small' sx={{ color: 'text.secondary' }}>
                        <Icon icon='material-symbols:mail' />
                      </IconButton>
                    </Tooltip>
                    {t('Email') as string}
                  </MenuItem>
                  {row?.codeAccount == null && (
                    <MenuItem onClick={() => onCreateAccount(row)}>
                      <Tooltip title={t('Action.Link Account')}>
                        <IconButton size='small' sx={{ color: 'text.secondary' }}>
                          <Icon icon='tabler:user-check' />
                        </IconButton>
                      </Tooltip>
                      {t('Link to account')}
                    </MenuItem>
                  )}
                </Menu>
              </div>
            ))}
            {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.READ) &&
              renderViewBasedOnMode()}
            {!isLoadingProfileUser &&
              checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE) && (
                <AddResumeDrawer domain={profileUser?.domain} open={addResumeOpen} toggle={toggleAddResumeDrawer} />
              )}
            {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.DELETE) && (
              <DeleteCommonDialog
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                selectedRowId={selectedRowId}
                onDelete={onDelete}
                item='Resume'
              />
            )}
            {applicationJobOpen &&
              checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE) && (
                <ApplicationjobOffer
                  open={applicationJobOpen}
                  toggle={toggleJobApplicationDrawer}
                  code={selectedResume?.code}
                  email={selectedResume?.email}
                />
              )}
          </Card>
        </Grid>
        {dialogShare && checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE) && (
          <ShareDrawer open={dialogShare} setOpen={setDialogShare} resume={resume} setResume={setResumeSharedInfo} />
        )}
        {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.READ) && previewOpen && (
          <ResumeDialog open={previewOpen} onCloseClick={closeFilePreview} resumePreview={resumePreview} />
        )}
      </Grid>
    </>
  ) : null
}

export default ResumeList
