import {useMutation, useQuery, useQueryClient} from "react-query";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Avatar, Switch, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import Box from "@mui/material/Box";

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
import {
  deleteTemplate,
  downloadTemplateFile,
  fetchAllTemplate,
  getTemplateCount,
  getTemplatesByCategory,
  getUserConnect,
  updateTemplate
} from "../../../api/template";
import AddTemplateDrawer from "../../../views/apps/Template/addTemplateDrawer";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import toast from "react-hot-toast";
import UpdateVisibility from "../../../views/apps/Template/updateVisibility";
import TemplatePreviewDialog from "../../../views/apps/Template/TemplatePreviewDialog";
import {useRouter} from "next/navigation";
import {fetchAll, getCategoryByPage} from "../../../api/category";
import CategorySelector from "../../../views/apps/Template/CategorySelector";
import TreeViewCategoriesTemplates from "../../../views/apps/Template/TreeViewCategoriesTemplates";
import PinIcon from "../../../views/apps/FavoriteTemplate/PinIcon";

const initialValue: CategoryTemplateType = {
  isFavorite: false,
  file: undefined,
  extension: " ",
  version: " ",
  typeTs: IEnumDocTempStatus.EDITING,
  typeTv: IEnumTemplateVisibility.PRV,
  typeTl: IEnumTemplateLanguage.EN,
  author: undefined,
  category: undefined,
  createDate: "",
  createdBy: "",
  editionDate: undefined,
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

const ViewToggleButtons = ({viewMode, onViewModeChange}) => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
      <ToggleButtonGroup
        exclusive
        value={viewMode}
        onChange={onViewModeChange}
        aria-label="view mode selection"
      >
        <ToggleButton value="grid" aria-label="grid view">
          <Icon icon="ic:baseline-view-list"/>
        </ToggleButton>
        <ToggleButton value="card" aria-label="card view">
          <Icon icon="ic:baseline-view-module"/>
        </ToggleButton>
        <ToggleButton value="tree" aria-label="tree view">
          <Icon icon="ic:outline-account-tree"/>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

const Template = () => {
  const {
    data: countTemplate,
    isLoading: isLoadingCountTemplate,
  } = useQuery('countTemplate', getTemplateCount)
  const [disabledNextBtn, setDisabledNextBtn] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const {t} = useTranslation()
  const [selectId, setSelectId] = useState<number | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [value, setValue] = useState<string>('')
  const [showDialogue, setShowDialogue] = useState<boolean>(false)
  const [SelectedTemplate, setSelectedTemplate] = useState<CategoryTemplateType>(initialValue)
  const [newStatus, setNewStatus] = useState<boolean>(false)

  const [viewMode, setViewMode] = useState<'grid' | 'card' | 'tree'>('grid')
  const queryClient = useQueryClient()
  const dataGridApiRef = React.useRef<GridApi>()
  const {isLoading: isLoadingUseData} = useQuery('userData', getUserConnect)
  const {data: allCategories} = useQuery('categories', fetchAll)
  const [filteredData, setFilteredData] = useState<CategoryTemplateType[] | null>(null)
  const [, setPaginationPage] = useState<number>(0)

  const {data: categoryTemplate, isLoading} = useQuery(
    ['categoryTemplate', selectedCategory],
    () => selectedCategory ? getTemplatesByCategory(selectedCategory) : fetchAllTemplate(),
    {
      select: (data) => {
        if (Array.isArray(data)) {
          return data.map(item => ({
            ...item,
            author: item.author || null,
            category: item.category || null,
            isFavorite: item.isFavorite || false
          }))
        }

        return data
      }
    }
  )

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories)
    }
  }, [allCategories])

  // const toggleViewMode = () => {
  //   if (isMobile && viewMode === 'auto') {
  //     setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
  //   } else if (!isMobile && viewMode === 'auto') {
  //     setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
  //   } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  // }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false,
    categories: false
  })
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  }

  // const handlePaginationChange = async (newModel: GridPaginationModel) => {
  //   try {
  //     if (newModel.pageSize !== paginationModel.pageSize) {
  //       localStorage.setItem(localStorageKeys.paginationSize, String(newModel.pageSize))
  //     }
  //
  //     const apiList = await getTemplatesByPage(newModel.page, newModel.pageSize)
  //     queryClient.setQueryData('categoryTemplate', apiList)
  //     setPaginationModel(newModel)
  //     setDisabledNextBtn(apiList.length < newModel.pageSize)
  //   } catch (error) {
  //     console.error('Erreur de pagination:', error)
  //     toast.error('Échec du chargement des données')
  //   }
  // }
  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = getCategoryByPage(0, item.pageSize)
      queryClient.removeQueries('resumes')
      queryClient.setQueryData('resumes', apiList)
      setPaginationPage(0)
      setPaginationModel({page: 0, pageSize: item.pageSize})
      setDisabledNextBtn(false)
    }
  }
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: localStorage.getItem(localStorageKeys.paginationSize)
      ? Number(localStorage.getItem(localStorageKeys.paginationSize))
      : 20
  })

  const toggleAddTemplate = () => {
    setSelectedTemplate(initialValue)
    setShowDialogue(true)
  }

  const deleteTemplateMutation = useMutation({
    mutationFn: () => deleteTemplate(selectId!),
    onSuccess: (res: number) => {
      if (res) {
        queryClient.invalidateQueries('categoryTemplate');
        setDeleteDialog(false)
        const updatedItems = ((queryClient.getQueryData('categoryTemplate') as CategoryTemplateType[]) || []).filter(item => item.id !== res)
        queryClient.setQueryData('categoryTemplate', updatedItems)
        toast.success("Template deleted successfully")
        setSelectId(undefined)
      }
    },
    onError: (error: Error) => {
      setDeleteDialog(false)
      setSelectId(undefined)
    }
  })

  const updatTemplateMutation = useMutation({
    mutationFn: (data: FormData) => updateTemplate(data),
    onSuccess: (res: any) => {
      if (res) {
        queryClient.setQueryData('categoryTemplate', (old: CategoryTemplateType[] | undefined) => {
          if (!old) return [res]

          return old.map(item => {
            if (item.id === res.id) {
              return {
                ...res,
                author: res.author || item.author,
                category: res.category || item.category
              }
            }

            return item
          })
        })
        toast.success("Template updated successfully")
        setNewStatus(false)
        setSelectedTemplate(undefined)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update template')
    }
  })

  const handleFilter = (val: string) => {
    setValue(val);
    if (val.trim() === '') {
      setFilteredData(null)

      return;
    } else {
      const dataToFilter = categoryTemplate || [];
      const filtered = dataToFilter.filter(row =>
        Object.keys(row).some((key) => {
          const value = row[key as keyof CategoryTemplateType]

          return typeof value === "string" && value.toLowerCase().includes(val.trim().toLowerCase());
        })
      );
      setFilteredData(filtered);
    }
  }

  const handleDeleteClick = (rowId: number | undefined) => {
    setSelectId(rowId)
    setDeleteDialog(true)
  }
  const handleTreeDeleteClick = (template: CategoryTemplateType) => {
    handleDeleteClick(template.id);
  };
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<CategoryTemplateType | null>(null)

  const handleFilePreview = (template: CategoryTemplateType) => {
    setPreviewTemplate(template)
    setPreviewOpen(true)
  }

  const closeFilePreview = () => {
    setPreviewOpen(false)
  }

  const handleSwitchVisibility = (data: CategoryTemplateType, e: any) => {
    setNewStatus(true)
    setSelectedTemplate(data)
  }

  const handleDelete = () => {
    deleteTemplateMutation.mutate()
  }

  const router = useRouter()

  const handleUpdateClick = (CategoryTemplate) => {
    router.push(`/apps/template/view/update/${CategoryTemplate.id}`)
  }

  const handleClose = () => {
    setNewStatus(false)
    setSelectedTemplate(undefined)
  }

  const downloadTemplateMutation = useMutation({
    mutationFn: downloadTemplateFile,
    onSuccess: () => {
      toast.success("Template téléchargé avec succès !")
    },
    onError: (error: any) => {
      toast.error(`Erreur lors du téléchargement : ${error.message}`)
    }
  })

  function onDownload(row) {
    downloadTemplateMutation.mutate({id: row.id, originalFileName: row.originalFileName})
  }

  const handleConfirmation = () => {
    if (SelectedTemplate) {
      const updatedTemplate = {
        ...SelectedTemplate,
        typeTv: SelectedTemplate.typeTv === IEnumTemplateVisibility.PRV
          ? IEnumTemplateVisibility.PB
          : IEnumTemplateVisibility.PRV
      }

      const formData = new FormData()
      formData.append('id', String(updatedTemplate.id))
      formData.append('name', updatedTemplate.name)
      formData.append('description', updatedTemplate.description || '')
      formData.append('domain', updatedTemplate.domain)
      formData.append('type', updatedTemplate.type)
      formData.append('typeTs', updatedTemplate.typeTs)
      formData.append('typeTl', updatedTemplate.typeTl)
      formData.append('typeTv', updatedTemplate.typeTv)
      formData.append('version', updatedTemplate.version || '1.0.0')
      formData.append('source', updatedTemplate.source || '')
      formData.append('path', updatedTemplate.path || '')
      formData.append('extension', updatedTemplate.extension || '')
      formData.append('originalFileName', updatedTemplate.originalFileName || '')
      formData.append('authorId', updatedTemplate.author?.id ? String(updatedTemplate.author.id) : '')
      formData.append('categoryId', updatedTemplate.category?.id ? String(updatedTemplate.category.id) : '')

      updatTemplateMutation.mutate(formData)
    }
  }

  const getFileTypeIcon = (extension) => {
    if (!extension) return "mdi:file-outline"
    const ext = extension.toLowerCase()
    switch (ext) {
      case "pdf":
        return "mdi:file-pdf-box"
      case "doc":
        return "mdi:file-word-outline"
      case "docx":
        return "mdi:file-word-outline"
      case "xls":
        return "mdi:file-excel-outline"
      case "xlsx":
        return "mdi:file-excel-outline"
      case "ppt":
        return "mdi:file-powerpoint-outline"
      case "pptx":
        return "mdi:file-powerpoint-outline"
      case "txt":
        return "mdi:file-document-outline"
      default:
        return "mdi:file-outline"
    }
  }

  const getFileTypeColor = (extension) => {
    if (!extension) return "text.secondary"
    const ext = extension.toLowerCase()
    switch (ext) {
      case "pdf":
        return "error.main"
      case "doc":
        return "primary.main"
      case "docx":
        return "primary.main"
      case "xls":
        return "success.main"
      case "xlsx":
        return "success.main"
      case "ppt":
        return "warning.main"
      case "pptx":
        return "warning.main"
      default:
        return "text.secondary"
    }
  }

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.1,
      field: ' ',
      minWidth: 20,
      renderCell: ({row}) => (
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: 'transparent',
            color: getFileTypeColor(row.extension),
            '& .MuiSvgIcon-root': {fontSize: '2rem'},
            '& svg': {fontSize: '2rem'}
          }}
        >
          <Icon icon={getFileTypeIcon(row.extension)} fontSize="large"/>
        </Avatar>
      )
    },
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
      field: 'author',
      minWidth: 100,
      headerName: t('author') as string,
      renderCell: ({row}: CellType) => (
        <Typography>
          {row.author
            ? `${row.author.firstname} ${row.author.lastname}`
            : t('No author')
          }
        </Typography>
      )
    },

    {
      flex: 0.1,
      field: 'category',
      minWidth: 100,
      headerName: t('category') as string,
      renderCell: ({row}: CellType) => (
        <Typography>
          {row.category?.name || t('No Category')}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'typeTs',
      minWidth: 100,
      headerName: `Status` as string,
      renderCell: ({row}: CellType) => {
        return (
          <Tooltip title={t(row?.typeTs)}>
            <Typography sx={{color: 'text.secondary'}}>
              {t(row.typeTs)}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      field: 'typeTl',
      minWidth: 100,
      headerName: `${t('Language')}` as string,
      renderCell: ({row}: CellType) => {
        return (
          <Tooltip title={t(row?.typeTl)}>
            <Typography sx={{color: 'text.secondary'}}>
              {t(row.typeTl)}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      field: 'TemplateVisibility',
      minWidth: 100,
      headerName: `${t('Visibility')}` as string,
      renderCell: ({row}: CellType) => {
        const status = row.typeTv === IEnumTemplateVisibility.PB

        return (
          <Typography sx={{color: 'text.secondary'}}>
            <Tooltip title={t(row?.typeTv)}>
              <Switch
                checked={status}
                onChange={(e) => handleSwitchVisibility(row, e.target.checked)}
              />
            </Tooltip>
          </Typography>
        )
      }
    },
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
      headerName: ('') as string,
      align: 'right',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <PinIcon
            templateId={row.id}
            isPinned={row.isFavorite}
            onToggle={(newStatus) => {
              queryClient.setQueryData(['categoryTemplate'], (old: CategoryTemplateType[] | undefined) => {
                if (!old) return old

                return old.map(item =>
                  item.id === row.id ? {...item, isFavorite: newStatus} : item
                );
              });
            }}

          />

          {row.description && (
            <Tooltip title={t(row.description)}>
              <IconButton
                size="small"
                sx={{color: 'text.secondary'}}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon='tabler:info-circle'/>
              </IconButton>
            </Tooltip>
          )}

          {/* Bouton de suppression */}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                size="small"
                sx={{color: 'text.secondary'}}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.id);
                }}
              >
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}

          {/* Bouton d'édition */}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                size="small"
                sx={{color: 'text.secondary'}}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateClick(row);
                }}
              >
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}

          {/* Bouton de téléchargement */}
          <Tooltip title={t('Action.Download')}>
            <IconButton
              size="small"
              sx={{color: 'text.secondary'}}
              onClick={(e) => {
                e.stopPropagation();
                onDownload(row);
              }}
              disabled={!row.originalFileName}
            >
              <Icon icon='material-symbols:download'/>
            </IconButton>
          </Tooltip>
        </Box>
      )
    }

  ]

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {(filteredData || categoryTemplate)?.map((template, index) => (
        <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
          <TemplateCard
            data={template}
            onDeleteClick={handleDeleteClick}
            onSwitchStatus={handleSwitchVisibility}
            onViewClick={handleUpdateClick}
            onDownloadClick={onDownload}
            onPreviewClick={handleFilePreview}
          />
        </Grid>
      ))}
    </Grid>
  )

  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={filteredData || categoryTemplate || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={onChangePagination}
        rowCount={countTemplate || 0}
        paginationMode="server"
        slotProps={{
          pagination: {
            count: countTemplate,
            page: paginationModel.page,
            labelDisplayedRows: ({from, to, count}) =>
              `${t('pagination footer')} ${from} - ${to} ${t('of')} ${count}`,
            labelRowsPerPage: t('Rows_per_page'),
            nextIconButtonProps: {
              disabled: disabledNextBtn || (categoryTemplate?.length || 0) < paginationModel.pageSize,
            },
            backIconButtonProps: {
              disabled: paginationModel.page === 0,
            }
          },
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
    if (viewMode === 'tree') {
      return (
        <TreeViewCategoriesTemplates
          categories={categories}
          templates={filteredData || categoryTemplate || []}
          onUpdateClick={handleUpdateClick}
          onDownload={onDownload}
          onDeleteClick={handleTreeDeleteClick}
        />
      );
    } else if (viewMode === 'grid') {
      return gridView;
    } else {
      return (
        <>
          <CategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories || []}
          />
          {cardView}
        </>
      );
    }
  }

  return (
    <>
      {!isLoading && !isLoadingUseData && !isLoadingCountTemplate && (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Templates')}/>

              <ViewToggleButtons
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />

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

              {previewOpen && previewTemplate && (
                <TemplatePreviewDialog
                  open={previewOpen}
                  onCloseClick={closeFilePreview}
                  templatePreview={previewTemplate}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default Template
