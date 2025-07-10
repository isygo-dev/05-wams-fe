import { useEffect, useState } from "react";
import { getDocumentsSharedWithUser } from "../../../api/SharedWith";
import {
  Card, Box, Avatar, IconButton, Tooltip, Typography,
  Chip, Accordion, AccordionSummary, AccordionDetails, Divider,
  Grid, Stack, useTheme
} from "@mui/material";
import toast from "react-hot-toast";
import Icon from "template-shared/@core/components/icon";
import { useTranslation } from "react-i18next";
import AccountApis from "ims-shared/@core/api/ims/account";
import { useRouter } from "next/navigation";
import Moment from "react-moment";

interface DocumentsPartagesProps {
  onPreview: (doc: any) => void;
  onDownload: (doc: any) => void;
}

const DocumentsPartages = ({ onPreview, onDownload }: DocumentsPartagesProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const AccountApi = AccountApis(t);
  const router = useRouter();

  const [userCode, setUserCode] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);

  const getFileTypeIcon = (ext?: string) => {
    switch (ext?.toLowerCase()) {
      case "pdf": return "mdi:file-pdf-box";
      case "doc":
      case "docx": return "mdi:file-word-outline";
      case "xls":
      case "xlsx": return "mdi:file-excel-outline";
      case "ppt":
      case "pptx": return "mdi:file-powerpoint-outline";
      default: return "mdi:file-outline";
    }
  };

  const getFileTypeColor = (ext?: string) => {
    switch (ext?.toLowerCase()) {
      case "pdf": return "error.main";
      case "doc":
      case "docx": return "primary.main";
      case "xls":
      case "xlsx": return "success.main";
      case "ppt":
      case "pptx": return "warning.main";
      default: return "text.secondary";
    }
  };

  const getPermissionColor = (permission: string) =>
    permission === "READ" ? "warning" : "success";

  const getPermissionLabel = (permission: string) =>
    permission === "READ" ? t("Lecture seule") : t("Édition autorisée");

  useEffect(() => {
    AccountApi.getAccountProfile()
      .then((user) => (user?.code ? setUserCode(user.code) : toast.error(t("Code utilisateur introuvable"))))
      .catch(() => toast.error(t("Impossible de récupérer l'utilisateur connecté")));
  }, []);

  useEffect(() => {
    if (!userCode) return;

    Promise.all([
      getDocumentsSharedWithUser(userCode),
      AccountApi.getAccounts()
    ])
      .then(([docs, accounts]) => {
        const accountMap = new Map(accounts.map(acc => [acc.code, acc]));

        const enrichedDocs = docs.map(doc => ({
          ...doc,
          document: {
            ...doc.document,
            createdByDetails: accountMap.get(doc.document.createdBy)
          },
          sharedWithDetails: accountMap.get(doc.user),
          sharedByDetails: accountMap.get(doc.createdBy)
        }));

        setDocuments(enrichedDocs);
      })
      .catch(() => toast.error(t("Impossible de charger les documents ou utilisateurs")));
  }, [userCode]);

  return (
    <Grid container spacing={2}>
      {documents.map((share) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={share.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[8] }
            }}
          >
            {/* Bandeau supérieur */}
            <Box
              sx={{
                p: 2,
                backgroundColor: theme.palette.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "transparent", color: getFileTypeColor(share.document.extension) }}>
                  <Icon icon={getFileTypeIcon(share.document.extension)} />
                </Avatar>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title={t("Aperçu")}>
                    <IconButton onClick={() => onPreview(share.document)}>
                      <Icon icon="solar:document-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("Télécharger")}>
                    <IconButton onClick={() => onDownload(share.document)}>
                      <Icon icon="material-symbols:download" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("Éditer")}>
                    <IconButton
                      onClick={() =>
                        router.push(`/apps/document/edit/${share.document.id}/${share.document.version || "1"}?permission=${share.permission}`)
                      }
                    >
                      <Icon icon="mdi:file-document-edit-outline" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Contenu principal */}
            <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("Créé par")}:</strong>{" "}
                {share.document.createdByDetails
                  ? `${share.document.createdByDetails.accountDetails?.firstName || ""} ${share.document.createdByDetails.accountDetails?.lastName || ""}`
                  : share.document.createdBy || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>{t("Partagé par")}:</strong>{" "}
                {share.sharedByDetails
                  ? `${share.sharedByDetails.accountDetails?.firstName || ""} ${share.sharedByDetails.accountDetails?.lastName || ""}`
                  : share.createdBy || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>{t("Partagé avec")}:</strong>{" "}
                {share.sharedWithDetails
                  ? `${share.sharedWithDetails.accountDetails?.firstName || ""} ${share.sharedWithDetails.accountDetails?.lastName || ""}`
                  : share.user || "-"}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip label={`v${share.document.version || "1"}`} size="small" />
                <Chip label={share.document.template?.typeTl || "N/A"} size="small" />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                <strong>{t("Domaine")}:</strong> {share.document.domain || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>{t("Date de création")}:</strong>{" "}
                {share.document.createDate ? <Moment format="DD/MM/YYYY">{share.document.createDate}</Moment> : "-"}
              </Typography>

              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<Icon icon="tabler:chevron-down" />}>
                  <Typography>{t("Description")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {share.document.description || t("Aucune description")}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Divider />

            {/* Badge bas de carte */}
            <Box sx={{ px: 3, py: 2 }}>
              <Chip label={getPermissionLabel(share.permission)} color={getPermissionColor(share.permission)} size="small" />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DocumentsPartages;
