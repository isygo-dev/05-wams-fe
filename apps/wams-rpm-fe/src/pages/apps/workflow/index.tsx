// ** React Imports
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import TableHeader from 'template-shared/views/table/TableHeader'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { WorkflowsType } from 'rpm-shared/@core/types/rpm/workflowTypes'
import AddWorkFlowDrawer from '../../../views/apps/workFlow/AddWorkFlowDrawer'
import Moment from 'react-moment'
import Styles from 'template-shared/style/style.module.css'
import themeConfig from 'template-shared/configs/themeConfig'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import WorkflowApis from 'rpm-shared/@core/api/rpm/workflow'
import AccountApis from 'ims-shared/@core/api/ims/account'

interface CellType {
  row: WorkflowsType
}

const WorkflowList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [addWorkFlowOpen, setAddWorkFlowOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(null)
  const router = useRouter()
  const toggleAddWorkFlowDrawer = () => setAddWorkFlowOpen(!addWorkFlowOpen)
  const { data: workflows, isLoading } = useQuery(`workflows`, () => WorkflowApis(t).getWorkflows())
  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true), setSelectedRowId(rowId)
  }

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const workflowMutationDelete = useMutation({
    mutationFn: (id: number) => WorkflowApis(t).deleteWorkFlow(id),
    onSuccess: (id: number) => {
      setDeleteDialogOpen(false)
      if (id) {
        const updatedItems = ((queryClient.getQueryData('workflows') as any[]) || []).filter(item => item.id !== id)
        queryClient.setQueryData('workflows', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    workflowMutationDelete.mutate(id)
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
      flex: 0.1,
      field: 'domain',
      minWidth: 100,
      headerName: t('Domain.Domain') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },

    /*Code column*/
    {
      flex: 0.1,
      field: 'code',
      minWidth: 100,
      headerName: t('Code') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
    },

    /*Name column*/
    {
      flex: 0.1,
      field: 'name',
      minWidth: 100,
      headerName: t('Name') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
    },

    /*Category column*/
    {
      flex: 0.1,
      field: 'category',
      minWidth: 100,
      headerName: t('Category') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.category}</Typography>
    },

    /*Type column*/
    {
      flex: 0.1,
      field: 'type',
      minWidth: 100,
      headerName: t('Type') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}> {row.type}</Typography>
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

  const dataGridApiRef = React.useRef<GridApi>()

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: t('Action') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('Action.Edit')}>
            <IconButton
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
              onClick={() => router.push(`/apps/workflow/view/${row.id}`)}
            >
              <Icon icon='fluent:slide-text-edit-24-regular' />
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                onClick={() => handleOpenDeleteDialog(row.id)}
                sx={{ color: 'text.secondary' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  return !isLoading ? (
    <Grid container spacing={12}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddWorkFlowDrawer}
            dataGridApi={dataGridApiRef}
            permissionApplication={PermissionApplication.RPM}
            permissionPage={PermissionPage.WORKFLOW}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={workflows || []}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                apiRef={dataGridApiRef}
              />
            </Box>
          )}
        </Card>
      </Grid>
      {!isLoadingProfileUser &&
        addWorkFlowOpen &&
        checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW, PermissionAction.WRITE) && (
          <AddWorkFlowDrawer open={addWorkFlowOpen} toggle={toggleAddWorkFlowDrawer} domain={profileUser?.domain} />
        )}

      {deleteDialogOpen &&
        checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW, PermissionAction.DELETE) && (
          <DeleteCommonDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            selectedRowId={selectedRowId}
            onDelete={onDelete}
            item='Workflow'
          />
        )}
    </Grid>
  ) : null
}

export default WorkflowList
