import React, {useCallback, useEffect, useState} from 'react'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import {useTranslation} from 'react-i18next'
import Grid from '@mui/material/Grid'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import Card from '@mui/material/Card'
import TableHeader from 'template-shared/views/table/TableHeader'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {AddContractDrawer} from '../../../views/apps/contract/addContractDrawer'
import Link from 'next/link'
import {Avatar, ToggleButton, ToggleButtonGroup} from '@mui/material'
import hrmApiUrls from "hrm-shared/configs/hrm_apis";
import {format} from 'date-fns'
import Badge from '@mui/material/Badge'
import {useTheme} from '@mui/system'
import {useRouter} from 'next/router'
import useMediaQuery from '@mui/material/useMediaQuery'
import ContractCard from './view/ContractCard'
import Styles from "template-shared/style/style.module.css"
import themeConfig from "template-shared/configs/themeConfig";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import localStorageKeys from "template-shared/configs/localeStorage";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import PaginationCard from "template-shared/@core/components/card-pagination";
import ContractApis from "hrm-shared/@core/api/hrm/contract";
import AccountApis from "ims-shared/@core/api/ims/account";
import {ContractType, MinContractType} from "hrm-shared/@core/types/hrm/contractType";
import EmployeeApis from "hrm-shared/@core/api/hrm/employee";

interface CellType {
  row: MinContractType
}

