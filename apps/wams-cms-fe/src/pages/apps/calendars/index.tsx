import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridApi, GridColDef } from '@mui/x-data-grid'
import Icon from 'template-shared/@core/components/icon'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import AddCalendarDrawer from '../../../views/apps/calendarPreview/AddCalendarDrawer'
import EditCalendarDrawer from '../../../views/apps/calendarPreview/EditCalendarDrawer'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import { useTranslation } from 'react-i18next'
import TableHeader from 'template-shared/views/table/TableHeader'
import { Switch } from '@mui/material'
import Styles from 'template-shared/style/style.module.css'
import UpdateAdminStatusDialog from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps'
import localStorageKeys from 'template-shared/configs/localeStorage'
import { CalendarsType } from 'template-shared/@core/types/helper/calendarTypes'
import CalendarApis from 'cms-shared/@core/api/cms/calendar'

interface CellType {
  row: CalendarsType
}

/* eslint-enable */

const AppCalendars = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const { data: countCalendar, isLoading: isLoadingCountCalendar } = useQuery(`countCalendar`, () =>
    CalendarApis(t).getCalendarsCount()
  )
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: paginationPage,
    pageSize:
      localStorage.getItem(localStorageKeys.paginationSize) &&
      Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9
        ? Number(localStorage.getItem(localStorageKeys.paginationSize))
        : 20
  })
  const [addCalenderOpen, setAddCalendarOpen] = useState<boolean>(false)
  const [editCalenderOpen, setEditCalendarOpen] = useState<boolean>(false)
  const [editDataCalendar, setEditDataCalendar] = useState<CalendarsType>()
  const toggleAddCalendarDrawer = () => setAddCalendarOpen(!addCalenderOpen)
  const toggleEditCalendarDrawer = () => setEditCalendarOpen(!editCalenderOpen)
  const { data: calendars, isLoading } = useQuery(`calendars`, () =>
    CalendarApis(t).getCalendarsByPage(paginationModel.page, paginationModel.pageSize)
  )

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const dataGridApiRef = React.useRef<GridApi>()

  async function handelOpenEdit(data: CalendarsType) {
    setEditCalendarOpen(true)
    setEditDataCalendar(data)
  }

  const theme = useTheme()

  useEffect(() => {
    console.log(' theme.palette', theme.palette)
  })

  useEffect(() => {
    const getPage = localStorage.getItem(localStorageKeys.paginationSize)
    if (!getPage || Number(getPage) < 9) {
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, '20')
    } else {
      setPaginationModel({
        page: paginationPage,
        pageSize: Number(localStorage.getItem(localStorageKeys.paginationSize))
      })
    }
  }, [setPaginationModel])
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await CalendarApis(t).getCalendarsByPage(0, item.pageSize)
      queryClient.removeQueries('calendars')
      queryClient.setQueryData('calendars', apiList)
      setPaginationPage(0)
      setPaginationModel({ page: 0, pageSize: item.pageSize })
      setDisabledNextBtn(false)
    }
  }

  const onChangePage = async item => {
    let newPagination: GridPaginationModel
    if (item === 'backIconButtonProps') {
      newPagination = {
        page: paginationModel.page - 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await CalendarApis(t).getCalendarsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('calendars')
        queryClient.setQueryData('calendars', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await CalendarApis(t).getCalendarsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('calendars')
        queryClient.setQueryData('calendars', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }
  }

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const mutationDelete = useMutation({
    mutationFn: (id: number) => CalendarApis(t).deleteCalendars(id),
    onSuccess: (id: number) => {
      setDeleteDialogOpen(false)
      const updatedItems: CalendarsType[] =
        (queryClient.getQueryData('calendars') as CalendarsType[])?.filter((item: CalendarsType) => item.id !== id) ||
        []
      queryClient.setQueryData('calendars', updatedItems)
    },
    onError: err => {
      console.log(err)
    }
  })

  let openEditCalendarForm
  if (editCalenderOpen) {
    openEditCalendarForm = (
      <EditCalendarDrawer open={editCalenderOpen} toggle={toggleEditCalendarDrawer} dataCalendar={editDataCalendar} />
    )
  } else {
    openEditCalendarForm = ''
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleOpenUpdateIsAdmin = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(!status)
  }
  console.log('newStatus', newStatus)

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'code',
      headerName: t('Code') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'name',
      headerName: t('Name') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'icsPath',
      headerName: t('Path') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.icsPath}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'locked',
      headerName: t('Locked') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {checkPermission(PermissionApplication.CMS, PermissionPage.VCALENDAR, PermissionAction.WRITE) ? (
              <Switch
                size={'small'}
                checked={row.locked}
                onChange={() => handleOpenUpdateIsAdmin(row.id, row.locked)}
              />
            ) : (
              <Switch size={'small'} checked={row.locked} />
            )}
          </>
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
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={row.description}>
            <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:info-circle' />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Action.Delete')}>
            <IconButton
              size='small'
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
              onClick={() => handleOpenDeleteDialog(row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('View calendar')}>
            <IconButton
              size='small'
              component={Link}
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
              href={`/apps/calendars/view/${row.id}/`}
            >
              <Icon icon='fluent:slide-text-edit-24-regular' />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Edit calendar')}>
            <IconButton
              size='small'
              className={Styles.sizeIcon}
              sx={{ color: 'text.secondary' }}
              onClick={() => handelOpenEdit(row)}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      {!isLoading && !isLoadingCountCalendar ? (
        <Grid>
          <DatePickerWrapper>
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <Card>
                  <TableHeader
                    dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                    value={value}
                    handleFilter={handleFilter}
                    toggle={toggleAddCalendarDrawer}
                  />

                  <DataGrid
                    autoHeight
                    pagination
                    rowHeight={62}
                    rows={calendars || []}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 25, 50]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onChangePagination}
                    slotProps={{
                      pagination: {
                        count: countCalendar,
                        page: paginationPage,
                        labelDisplayedRows: ({ page, count }) =>
                          `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,
                        labelRowsPerPage: t('Rows_per_page'),
                        nextIconButtonProps: {
                          onClick: () => onChangePage('nextIconButtonProps'),
                          disabled: disabledNextBtn || calendars?.length < paginationModel.pageSize
                        },
                        backIconButtonProps: {
                          onClick: () => onChangePage('backIconButtonProps'),
                          disabled: paginationModel.page === 0
                        }
                      },
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 }
                      }
                    }}
                    apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                  />
                </Card>
              </Grid>
            </Grid>
          </DatePickerWrapper>

          {addCalenderOpen &&
            checkPermission(PermissionApplication.CMS, PermissionPage.VCALENDAR, PermissionAction.WRITE) && (
              <AddCalendarDrawer open={addCalenderOpen} toggle={toggleAddCalendarDrawer} />
            )}
          {openEditCalendarForm}
          {deleteDialogOpen &&
            checkPermission(PermissionApplication.CMS, PermissionPage.VCALENDAR, PermissionAction.DELETE) && (
              <DeleteCommonDialog
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                selectedRowId={selectedRowId}
                item='Calendar'
                onDelete={onDelete}
              />
            )}
          {updateStatusDialogOpen &&
            checkPermission(PermissionApplication.CMS, PermissionPage.VCALENDAR, PermissionAction.WRITE) && (
              <UpdateAdminStatusDialog
                open={updateStatusDialogOpen}
                setOpen={setUpdateStatusDialogOpen}
                setSelectedRowId={selectedRowId}
                item='Calendar'
                newStatus={newStatus}
              />
            )}
        </Grid>
      ) : null}
    </>
  )
}

export default AppCalendars
