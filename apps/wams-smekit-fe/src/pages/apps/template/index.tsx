import {useMutation, useQuery, useQueryClient} from "react-query";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Switch, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/system";
import TableHeader from "template-shared/views/table/TableHeader";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from "@mui/x-data-grid";
import {
  CategoryTemplateType,
  IEnumDocTempStatus,
  IEnumTemplateLanguage,
  IEnumTemplateVisibility
} from "../../../types/categoryTemplateType";
import {IEnumCategoryType} from "../../../types/category";
import TemplateCard from "../../../views/apps/Template/TemplateCard";
import Styles from "template-shared/style/style.module.css";
import themeConfig from "template-shared/configs/themeConfig";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import ResumeApis from "rpm-shared/@core/api/rpm/resume";
import {deleteTemplate, fetchAllTemplate, getUserConnect, updateTemplate} from "../../../api/template";
import AddTemplateDrawer from "../../../views/apps/Template/addTemplateDrawer";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import toast from "react-hot-toast";
import UpdateVisibility from "../../../views/apps/Template/updateVisibility";


const initialValue: CategoryTemplateType =
  {
    extension: " ", version: " ",
    typeTs: IEnumDocTempStatus.EDITING,
    typeTv: IEnumTemplateVisibility.PRV,
    typeTl: IEnumTemplateLanguage.EN,
    author: undefined,
    category: undefined,
    createDate: "",
    createdBy: "",
    editionDate: undefined,
    fileName: "",
    originalFileName: "",
    path: "",
    source: "",
    tag: undefined,
    updateDate: "",
    updatedBy: "",
    domain: '',
    name: '',
    type: IEnumCategoryType.ENABLED,
    description: ''
  }
interface CellType {
  row: CategoryTemplateType
}
const Template = () => {
  const { data: categoryTemplate, isLoading } = useQuery('categoryTemplate', fetchAllTemplate);
  const {t} = useTranslation();
  const [selectId, setSelectId] = useState<number | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [value, setValue] = useState<string>('')
  const [showDialogue, setShowDialogue] = useState<boolean>(false);
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [SelectedTemplate,setSelectedTemplate] =useState<CategoryTemplateType>(initialValue)
  const [, setDisabledNextBtn] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('auto')
  const theme = useTheme()
  const queryClient = useQueryClient();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dataGridApiRef = React.useRef<GridApi>()

  const { isLoading: isLoadingUseData } = useQuery('userData', getUserConnect);

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
    updatedBy: false
  })
  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = await ResumeApis(t).getResumesByPage(0, item.pageSize)
      queryClient.removeQueries('resumes')
      queryClient.setQueryData('resumes', apiList)
      setPaginationPage(0)
      setPaginationModel({page: 0, pageSize: item.pageSize})
      setDisabledNextBtn(false)
    }
  }
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )
  const toggleAddTemplate = () => {
    setSelectedTemplate(initialValue);
    setShowDialogue(true)
  }
  const deleteTemplateMutation = useMutation({
    mutationFn: () => deleteTemplate(selectId),
    onSuccess: (res: any) => {
      if (res) {

        setDeleteDialog(false)
        const updatedItems = ((queryClient.getQueryData('categoryTemplate') as CategoryTemplateType[]) || []).filter(item => item.id !== res)
        queryClient.setQueryData('categoryTemplate', updatedItems)
        toast.success("Template deleted successfully")
        setSelectId(undefined)


      }
    }
  })
  const updatTemplateMutation = useMutation({
    mutationFn: (data: CategoryTemplateType) => updateTemplate(data),
    onSuccess: (res: CategoryTemplateType) => {
      if (res) {

        const cachedData: CategoryTemplateType[] = queryClient.getQueryData('categoryTemplate') || []
        const index = cachedData.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedData = [...cachedData]
          updatedData[index] = res
          queryClient.setQueryData('categoryTemplate', updatedData)
        }
        toast.success("Template updated successfully");
        setNewStatus(false)
        setSelectedTemplate(undefined)



      }
    }
  })
  const handleFilter = (val: string) => {
    setValue(val);
    if (val.trim() === '') {
      return;
    } else {
      const categoryTemplateCopie = Array.isArray(categoryTemplate) ? categoryTemplate : [];
      const filtered = categoryTemplateCopie.filter(row =>
        Object.keys(row).some((key) => {
          const value = row[key as keyof CategoryTemplateType];

          return typeof value === "string" && value.toLowerCase().includes(val.trim().toLowerCase());
        })
      );
      if (filtered.length > 0) {
        console.log(filtered);
      }
    }
  }

  const handleDeleteClick = (rowId: number | undefined) => {
    setSelectId(rowId)
    setDeleteDialog(true)
  }
  const handleUpdateClick = (item: CategoryTemplateType) => {
    item.categoryId = item?.category?.id
    item.authorId =item?.author?.id
    setSelectedTemplate(item);
    setShowDialogue(true);
  }
  const handleSwitchVisibility = (data: CategoryTemplateType , e: any) => {
    setNewStatus(true)
    setSelectedTemplate(data)
  }
  const handleDelete = () => {
    deleteTemplateMutation.mutate()
  }
  const handleClose =() => {
    setNewStatus(false)
    setSelectedTemplate(undefined)

  }
  const handleConfirmation =() => {
    if (SelectedTemplate.typeTv === IEnumTemplateVisibility.PRV) {
      SelectedTemplate.typeTv = IEnumTemplateVisibility.PB
    }else {
      SelectedTemplate.typeTv = IEnumTemplateVisibility.PRV
    }
    updatTemplateMutation.mutate(SelectedTemplate);
  }
  const defaultColumns: GridColDef[] = [
    /*Domain column*/
    {
      flex: 0.1,
      field: 'domain',
      minWidth: 100,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },

    {
      flex: 0.1,
      field: t('name'),
      minWidth: 100,
      headerName: t('Name') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
    },
    {
      flex: 0.1,
      field: t('path'),
      minWidth: 100,
      headerName: t('path') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.path}</Typography>
    },
    {
      flex: 0.1,
      field: t('fileName'),
      minWidth: 100,
      headerName: t('fileName') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.fileName}</Typography>
    },
    {
      flex: 0.1,
      field: 'extension',
      minWidth: 100,
      headerName: t('extension') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.extension}</Typography>
    },
    {
      flex: 0.1,
      field: 'editionDate',
      minWidth: 100,
      headerName: t('editionDate') as string,
      renderCell: ({row}: CellType) => <>
        {
          row.editionDate && <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              <Moment format='DD-MM-YYYY'>{row.editionDate}</Moment>
            </Typography>
          </Box>
        }

      </>
    },
    {
      flex: 0.1,
      field: 'version',
      minWidth: 100,
      headerName: t('version') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.version}</Typography>
    },
    {
      flex: 0.1,
      field: 'source',
      minWidth: 100,
      headerName: t('source') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.source}</Typography>
    },
    {
      flex: 0.1,
      field: 'category',
      minWidth: 100,
      headerName: t('category') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.category?.name || t('No Category')}
        </Typography>
      )
    }
