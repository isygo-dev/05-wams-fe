import apiUrls from "../../config/apiUrl";
import { AppQuery, HttpError } from "template-shared/@core/utils/fetchWrapper";
import toast from "react-hot-toast";

export const shareDocument = async (documentId: number, data: { user: string; permission: 'READ' | 'EDIT' }) => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_SharedWith_Endpoint}/${documentId}/share`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new HttpError(error);
  }

  toast.success('Document partagé avec succès');
};

// Liste des utilisateurs ayant accès
export const getDocumentShares = async (documentId: number) => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_SharedWith_Endpoint}/${documentId}/shares`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Échec du chargement des partages');
  }

  return await response.json();
};
export const getDocumentsSharedWithUser = async (userCode: string) => {
  const url = `${apiUrls.apiUrl_smekit_SharedWith_Endpoint}/user/${userCode}/documents`;
  console.log("🔗 Appel API documents partagés :", url);

  const response = await AppQuery(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  console.log("📥 Status de la réponse :", response.status);

  if (!response.ok) {
    console.error("❌ Échec API :", response.status, response.statusText);
    throw new Error("Erreur lors du chargement des documents partagés");
  }

  const data = await response.json();
  console.log("📦 Données reçues :", data);

  return data;
};
