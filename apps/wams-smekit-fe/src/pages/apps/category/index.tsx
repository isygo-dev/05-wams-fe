import React, {useState} from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteCategory, fetchAll, getCategoryByPage, updateCategory} from "../../../api/category";
import Box from '@mui/material/Box';
import Icon from "template-shared/@core/components/icon";
import {CategoryType, IEnumCategoryType} from "../../../types/category";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import AddCategoryDrawer from "../../../views/apps/category/addCatgoryDrawer";
import {Avatar, Chip, Switch, ToggleButton, ToggleButtonGroup} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/system";
import Styles from "template-shared/style/style.module.css";
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from "@mui/x-data-grid";
import themeConfig from "template-shared/configs/themeConfig";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import TableHeader from "template-shared/views/table/TableHeader";
import Moment from "react-moment";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import CategoryCard from "../../../views/apps/category/CategoryCard";
import UpdateStatus from "../../../views/apps/category/updateStatus";
import apiUrls from "../../../config/apiUrl";

const initialValue: CategoryType =
  {
    domain: '',
    name: '',
    type: IEnumCategoryType.ENABLED,
    description: '',
    imagePath:'',
    tagName: []
  }


interface CellType {
  row: CategoryType
}

const Category = () => {
  const {data: categoryList, isLoading} = useQuery('categoryList', fetchAll);
  const [showDialogue, setShowDialogue] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialValue);
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<boolean>(false)


  const [selectId, setSelectId] = useState<number | undefined>(undefined)



  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryType) => updateCategory(data),
    onSuccess: (res: CategoryType) => {
      if (res) {

        const cachedData: CategoryType[] = queryClient.getQueryData('categoryList') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedData = [...cachedData]
          updatedData[index] = res
          queryClient.setQueryData('categoryList', updatedData)
        }
        toast.success("Status updated successfully");
        setNewStatus(false)
        setSelectedCategory(undefined)



      }
    }
  })

  const handleConfirmation =() => {
    if (selectedCategory.type === IEnumCategoryType.ENABLED) {
      selectedCategory.type = IEnumCategoryType.DISABLED
    }else {
      selectedCategory.type = IEnumCategoryType.ENABLED
    }
    updateCategoryMutation.mutate(selectedCategory);
  }

  const handleClose =() => {
    setNewStatus(false)
    setSelectedCategory(undefined)

  }


  const handleSwitchStatus = (data: CategoryType , e: any) => {
    setNewStatus(true)
    setSelectedCategory(data)
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: () => deleteCategory(selectId),
    onSuccess: (res: any) => {
      if (res) {
        setDeleteDialog(false)
        const updatedItems = ((queryClient.getQueryData('categoryList') as CategoryType[]) || []).filter(item => item.id !== res)
        queryClient.setQueryData('categoryList', updatedItems)
        toast.success("Category deleted successfully")
        setSelectId(undefined)
      }
    },
    onError: (error: Error) => {
      setDeleteDialog(false)
      setSelectId(undefined)
    }
  })


  const handleDelete = () => {
    deleteCategoryMutation.mutate()
  }


  const handleDeleteClick = (rowId: number | undefined) => {
    setSelectId(rowId)
    setDeleteDialog(true)
  }
  const handleUpdateClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setShowDialogue(true);
  }
  const theme = useTheme()

  const [viewMode, setViewMode] = useState('auto')
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }


  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false,
    tags: false
  })
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [, setDisabledNextBtn] = useState<boolean>(false)

  const dataGridApiRef = React.useRef<GridApi>()


  const defaultColumns: GridColDef[] = [
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Avatar className={Styles.avatarTable}
                src={row.imagePath ? `${apiUrls.apiUrl_smekit_Category_ImageDownload_Endpoint}/${row.id}?${Date.now()}` : ''}
                alt={row.name}
        />
      )
    },
    {
      flex: 0.1,
      field: 'domain',
      minWidth: 100,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },

    /*Name column*/
    {
      flex: 0.1,
      field: 'name',
      minWidth: 100,
      headerName: t('Name') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
    },
    {
      flex: 0.1,
      field: 'type',
      minWidth: 100,
      headerName: `${t('ENABLED')} ` as string,
      renderCell: ({row}: CellType) => {

        const status = row.type === 'ENABLED';

        return <Typography sx={{color: 'text.secondary'}}>
          <Tooltip title={t(row?.type)}>
            <Switch checked={status}
                    onChange={(e) => handleSwitchStatus(row, e.target.checked)}
            />
          </Tooltip>
        </Typography>

      }
    },

    /*Tags column*/
    {
      flex: 0.2,
      field: 'tags',
      minWidth: 150,
      headerName: t('Tags') as string,
      renderCell: ({row}: CellType) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.tagName && row.tagName.length > 0 ? (
            row.tagName.map((tag, index) => (
              <Chip
                key={index}
                label={tag.category_tag}
                size="small"
                sx={{
                  '& .MuiChip-label': {
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }
                }}
              />
            ))
          ) : (
            <Typography sx={{color: 'text.secondary'}}>{t('No tags')}</Typography>
          )}
        </Box>
      )
    },


    /*edit Date column*/
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
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      maxWidth: 150,
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title={t(row.description)}>
            <IconButton
              className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
              <Icon icon='tabler:info-circle'/>
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                onClick={() => handleDeleteClick(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleUpdateClick(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )


  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList =  getCategoryByPage(0, item.pageSize)
      queryClient.removeQueries('resumes')
      queryClient.setQueryData('resumes', apiList)
      setPaginationPage(0)
      setPaginationModel({page: 0, pageSize: item.pageSize})
      setDisabledNextBtn(false)
    }
  }


  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={categoryList || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}

        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {debounceMs: 500}
          }
        }}
        apiRef={dataGridApiRef}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {categoryList &&
        Array.isArray(categoryList) &&
        categoryList.map((category, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <CategoryCard
                data={category}
                onDeleteClick={handleDeleteClick}
                onSwitchStatus={handleSwitchStatus}
                onViewClick={handleUpdateClick}
                imageUrl={apiUrls.apiUrl_smekit_Category_ImageDownload_Endpoint}/>
            </Grid>

          )
        })}

    </Grid>
  )
  const [value, setValue] = useState<string>('')
  const handleFilter = (val: string) => {
    setValue(val)
    if (val.trim() === '') {
    } else {
      const resumesCopie = [...categoryList]
      const filtered = resumesCopie.filter(
        row =>
          row.name.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.type.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.domain.toLowerCase().includes(val.trim().toLowerCase()) ||
          (row.tagName && row.tagName.some(tag =>
              tag.tagName.toLowerCase().includes(val.trim().toLowerCase())
            )
          ) || []
      )
      if (filtered) {
        console.log(filtered)
      }
    }
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


  const toggleAddCateogry = () => {
    setSelectedCategory(initialValue);
    setShowDialogue(true)
  }


  return (
    <>
      {!isLoading && (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Category')}/>

              <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
                <ToggleButtonGroup
                  exclusive
                  value={viewMode}
                  onChange={toggleViewMode}
                  aria-label="text alignment"
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <Icon icon="ic:baseline-view-list"/>
                  </ToggleButton>
                  <ToggleButton value="card" aria-label="card view">
                    <Icon icon="ic:baseline-view-module"/>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <TableHeader
                dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                value={value}
                handleFilter={handleFilter}
                toggle={toggleAddCateogry}
                permissionApplication={PermissionApplication.IMS}
                permissionPage={PermissionPage.APP_PARAMETER}
                permissionAction={PermissionAction.WRITE}
              />

              {renderViewBasedOnMode()}

              {showDialogue && (
                <AddCategoryDrawer
                  category={selectedCategory}
                  showDialogue={showDialogue}
                  setShowDialogue={setShowDialogue}
                />
              )}

              <DeleteCommonDialog
                open={deleteDialog}
                setOpen={setDeleteDialog}
                selectedRowId={selectId}
                onDelete={handleDelete}
                item="Category"
              />

              <UpdateStatus
                open={newStatus}
                setOpen={setNewStatus}
                handleConfirmation={handleConfirmation}
                handleClose={handleClose}
              />
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default Category;