,
    {
      flex: 0.1,
      field: 'author',
      minWidth: 100,
      headerName: t('author') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.author?.name || t('No author')}
        </Typography>
      )
    },

    // /*Description column*/
    //
    // {
    //   flex: 0.1,
    //   field: 'description',
    //   minWidth: 100,
    //   headerName: t('Description') as string,
    //   renderCell: ({ row }: CellType) => {
    //     const [expanded, setExpanded] = React.useState(false);
    //     const maxLength = 30;
    //
    //     const handleToggle = () => setExpanded(!expanded);
    //
    //     return (
    //       <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
    //         {expanded ? row.description : `${row.description.slice(0, maxLength)}... `}
    //         {row.description.length > maxLength && (
    //           <Button
    //             variant="text"
    //             size="small"
    //             sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
    //             onClick={handleToggle}
    //           >
    //             {expanded ? t('See less') : t('See more')}
    //           </Button>
    //         )}
    //       </Typography>
    //     );
    //   }
    // },

    {
      flex: 0.1,
      field: 'typeTs',
      minWidth: 100,
      headerName: `Status` as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={t(row?.typeTs)}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t(row.typeTs)}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      flex: 0.1,
      field: 'typeTl',
      minWidth: 100,
      headerName: `${t('Language')}`as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={t(row?.typeTl)}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t(row.typeTl)}
            </Typography>
          </Tooltip>
        );
      }
    }
    ,

    {
      flex: 0.1,
      field: 'TemplateVisibility',
      minWidth: 100,
      headerName: `${t('Visibility')}` as string,
      renderCell: ({ row }: CellType) => {
        const status = row.typeTv === IEnumTemplateVisibility.PB;

        return (
          <Typography sx={{ color: 'text.secondary' }}>
            <Tooltip title={t(row?.typeTv)}>
              <Switch
                checked={status}
                onChange={(e) => handleSwitchVisibility(row, e.target.checked)}
              />
            </Tooltip>
          </Typography>
        );
      }
    },


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

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {categoryTemplate &&
        Array.isArray(categoryTemplate) &&
        categoryTemplate.map((Template, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <TemplateCard
                data={Template}
                onDeleteClick={handleDeleteClick}
                onSwitchStatus={handleSwitchVisibility}
                onViewClick={handleUpdateClick}
              />
            </Grid>

          )
        })}

    </Grid>
  )
  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={categoryTemplate }
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

  return  (
    <>
      {!isLoading && !isLoadingUseData && (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Templates')}/>
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
                toggle={toggleAddTemplate}
                permissionApplication={PermissionApplication.IMS}
                permissionPage={PermissionPage.APP_PARAMETER}
                permissionAction={PermissionAction.WRITE}
              />
              {renderViewBasedOnMode()}
              {showDialogue && (
                <AddTemplateDrawer
                  categoryTemplate={SelectedTemplate}
                  showDialogue={showDialogue}
                  setShowDialogue={setShowDialogue}

                  //userData={userData}
                />
              )}

              <DeleteCommonDialog
                open={deleteDialog}
                setOpen={setDeleteDialog}
                selectedRowId={selectId}
                onDelete={handleDelete}
                item="Template"
              />
              <UpdateVisibility
                open={newStatus}
                setOpen={setNewStatus}
                handleConfirmation={handleConfirmation}
                handleClose={handleClose}
              />
            </Card>
          </Grid>
        </Grid>
      )
      }
    </>
  )
}
export default Template
