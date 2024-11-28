// ** React Imports
import React, {useCallback, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Store Imports
// ** Types Imports
// ** Custom Table Components Imports
import TableHeader from 'template-shared/views/table/TableHeader'
import Tooltip from '@mui/material/Tooltip'
import {TemplateType} from 'mms-shared/@core/types/mms/templateTypes'
import AddTemplateDrawer from '../../../views/apps/mms-mail-template/AddTemplateDrawer'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useTranslation} from 'react-i18next'
import Link from 'next/link'
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
import MailTemplateApis from "mms-shared/@core/api/mms/mail-template";
import AccountApis from "ims-shared/@core/api/ims/account";


interface CellType {
  row: TemplateType
}

const Template = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addTemplateOpen, setAddTemplateOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const dataGridApiRef = React.useRef<GridApi>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>()
  const {data: templates, isLoading} = useQuery(`templates`, () => MailTemplateApis(t).getMessageTemplates())
  const mutationDelete = useMutation({
    mutationFn: (id: number) => MailTemplateApis(t).deleteMessageTemplate(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: TemplateType[] =
          (queryClient.getQueryData('templates') as TemplateType[])?.filter((item: TemplateType) => item.id !== id) ||
          []
        queryClient.setQueryData('templates', updatedItems)
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
  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true), setSelectedRowId(rowId)
  }

  const toggleAddTemplateDrawer = () => setAddTemplateOpen(!addTemplateOpen)
  const defaultColumns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
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
      flex: 0.25,
      minWidth: 280,
      field: 'name',
      headerName: t('Name') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap variant='body2' sx={{color: 'text.disabled'}}>
              {row.name}
            </Typography>
          </Box>
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
            {checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.DELETE) && (
              <Tooltip title={t('Action.Delete')}>
                <IconButton
                  className={Styles.sizeIcon}
                  sx={{color: 'text.secondary'}}
                  onClick={() => handleOpenDeleteDialog(row.id ?? 0)}
                >
                  <Icon icon='tabler:trash'/>
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  className={Styles.sizeIcon}
                  component={Link}
                  sx={{color: 'text.secondary'}}
                  href={`/apps/mms-mail-template/view/TemplateView/${row.id}`}
                >
                  <Icon icon='fluent:slide-text-edit-24-regular'/>
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Download')}>
                <IconButton
                  className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                  onClick={() => MailTemplateApis(t).handleDownloadMessageTemplateFile(row)}>
                  <Icon icon='tabler:download'/>
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
          <CardHeader/>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddTemplateDrawer}
            permissionApplication={PermissionApplication.MMS}
            permissionPage={PermissionPage.MSG_TEMPLATE}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                getRowId={row => row.id}
                autoHeight

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={templates || []}
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

      {!isLoadingProfileUser && addTemplateOpen &&
        checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE) && (
          <AddTemplateDrawer open={addTemplateOpen} domain={profileUser?.domain} toggle={toggleAddTemplateDrawer}/>
        )}
      {deleteDialogOpen &&
        checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            item='Template'
            onDelete={onDelete}
          />
        )}
    </Grid>
  ) : null
}

export default Template
