import React, { useCallback, useState } from 'react'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import AddDomainDrawer from '../../../views/apps/domain/AddDomainDrawer'
import TableHeader from 'template-shared/views/table/TableHeader'
import { Avatar, ToggleButtonGroup } from '@mui/material'
import Switch from '@mui/material/Switch'
import { useTranslation } from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import UpdateAdminStatusDialog from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import Card from '@mui/material/Card'
import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import DomainCard from '../../../views/apps/domain/DomainCard'
import { DomainType } from 'ims-shared/@core/types/ims/domainTypes'
import { useRouter } from 'next/router'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import Moment from 'react-moment'
import themeConfig from 'template-shared/configs/themeConfig'
import Styles from 'template-shared/style/style.module.css'
import AddAdminDomainDrawer from '../../../views/apps/domain/AddAdminDomainDrawer'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps'
import localStorageKeys from 'template-shared/configs/localeStorage'
import PaginationCard from 'template-shared/@core/components/card-pagination'
import DomainApis from 'ims-shared/@core/api/ims/domain'
import AccountApis from 'ims-shared/@core/api/ims/account'

const DomainList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  interface CellType {
    row: DomainType
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [addDomainOpen, setAddDomainOpen] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const { data: countDomain, isLoading: isLoadingCountDomain } = useQuery(`countDomain`, () =>
    DomainApis(t).getDomainsCount()
  )
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: paginationPage,
    pageSize:
      localStorage.getItem(localStorageKeys.paginationSize) &&
      Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9
        ? Number(localStorage.getItem(localStorageKeys.paginationSize))
        : 20
  })
  const toggleAddDomainDrawer = () => setAddDomainOpen(!addDomainOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('auto')
  const { data: domains, isLoading } = useQuery(`domains`, () =>
    DomainApis(t).getDomainsByPage(paginationModel.page, paginationModel.pageSize)
  )
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await DomainApis(t).getDomainsByPage(0, item.pageSize)
      queryClient.removeQueries('domains')
      queryClient.setQueryData('domains', apiList)
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
      const apiList = await DomainApis(t).getDomainsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('domains')
        queryClient.setQueryData('domains', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await DomainApis(t).getDomainsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('domains')
        queryClient.setQueryData('domains', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }
  }

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

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(status)
  }

  const mutationDelete = useMutation({
    mutationFn: (id: number) => DomainApis(t).deleteDomainById(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: DomainType[] =
          (queryClient.getQueryData('domains') as DomainType[])?.filter((item: DomainType) => item.id !== id) || []
        queryClient.setQueryData('domains', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
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

  const router = useRouter()

  const handleClickView = (id: number) => {
    router.push(`/apps/ims-domain/view/DomainView/${id}`)
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    url: false,
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const [dataDomainDetails, setDataDomainDetails] = useState<DomainType>()
  const [addAdminDomainOpen, setAddAdminDomainOpen] = useState<boolean>(false)
  const handelOpenAddAdmin = (data: DomainType) => {
    setAddAdminDomainOpen(true)
    setDataDomainDetails(data)
  }

  const toggleAddAdminDomainDrawer = () => setAddAdminDomainOpen(!addAdminDomainOpen)
  const defaultColumns: GridColDef[] = [
    /*Photo column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={row.imagePath ? `${imsApiUrls.apiUrl_IMS_Domain_ImageDownload_EndPoint}/${row.id}?${Date.now()}` : ''}
          alt={row.name}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },

    /*Name column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
    },

    /*Email column*/
    {
      field: 'email',
      headerName: t('Email') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.email}</Typography>
    },

    /*Phone column*/
    {
      field: 'phone',
      headerName: t('Phone') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.phone}</Typography>
    },

    /*Url column*/
    {
      field: 'url',
      headerName: t('Url') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.url}</Typography>
    },

    /*Status column*/
    {
      field: 'status',
      headerName: t('Status') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => {
        const status = row.adminStatus === 'ENABLED'

        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={status} onChange={() => handleOpenUpdateStatusDialog(row.id, !status)} />
            ) : (
              <Switch size={'small'} checked={status} readOnly={true} />
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

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleOpenDeleteDialog(row.id)}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          )}

          {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.READ) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleClickView(row.id)}
              >
                <Icon icon='fluent:slide-text-edit-24-regular' />
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Add')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handelOpenAddAdmin(row)}
              >
                <PersonAddAlt1Icon />
              </IconButton>
            </Tooltip>
          )}
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
        rows={domains || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}
        slotProps={{
          pagination: {
            count: countDomain,
            page: paginationPage,
            labelDisplayedRows: ({ page, count }) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,

            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              onClick: () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || domains?.length < paginationModel.pageSize
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
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{ mb: 2, padding: '15px' }}>
      {domains &&
        Array.isArray(domains) &&
        domains?.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <DomainCard
                handleClickView={handleClickView}
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                imageUrl={imsApiUrls.apiUrl_IMS_Domain_ImageDownload_EndPoint}
                onSwitchStatus={handleOpenUpdateStatusDialog}
              />
            </Grid>
          )
        })}{' '}
      <PaginationCard
        paginationModel={paginationModel}
        onChangePagination={onChangePagination}
        paginationPage={paginationPage}
        countList={countDomain}
        disabledNextBtn={disabledNextBtn}
        ListLength={domains?.length}
        onChangePage={onChangePage}
      />
    </Grid>
  )

  return !isLoading && !isLoadingCountDomain ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
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
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddDomainDrawer}
            permissionApplication={PermissionApplication.IMS}
            permissionPage={PermissionPage.DOMAIN}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.READ) &&
            renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        addDomainOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
          <AddDomainDrawer open={addDomainOpen} domain={profileUser?.domain} toggle={toggleAddDomainDrawer} />
        )}

      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Domain'
          onDelete={onDelete}
        />
      )}

      {updateStatusDialogOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
          <UpdateAdminStatusDialog
            open={updateStatusDialogOpen}
            setOpen={setUpdateStatusDialogOpen}
            setSelectedRowId={selectedRowId}
            item='Domain'
            newStatus={newStatus}
          />
        )}
      {addAdminDomainOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.DOMAIN, PermissionAction.WRITE) && (
          <AddAdminDomainDrawer
            open={addAdminDomainOpen}
            toggle={toggleAddAdminDomainDrawer}
            dataDomain={dataDomainDetails}
          />
        )}
    </Grid>
  ) : null
}

export default DomainList
