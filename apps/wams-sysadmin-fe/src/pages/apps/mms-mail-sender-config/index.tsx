import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AddConfigDrawer from '../../../views/apps/mms-mail-sender-config/AddConfigDrawer'
import Tooltip from '@mui/material/Tooltip'
import { MailSenderConfigTypes } from 'mms-shared/@core/types/mms/mailSenderConfigTypes'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import EditConfigDrawer from '../../../views/apps/mms-mail-sender-config/EditConfigDrawer'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import themeConfig from 'template-shared/configs/themeConfig'
import Styles from 'template-shared/style/style.module.css'
import MailSenderConfigApis from 'mms-shared/@core/api/mms/mail-sender-config'
import AccountApis from 'ims-shared/@core/api/ims/account'

interface CellType {
  row: MailSenderConfigTypes
}

const Config = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addConfigOpen, setaddConfigOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const dataGridApiRef = React.useRef<GridApi>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [editDataConfig, seteditDataConfig] = useState<MailSenderConfigTypes>()
  const [editConfigOpen, seteditConfigOpen] = useState<boolean>(false)
  const toggleEditConfigDrawer = () => seteditConfigOpen(!editConfigOpen)
  const { data: configs, isLoading } = useQuery(`configs`, () => MailSenderConfigApis(t).getMailSenderConfigurations())
  const mutationDelete = useMutation({
    mutationFn: (id: number) => MailSenderConfigApis(t).deleteMailSenderConfiguration(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: MailSenderConfigTypes[] =
          queryClient.getQueryData('configs') || [].filter((item: MailSenderConfigTypes) => item.id !== id)
        queryClient.setQueryData('configs', updatedItems)
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

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  function handelOpenEdit(data: MailSenderConfigTypes) {
    seteditConfigOpen(true)
    seteditDataConfig(data)
  }

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true), setSelectedRowId(rowId)
  }

  const toggleAddConfigDrawer = () => setaddConfigOpen(!addConfigOpen)

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
      field: 'host',
      minWidth: 170,
      headerName: t('Config.host') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.host}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'port',
      minWidth: 170,
      headerName: t('Config.port') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
              {row.port}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Config.Transport_Protocol') as string,
      field: 'transportProtocol',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' /* , textTransform: 'capitalize' */ }}>
            {row.transportProtocol}
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
            {checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.DELETE) && (
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
            {checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.WRITE) && (
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
          <CardHeader />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddConfigDrawer}
            permissionApplication={PermissionApplication.MMS}
            permissionPage={PermissionPage.SENDER_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                getRowId={row => row.id}
                autoHeight
                rows={configs || []}
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
        addConfigOpen &&
        checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.WRITE) && (
          <AddConfigDrawer open={addConfigOpen} domain={profileUser?.domain} toggle={toggleAddConfigDrawer} />
        )}
      {deleteDialogOpen &&
        checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Config'
            onDelete={onDelete}
          />
        )}
      {editConfigOpen &&
        checkPermission(PermissionApplication.MMS, PermissionPage.SENDER_CONFIG, PermissionAction.WRITE) && (
          <EditConfigDrawer open={editConfigOpen} toggle={toggleEditConfigDrawer} dataConfig={editDataConfig} />
        )}
    </Grid>
  ) : null
}

export default Config
