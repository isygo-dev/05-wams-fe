import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { shareDocument } from "../../../api/SharedWith";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTranslation } from "react-i18next";
import AccountApis from "ims-shared/@core/api/ims/account";
import { Box, Divider } from "@mui/material";

interface ShareDocumentDialogProps {
  documentId: number;
  isOpen: boolean;
  onClose: () => void;
  onShareSuccess?: () => void;
}

export const ShareDocumentDialog = ({
                                      documentId,
                                      isOpen,
                                      onClose,
                                      onShareSuccess
                                    }: ShareDocumentDialogProps) => {

  const { t } = useTranslation();
  const [userCode, setUserCode] = useState("");
  const [permission, setPermission] = useState<"READ" | "EDIT">("READ");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const accountApi = AccountApis(t);

  useEffect(() => {
    if (isOpen) {
      accountApi.getAccounts().then((res) => {
        if (Array.isArray(res)) {
          setUsers(res);
        } else {
          setUsers([]);
        }
      }).catch(() => {
        toast.error("Impossible de récupérer les utilisateurs");
        setUsers([]);
      });
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!userCode) {
      toast.error("Veuillez sélectionner un utilisateur");

      return;
    }
    setLoading(true);
    try {
      await shareDocument(documentId, { user: userCode, permission });
      toast.success("Partage effectué");
      setUserCode("");
      setPermission("READ");
      onClose();
      onShareSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du partage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        {t("Partager le document")}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 4 }}>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Sélection utilisateur */}
          <FormControl fullWidth>
            <InputLabel id="user-label">{t("Utilisateur")}</InputLabel>
            <Select
              labelId="user-label"
              value={userCode}
              label={t("Utilisateur")}
              onChange={(e) => setUserCode(e.target.value)}
            >
              {users.map((user) => {
                const firstName = user.accountDetails?.firstName || "";
                const lastName = user.accountDetails?.lastName || "";
                const fullName = `${firstName} ${lastName}`.trim();

                return (
                  <MenuItem key={user.id} value={user.code}>
                    {fullName || "Utilisateur sans nom"}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Sélection permission */}
          <FormControl fullWidth>
            <InputLabel id="permission-label">{t("Permission")}</InputLabel>
            <Select
              labelId="permission-label"
              value={permission}
              label={t("Permission")}
              onChange={(e) => setPermission(e.target.value as "READ" | "EDIT")}
            >
              <MenuItem value="READ">{t("Lecture seule")}</MenuItem>
              <MenuItem value="EDIT">{t("Édition autorisée")}</MenuItem>
            </Select>
          </FormControl>

          {/* Bouton */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "primary.main",
              fontWeight: 600,
              "&:hover": { backgroundColor: "primary.dark" }
            }}
            onClick={handleShare}
            disabled={loading}
          >
            {loading ? t("Partage en cours...") : t("Partager")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
