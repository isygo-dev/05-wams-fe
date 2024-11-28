import React, {useCallback, useEffect, useState} from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {EmployeeStatus, EmployeeType, MinEmployeeType} from 'hrm-shared/@core/types/hrm/employeeTypes'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import AddEmployeeDrawer from '../../../views/apps/employee/addEmployeeDrawer'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Link from 'next/link'
import TableHeader from 'template-shared/views/table/TableHeader'
import {Avatar, DialogContent, DialogContentText, Switch, ToggleButton, ToggleButtonGroup} from '@mui/material'
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import useMediaQuery from '@mui/material/useMediaQuery'
import EmployeeCard from './view/EmployeeCard'
import {useTheme} from '@mui/system'
import {useRouter} from 'next/router'
import Moment from 'react-moment'

import Styles from "template-shared/style/style.module.css"
import themeConfig from "template-shared/configs/themeConfig";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import EmployeeStatisticsContainer from "./statistics/EmployeeStatisticsContainer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ConfirmationDialog from "./view/ConfirmationDialog";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import PaginationCard from "template-shared/@core/components/card-pagination";
import EmployeeApis from "hrm-shared/@core/api/hrm/employee";
import AccountApis from "ims-shared/@core/api/ims/account";

interface CellType {
  row: MinEmployeeType
}

