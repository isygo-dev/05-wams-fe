import {useMutation, useQuery, useQueryClient} from "react-query";
import {AuthorType} from "../../../types/author";
import {deleteAuthor, fetchAllAuthor, getAuthorByPage} from "../../../api/author";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";
import {Avatar, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
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
import Styles from "template-shared/style/style.module.css";
import themeConfig from "template-shared/configs/themeConfig";
import AuthorCard from "../../../views/apps/Author/AuthorCard";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import AddAuthorDrawer from "../../../views/apps/Author/AddAuthorDrawer";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";

import toast from "react-hot-toast";
import apiUrls from "../../../config/apiUrl";
import {useRouter} from "next/navigation";

const initialValue: AuthorType =
  {
    email: "", extension: "", file: undefined, fileName: "", originalFileName: "", path: "", phone: "", type: "",
    domain: "", firstname: "", lastname: "",
    code: "",
    createDate: "",
    createdBy: "",
    updateDate: "",
    updatedBy: "",
    imagePath: ""

  }

interface CellType {
  row: AuthorType
}

const Author = () => {
  const {data: authorList, isLoading} = useQuery('authorList', fetchAllAuthor);
  const {t} = useTranslation();
  const [viewMode, setViewMode] = useState('auto')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dataGridApiRef = React.useRef<GridApi>()
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>('')
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>(initialValue);
  const [showDialogue, setShowDialogue] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<number | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [, setDisabledNextBtn] = useState<boolean>(false)
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false,
    phone: false,
    email: false,

  })
  const [, setPreviewOpen] = useState(false);
  const [, setPreviewTemplate] = useState<AuthorType | null>(null);

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
        page: paginationPage,
        pageSize: localStorage.getItem(localStorageKeys.paginationSize) &&
        Number(localStorage.getItem(localStorageKeys.paginationSize)) > 9 ?
          Number(localStorage.getItem(localStorageKeys.paginationSize)) : 20
      }
    )
  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const onChangePagination = async (item: any) => {
    if (item.pageSize !== paginationModel.pageSize) {
      setPaginationModel(item)
      localStorage.removeItem(localStorageKeys.paginationSize)
      localStorage.setItem(localStorageKeys.paginationSize, item.pageSize)
      const apiList = getAuthorByPage(0, item.pageSize)
      queryClient.removeQueries('author')
      queryClient.setQueryData('author', apiList)
      setPaginationPage(0)
      setPaginationModel({page: 0, pageSize: item.pageSize})
      setDisabledNextBtn(false)
    }
  }
  const handleFilter = (val: string) => {
    setValue(val)
    if (val.trim() === '') {
    } else {
      const resumesCopie = [...authorList]
      const filtered = resumesCopie.filter(
        row =>
          row.firstname.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.lastname.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.type.toLowerCase().includes(val.trim().toLowerCase()) ||
          row.domain.toLowerCase().includes(val.trim().toLowerCase())
      )
      if (filtered) {
        console.log(filtered)
      }
    }
  }

  const handleDeleteClick = (rowId: number | undefined) => {
    setSelectId(rowId)
    setDeleteDialog(true)
  }
  const router = useRouter()

  const handleUpdateClick = (author) => {
    router.push(`/apps/author/view/update/${author.id}`);
  }

  const toggleAddAuthor = () => {
    setSelectedAuthor(initialValue);
    setShowDialogue(true)
  }

  const defaultColumns: GridColDef[] = [
    {
      field: 'photo',
      headerName: t('Photo') as string,
      type: 'string',
      flex: 0.1,
      renderCell: ({row}: CellType) => (
        <Avatar className={Styles.avatarTable}
                src={row.imagePath ? `${apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint}/${row.id}?${Date.now()}` : ''}
                alt={row.firstname}
        />
      )
    },
    {
      flex: 0.1,
      field: 'code',
      minWidth: 100,
      headerName: t('Code') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },

    /*Name column*/
    {
      flex: 0.1,
      field: 'firstName',
      minWidth: 100,
      headerName: t('FirstName') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.firstname}</Typography>
    },
    {
      flex: 0.1,
      field: 'lastName',
      minWidth: 100,
      headerName: t('LastName') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.lastname}</Typography>
    },

    {
      flex: 0.1,
      field: 'domaine',
      minWidth: 100,
      headerName: t('Domaine') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },
    {
      flex: 0.1,
      field: 'email',
      minWidth: 100,
      headerName: t('email') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.email}</Typography>
    },
    {
      flex: 0.1,
      field: 'phone',
      minWidth: 100,
      headerName: t('phone') as string,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.phone}</Typography>
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
          {/*<Tooltip title={t(row.description)}>*/}
          {/*  <IconButton*/}
          {/*    className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>*/}
          {/*    <Icon icon='tabler:info-circle'/>*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.update')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => handleUpdateClick(row)}
              >
                <Icon icon="tabler:edit"/>
              </IconButton>
            </Tooltip>


          )}
          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                onClick={() => handleDeleteClick(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {/*{checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (*/}
          {/*  <Tooltip title={t('Action.Edit')}>*/}
          {/*    <IconButton*/}
          {/*      className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleUpdateClick(row)}>*/}
          {/*      <Icon icon='tabler:edit'/>*/}
          {/*    </IconButton>*/}
          {/*  </Tooltip>*/}
          {/*)}*/}
        </Box>
      )
    }
  ]

  const deleteAuthorMutation = useMutation({
    mutationFn: () => deleteAuthor(selectId),
    onSuccess: (res: any) => {
      if (res) {
        queryClient.invalidateQueries('AuthorType');
        setDeleteDialog(false)
        const updatedItems = ((queryClient.getQueryData('authorList') as AuthorType[]) || []).filter(item => item.id !== res)
        queryClient.setQueryData('authorList', updatedItems)
        toast.success("Author deleted successfully")
        setSelectId(undefined)


      }
    }
  })
  const handlePreviewClick = (author: AuthorType) => {
    setPreviewTemplate(author);
    setPreviewOpen(true);
  }
  const handleDelete = () => {
    deleteAuthorMutation.mutate()
  }

  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={authorList || []}
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
      {authorList &&
        Array.isArray(authorList) &&
        authorList.map((author, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <AuthorCard
                data={author}
                onPreviewClick={handlePreviewClick}
                onDeleteClick={handleDeleteClick}
                onViewClick={handleUpdateClick}
                imageUrl={apiUrls.apiUrl_smekit_Author_ImageDownload_Endpoint}

              />
            </Grid>

          )
        })}

    </Grid>
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

  return (
    <>
      {!isLoading && (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Authors')}/>
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
                toggle={toggleAddAuthor}
                permissionApplication={PermissionApplication.IMS}
                permissionPage={PermissionPage.APP_PARAMETER}
                permissionAction={PermissionAction.WRITE}
              />
              {renderViewBasedOnMode()}
              {showDialogue && (
                <AddAuthorDrawer
                  author={selectedAuthor}
                  showDialogue={showDialogue}
                  setShowDialogue={setShowDialogue}
                />
              )}


              <DeleteCommonDialog
                open={deleteDialog}
                setOpen={setDeleteDialog}
                selectedRowId={selectId}
                onDelete={handleDelete}
                item="Author"
              />


            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}
export default Author
