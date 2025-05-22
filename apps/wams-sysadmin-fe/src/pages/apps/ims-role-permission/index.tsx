import React, { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { useTranslation } from 'react-i18next'
import { ToggleButtonGroup } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import RoleCard from '../../../views/apps/role-permission/RoleCard'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import AddRoleDrawer from '../../../views/apps/role-permission/AddRoleDrawer'
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
import RolePermissionApis from 'ims-shared/@core/api/ims/role-permission'
import AccountApis from 'ims-shared/@core/api/ims/account'
import { RoleTypes } from 'ims-shared/@core/types/ims/roleTypes'

interface CellType {
  row: RoleTypes
}

const RoleAccount = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addRoleOpen, setAddRoleOpen] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [viewMode, setViewMode] = useState('auto')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>()
  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const dataGridApiRef = React.useRef<GridApi>()
  const router = useRouter()

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

  const { data: roles, isLoading } = useQuery(`roles`, () => RolePermissionApis(t).getRoles())
  const extractRoleNames = roles?.map(item => ({
    code: item.code,
    name: item.name
  }))
  console.log('rolesName', extractRoleNames)

  const mutationDelete = useMutation({
    mutationFn: (id: number) => RolePermissionApis(t).deleteRole(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: RoleTypes[] =
          (queryClient.getQueryData('roles') as RoleTypes[])?.filter((item: RoleTypes) => item.id !== id) || []
        queryClient.setQueryData('roles', updatedItems)
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
    router.push(`/apps/ims-role-permission/view/RoleView/${id}`)
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
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

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },

    /*Code column*/
    {
      field: 'code',
      headerName: t('Code') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row.code}
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

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.name}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'level',
      headerName: t('Level') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.level}
            </Typography>
          </Box>
        )
      }
    },

    /*Number of users column*/
    {
      field: 'numberOfUsers',
      headerName: t('Number_of_Users') as string,
      flex: 1,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.numberOfUsers}
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
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
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
            {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  className={Styles.sizeIcon}
                  sx={{ color: 'text.secondary' }}
                  onClick={() => handleView(row?.id ?? 0)}
                >
                  <Icon icon='fluent:slide-text-edit-24-regular' />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  const toggleAddRoleDrawer = () => setAddRoleOpen(!addRoleOpen)

  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={roles || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          pagination: {
            labelRowsPerPage: t('Rows_per_page'),
            labelDisplayedRows: ({ from, to, count }) => t('pagination footer', { from, to, count })
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{ mb: 2, padding: '15px' }}>
      {roles &&
        Array.isArray(roles) &&
        roles.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <RoleCard data={item} onDeleteClick={handleOpenDeleteDialog} onViewClick={handleView} />
            </Grid>
          )
        })}{' '}
    </Grid>
  )

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
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
            toggle={toggleAddRoleDrawer}
            permissionApplication={PermissionApplication.IMS}
            permissionPage={PermissionPage.ROLE_INFO}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.READ) &&
            renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        addRoleOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.WRITE) && (
          <AddRoleDrawer open={addRoleOpen} domain={profileUser?.domain} toggle={toggleAddRoleDrawer} />
        )}
      {deleteDialogOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.ROLE_INFO, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Role'
            onDelete={onDelete}
          />
        )}
    </Grid>
  ) : null
}

export default RoleAccount
