import React, { useCallback, useEffect, useState } from 'react'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import { AppParameter } from 'ims-shared/@core/types/ims/appParameterTypes'
import AddParameterDrawer from '../../../views/apps/custom-parameter/AddParameterDrawer'
import SidebarEditParameter from '../../../views/apps/custom-parameter/EditParameterConfig'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import CardHeader from '@mui/material/CardHeader'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import Moment from 'react-moment'
import themeConfig from 'template-shared/configs/themeConfig'

import Styles from 'template-shared/style/style.module.css'
import AccountApis from 'ims-shared/@core/api/ims/account'
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps'
import localStorageKeys from 'template-shared/configs/localeStorage'
import CustomParameterApis from 'ims-shared/@core/api/ims/custom-parametre'

const AppParameterList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  interface CellType {
    row: AppParameter
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataParameter, setEditDataParameter] = useState<AppParameter>()
  const [addParameterOpen, setAddParameterOpen] = useState<boolean>(false)
  const [editParameterOpen, setEditParameterOpen] = useState<boolean>(false)
  const toggleEditParameterDrawer = () => setEditParameterOpen(!editParameterOpen)
  const toggleAddParameterDrawer = () => setAddParameterOpen(!addParameterOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: paginationPage,
    pageSize:
      localStorage.getItem(localStorageKeys.paginationSize) &&
      Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9
        ? Number(localStorage.getItem(localStorageKeys.paginationSize))
        : 20
  })

  const { data: countParam, isLoading: isLoadingCountParam } = useQuery(`countParam`, () =>
    CustomParameterApis(t).getCustomParametersCount()
  )

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  const { data: appParametersList, isLoading } = useQuery('appParametersList', () =>
    CustomParameterApis(t).getCustomParametersByPage(paginationModel.page, paginationModel.pageSize)
  )

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  function onDelete(id: number) {
    parameterMutationDelete.mutate(id)
  }

  const parameterMutationDelete = useMutation({
    mutationFn: (id: number) => CustomParameterApis(t).deleteCustomParameterById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: AppParameter[] =
          (queryClient.getQueryData('appParametersList') as AppParameter[])?.filter(
            (item: AppParameter) => item.id !== id
          ) || []
        queryClient.setQueryData('appParametersList', updatedItems)
      }
    }
  })

  function handleOpenEdit(data: AppParameter) {
    setEditParameterOpen(true)
    setEditDataParameter(data)
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

    /*Value column*/
    {
      field: 'value',
      headerName: t('Parameter.Value') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.value}</Typography>
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
      maxWidth: 150,
      flex: 1,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t(row.description)}>
            <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:info-circle' />
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
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
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleOpenEdit(row)}
              >
                <Icon icon='tabler:edit' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

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
      const apiList = await CustomParameterApis(t).getCustomParametersByPage(0, item.pageSize)
      queryClient.removeQueries('appParametersList')
      queryClient.setQueryData('appParametersList', apiList)

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
      const apiList = await CustomParameterApis(t).getCustomParametersByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('appParametersList')
        queryClient.setQueryData('appParametersList', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await CustomParameterApis(t).getCustomParametersByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('appParametersList')
        queryClient.setQueryData('appParametersList', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }
  }

  return !isLoading && !isLoadingCountParam ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('System_Parameters')} />
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddParameterDrawer}
            permissionApplication={PermissionApplication.IMS}
            permissionPage={PermissionPage.APP_PARAMETER}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={appParametersList || []}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={onChangePagination}
                slotProps={{
                  pagination: {
                    count: countParam,
                    page: paginationPage,
                    labelDisplayedRows: ({ page, count }) =>
                      `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,
                    labelRowsPerPage: t('Rows_per_page'),
                    nextIconButtonProps: {
                      onClick: () => onChangePage('nextIconButtonProps'),
                      disabled: disabledNextBtn || appParametersList?.length < paginationModel.pageSize
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
          )}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
          <AddParameterDrawer open={addParameterOpen} domain={profileUser?.domain} toggle={toggleAddParameterDrawer} />
        )}

      {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          onDelete={onDelete}
          item='Parametre'
        />
      )}

      {editParameterOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
          <SidebarEditParameter
            open={editParameterOpen}
            toggle={toggleEditParameterDrawer}
            dataParameter={editDataParameter}
          />
        )}
    </Grid>
  ) : null
}

export default AppParameterList