const EmployeeList = () => {
  const {t} = useTranslation()
  const dataGridApiRef = React.useRef<GridApi>()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addEmployeeOpen, setAddEmployeeOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [viewMode, setViewMode] = useState('auto')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEmployeeForAccount, setSelectedEmployeeForAccount] = useState<MinEmployeeType | null>(null);
  const [updateIsActiveDialogOpen, setUpdateIsActiveDialogOpen] = useState<boolean>(false)
  const [newStatusIsActive, setNewStatusIsActive] = useState<boolean>(false)
  const {
    data: countEmployee,
    isLoading: isLoadingCountEmployee
  } = useQuery(`countEmployee`, () => EmployeeApis(t).getEmployeesCount())


  const {
    data: employee,
    isLoading
  } = useQuery(`employee`, () => EmployeeApis(t).getEmployeesByPage(paginationModel.page, paginationModel.pageSize))


  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
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

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await EmployeeApis(t).getEmployeesByPage(0, item.pageSize)
      queryClient.removeQueries('employee')
      queryClient.setQueryData('employee', apiList)
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
      const apiList = await EmployeeApis(t).getEmployeesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('employee')
        queryClient.setQueryData('employee', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await EmployeeApis(t).getEmployeesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('employee')
        queryClient.setQueryData('employee', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }

  }

  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  console.log(employee)
  const toggleAddEmployeeDrawer = () => {
    setAddEmployeeOpen(!addEmployeeOpen)
  }

  const onCreateAccount = (employee: MinEmployeeType) => {
    setSelectedEmployeeForAccount(employee);
    setConfirmDialogOpen(true);
  };
  const handleCreateAccountConfirmation = () => {
    if (selectedEmployeeForAccount) {
      createAccountMutation.mutate(selectedEmployeeForAccount);
      setConfirmDialogOpen(false);
    }

  };
  const createAccountMutation = useMutation({
    mutationFn: async (row: MinEmployeeType) => {
      try {
        const response = await EmployeeApis(t).linkEmployeeToAccount(row);
        console.log("Account created successfully!", response);
        queryClient.invalidateQueries(['employee']);
      } catch (error) {
        console.error("Error creating account:", error);
      }
    },
  });

  const handleOpenAdd = () => {
    toggleAddEmployeeDrawer()
  }

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const mutationDelete = useMutation({
    mutationFn: (id: number) => EmployeeApis(t).deleteEmployeeById(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: EmployeeType[] =
          (queryClient.getQueryData('employee') as EmployeeType[])?.filter((item: EmployeeType) => item.id !== id) || []
        queryClient.setQueryData('employee', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const handleOpenUpdateStatus = (rowId: number, status: boolean, newStatus) => {
    setUpdateIsActiveDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatusIsActive(newStatus == EmployeeStatus.ENABLED ? true : false)
  }

  const columns: GridColDef[] = [
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Avatar className={Styles.avatarTable}
                src={row.imagePath ? `${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${row.id}?${Date.now()}` : ''}
                alt={row.firstName}
        />
      )
    },

    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },
    {
      field: 'code',
      headerName: t('Code') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },
    {
      field: 'code Account',
      headerName: t('Code Account') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.accountCode}</Typography>
    },
    {
      field: 'fullName',
      headerName: t('Employee.Full_Name') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{row.firstName + ' ' + row.lastName}</Typography>
      )
    },
    {
      field: 'email',
      headerName: t('Employee.Email') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.email}</Typography>
    },
    {
      field: 'active Contracts',
      headerName: t('Employee.Active_Contracts') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{row.numberActiveContracts}</Typography>
      )
    },

    {
      field: 'Func. Role',
      headerName: t('Employee.FunctionalRole') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.functionRole}</Typography>
    },

    {
      field: 'status',
      minWidth: 140,
      flex: 0.15,
      headerName: t('Employee.status') as string,
      renderCell: ({row}: CellType) => {
        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={row.employeeStatus === EmployeeStatus.ENABLED}
                      onChange={e => handleOpenUpdateStatus(row.id, e.target.checked, row.employeeStatus)}/>
            ) : (
              <Switch size={'small'} checked={row.employeeStatus === EmployeeStatus.ENABLED} readOnly={true}/>
            )}
          </>
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
    },

    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.DELETE) &&
            <Tooltip title={t('Action.Delete')}>
              <IconButton sx={{color: 'text.secondary'}}
                          className={Styles.sizeIcon} onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>}

          <Tooltip title={t('Action.Edit')}>
            <IconButton
              className={Styles.sizeIcon}
              component={Link}
              sx={{color: 'text.secondary'}}
              href={`/apps/employee/view/${row.id}`}
            >
              <Icon icon='fluent:slide-text-edit-24-regular'/>
            </IconButton>
          </Tooltip>
          {row?.accountCode == null && (
            <Tooltip title={t('Action.Link Account')}>
              <IconButton sx={{color: 'text.secondary'}}
                          className={Styles.sizeIcon} onClick={() => onCreateAccount(row)}>
                <Icon icon="tabler:user-check"/>
              </IconButton>
            </Tooltip>)}
        </Box>
      )
    }
  ]

  const gridView = (

    <Box className={Styles.boxTable}>
      <DataGrid

        pageSizeOptions={themeConfig.pageSizeOptions}
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        autoHeight
        pagination
        rows={employee || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}

        slotProps={{

          pagination: {

            count: countEmployee,
            page: paginationPage,
            labelDisplayedRows: ({page, count}) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`

            ,
            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              'onClick': () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || employee?.length < paginationModel.pageSize,

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
  const handleViewIconClick = (row: MinEmployeeType) => {
    router.push(`/apps/employee/view/${row.id}`)
  }

  const cardView = (
    <Grid container spacing={6} sx={{mb: 2, padding: '15px'}}>
      {employee &&
        Array.isArray(employee) &&
        employee.map((item, index) => {
          return (
            <Grid key={index} item xs={12} sm={12} md={3} lg={2.4} xl={2.4}>
              <EmployeeCard data={item} onViewClick={handleViewIconClick} onDeleteClick={handleOpenDeleteDialog}/>
            </Grid>
          )
        })}

      <PaginationCard paginationModel={paginationModel}
                      onChangePagination={onChangePagination}
                      paginationPage={paginationPage}
                      countList={countEmployee}
                      disabledNextBtn={disabledNextBtn}
                      ListLength={employee?.length}
                      onChangePage={onChangePage}
      />
    </Grid>
  )
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

  return !isLoading && !isLoadingCountEmployee ? (
    <>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{t('Confirm Account Creation')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {t('Are you sure you want to create an account for this employee?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleCreateAccountConfirmation}
            color="primary"
            autoFocus
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <EmployeeStatisticsContainer/>
      <Grid container>
        <Grid item xs={12} md={12} sm={12}>
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
              toggle={handleOpenAdd}

              permissionApplication={PermissionApplication.HRM}
              permissionPage={PermissionPage.EMPLOYEE}
              permissionAction={PermissionAction.WRITE}
            />
            {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.READ) && renderViewBasedOnMode()}

          </Card>
        </Grid>
        {!isLoadingProfileUser && checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.WRITE) &&
          <AddEmployeeDrawer open={addEmployeeOpen} toggle={toggleAddEmployeeDrawer} domain={profileUser?.domain}/>}

        {deleteDialogOpen && checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Employee'
            onDelete={onDelete}
          />
        )}
        {updateIsActiveDialogOpen &&
          checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.WRITE) && (
            <ConfirmationDialog
              open={updateIsActiveDialogOpen}
              setOpen={setUpdateIsActiveDialogOpen}
              selectedRowId={selectedRowId}
              status={newStatusIsActive}
            />
          )}
      </Grid>
    </>
  ) : null
}

export default EmployeeList
