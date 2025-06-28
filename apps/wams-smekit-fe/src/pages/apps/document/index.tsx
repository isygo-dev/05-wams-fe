import {useMutation, useQuery, useQueryClient} from "react-query";
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
import {deleteDocument, downloadDocument, fetchDocuments} from "../../../api/Document";
import { DocumentType } from "../../../types/document";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import toast from "react-hot-toast";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import {IEnumPermissionLevel, SharedWithType} from "../../../types/SharedWith";
import {ShareDocumentDialog} from "../../../views/apps/SharedWith/ShareDocumentDialog";
import {getDocumentShares} from "../../../api/SharedWith";
import AccountApis from "ims-shared/@core/api/ims/account";



interface CellType {
  row: DocumentType;
}


const Documents = () => {
  const { t } = useTranslation();
  const router = useRouter()
  const AccountApi = AccountApis(t);
  const dataGridApiRef = React.useRef<GridApi>();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();
  const [shareDialog, setShareDialog] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<DocumentType | null>(null);
  const [sharesList, setSharesList] = useState<SharedWithType[]>([]);
  const [value, setValue] = useState<string>('');

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

  const loadDocumentShares = async (documentId: number) => {
    try {
      const shares = await getDocumentShares(documentId);

      if (!shares || shares.length === 0) {
        setSharesList([]);

        return;
      }

      const imsUsers = await AccountApi.getAccounts();
      const enrichedShares = shares.map((share) => {
        const userData = imsUsers?.find((u) => u.code === share.user);

        return {
          ...share,
          userDisplayName: userData ? `${userData.firstname} ${userData.lastname}` : share.user
        };
      });

      setSharesList(enrichedShares);
      console.log("Liste enrichie des partages :", enrichedShares);

    } catch (error) {
      console.error("Erreur lors du chargement des partages :", error);
      setSharesList([]);
    }
  };


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
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      toast.success(t("Document supprimé avec succès"));
      queryClient.invalidateQueries('documents');
      setDeleteDialog(false);
      setSelectedId(undefined);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("Échec de la suppression"));
      setDeleteDialog(false);
      setSelectedId(undefined);
    }
  });


  const downloadDocumentMutation = useMutation({
    mutationFn: ({ id, originalFileName }: { id: number; originalFileName: string }) => {
      return downloadDocument({ id, originalFileName });
    },
    onSuccess: () => {
      toast.success(t("Document téléchargé avec succès !"));
    },
    onError: (error: any) => {
      toast.error(`Erreur lors du téléchargement : ${error.message}`);
    }
  });



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

  const handleDelete = () => {
    if (selectedId) {
      deleteDocumentMutation.mutate(selectedId);
    }
  };

  const onDownload = (row: DocumentType) => {
    if (!row.id || !row.originalFileName) {
      toast.error("Fichier manquant");

      return;
    }
    downloadDocumentMutation.mutate({
      id: row.id,
      originalFileName: row.originalFileName
    });
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
                  onDownload(row);
                }}
                disabled={!row.originalFileName}
              >
                <Icon icon='material-symbols:download' />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Partager le document" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDocumentToShare(row);
                setShareDialog(true);
                loadDocumentShares(row.id);
              }}
            >
              <Icon icon="mdi:share-variant" />
            </IconButton>
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

      <DeleteCommonDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        selectedRowId={selectedId}
        onDelete={handleDelete}
        item="Document"
      />
      <ShareDocumentDialog
        documentId={documentToShare?.id || 0}
        isOpen={shareDialog}
        onClose={() => setShareDialog(false)}
        onShareSuccess={() => {
          if (documentToShare) {
            loadDocumentShares(documentToShare.id);
          }
        }}
      />

      {sharesList.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Utilisateurs ayant accès :</Typography>
          {sharesList.map((s) => (
            <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>{s.userDisplayName ? s.userDisplayName : s.user}</Typography>
              <Typography color="text.secondary">
                {s.permission === IEnumPermissionLevel.READ ? "Lecture seule" : "Édition autorisée"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}



    </Grid>
  );
};

export default Documents;
