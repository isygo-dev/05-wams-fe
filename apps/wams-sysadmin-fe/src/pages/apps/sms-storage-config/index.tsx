// ** React Imports
import React, { useCallback, useState } from 'react'
import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import TableHeader from 'template-shared/views/table/TableHeader'
import { useTranslation } from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Card from '@mui/material/Card'
import { StorageConfigType } from 'sms-shared/@core/types/sms/storageTypes'
import AddStorageConfigDrawer from '../../../views/apps/sms-storage-config/AddStorageConfigDrawer'
import EditStorageConfigDrawer from '../../../views/apps/sms-storage-config/EditStorageConfigDrawer'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import themeConfig from 'template-shared/configs/themeConfig'
import Styles from 'template-shared/style/style.module.css'
import StorageConfigApis from 'sms-shared/@core/api/sms/storage-config'
import AccountApis from 'ims-shared/@core/api/ims/account'

interface CellType {
  row: StorageConfigType
}

const StorageConfigList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataStorage, setEditDataStorage] = useState<StorageConfigType>()
  const [addStorageOpen, setAddStorageOpen] = useState<boolean>(false)
  const [editStorageOpen, setEditStorageOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const toggleEditStorageDrawer = () => setEditStorageOpen(!editStorageOpen)
  const toggleAddStorageDrawer = () => setAddStorageOpen(!addStorageOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const { data: storageConfigs, isLoading } = useQuery(`storageConfigs`, () =>
    StorageConfigApis(t).getStorageConfigurations()
  )

  const mutationDelete = useMutation({
    mutationFn: (id: number) => StorageConfigApis(t).deleteStorageConfigurationById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: StorageConfigType[] =
          (queryClient.getQueryData('storageConfigs') as StorageConfigType[])?.filter(
            (item: StorageConfigType) => item.id !== id
          ) || []
        queryClient.setQueryData('storageConfigs', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  function handleOpenEdit(data: StorageConfigType) {
    setEditStorageOpen(true)
    setEditDataStorage(data)
  }

  const columns: GridColDef[] = [
    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },
    {
      field: 'type',
      headerName: t('Type') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => {
        {
          switch (row.type) {
            case 'MINIO_STORAGE':
              return <Typography sx={{ color: 'text.secondary' }}> MinIO Storage </Typography>
          }
        }
      }
    },
    {
      field: 'userName',
      headerName: t('User_Name') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.userName}</Typography>
    },
    {
      field: 'url',
      headerName: t('Url') as string,
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.url}</Typography>
    },
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.DELETE) && (
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
          {checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.WRITE) && (
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

  return !isLoading && storageConfigs ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddStorageDrawer}
            permissionApplication={PermissionApplication.SMS}
            permissionPage={PermissionPage.STORAGE_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={storageConfigs || []}
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
          )}
        </Card>
      </Grid>

      {!isLoadingProfileUser &&
        addStorageOpen &&
        checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.WRITE) && (
          <AddStorageConfigDrawer open={addStorageOpen} domain={profileUser?.domain} toggle={toggleAddStorageDrawer} />
        )}
      {editStorageOpen &&
        checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.WRITE) && (
          <EditStorageConfigDrawer
            open={editStorageOpen}
            toggle={toggleEditStorageDrawer}
            dataStorageConfig={editDataStorage}
          />
        )}

      {checkPermission(PermissionApplication.SMS, PermissionPage.STORAGE_CONFIG, PermissionAction.DELETE) &&
        deleteDialogOpen && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Storage'
            onDelete={onDelete}
          />
        )}
    </Grid>
  ) : null
}

export default StorageConfigList
