import React, { useCallback, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'

import Icon from 'template-shared/@core/components/icon'

import Tooltip from '@mui/material/Tooltip'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { useTranslation } from 'react-i18next'
import { ToggleButtonGroup } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import TableHeader from 'template-shared/views/table/TableHeader'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import Moment from 'react-moment'
import themeConfig from 'template-shared/configs/themeConfig'
import Styles from 'template-shared/style/style.module.css'
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps'
import localStorageKeys from 'template-shared/configs/localeStorage'
import PaginationCard from 'template-shared/@core/components/card-pagination'
import { IntegrationFlowType } from 'integration-shared/@core/types/integration/IntegrationFlowTypes'
import FlowCard from '../../../../views/apps/integration-flow/list/FlowCard'
import AddFlowDrawer from '../../../../views/apps/integration-flow/list/AddIntegrationFlowDrawer'
import AccountApis from 'ims-shared/@core/api/ims/account'
import IntegrationFlowApis from 'integration-shared/@core/api/integration/flow'

interface CellType {
  row: IntegrationFlowType
}

const FlowList = () => {
  const { t } = useTranslation()
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
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: paginationPage,
    pageSize:
      localStorage.getItem(localStorageKeys.paginationSize) &&
      Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9
        ? Number(localStorage.getItem(localStorageKeys.paginationSize))
        : 20
  })
  const [addFlowOpen, setAddFlowOpen] = useState<boolean>(false)
  const { data: countFlow, isLoading: isLoadingCountFlow } = useQuery(`countFlow`, () =>
    IntegrationFlowApis(t).getIntegrationFlowsCount()
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

  const { data: flow, isLoading } = useQuery(`flow`, () =>
    IntegrationFlowApis(t).getIntegrationFlowsByPage(paginationModel.page, paginationModel.pageSize)
  )

  const handleOpenDeleteDialog = (rowId: number | undefined) => {
    if (rowId != undefined) {
      setSelectedRowId(rowId)
      setDeleteDialogOpen(true)
    }
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
    mutationFn: (id: number) => IntegrationFlowApis(t).deleteIntegrationFlow(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)

        const updatedItems: IntegrationFlowType[] =
          (queryClient.getQueryData('flow') as IntegrationFlowType[])?.filter(
            (item: IntegrationFlowType) => item.id !== id
          ) || []
        queryClient.setQueryData('flow', updatedItems)
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
    router.push(`/apps/integration-flow/view/flowView/${id}`)
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
    /*Domain column*/
    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },

    /*Code column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.code}
            </Typography>
          </Box>
        )
      }
    },

    /*integrationDate column*/
    {
      field: 'integrationDate',
      headerName: t('Integration Date') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.integrationDate.toDateString()}
            </Typography>
          </Box>
        )
      }
    },

    /*originalFileName column*/
    {
      field: 'originalFileName',
      headerName: 'originalFileName' as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.originalFileName}
            </Typography>
          </Box>
        )
      }
    },

    /*extension column*/
    {
      field: 'extension',
      headerName: 'extension' as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.extension}
            </Typography>
          </Box>
        )
      }
    },

    /*type account column*/
    {
      field: 'type',
      headerName: t('type') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.type}
            </Typography>
          </Box>
        )
      }
    },

    /*file column*/
    {
      field: 'file',
      headerName: t('file') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.type}
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
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleOpenDeleteDialog(row.id)}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Action.View')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleView(row.id)}
              >
                <Icon icon='fluent:slide-text-edit-24-regular' />
              </IconButton>
            </Tooltip>
            )
          </Box>
        )
      }
    }
  ]

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  const toggleAddCustomerDrawer = () => setAddCutomerOpen(!addCustomerOpen)

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await IntegrationFlowApis(t).getIntegrationFlowsByPage(0, item.pageSize)
      queryClient.removeQueries('flow')
      queryClient.setQueryData('flow', apiList)

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
      const apiList = await IntegrationFlowApis(t).getIntegrationFlowsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('flow')
        queryClient.setQueryData('flow', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await IntegrationFlowApis(t).getIntegrationFlowsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('flow')
        queryClient.setQueryData('flow', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }
  }

  const toggleAddFlowDrawer = () => setAddFlowOpen(!addFlowOpen)

  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={flow || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}
        slotProps={{
          pagination: {
            count: countFlow,
            page: paginationPage,
            labelDisplayedRows: ({ page, count }) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,

            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              onClick: () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || flow?.length < paginationModel.pageSize
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
      {flow &&
        Array.isArray(flow) &&
        flow.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <FlowCard onViewClick={handleView} data={item} onDeleteClick={handleOpenDeleteDialog} />
            </Grid>
          )
        })}{' '}
      <PaginationCard
        paginationModel={paginationModel}
        onChangePagination={onChangePagination}
        paginationPage={paginationPage}
        countList={countFlow}
        disabledNextBtn={disabledNextBtn}
        ListLength={flow?.length}
        onChangePage={onChangePage}
      />
    </Grid>
  )

  return !isLoading && !isLoadingCountFlow ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: 2 }}>
            <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode}>
              <ToggleButton value='grid'>
                <Icon icon='ic:baseline-view-list' />
              </ToggleButton>
              <ToggleButton value='card'>
                <Icon icon='ic:baseline-view-module' />
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
            renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        addFlowOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.CUSTOMER, PermissionAction.WRITE) && (
          <AddFlowDrawer open={addFlowOpen} domain={profileUser?.domain} toggle={toggleAddFlowDrawer} />
        )}

      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item={'flow'}
          onDelete={onDelete}
        />
      )}
    </Grid>
  ) : null
}

export default FlowList
