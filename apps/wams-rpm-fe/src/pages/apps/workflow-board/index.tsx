// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridApi, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Imports
// ** Styled Components
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import TableHeader from 'template-shared/views/table/TableHeader'
import { WorkflowsBoardType } from 'rpm-shared/@core/types/rpm/workflowBoardTypes'
import AddWorkflowBoardDrawer from '../../../views/apps/workflow-board/AddWorkflowBoardDrawer'
import EditWorkflowBoardDrawer from '../../../views/apps/workflow-board/EditWorkflowBoardDrawer'
import Moment from 'react-moment'

import Styles from 'template-shared/style/style.module.css'
import themeConfig from 'template-shared/configs/themeConfig'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import localStorageKeys from 'template-shared/configs/localeStorage'
import WorkflowBoardApis from 'rpm-shared/@core/api/rpm/workflow-board'

interface CellType {
  row: WorkflowsBoardType
}

const WorkflowBoardList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [addWorkflowBoardOpen, setAddWorkflowBoardOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(null)
  const { data: workflowBoards, isLoading } = useQuery(`workflowBoards`, () => WorkflowBoardApis(t).getWorkflowBoards())
  const [filteredData, setFilteredData] = useState('')
  const [editDataWorkflowBoard, setEditDataWorkflowBoard] = useState<WorkflowsBoardType>()
  const [editWorkflowBoardOpen, setEditWorkflowBoardOpen] = useState<boolean>(false)
  const toggleAddWorkflowBoardDrawer = () => setAddWorkflowBoardOpen(!addWorkflowBoardOpen)
  const toggleEditWorkflowBoardDrawer = () => setEditWorkflowBoardOpen(!editWorkflowBoardOpen)
  const dataGridApiRef = React.useRef<GridApi>()

  useEffect(() => {
    setFilteredData(workflowBoards)
  }, [workflowBoards, filteredData])

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true), setSelectedRowId(rowId)
  }

  async function handelOpenEdit(data: WorkflowsBoardType) {
    setEditWorkflowBoardOpen(true)
    setEditDataWorkflowBoard(data)
  }

  const workflowBoardMutationDelete = useMutation({
    mutationFn: (id: number) => WorkflowBoardApis(t).deleteWorkflowBoard(id),
    onSuccess: (id: number) => {
      if (id) {
        const updatedItems: any[] = ((queryClient.getQueryData('workflowBoards') as any[]) || []).filter(
          item => item.id !== id
        )
        queryClient.setQueryData('workflowBoards', updatedItems)
        localStorage.removeItem(localStorageKeys.dashboardLink)
        localStorage.setItem(localStorageKeys.dashboardLink, JSON.stringify(updatedItems))
      }
    }
  })

  function onDelete(id: number) {
    workflowBoardMutationDelete.mutate(id)
  }

  const handleFilter = (val: string) => {
    setValue(val)
    if (val.trim() === '') {
      setFilteredData(workflowBoards)
    } else {
      const filtered = workflowBoards?.filter(
        row =>
          row.name.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.domain.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.description.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.code.toLowerCase().includes(val.trim().toLowerCase())
      )
      setFilteredData(filtered)
    }
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

    /*Item column*/
    {
      flex: 0.1,
      field: 'item',
      minWidth: 100,
      headerName: t('Item') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}> {row.item}</Typography>
    },

    /*Workflow name column*/
    {
      flex: 0.1,
      field: 'workflow.name',
      minWidth: 100,
      headerName: t('Workflow.Workflow') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}> {row.workflow.name}</Typography>
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
              onClick={() => handelOpenEdit(row)}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW_BOARD, PermissionAction.WRITE) && (
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
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddWorkflowBoardDrawer}
            dataGridApi={dataGridApiRef}
            permissionApplication={PermissionApplication.RPM}
            permissionPage={PermissionPage.WORKFLOW_BOARD}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW_BOARD, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={workflowBoards || []}
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
                apiRef={dataGridApiRef}
              />
            </Box>
          )}
        </Card>
      </Grid>
      {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW_BOARD, PermissionAction.WRITE) && (
        <AddWorkflowBoardDrawer open={addWorkflowBoardOpen} toggle={toggleAddWorkflowBoardDrawer} />
      )}

      {checkPermission(PermissionApplication.RPM, PermissionPage.WORKFLOW_BOARD, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='WorkflowBoard'
          onDelete={onDelete}
          buttonId={'btn-change-workflow-board'}
        />
      )}

      {editWorkflowBoardOpen && (
        <EditWorkflowBoardDrawer
          open={editWorkflowBoardOpen}
          toggle={toggleEditWorkflowBoardDrawer}
          dataWorkflowBoard={editDataWorkflowBoard}
        />
      )}
    </Grid>
  ) : null
}

export default WorkflowBoardList
