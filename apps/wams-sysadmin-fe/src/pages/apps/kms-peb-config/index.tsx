import React, {useCallback, useState} from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import TableHeader from 'template-shared/views/table/TableHeader'
import Tooltip from '@mui/material/Tooltip'
import {PebConfigType} from 'kms-shared/@core/types/kms/pebConfig'
import EditPebDrawer from '../../../views/apps/kms-peb-config/EditPebDrawer'
import AddPebDrawer from '../../../views/apps/kms-peb-config/AddPebDrawer'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import themeConfig from "template-shared/configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import PebConfigApis from "kms-shared/@core/api/kms/peb-config";
import AccountApis from "ims-shared/@core/api/ims/account";


interface CellType {
  row: PebConfigType
}

const Peb = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addPebOpen, setAddPebOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const dataGridApiRef = React.useRef<GridApi>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [editDataPebConfig, setEditDataPebConfig] = useState<PebConfigType>()
  const [editPebConfigOpen, setEditPebConfigOpen] = useState<boolean>(false)
  const toggleEditPebDrawer = () => setEditPebConfigOpen(!editPebConfigOpen)
  const {data: pebConfigs, isLoading} = useQuery(`PEB`, () => PebConfigApis(t).getPebConfigurations())
  const mutationDelete = useMutation({
    mutationFn: (id: number) => PebConfigApis(t).deletePebConfiguration(id),
    onSuccess: (id: number) => {
      if (id) {
        console.log(id)
        setDeleteDialogOpen(false)
        const updatedItems: PebConfigType[] =
          (queryClient.getQueryData('PEB') as PebConfigType[])?.filter((item: PebConfigType) => item.id !== id) || []
        console.log(updatedItems)
        queryClient.setQueryData('PEB', updatedItems)
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
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  async function handelOpenEdit(data: PebConfigType) {
    setEditPebConfigOpen(true)
    setEditDataPebConfig(data)
  }

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true), setSelectedRowId(rowId)
  }

  const toggleAddPebDrawer = () => setAddPebOpen(!addPebOpen)

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'domain',
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'code',
      headerName: t('code') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap variant='body2' sx={{color: 'text.disabled'}}>
              {row.code}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('algorithm') as string,
      field: 'algorithm',
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.algorithm}
          </Typography>
        )
      }
    }
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handelOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Search')}/>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddPebDrawer}
            permissionApplication={PermissionApplication.KMS}
            permissionPage={PermissionPage.PEB_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                getRowId={row => row.id}
                autoHeight

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={pebConfigs || []}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: t('Rows_per_page'),
                    labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
                  }
                }}
                apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              />
            </Box>
          )}
        </Card>
      </Grid>

      {!isLoadingProfileUser && addPebOpen && checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.WRITE) && (
        <AddPebDrawer open={addPebOpen} domain={profileUser?.domain} toggle={toggleAddPebDrawer}/>
      )}
      {editPebConfigOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.WRITE) && (
          <EditPebDrawer open={editPebConfigOpen} toggle={toggleEditPebDrawer} dataPeb={editDataPebConfig}/>
        )}

      {checkPermission(PermissionApplication.KMS, PermissionPage.PEB_CONFIG, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='PEB'
          onDelete={onDelete}
        />
      )}
    </Grid>
  ) : null
}

export default Peb
