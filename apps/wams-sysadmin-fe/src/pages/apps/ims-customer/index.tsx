// ** React Imports
import React, {useCallback, useEffect, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Table Components Imports
import Tooltip from '@mui/material/Tooltip'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useTranslation} from 'react-i18next'
import {Avatar, ToggleButtonGroup} from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import {useRouter} from 'next/router'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import imsApiUrls from "ims-shared/configs/ims_apis"
import AddCustomerDrawer from '../../../views/apps/customer/AddCustomerDrawer'
import Switch from '@mui/material/Switch'
import CustomerCard from '../../../views/apps/customer/CustomerCard'
import UpdateAdminStatusDialog
  from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import TableHeader from 'template-shared/views/table/TableHeader'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import LinkToAccountModal from '../../../views/apps/customer/LinkToAccountModal'
import Moment from 'react-moment'
import themeConfig from "template-shared/configs/themeConfig";

import Styles from "template-shared/style/style.module.css"
import AccountApis from "ims-shared/@core/api/ims/account";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import PaginationCard from "template-shared/@core/components/card-pagination";
import CustomerApis from "ims-shared/@core/api/ims/customer";
import {CustomerDetailType} from "ims-shared/@core/types/ims/customerTypes";


interface CellType {
  row: CustomerDetailType
}

