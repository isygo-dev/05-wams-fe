// ** React Imports
import React, {useCallback, useState} from 'react'

// ** Next Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'template-shared/@core/components/mui/chip'

// ** Types Imports
import {ThemeColor} from 'template-shared/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'template-shared/views/table/TableHeader'

import Tooltip from '@mui/material/Tooltip'

import {PasswordConfigType} from 'kms-shared/@core/types/kms/passwordConfigTypes'
import AddPwdConfigDrawer from '../../../views/apps/kms-password-config/AddPwdConfigDrawer'

import EditPwdConfigDrawer from '../../../views/apps/kms-password-config/EditPwdConfigDrawer'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useTranslation} from 'react-i18next'
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
import AccountApis from "ims-shared/@core/api/ims/account";
import PasswordConfigApis from "kms-shared/@core/api/kms/password-config";


interface charSetType {
  [key: string]: ThemeColor
}

interface authType {
  [key: string]: ThemeColor
}

interface CellType {
  row: PasswordConfigType
}

const charSetTypeObj: charSetType = {
  ALL: 'success',
  ALPHA: 'secondary',
  ALPHANUM: 'info',
  NUMERIC: 'warning'
}

const authTypeObj: authType = {
  PWD: 'success',
  OTP: 'secondary',
  QRC: 'info',
  TOKEN: 'warning'
}

const PasswordConfigList = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [addPwdConfigOpen, setAddPwdConfigOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const dataGridApiRef = React.useRef<GridApi>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [editDataPwdConfig, setEditDataPwdConfig] = useState<PasswordConfigType>()
  const [editPwdConfigOpen, setEditPwdConfigOpen] = useState<boolean>(false)
  const {
    data: passwordConfigs,
    isLoading
  } = useQuery(`passwordConfigs`, () => PasswordConfigApis(t).getPasswordConfigurations())

  const mutationDelete = useMutation({
    mutationFn: (id: number) => PasswordConfigApis(t).deletePasswordConfiguration(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)

        const updatedItems: PasswordConfigType[] =
          (queryClient.getQueryData('passwordConfigs') as PasswordConfigType[])?.filter(
            (item: PasswordConfigType) => item.id !== id
          ) || []
        queryClient.setQueryData('passwordConfigs', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }

  const toggleEditPwdConfigDrawer = () => setEditPwdConfigOpen(!editPwdConfigOpen)

  const toggleAddPwdConfigDrawer = () => setAddPwdConfigOpen(!addPwdConfigOpen)
  const handelOpenEdit = (data: PasswordConfigType) => {
    setEditPwdConfigOpen(true)
    setEditDataPwdConfig(data)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'domain',
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.domain}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'code',
      headerName: t('Code') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': {color: 'primary.main'}
              }}
            ></Typography>
            <Typography noWrap variant='body2' sx={{color: 'text.disabled'}}>
              {row.code}
            </Typography>
          </Box>
        </Box>
      )
    },

    {
      flex: 0.15,
      field: 'type',
      minWidth: 170,
      headerName: t('Password.Type') as string,
      renderCell: ({row}: CellType) => (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.type}
          color={authTypeObj[row.type]}

          /* sx={{textTransform: 'capitalize'}} */
        />
      )
    },

    {
      flex: 0.15,
      field: 'charSetType',
      minWidth: 170,
      headerName: t('Password.CharsetType') as string,
      renderCell: ({row}: CellType) => (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.charSetType}
          color={charSetTypeObj[row.charSetType]}

          /* sx={{textTransform: 'capitalize'}} */
        />
      )
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'minLength',
      headerName: t('Password.MinLength') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.minLength}
          </Typography>
        </Box>
      )
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'maxLength',
      headerName: t('Password.MaxLength') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.maxLength}
          </Typography>
        </Box>
      )
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'pattern',
      headerName: t('Password.Pattern') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography noWrap sx={{color: 'text.secondary' /* , textTransform: 'capitalize' */}}>
            {row.pattern}
          </Typography>
        </Box>
      )
    },

    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handelOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddPwdConfigDrawer}
            permissionApplication={PermissionApplication.KMS}
            permissionPage={PermissionPage.PASSWORD_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={passwordConfigs || []}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              />
            </Box>
          )}
        </Card>
      </Grid>

      {!isLoadingProfileUser && addPwdConfigOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.WRITE) && (
          <AddPwdConfigDrawer open={addPwdConfigOpen} domain={profileUser?.domain} toggle={toggleAddPwdConfigDrawer}/>
        )}

      {editPwdConfigOpen &&
        checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.WRITE) && (
          <EditPwdConfigDrawer
            open={editPwdConfigOpen}
            toggle={toggleEditPwdConfigDrawer}
            dataPwdConfig={editDataPwdConfig}
          />
        )}

      {checkPermission(PermissionApplication.KMS, PermissionPage.PASSWORD_CONFIG, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Password'
          onDelete={onDelete}
        />
      )}
    </Grid>
  ) : null
}

export default PasswordConfigList
