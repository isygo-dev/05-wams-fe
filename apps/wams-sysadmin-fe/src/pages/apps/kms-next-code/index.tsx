// ** React Imports
import React, { useCallback, useState } from 'react'

// ** Next Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Table Components Imports
import TableHeader from 'template-shared/views/table/TableHeader'
import Tooltip from '@mui/material/Tooltip'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { useTranslation } from 'react-i18next'
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
import AccountApis from 'ims-shared/@core/api/ims/account'
import { CodificationTypes } from 'ims-shared/@core/types/ims/nextCodeTypes'
import SidebarAddNextCode from '../../../views/apps/kms-next-code/AddNextCodeDrawer'
import SidebarEditNextCode from '../../../views/apps/kms-next-code/EditNextCodeDrawer'
import NextCodeApis from 'kms-shared/@core/api/kms/next-code'

interface CellType {
  row: CodificationTypes
}

const Codification = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addCodificationOpen, setAddCodificationOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>()
  const [editDataCodification, setEditDataCodification] = useState<CodificationTypes>()
  const [editCodificationOpen, setEditCodificationOpen] = useState<boolean>(false)
  const toggleEditCodificationDrawer = () => setEditCodificationOpen(!editCodificationOpen)
  const { data: codes, isLoading } = useQuery(`codes`, () => NextCodeApis(t).getNextCodes())

  const mutationDelete = useMutation({
    mutationFn: (id: number) => NextCodeApis(t).deleteNextCode(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: CodificationTypes[] =
          (queryClient.getQueryData('codes') as CodificationTypes[])?.filter(
            (item: CodificationTypes) => item.id !== id
          ) || []
        queryClient.setQueryData('codes', updatedItems)
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

  function handelOpenEdit(data: CodificationTypes) {
    setEditCodificationOpen(true)
    setEditDataCodification(data)
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }

  const toggleAddCodeDrawer = () => setAddCodificationOpen(!addCodificationOpen)
  const dataGridApiRef = React.useRef<GridApi>()

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'domain',
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'code',
      headerName: t('code') as string,
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

    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Entity') as string,
      field: 'entity',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.entity}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Attribute') as string,
      field: 'attribute',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.attribute}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Prefix') as string,
      field: 'prefix',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.prefix}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Suffix') as string,
      field: 'suffix',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.suffix}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Value') as string,
      field: 'value',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.value}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.ValueLength') as string,
      field: 'valueLength',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.valueLength}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Codification.Increment') as string,
      field: 'increment',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.increment}
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
      renderCell: ({ row }: CellType) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.DELETE) && (
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
            {checkPermission(PermissionApplication.KMS, PermissionPage.DIGETS_CONFIG, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  className={Styles.sizeIcon}
                  sx={{ color: 'text.secondary' }}
                  onClick={() => handelOpenEdit(row)}
                >
                  <Icon icon='tabler:edit' />
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
          <CardHeader title={t('Search')} />
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddCodeDrawer}
            permissionApplication={PermissionApplication.KMS}
            permissionPage={PermissionPage.APP_NEXT_CODE}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.KMS, PermissionPage.APP_NEXT_CODE, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={codes || []}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                getRowId={row => row.id}
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
        addCodificationOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.APP_NEXT_CODE, PermissionAction.WRITE) && (
          <SidebarAddNextCode open={addCodificationOpen} domain={profileUser?.domain} toggle={toggleAddCodeDrawer} />
        )}
      {deleteDialogOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.APP_NEXT_CODE, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Codification'
            onDelete={onDelete}
          />
        )}
      {editCodificationOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.APP_NEXT_CODE, PermissionAction.WRITE) && (
          <SidebarEditNextCode
            open={editCodificationOpen}
            toggle={toggleEditCodificationDrawer}
            dataNextCode={editDataCodification}
          />
        )}
    </Grid>
  ) : null
}

export default Codification