export default function () {
  const {t} = useTranslation()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const {
    data: contract,
    isLoading
  } = useQuery(`contract`, () => ContractApis(t).getContractsByPage(paginationModel.page, paginationModel.pageSize))

  const {data: employeeList, isLoading: employeeLoading} = useQuery('employee', EmployeeApis(t).getEmployees)
  const {
    data: countContract,
    isLoading: isLoadingCountContract
  } = useQuery(`countContract`, () => ContractApis(t).getContractsCount())

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [addContractOpen, setAddContractOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('auto')
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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

  const employeeIdFullNameList = employeeList?.map(employee => ({
    id: employee.id,
    fullName: `${employee.firstName} ${employee.lastName}`
  }))

  const mutationDelete = useMutation({
    mutationFn: (id: number) => ContractApis(t).deleteContractById(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: ContractType[] =
          (queryClient.getQueryData('contract') as ContractType[])?.filter((item: ContractType) => item.id !== id) || []
        queryClient.setQueryData('contract', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {

    }
  }

  const onChangePage = async (item) => {

    let newPagination: GridPaginationModel
    if (item === 'backIconButtonProps') {
      newPagination = {
        page: paginationModel.page - 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await ContractApis(t).getContractsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('contract')
        queryClient.setQueryData('contract', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      }
      setDisabledNextBtn(false)
    } else if (item === 'nextIconButtonProps') {
      newPagination = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize
      }
      const apiList = await ContractApis(t).getContractsByPage(newPagination.page, newPagination.pageSize)
      if (apiList && apiList.length > 0) {
        queryClient.removeQueries('contract')
        queryClient.setQueryData('contract', apiList)
        setPaginationPage(newPagination.page)
        setPaginationModel(newPagination)
      } else {
        setDisabledNextBtn(true)
      }
    }

  }


  const toggleAddContractDrawer = () => {
    setAddContractOpen(!addContractOpen)
  }

  const handleOpenAdd = () => {
    toggleAddContractDrawer()
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    AccountApis(t).getAccountProfile
  )

  const columns: GridColDef[] = [
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 0.1,
      renderCell: ({row}: CellType) => (

        <Avatar
          className={Styles.avatarTable}
          alt={row.code}
          src={
            row.employee ? `${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${row.employee}?${Date.now()}` : ''
          }
        />
      )
    },
    {
      field: 'domain',
      headerName: t('domain') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },
    {
      field: 'code',
      headerName: t('Code') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },

    {
      field: 'contract type',
      headerName: t('Contract.Contract_Type') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.contract}</Typography>
    },
    {
      field: 'employee',
      headerName: t('Employee.Full_Name'),
      minWidth: 150,
      flex: 0.1,
      renderCell: ({row}: CellType) => {
        const employee = employeeList?.find(emp => emp.id === row.employee)

        return (
          <Typography sx={{color: 'text.secondary'}}>
            {employee ? `${employee.firstName} ${employee.lastName}` : ''}
          </Typography>
        )
      }
    },
    {
      field: 'start date',
      headerName: t('Contract.start_Date') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{format(new Date(row.startDate), 'dd-MM-yyyy')}</Typography>
      )
    },
    {
      field: 'end date',
      headerName: t('Contract.End_Date') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{format(new Date(row.endDate), 'dd-MM-yyyy')}</Typography>
      )
    },
    {
      field: 'createdDate',
      headerName: t('CreateDate') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}>{format(new Date(row.createDate), 'yyyy-MM-dd')}</Typography>
      )
    },
    {
      field: 'updatedDate',
      headerName: t('UpdateDate') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Typography sx={{color: 'text.secondary'}}> {format(new Date(row.updateDate), 'yyyy-MM-dd')}</Typography>
      )
    },
    {
      field: 'status',
      headerName: t('Contract.Is_Locked') as string,
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Badge
          className={Styles.sizeBadge}
          badgeContent={row.isLocked ? t('Yes') : t('No')}
          color={row.isLocked ? 'error' : 'success'}
        />
      )
    },

    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      minWidth: 100,
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.DELETE) &&
            <Tooltip title={t('Contract.Delete_Contract')}>
              <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                          onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>}

          <Tooltip title={t('Action.Edit')}>
            <IconButton
              className={Styles.sizeIcon}
              component={Link}
              sx={{color: 'text.secondary'}}
              href={`/apps/contract/view/${row.id}`}
            >
              <Icon icon='fluent:slide-text-edit-24-regular'/>
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
        pageSizeOptions={themeConfig.pageSizeOptions}
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={contract || []}
        columns={columns}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}

        slotProps={{

          pagination: {

            count: countContract,
            page: paginationPage,
            labelDisplayedRows: ({page, count}) =>
              `${t('pagination footer')} ${page + 1} - ${paginationModel.pageSize} of ${count}`

            ,
            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              'onClick': () => onChangePage('nextIconButtonProps'),
              disabled: disabledNextBtn || contract?.length < paginationModel.pageSize,

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
  )
  const handleViewIconClick = (row: MinContractType) => {
    router.push(`/apps/contract/view/${row.id}`)
  }

  const cardView = (
    <Grid container spacing={6} sx={{mb: 2, padding: '15px'}}>
      {contract &&
        Array.isArray(contract) &&
        contract.map((item, index) => {
          return (
            <Grid key={index} item xs={12} sm={12} md={3} lg={2.4} xl={2.4}>
              <ContractCard
                data={item}
                onViewClick={handleViewIconClick}
                employeeFullName={employeeIdFullNameList}
                onDeleteClick={handleOpenDeleteDialog}
              />
            </Grid>
          )
        })}
      <PaginationCard paginationModel={paginationModel}
                      onChangePagination={onChangePagination}
                      paginationPage={paginationPage}
                      countList={countContract}
                      disabledNextBtn={disabledNextBtn}
                      ListLength={contract?.length}
                      onChangePage={onChangePage}
      />
    </Grid>
  )
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

  return !isLoading && !isLoadingCountContract ? (
    <Grid container>
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
            toggle={handleOpenAdd}
            permissionApplication={PermissionApplication.HRM}
            permissionPage={PermissionPage.CONTRACT}
            permissionAction={PermissionAction.WRITE}
          />


          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) && renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser && checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE) &&
        <AddContractDrawer
          open={addContractOpen}
          toggle={toggleAddContractDrawer}
          employeeList={employeeList}
          employeeLoading={employeeLoading}
          domain={profileUser?.domain}
        />}

      {deleteDialogOpen && checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Contract'
          onDelete={onDelete}
        />
      )}
    </Grid>
  ) : null
}
