import React, {useCallback, useState} from 'react'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import Grid from '@mui/material/Grid'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {useQuery} from 'react-query'
import Card from '@mui/material/Card'
import TableHeader from 'template-shared/views/table/TableHeader'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import SideBarEditLeaveSummary from '../../../views/apps/leaveStatus/SideBarEditLeaveSummary'

import Styles from "template-shared/style/style.module.css"
import themeConfig from "template-shared/configs/themeConfig";
import LeaveStatusApis from "hrm-shared/@core/api/hrm/leaveStatus";
import {LeaveStatusType} from "hrm-shared/@core/types/hrm/leaveStatusType";


interface CellType {
  row: LeaveStatusType
}

export default function () {
  const {t} = useTranslation()
  const [value, setValue] = useState<string>('')
  const [editLeaveStatusOpen, setEditLeaveStatusOpen] = useState<boolean>(false)
  const toggleEditLeaveStatusDrawer = () => setEditLeaveStatusOpen(!editLeaveStatusOpen)
  const [editDataLeaveStatus, setEditDataLeaveStatus] = useState<LeaveStatusType>()

  const dataGridApiRef = React.useRef<GridApi>()
  const {data: leaveStatus, isLoading} = useQuery(`leaveStatus`, () => LeaveStatusApis(t).getLeaveStatus())
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})

  function handleOpenEdit(data: LeaveStatusType) {
    setEditLeaveStatusOpen(true)
    setEditDataLeaveStatus(data)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const handleOpenAdd = () => {
    console.log('add')
  }

  const columns: GridColDef[] = [
    {
      field: 'EmployeeCode',
      headerName: t('LeaveStatus.Employee_Code') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.codeEmployee}</Typography>
    },
    {
      field: 'nameEmployee',
      headerName: t('LeaveStatus.Full_Name') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.nameEmployee}</Typography>
    },
    {
      field: 'AvailableBudget',
      headerName: t('LeaveStatus.available_budget') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{row.leaveCount === null ? 0 : row.leaveCount}</Typography>
      )
    },
    {
      field: 'RecoveryLeaveBudget',
      headerName: t('LeaveStatus.Recovery_Leave_Budget') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>
          {row.recoveryLeaveCount === null ? 0 : row.recoveryLeaveCount}
        </Typography>
      )
    },
    {
      field: 'leaveTakenCount',
      headerName: t('LeaveStatus.leave_Taken_Count') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>
          {row.leaveTakenCount === null ? 0 : row.leaveTakenCount}
        </Typography>
      )
    },
    {
      field: 'remainingLeaveCount',
      headerName: t('LeaveStatus.remaining_Leave_Count') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>
          {row.remainingLeaveCount === null ? 0 : row.leaveTakenCount}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title={t('LeaveStatus.Update_LeaveStatus')}>
            <IconButton
              className={Styles.sizeIcon}
              sx={{color: 'text.secondary'}}
              onClick={() => handleOpenEdit(row)}>
              <Icon icon='tabler:edit'/>
            </IconButton>
          </Tooltip>

          <Tooltip title={t('LeaveStatus.View_LeaveStatus')}>
            <IconButton className={Styles.sizeIcon}
                        sx={{color: 'text.secondary'}}
                        href={`/apps/leaveStatus/view/${row.id}`}>
              <Icon icon='tabler:calendar'/>
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]


  return (
    !isLoading ? (
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              viewAdd={false}
              dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              value={value}
              handleFilter={handleFilter}
              toggle={handleOpenAdd}
            />

            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                pageSizeOptions={themeConfig.pageSizeOptions}
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={leaveStatus || []}
                columns={columns}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: t('Rows_per_page:'),
                    labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
                  }
                }}
                apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              />
            </Box>
          </Card>
        </Grid>


        {editLeaveStatusOpen && (
          <SideBarEditLeaveSummary
            open={editLeaveStatusOpen}
            toggle={toggleEditLeaveStatusDrawer}
            dataParameter={editDataLeaveStatus}
          />
        )}

      </Grid>
    ) : null

  )
}