const CustomerList = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addCustomerOpen, setAddCutomerOpen] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [viewMode, setViewMode] = useState('auto')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>()
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

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const dataGridApiRef = React.useRef<GridApi>()
  const router = useRouter()
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<boolean>()

  const {
    data: countCustomer,
    isLoading: isLoadingCountCustomer
  } = useQuery(`countCustomer`, () => CustomerApis(t).getCustomersCount())
  const {
    data: customers,
    isLoading
  } = useQuery(`customers`, () => CustomerApis(t).getCustomersByPage(paginationModel.page, paginationModel.pageSize))
  const {
    data: accounts,
    isLoading: isLoadingAccounts
  } = useQuery(`accounts`, () => AccountApis(t).getAccounts())

  const handleOpenDeleteDialog = (rowId: number | undefined) => {
    if (rowId != undefined) {
      setSelectedRowId(rowId)
      setDeleteDialogOpen(true)
    }
  }

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

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

  const mutationDelete = useMutation({
    mutationFn: (id: number) => CustomerApis(t).deleteCustomer(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)

        const updatedItems: CustomerDetailType[] =
          (queryClient.getQueryData('customers') as CustomerDetailType[])?.filter((item: CustomerDetailType) => item.id !== id) ||
          []
        queryClient.setQueryData('customers', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleView = (id: number) => {
    router.push(`/apps/ims-customer/view/CustomerView/${id}`)
  }

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(!status)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    email: false,
    url: false,
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
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Avatar className={Styles.avatarTable}
                src={row.imagePath ? `${imsApiUrls.apiUrl_IMS_Customer_ImageDownload_EndPoint}/${row.id}` : ''}
                alt={row.name}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      flex: 1,

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

    /*Name column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
              {row.name}
            </Typography>
          </Box>
        )
      }
    },

    /*Email column*/
    {
      field: 'email',
      headerName: t('Email') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.email}
            </Typography>
          </Box>
        )
      }
    },

    /*Phone column*/
    {
      field: 'phoneNumber',
      headerName: t('Phone_Number') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
              {row.phoneNumber}
            </Typography>
          </Box>
        )
      }
    },

    /*Phone column*/
    {
      field: 'url',
      headerName: t('Url') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
              {row.url}
            </Typography>
          </Box>
        )
      }
    },

    /*Linked account column*/
    {
      field: 'linkedAccount',
      headerName: t('Customer.LinkedUser') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.accountCode}
            </Typography>
          </Box>
        )
      }
    },

    /*Admin status column*/
    {
      field: 'status',
      headerName: t('Status') as string,
      flex: 1,
      renderCell: ({row}: CellType) => {
        const status = row.adminStatus === 'ENABLED'

        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={status} onChange={() => handleOpenUpdateStatusDialog(row.id, status)}/>
            ) : (
              <Switch size={'small'} checked={status} readOnly={true}/>
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
    }
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {!checkPermission(
              PermissionApplication.IMS,
              PermissionPage.CUSTOMER,
              PermissionAction.DELETE
            ) ? null : (
              <Tooltip title={t('Action.Delete')}>
                <IconButton
                  className={Styles.sizeIcon}
                  sx={{color: 'text.secondary'}}
                  onClick={() => handleOpenDeleteDialog(row.id)}
                >
                  <Icon icon='tabler:trash'/>
                </IconButton>
              </Tooltip>
            )}

            {!checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) ? null : (
              <Tooltip title={t('Action.View')}>
                <IconButton
                  className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleView(row.id)}>
                  <Icon icon='fluent:slide-text-edit-24-regular'/>
                </IconButton>
              </Tooltip>
            )}

            {!checkPermission(
              PermissionApplication.IMS,
              PermissionPage.CUSTOMER,
              PermissionAction.WRITE
            ) ? null : (
              <Tooltip title={t('Action.LinkToAccount')}>
                <IconButton
                  className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleLinkedUser(row)}>
                  <Icon icon='tabler:link-plus'/>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  const [linkedUser, setLinkUser] = useState<boolean>(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetailType>()
  const handleLinkedUser = (row: CustomerDetailType) => {
    setSelectedCustomer(row)
    setLinkUser(true)
  }

  const handleClose = () => {
    setLinkUser(false)
    setSelectedCustomer(null)
  }

  const toggleAddCustomerDrawer = () => setAddCutomerOpen(!addCustomerOpen)

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {

      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await CustomerApis(t).getCustomersByPage(0, item.pageSize)
      queryClient.removeQueries('customers')
      queryClient.setQueryData('customers', apiList)

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
      const apiList = await CustomerApis(t).getCustomersByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('customers')
        queryClient.setQueryData('customers', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)

    } else if (item === 'nextIconButtonProps') {

      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize

      }
      const apiList = await CustomerApis(t).getCustomersByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {

        queryClient.removeQueries('customers')
        queryClient.setQueryData('customers', apiList)
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
        rows={customers || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}

        slotProps={{

          pagination: {

            count: countCustomer,
            page: paginationPage,
            labelDisplayedRows: ({page, count}) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`

            ,
            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              'onClick': () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || customers?.length < paginationModel.pageSize,

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
      {customers &&
        Array.isArray(customers) &&
        customers.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <CustomerCard
                onViewClick={handleView}
                handleLinkedUser={handleLinkedUser}
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                imageUrl={imsApiUrls.apiUrl_IMS_Customer_ImageDownload_EndPoint}
                onSwitchStatus={handleOpenUpdateStatusDialog}
              />
            </Grid>
          )
        })}{' '}

      <PaginationCard paginationModel={paginationModel}
                      onChangePagination={onChangePagination}
                      paginationPage={paginationPage}
                      countList={countCustomer}
                      disabledNextBtn={disabledNextBtn}
                      ListLength={customers?.length}
                      onChangePage={onChangePage}
      />
    </Grid>
  )

  return !isLoading && !isLoadingCountCustomer ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{m: '0 !important'}}/>
          <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
            <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode}>
              <ToggleButton value='grid'>
                <Icon icon='ic:baseline-view-list'/>
              </ToggleButton>
              <ToggleButton value='card'>
                <Icon icon='ic:baseline-view-module'/>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddCustomerDrawer}
            permissionApplication={PermissionApplication.IMS}
            permissionPage={PermissionPage.CUSTOMER}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.READ) &&

            renderViewBasedOnMode()

          }

        </Card>
      </Grid>

      {!isLoadingProfileUser && addCustomerOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <AddCustomerDrawer open={addCustomerOpen} domain={profileUser?.domain} toggle={toggleAddCustomerDrawer}/>
        )}
      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Customer'
          onDelete={onDelete}
        />
      )}
      {updateStatusDialogOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <UpdateAdminStatusDialog
            open={updateStatusDialogOpen}
            setOpen={setUpdateStatusDialogOpen}
            setSelectedRowId={selectedRowId}
            item='Customer'
            newStatus={newStatus}
          />
        )}

      {linkedUser &&
        !isLoadingAccounts &&
        checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <LinkToAccountModal
            open={linkedUser}
            handleClose={handleClose}
            selectedCustomer={selectedCustomer}
            accounts={accounts}
          />
        )}
    </Grid>
  ) : null
}

export default CustomerList
