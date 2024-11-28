import React, {useCallback, useEffect, useState} from 'react'
import {
  Avatar,
  Box,
  Card,
  Grid,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Styles from "template-shared/style/style.module.css"
import Icon from 'template-shared/@core/components/icon'
import CustomChip from 'template-shared/@core/components/mui/chip'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import imsApiUrls from "ims-shared/configs/ims_apis"
import {useTheme} from '@mui/material/styles'
import AccountCard from '../../../views/apps/account/AccountCard'
import UpdateAdminStatusDialog
  from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import AddAccountDrawer from '../../../views/apps/account/AddAccountDrawer'
import TableHeader from 'template-shared/views/table/TableHeader'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import Moment from 'react-moment'
import UpdateIsAdminDialog from 'template-shared/@core/components/common-update-is-admin/UpdateIsAdminDialog'
import themeConfig from 'template-shared/configs/themeConfig'
import AccountStatisticsContainer from "./accountStatistic/AccountStatisticsContainer";
import LockResetIcon from '@mui/icons-material/LockReset';
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import PaginationCard from "template-shared/@core/components/card-pagination";
import AccountApis from "ims-shared/@core/api/ims/account";
import {AccountDto, systemStatusObj} from "ims-shared/@core/types/ims/accountTypes";

interface CellType {
  row: AccountDto
}

const AccountList = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [value, setValue] = useState<string>('')
  const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const [newStatusIsAdmin, setNewStatusIsAdmin] = useState<boolean>(false)
  const [updateIsAdminDialogOpen, setUpdateIsAdminDialogOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('auto')
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dataGridApiRef = React.useRef<GridApi>()

  const {
    data: accounts,
    isLoading
  } = useQuery('accounts', () => AccountApis(t).getAccountsByPage(paginationModel.page, paginationModel.pageSize))

  const {
    data: accountsCount,
    isLoading: isLoadingCount
  } = useQuery('accountsCount', () => AccountApis(t).getAccountsCount())

  const mutationDelete = useMutation({
    mutationFn: (id: number) => AccountApis(t).deleteAccountById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: AccountDto[] =
          (queryClient.getQueryData('accounts') as AccountDto[])?.filter((item: AccountDto) => item.id !== id) ||
          []
        queryClient.setQueryData('accounts', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
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

  const handleResendEmailCreation = (id: number) => {
    mutationResendEmail.mutate(id)
  }

  const mutationResendEmail = useMutation({
    mutationFn: (id: number) => AccountApis(t).resendAccountCredentialsEmail(id)
  })

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(!status)
  }

  const handleOpenUpdateIsAdmin = (rowId: number, status: boolean) => {
    setUpdateIsAdminDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatusIsAdmin(status)
  }

  const handleClickView = (id: number) => {
    router.push(`/apps/ims-account/view/account/${id}`)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    origin: false,
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const defaultColumns: GridColDef[] = [
    /*Photo column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      flex: 0.15,
      minWidth: 100,
      renderCell: ({row}: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={
            row.imagePath !== 'defaultPhoto.jpg' ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${row.id}` : ''
          }
          alt={row.accountDetails?.firstName}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      flex: 0.15,
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },

    /*User Name column*/
    {
      field: 'username',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Username') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.code}
            </Typography>
          </Box>
        )
      }
    },

    /*Full Name column*/
    {
      field: 'fullName',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Employee.Full_Name') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.accountDetails.firstName} {row.accountDetails.lastName}
            </Typography>
          </Box>
        )
      }
    },

    /*Email column*/
    {
      field: 'email',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Email') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.email}
          </Typography>
        )
      }
    },

    /*Func. Role column*/
    {
      field: 'Function role',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Role.Functional_Role') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.functionRole}
          </Typography>
        )
      }
    },

    /*Is Admin column*/
    {
      field: 'isAdmin',
      minWidth: 140,
      flex: 0.15,
      headerName: t('IsAdmin') as string,
      renderCell: ({row}: CellType) => {
        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={row.isAdmin}
                      onChange={e => handleOpenUpdateIsAdmin(row.id, e.target.checked)}/>
            ) : (
              <Switch size={'small'} checked={row.isAdmin} readOnly={true}/>
            )}
          </>
        )
      }
    },

    /*Last login date column*/
    {
      field: 'loginDate',
      flex: 0.15,
      minWidth: 155,
      sortable: false,
      headerName: t('lastLoginDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary', fontSize: '14px'}}>
              {row.connectionTracking && row.connectionTracking?.length > 0 ? (
                <Moment format='DD-MM-YYYY HH:mm:ss'>
                  {row.connectionTracking?.length > 0 ? row.connectionTracking[0]?.loginDate : '-'}
                </Moment>
              ) : null}
            </Typography>
          </Box>
        )
      }
    },

    /*Admin status column*/
    {
      field: 'adminStatus',
      flex: 0.15,
      minWidth: 150,
      headerName: t('Admin_Status') as string,
      renderCell: ({row}: CellType) => {
        const status = row.adminStatus === 'ENABLED'

        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={status}
                      onChange={() => handleOpenUpdateStatusDialog(row.id ?? 0, status)}/>
            ) : (
              <Switch size={'small'} checked={status}/>
            )}
          </>
        )
      }
    },

    /*System status column*/
    {
      field: 'systemStatus',
      flex: 0.15,
      minWidth: 170,
      headerName: t('System_status') as string,
      renderCell: ({row}: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            className={Styles.sizeCustomChip}
            label={row.systemStatus}
            color={systemStatusObj[row.systemStatus as string]}

          />
        )
      }
    },

    /*Origin column*/
    {
      flex: 0.15,
      field: 'origin',
      minWidth: 140,
      headerName: t('Origin') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.origin}
            </Typography>
          </Box>
        )
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
  const toggleAddAccountDrawer = () => setAddAccountOpen(!addAccountOpen)
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )


  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      flex: 0.15,
      minWidth: 150,
      sortable: false,
      headerName: '' as string,
      align: 'right',
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.DELETE) ? (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id ?? 0)}
              >
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          ) : null}

          {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT_DETAIL, PermissionAction.WRITE) ? (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => {
                  row.id && handleClickView(row.id)
                }}
              >
                <Icon icon='fluent:slide-text-edit-24-regular'/>
              </IconButton>
            </Tooltip>
          ) : null}

          {checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) ? (
            <Tooltip title={t('Action.ResetPassword')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => {
                  row.id && handleResendEmailCreation(row.id)
                }}
              >
                <LockResetIcon/>
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      )
    }
  ]

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await AccountApis(t).getAccountsByPage(0, item.pageSize)
      queryClient.removeQueries('accounts')
      queryClient.setQueryData('accounts', apiList)
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
      const apiList = await AccountApis(t).getAccountsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('accounts')
        queryClient.setQueryData('accounts', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await AccountApis(t).getAccountsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('accounts')
        queryClient.setQueryData('accounts', apiList)
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
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        autoHeight
        rows={accounts || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}
        slotProps={{
          pagination: {
            count: accountsCount,
            page: paginationPage,
            labelDisplayedRows: ({page, count}) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,
            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              'onClick': () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || accounts?.length < paginationModel.pageSize,
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
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {accounts &&
        Array.isArray(accounts) &&
        accounts.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <AccountCard
                handleResendEmailCreation={handleResendEmailCreation}
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                imageUrl={imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}
                onSwitchStatus={handleOpenUpdateStatusDialog}
                onViewClick={handleClickView}
              />
            </Grid>
          )
        })}

      <PaginationCard paginationModel={paginationModel}
                      onChangePagination={onChangePagination}
                      paginationPage={paginationPage}
                      countList={accountsCount}
                      disabledNextBtn={disabledNextBtn}
                      ListLength={accounts?.length}
                      onChangePage={onChangePage}
      />
    </Grid>
  )

  return !isLoading && !isLoadingCount ? (
    <>
      <AccountStatisticsContainer/>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
              <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
                <ToggleButton value='grid' aria-label='left aligned'>
                  <Icon icon='ic:baseline-view-list'/>
                </ToggleButton>
                <ToggleButton value='card' aria-label='center aligned'>
                  <Icon icon='ic:baseline-view-module'/>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TableHeader
              dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddAccountDrawer}
              permissionApplication={PermissionApplication.IMS}
              permissionPage={PermissionPage.ACCOUNT}
              permissionAction={PermissionAction.WRITE}
            />
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.READ) ? (
              renderViewBasedOnMode()
            ) : null}
          </Card>
        </Grid>
        {!isLoadingProfileUser && addAccountOpen &&
          checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
            <AddAccountDrawer open={addAccountOpen} toggle={toggleAddAccountDrawer} domain={profileUser?.domain}/>
          )}
        {deleteDialogOpen &&
          checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.DELETE) && (
            <DeleteCommonDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              selectedRowId={selectedRowId}
              item='Account'
              onDelete={onDelete}
            />
          )}
        {updateStatusDialogOpen &&
          checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
            <UpdateAdminStatusDialog
              open={updateStatusDialogOpen}
              setOpen={setUpdateStatusDialogOpen}
              setSelectedRowId={selectedRowId}
              item='Account'
              newStatus={newStatus}
            />
          )}
        {updateIsAdminDialogOpen &&
          checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
            <UpdateIsAdminDialog
              open={updateIsAdminDialogOpen}
              setOpen={setUpdateIsAdminDialogOpen}
              setSelectedRowId={selectedRowId}
              item='Account'
              newStatus={newStatusIsAdmin}
            />
          )}
      </Grid>
    </>
  ) : null
}

export default AccountList
