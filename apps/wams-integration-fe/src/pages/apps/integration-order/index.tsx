// ** React Imports
import React, {useCallback, useState} from 'react'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import {Card, ToggleButtonGroup} from '@mui/material'
import {useTranslation} from 'react-i18next'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import ToggleButton from '@mui/material/ToggleButton'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import themeConfig from "template-shared/configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import AddIntegrationOrderDrawer from "../../../views/apps/integration-order/AddIntegrationOrderDrawer";
import {IntegrationOrderType} from "integration-shared/@core/types/integration/IntegrationOrderTypes";
import EditIntegrationOrderDrawer from "../../../views/apps/integration-order/EditIntegrationOrderDrawer";
import AccountApis from "ims-shared/@core/api/ims/account";
import IntegrationOrderApis from "integration-shared/@core/api/integration/order";

const IntegrationOrderList = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()

  interface CellType {
    row: IntegrationOrderType
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataIntegrationOrder, setEditDataIntegrationOrder] = useState<IntegrationOrderType>()
  const [addIntegrationOrderOpen, setAddIntegrationOrderOpen] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [editIntegrationOrderOpen, setEditIntegrationOrderOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const toggleEditIntegrationOrderDrawer = () => setEditIntegrationOrderOpen(!editIntegrationOrderOpen)
  const toggleAddIntegrationOrderDrawer = () => setAddIntegrationOrderOpen(!addIntegrationOrderOpen)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  function handleOpenEdit(data: IntegrationOrderType) {
    setEditIntegrationOrderOpen(true)
    setEditDataIntegrationOrder(data)
  }

  const {data: integrationOrder, isLoading} = useQuery(`integrationOrder`, IntegrationOrderApis(t).getIntegrationOrders)

  const integrationOrderMutationDelete = useMutation({
    mutationFn: (id: number) => IntegrationOrderApis(t).deleteIntegrationOrder(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: IntegrationOrderType[] =
          (queryClient.getQueryData('integrationOrder') as IntegrationOrderType[])?.filter(
            (item: IntegrationOrderType) => item.id !== id
          ) || []
        queryClient.setQueryData('integrationOrder', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    integrationOrderMutationDelete.mutate(id)
  }


  const downloadIntegrationOrderFileMutation = useMutation({
    mutationFn: (data: {
      id: number,
      originalFileName: string
    }) => IntegrationOrderApis(t).downloadIntegrationOrderFile(data),
    onSuccess: () => {
    }
  })

  function onDownload(row) {
    downloadIntegrationOrderFileMutation.mutate({id: row.id, originalFileName: row.originalFileName})
  }

  const [viewMode, setViewMode] = useState('auto')

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const renderViewBasedOnMode = () => {
    if (isMobile && viewMode === 'auto') {
      return cardView
    } else if (!isMobile && viewMode === 'auto') {
      return gridView
    } else if (viewMode === 'grid') {
      return gridView
    } else if (viewMode === 'card') {
      return cardView
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
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      flex: 1,

      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap variant='body2' sx={{color: 'text.disabled'}}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },

    /*Code Column*/
    {
      field: 'code',
      headerName: t('Code') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },

    /*Name Column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
    },

    /*integrationOrder Column*/
    {
      field: 'integrationOrder',
      headerName: t('IntegrationOrder.IntegrationOrder') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.integrationOrder}</Typography>
    },

    /*serviceName Column*/
    {
      field: 'serviceName',
      headerName: t('IntegrationOrder.serviceName') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.serviceName}</Typography>
    },

    /*mapping Column*/
    {
      field: 'mapping',
      headerName: t('IntegrationOrder.mapping') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.mapping}</Typography>
    }
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>

          <Tooltip title={t('Action.Delete')}>
            <IconButton onClick={() => handleOpenDeleteDialog(row.id)}
                        className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
              <Icon icon='tabler:trash'/>
            </IconButton>
          </Tooltip>


          <Tooltip title={t('Action.Edit')}>
            <IconButton
              className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleOpenEdit(row)}>
              <Icon icon='tabler:edit'/>
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Action.Download') as string}>
            <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => onDownload(row)}>
              <Icon icon='material-symbols:download'/>
            </IconButton>
          </Tooltip>

        </Box>
      )
    }
  ]
  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        pagination

        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={integrationOrder || []}
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
            labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )
  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {integrationOrder &&
        Array.isArray(integrationOrder) &&
        integrationOrder.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>

            </Grid>
          )
        })}{' '}
    </Grid>
  )

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
            <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
              <ToggleButton value='grid' aria-label='left aligned'>
                <Icon icon='ic:baseline-view-list'/>
              </ToggleButton>
              <ToggleButton value='card' aria-label='center aligned'>
                <Icon icon='ic:baseline-view-module'/>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddIntegrationOrderDrawer}
          />

          {renderViewBasedOnMode()}

        </Card>
      </Grid>

      {!isLoadingProfileUser && addIntegrationOrderOpen && (
        <AddIntegrationOrderDrawer open={addIntegrationOrderOpen} domain={profileUser?.domain}
                                   toggle={toggleAddIntegrationOrderDrawer}/>)}
      <DeleteCommonDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        selectedRowId={selectedRowId}
        onDelete={onDelete}
        item='IntegrationOrder'
      />
      {editIntegrationOrderOpen && (
        <EditIntegrationOrderDrawer
          open={editIntegrationOrderOpen}
          toggle={toggleEditIntegrationOrderDrawer}
          dataIntegrationOrder={editDataIntegrationOrder}

        />
      )}
    </Grid>
  ) : null
}
export default IntegrationOrderList
