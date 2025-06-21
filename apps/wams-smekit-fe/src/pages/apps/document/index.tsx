import { useQuery } from "react-query";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import TableHeader from "template-shared/views/table/TableHeader";
import { DataGrid, GridColDef, GridApi } from "@mui/x-data-grid";
import Styles from "template-shared/style/style.module.css";
import themeConfig from "template-shared/configs/themeConfig";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import localStorageKeys from "template-shared/configs/localeStorage";
import { useRouter } from "next/navigation";
import {  fetchDocuments } from "../../../api/Document";
import { DocumentType } from "../../../types/document";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";



interface CellType {
  row: DocumentType;
}


const Documents = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dataGridApiRef = React.useRef<GridApi>();

  const [value, setValue] = useState<string>('');
  const [, setDeleteDialog] = useState(false);
  const [, setSelectedId] = useState<number | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<DocumentType[] | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: localStorage.getItem(localStorageKeys.paginationSize)
      ? Number(localStorage.getItem(localStorageKeys.paginationSize))
      : 20
  });

  const { data: documents, isLoading } = useQuery(
    ['documents', paginationModel],
    () => fetchDocuments(paginationModel.page, paginationModel.pageSize)
  );

  const getFileTypeIcon = (extension?: string) => {
    if (!extension) return "mdi:file-outline"
    const ext = extension.toLowerCase()
    switch (ext) {
      case "pdf": return "mdi:file-pdf-box"
      case "doc": case "docx": return "mdi:file-word-outline"
      case "xls": case "xlsx": return "mdi:file-excel-outline"
      case "ppt": case "pptx": return "mdi:file-powerpoint-outline"
      case "txt": return "mdi:file-document-outline"
      default: return "mdi:file-outline"
    }
  }

  const getFileTypeColor = (extension?: string) => {
    if (!extension) return "text.secondary"
    const ext = extension.toLowerCase()
    switch (ext) {
      case "pdf": return "error.main"
      case "doc": case "docx": return "primary.main"
      case "xls": case "xlsx": return "success.main"
      case "ppt": case "pptx": return "warning.main"
      default: return "text.secondary"
    }
  }


  const handleFilter = (val: string) => {
    setValue(val);
    if (val.trim() === '') {
      setFilteredData(null);

      return;
    }

    const filtered = documents?.filter(doc =>
      Object.values(doc).some(value =>
        String(value).toLowerCase().includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered || null);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteDialog(true);
  };



  const columns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'icon',
      headerName: '',
      minWidth: 60,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'transparent',
              color: getFileTypeColor(row.extension),
              '& .MuiSvgIcon-root': { fontSize: '2rem' }
            }}
          >
            <Icon icon={getFileTypeIcon(row.extension)} fontSize="large"/>
          </Avatar>
        </Box>
      )
    },
    {
      flex: 0.2,
      field: 'name',
      headerName: t('Name'),
      renderCell: ({ row }) => <Typography>{row.name}</Typography>
    },
    {
      flex: 0.2,
      field: 'description',
      headerName: t('Description'),
      renderCell: ({ row }) => <Typography>{row.description}</Typography>
    },
    {
      flex: 0.15,
      field: 'createDate',
      headerName: t('Created Date'),
      renderCell: ({ row }) => <Moment format="DD-MM-YYYY">{row.createDate}</Moment>
    },
    {
      flex: 0.15,
      field: 'createdBy',
      headerName: t('Created By'),
      renderCell: ({ row }) => <Typography>{row.createdBy}</Typography>
    },
    {
      flex: 0.2,
      field: 'actions',
      headerName: t('Actions'),
      minWidth: 250,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

          <Tooltip title={t('Edit with Rich Editor')}>
            <IconButton
              onClick={() => router.push(`/apps/document/edit/${row.id}/${row.version || '1'}`)}
              size="small"
            >
              <Icon icon="mdi:file-document-edit-outline" />
            </IconButton>
          </Tooltip>

          {checkPermission(PermissionApplication.IMS, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')} arrow>
              <IconButton
                size="small"
                sx={{ color: 'text.secondary' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.id);
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={t('Action.Download')} arrow>
        <span>
          <IconButton
            size="small"
            sx={{ color: 'text.secondary' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={!row.originalFileName}
          >
            <Icon icon='material-symbols:download' />
          </IconButton>
        </span>
          </Tooltip>

        </Box>
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Documents')} />

          <TableHeader
            value={value}
            handleFilter={handleFilter}
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            toggle={() => {}}
          />


            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                rows={filteredData || documents || []}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={themeConfig.pageSizeOptions}
                disableRowSelectionOnClick
                loading={isLoading}
              />
            </Box>
        </Card>
      </Grid>


    </Grid>
  );
};

export default Documents;
