import React, {useState} from 'react'
import {Avatar, Box, Card, Grid, Switch, Typography, useMediaQuery} from '@mui/material'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Styles from "template-shared/style/style.module.css"
import CustomChip from 'template-shared/@core/components/mui/chip'
import {useTranslation} from 'react-i18next'
import imsApiUrls from "ims-shared/configs/ims_apis"
import {useTheme} from '@mui/material/styles'
import {useQuery} from 'react-query'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import Moment from 'react-moment'
import themeConfig from 'template-shared/configs/themeConfig'
import AccountApis from "ims-shared/@core/api/ims/account";
import CardHeader from "@mui/material/CardHeader";
import UpdateAdminStatusDialog
  from "template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog";
import {MinAccountDto, systemStatusObj} from "ims-shared/@core/types/ims/accountTypes";

interface CellType {
  row: MinAccountDto
}

interface Props {
  domain: string
}

const AdminAccountsList = (prop: Props) => {
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [viewMode, setViewMode] = useState('auto')
  const theme = useTheme()
  const {t} = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dataGridApiRef = React.useRef<GridApi>()
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [newStatus, setNewStatus] = useState<boolean>(false)

  const {data: accounts, isLoading} = useQuery(['usersByDomain', prop?.domain], () =>
    AccountApis(t).getAccountsByDomain(prop?.domain)
  )

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

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(!status)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    origin: false,
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const defaultColumns: GridColDef[] = [
    /*Photo column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      flex: 0.15,
      minWidth: 100,
      renderCell: ({row}: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={
            row.imagePath !== 'defaultPhoto.jpg' ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${row.id}` : ''
          }
          alt={row.fullName}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      flex: 0.15,
      minWidth: 170,
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

    /*User Name column*/
    {
      field: 'username',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Username') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.code}
            </Typography>
          </Box>
        )
      }
    },

    /*Full Name column*/
    {
      field: 'fullName',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Full_Name') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.fullName}
            </Typography>
          </Box>
        )
      }
    },

    /*Email column*/
    {
      field: 'email',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Email') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.email}
          </Typography>
        )
      }
    },

    /*Func. Role column*/
    {
      field: 'Function role',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Role.Functional_Role') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.functionRole}
          </Typography>
        )
      }
    },

    /*Is Admin column*/
    {
      field: 'isAdmin',
      minWidth: 140,
      flex: 0.15,
      headerName: t('IsAdmin') as string,
      renderCell: ({row}: CellType) => {
        return (
          <>

            <Switch size={'small'} checked={row.isAdmin} readOnly={true}/>

          </>
        )
      }
    },

    /*Last login date column*/
    {
      field: 'loginDate',
      flex: 0.15,
      minWidth: 155,
      sortable: false,
      headerName: t('lastLoginDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary', fontSize: '14px'}}>
              {row.connectionTracking && row.connectionTracking?.length > 0 ? (
                <Moment format='DD-MM-YYYY HH:mm:ss'>
                  {row.connectionTracking?.length > 0 ? row.connectionTracking[0]?.loginDate : '-'}
                </Moment>
              ) : null}
            </Typography>
          </Box>
        )
      }
    },

    /*Admin status column*/
    {
      field: 'adminStatus',
      flex: 0.15,
      minWidth: 150,
      headerName: t('Admin_Status') as string,
      renderCell: ({row}: CellType) => {
        const status = row.adminStatus === 'ENABLED'

        return (
          <>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={status}
                      onChange={() => handleOpenUpdateStatusDialog(row.id ?? 0, status)}/>
            ) : (
              <Switch size={'small'} checked={status}/>
            )}
          </>
        )
      }
    },

    /*System status column*/
    {
      field: 'systemStatus',
      flex: 0.15,
      minWidth: 170,
      headerName: t('System_status') as string,
      renderCell: ({row}: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            className={Styles.sizeCustomChip}
            label={row.systemStatus}
            color={systemStatusObj[row.systemStatus as string]}

          />
        )
      }
    },

    // /*Origin column*/
    // {
    //   flex: 0.15,
    //   field: 'origin',
    //   minWidth: 140,
    //   headerName: t('Origin') as string,
    //   renderCell: ({row}: CellType) => {
    //     return (
    //       <Box sx={{display: 'flex', alignItems: 'center'}}>
    //         <Typography noWrap sx={{color: 'text.secondary'}}>
    //           {row.origin}
    //         </Typography>
    //       </Box>
    //     )
    //   }
    // },

    /*create Date column*/
    {
      field: 'createDate',
      minWidth: 140,
      flex: 0.15,
      headerName: t('AuditInfo.createDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
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
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
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
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
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
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.updatedBy}
            </Typography>
          </Box>
        )
      }
    }
  ]


  const columns: GridColDef[] = [
    ...defaultColumns,

  ]
  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        autoHeight
        rows={accounts || []}
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
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {debounceMs: 500}
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {accounts &&
        Array.isArray(accounts) &&
        accounts.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>

            </Grid>
          )
        })}{' '}
    </Grid>
  )

  return !isLoading ? (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={'List users'}/>
            {checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.READ) ? (
              renderViewBasedOnMode()
            ) : null}
          </Card>
        </Grid>
        {updateStatusDialogOpen &&
          checkPermission(PermissionApplication.IMS, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
            <UpdateAdminStatusDialog
              open={updateStatusDialogOpen}
              setOpen={setUpdateStatusDialogOpen}
              setSelectedRowId={selectedRowId}
              item='Account'
              newStatus={newStatus}
            />
          )}
      </Grid>
    </>
  ) : null
}

export default AdminAccountsList
