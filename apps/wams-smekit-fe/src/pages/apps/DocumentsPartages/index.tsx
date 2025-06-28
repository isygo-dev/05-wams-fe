import { useEffect, useState } from "react";
import { getDocumentsSharedWithUser } from "../../../api/SharedWith";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Skeleton,
  Fade,
  Paper,
  Divider
} from "@mui/material";
import toast from "react-hot-toast";
import Icon from "template-shared/@core/components/icon";
import Moment from "react-moment";
import { useTranslation } from "react-i18next";
import AccountApis from "ims-shared/@core/api/ims/account";
import { useRouter } from "next/navigation";

const DocumentsPartages = () => {
  const { t } = useTranslation();
  const AccountApi = AccountApis(t);
  const router = useRouter();
  const [userCode, setUserCode] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFileTypeIcon = (extension?: string) => {
    if (!extension) return "mdi:file-outline";
    const ext = extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return "mdi:file-pdf-box";
      case "doc":
      case "docx":
        return "mdi:file-word-outline";
      case "xls":
      case "xlsx":
        return "mdi:file-excel-outline";
      case "ppt":
      case "pptx":
        return "mdi:file-powerpoint-outline";
      case "txt":
        return "mdi:file-document-outline";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "mdi:file-image-outline";
      default:
        return "mdi:file-outline";
    }
  };

  const getFileTypeColor = (extension?: string) => {
    if (!extension) return "#6b7280";
    const ext = extension.toLowerCase();
    switch (ext) {
      case "pdf":
        return "#ef4444";
      case "doc":
      case "docx":
        return "#2563eb";
      case "xls":
      case "xlsx":
        return "#16a34a";
      case "ppt":
      case "pptx":
        return "#ea580c";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getPermissionLabel = (permission: string) => {
    return permission === "READ" ? "Lecture seule" : "Édition autorisée";
  };

  const getPermissionColor = (permission: string) => {
    return permission === "READ" ? "info" : "success";
  };

  useEffect(() => {
    AccountApi.getAccountProfile()
      .then((user) => {
        if (user?.code) {
          setUserCode(user.code);
        } else {
          console.warn("⚠️ Code utilisateur introuvable");
          toast.error("Code utilisateur introuvable");
        }
      })
      .catch(() => toast.error("Impossible de récupérer l'utilisateur connecté"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userCode) return;

    setLoading(true);
    getDocumentsSharedWithUser(userCode)
      .then((res) => {
        setDocuments(res);
      })
      .catch(() => toast.error("Impossible de charger les documents partagés"))
      .finally(() => setLoading(false));
  }, [userCode]);

  const DocumentSkeleton = () => (
    <Card sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Skeleton variant="circular" width={64} height={64} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="30%" height={20} sx={{ mt: 0.5 }} />
        </Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </Card>
  );

  const EmptyState = () => (
    <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 3, border: '2px dashed', borderColor: 'divider' }}>
      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, backgroundColor: 'primary.light', color: 'primary.main' }}>
        <Icon icon="mdi:folder-open-outline" fontSize="2.5rem" />
      </Avatar>
      <Typography variant="h6" color="text.secondary" gutterBottom>Aucun document partagé</Typography>
      <Typography variant="body2" color="text.secondary">Les documents partagés avec vous apparaîtront ici</Typography>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ width: 48, height: 48, backgroundColor: 'primary.main', color: 'white' }}>
            <Icon icon="mdi:share-variant" fontSize="1.5rem" />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>Documents partagés</Typography>
            <Typography variant="body2" color="text.secondary">Documents partagés avec vous par d'autres utilisateurs</Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {loading ? (
        <Box>{[...Array(3)].map((_, index) => (<DocumentSkeleton key={index} />))}</Box>
      ) : documents.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={2}>
          {documents.map((share, index) => (
            <Grid item xs={12} md={6} lg={4} key={share.id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: '100%', borderRadius: 3, transition: 'all 0.3s ease', cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
                  }}
                  onClick={() =>
                    router.push(`/apps/document/edit/${share.document.id}/${share.document.version || "1"}?permission=${share.permission}`)
                  }
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ width: 64, height: 64, backgroundColor: 'transparent', border: '2px solid', borderColor: getFileTypeColor(share.document.extension), color: getFileTypeColor(share.document.extension) }}>
                        <Icon icon={getFileTypeIcon(share.document.extension)} fontSize="2rem" />
                      </Avatar>
                      <Chip label={getPermissionLabel(share.permission)} color={getPermissionColor(share.permission) as any} size="small" sx={{ fontWeight: 500 }} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Tooltip title={share.document.name} arrow>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {share.document.name}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Code: {share.document.code}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon icon="mdi:calendar" fontSize="1rem" color="#6b7280" />
                        <Typography variant="caption" color="text.secondary">
                          <Moment format="DD/MM/YYYY">{share.document.createDate}</Moment>
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title={t("Ouvrir avec TipTap")} arrow>
                        <IconButton size="small" sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/apps/document/edit/${share.document.id}/${share.document.version || "1"}?permission=${share.permission}`);
                                    }}>
                          <Icon icon="mdi:file-document-edit-outline" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DocumentsPartages;
