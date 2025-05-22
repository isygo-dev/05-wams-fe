// ** React Imports
import React, { useCallback, useState } from 'react'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import { Avatar, Card, ToggleButtonGroup } from '@mui/material'
import AddApplicationDrawer from '../../../views/apps/application/AddApplicationDrawer'
import EditApplicationDrawer from '../../../views/apps/application/EditApplicationDrawer'
import { useTranslation } from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import ToggleButton from '@mui/material/ToggleButton'
import ApplicationCard from '../../../views/apps/application/ApplicationCard'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import { ApplicationType } from 'ims-shared/@core/types/ims/applicationTypes'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import Moment from 'react-moment'
import Switch from '@mui/material/Switch'
import UpdateAdminStatusDialog from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import themeConfig from 'template-shared/configs/themeConfig'
import Styles from 'template-shared/style/style.module.css'
import AccountApis from 'ims-shared/@core/api/ims/account'
import ApplicationApis from 'ims-shared/@core/api/ims/application'

const ApplicationList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  interface CellType {
    row: ApplicationType
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataApplication, setEditDataApplication] = useState<ApplicationType>()
  const [addApplicationOpen, setAddApplicationOpen] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [editApplicationOpen, setEditApplicationOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const toggleEditApplicationDrawer = () => setEditApplicationOpen(!editApplicationOpen)
  const toggleAddApplicationDrawer = () => setAddApplicationOpen(!addApplicationOpen)

  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  function handleOpenEdit(data: ApplicationType) {
    setEditApplicationOpen(true)
    setEditDataApplication(data)
  }

  const { data: applications, isLoading } = useQuery(`applications`, () => ApplicationApis(t).getApplications())
  const applicationMutationDelete = useMutation({
    mutationFn: (id: number) => ApplicationApis(t).deleteApplicationById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: ApplicationType[] =
          (queryClient.getQueryData('applications') as ApplicationType[])?.filter(
            (item: ApplicationType) => item.id !== id
          ) || []
        queryClient.setQueryData('applications', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    applicationMutationDelete.mutate(id)
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

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true), setSelectedRowId(rowId)
    setNewStatus(status)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const defaultColumns: GridColDef[] = [
    /*Photo Column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={
            row.imagePath ? `${imsApiUrls.apiUrl_IMS_Application_ImageDownload_EndPoint}/${row.id}?${Date.now()}` : ''
          }
          alt={row.name}
        />
      )
    },

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

    /*Code Column*/
    {
      field: 'code',
      headerName: t('Code') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
    },

    /*Name Column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
    },

    /*Categroy Column*/
    {
      field: 'category',
      headerName: t('Category') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.category}</Typography>
    },

    /*Url Column*/
    {
      field: 'url',
      headerName: t('Url') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.url}</Typography>
    },

    /*Order Column*/
    {
      field: 'order',
      headerName: t('Order') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.order}</Typography>
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
            {checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.WRITE) ? (
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
          {checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                onClick={() => handleOpenDeleteDialog(row.id)}
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.WRITE) && (
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
  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        pagination
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={applications || []}
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
      {applications &&
        Array.isArray(applications) &&
        applications.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <ApplicationCard
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                onEditClick={handleOpenEdit}
                onSwitchStatus={handleOpenUpdateStatusDialog}
                imageUrl={imsApiUrls.apiUrl_IMS_Application_ImageDownload_EndPoint}
              />
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
            toggle={toggleAddApplicationDrawer}
            permissionApplication={PermissionApplication.IMS}
            permissionPage={PermissionPage.APPLICATION}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.READ) &&
            renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.WRITE) && (
          <AddApplicationDrawer
            open={addApplicationOpen}
            domain={profileUser?.domain}
            toggle={toggleAddApplicationDrawer}
          />
        )}

      {editApplicationOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.WRITE) && (
          <EditApplicationDrawer
            open={editApplicationOpen}
            toggle={toggleEditApplicationDrawer}
            data={editDataApplication}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}

      {checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          onDelete={onDelete}
          item='Application'
        />
      )}

      {updateStatusDialogOpen &&
        checkPermission(PermissionApplication.IMS, PermissionPage.APPLICATION, PermissionAction.WRITE) && (
          <UpdateAdminStatusDialog
            open={updateStatusDialogOpen}
            setOpen={setUpdateStatusDialogOpen}
            setSelectedRowId={selectedRowId}
            item='Application'
            newStatus={newStatus}
          />
        )}
    </Grid>
  ) : null
}

export default ApplicationList
