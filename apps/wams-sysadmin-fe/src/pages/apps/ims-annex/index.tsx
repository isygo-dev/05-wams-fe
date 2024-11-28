import React, {useCallback, useEffect, useState} from 'react'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import Card from '@mui/material/Card'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import AddAnnexDrawer from '../../../views/apps/annex/AddAnnexDrawer'
import SidebarEditAnnex from '../../../views/apps/annex/EditAnnexConfig'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import themeConfig from "template-shared/configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import AnnexApis from "ims-shared/@core/api/ims/annex";
import AccountApis from "ims-shared/@core/api/ims/account";
import {AnnexType} from "ims-shared/@core/types/ims/annexTypes";

interface CellType {
  row: AnnexType
}

const AnnexList = () => {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataAnnex, setEditDataAnnex] = useState<AnnexType>()
  const [addAnnexOpen, setAddAnnexOpen] = useState<boolean>(false)
  const [editAnnexOpen, setEditAnnexOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )
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
  const {data: annexList, isLoading} = useQuery('annexList', () =>
    AnnexApis(t).getAnnexesByPage(paginationModel.page, paginationModel.pageSize))
  const {
    data: countAnnex,
    isLoading: isLoadingCountAnnex
  } = useQuery(`countAnnex`, () => AnnexApis(t).getAnnexesCount())
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const toggleEditAnnexDrawer = () => setEditAnnexOpen(!editAnnexOpen)
  const toggleAddAnnexDrawer = () => setAddAnnexOpen(!addAnnexOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }
  const annexMutationDelete = useMutation({
    mutationFn: (id: number) => AnnexApis(t).deleteAnnexById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: AnnexType[] =
          (queryClient.getQueryData('annexList') as AnnexType[])?.filter((item: AnnexType) => item.id !== id) || []
        queryClient.setQueryData('annexList', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    annexMutationDelete.mutate(id)
  }

  const tableCodeList = annexList?.map(annex => annex.tableCode)
  const uniqueTableCodes: string[] = Array.from(new Set(tableCodeList))

  function handleOpenEdit(data: AnnexType) {
    setEditAnnexOpen(true)
    setEditDataAnnex(data)
  }

  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  const columns: GridColDef[] = [
    {
      field: 'tableCode',
      headerName: t('tableCode') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.tableCode}</Typography>
    },
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
    {
      field: 'value',
      headerName: t('Parameter.Value') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.value}</Typography>
    },
    {
      field: 'Reference',
      headerName: t('Reference') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.reference}</Typography>
    },
    {
      field: 'Language',
      headerName: t('Language') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.language}</Typography>
    },
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title={row.description}>
            <IconButton
              className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
              <Icon icon='tabler:info-circle'/>
            </IconButton>
          </Tooltip>

          {checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.DELETE) && (
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
          {checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Save')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}} onClick={() => handleOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]


  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await AnnexApis(t).getAnnexesByPage(0, item.pageSize)
      queryClient.removeQueries('annexList')
      queryClient.setQueryData('annexList', apiList)
      setPaginationPage(0)
      setPaginationModel({page: 0, pageSize: item.pageSize})
      setDisabledNextBtn(false)
    }
  }

  const onChangePage = async (item) => {

    let newPagination: GridPaginationModel
    if (item === 'backIconButtonProps') {
      newPagination = {
        page: paginationModel.page - 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await AnnexApis(t).getAnnexesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('annexList')
        queryClient.setQueryData('annexList', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)

    } else if (item === 'nextIconButtonProps') {

      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await AnnexApis(t).getAnnexesByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('annexList')
        queryClient.setQueryData('annexList', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {

        setDisabledNextBtn(true)
      }
    }

  }


  return (
    <>
      {!isLoading && !isLoadingCountAnnex ? (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <TableHeader
                dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                value={value}
                handleFilter={handleFilter}
                toggle={toggleAddAnnexDrawer}
                permissionApplication={PermissionApplication.IMS}
                permissionPage={PermissionPage.ANNEX}
                permissionAction={PermissionAction.WRITE}
              />
              {checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.READ) && (
                <Box className={Styles.boxTable}>
                  <DataGrid
                    autoHeight
                    pagination

                    className={Styles.tableStyleNov}
                    columnHeaderHeight={themeConfig.columnHeaderHeight}
                    rowHeight={themeConfig.rowHeight}
                    rows={annexList || []}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={themeConfig.pageSizeOptions}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onChangePagination}
                    slotProps={{

                      pagination: {

                        count: countAnnex,
                        page: paginationPage,


                        labelDisplayedRows: ({page, count}) =>
                          `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`,
                        labelRowsPerPage: t('Rows_per_page'),
                        nextIconButtonProps: {
                          'onClick': () => onChangePage('nextIconButtonProps'),
                          disabled: disabledNextBtn || annexList?.length < paginationModel.pageSize,

                        },
                        backIconButtonProps: {
                          'onClick': () => onChangePage('backIconButtonProps'),
                          disabled: paginationModel.page === 0,
                        }
                      },
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {debounceMs: 500}
                      }
                    }}
                    apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                  />
                </Box>
              )}
            </Card>
          </Grid>
          {!isLoadingProfileUser && checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.WRITE) && (
            <AddAnnexDrawer open={addAnnexOpen} toggle={toggleAddAnnexDrawer} domain={profileUser?.domain}
                            uniqueTableCodes={uniqueTableCodes}/>
          )}

          {checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.DELETE) && (
            <DeleteCommonDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              selectedRowId={selectedRowId}
              onDelete={onDelete}
              item='Annex'
            />
          )}

          {editAnnexOpen &&
            checkPermission(PermissionApplication.IMS, PermissionPage.ANNEX, PermissionAction.WRITE) && (
              <SidebarEditAnnex open={editAnnexOpen} toggle={toggleEditAnnexDrawer} dataParameter={editDataAnnex}
                                uniqueTableCodes={uniqueTableCodes}/>
            )}
        </Grid>
      ) : null}
    </>
  )
}

export default AnnexList
