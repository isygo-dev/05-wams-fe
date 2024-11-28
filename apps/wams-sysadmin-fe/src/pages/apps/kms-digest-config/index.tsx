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
import AddDigestDrawer from '../../../views/apps/kms-digest-config/AddDigestDrawer'
import {DigestConfigTypes} from 'kms-shared/@core/types/kms/DigestConfig'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import EditDigestDrawer from '../../../views/apps/kms-digest-config/EditDigestDrawer'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import themeConfig from "template-shared/configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import DigesterConfigApis from "kms-shared/@core/api/kms/digest-config";
import AccountApis from "ims-shared/@core/api/ims/account";

interface CellType {
  row: DigestConfigTypes
}

const Digest = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addDigestOpen, setAddDigestOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>()
  const [editDataDigestConfig, setEditDataDigestConfig] = useState<DigestConfigTypes>()
  const [editDigestConfigOpen, setEditDigestConfigOpen] = useState<boolean>(false)
  const toggleEditDigestDrawer = () => setEditDigestConfigOpen(!editDigestConfigOpen)

  const {data: digests, isLoading} = useQuery(`digests`, () => DigesterConfigApis(t).getDigestConfigurations())

  const mutationDelete = useMutation({
    mutationFn: (id: number) => DigesterConfigApis(t).deleteDigestConfiguration(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: DigestConfigTypes[] =
          (queryClient.getQueryData('digests') as DigestConfigTypes[])?.filter(
            (item: DigestConfigTypes) => item.id !== id
          ) || []
        queryClient.setQueryData('digests', updatedItems)
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

  function handelOpenEdit(data: DigestConfigTypes) {
    setEditDigestConfigOpen(true)
    setEditDataDigestConfig(data)
  }

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }

  const toggleAddDigestDrawer = () => setAddDigestOpen(!addDigestOpen)
  const dataGridApiRef = React.useRef<GridApi>()

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
      headerName: t('Digest.algorithm') as string,
      field: 'algorithm',
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.algorithm}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Digest.iterations') as string,
      field: 'iterations',
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.iterations}
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
        <>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.DELETE) && (
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
            {checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handelOpenEdit(row)}>
                  <Icon icon='tabler:edit'/>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </>
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
            toggle={toggleAddDigestDrawer}
            permissionApplication={PermissionApplication.KMS}
            permissionPage={PermissionPage.DIGETS_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={digests || []}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                getRowId={row => row.id}
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

      {!isLoadingProfileUser && addDigestOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.WRITE) && (
          <AddDigestDrawer open={addDigestOpen} domain={profileUser?.domain} toggle={toggleAddDigestDrawer}/>
        )}
      {deleteDialogOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Digest'
            onDelete={onDelete}
          />
        )}
      {editDigestConfigOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.WRITE) && (
          <EditDigestDrawer
            open={editDigestConfigOpen}
            toggle={toggleEditDigestDrawer}
            dataDigest={editDataDigestConfig}
          />
        )}
    </Grid>
  ) : null
}

export default Digest
