import apiUrls from "../../config/apiUrl";
import { AppQuery, HttpError } from "template-shared/@core/utils/fetchWrapper";
import toast from "react-hot-toast";
import { DocumentType } from "../../types/document";
import { IEnumDocTempStatus } from "../../types/categoryTemplateType";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";



const permission = PermissionPage.DOCUMENT

export const fetchDocuments = async (page: number, pageSize: number) => {
  if (!checkPermission(PermissionApplication.SMEKIT, permission, PermissionAction.READ)) {
    console.warn('Permission denied on read ' + permission)

    return
  }
  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_Document_Endpoint}?page=${page}&size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching documents:', error)

    return [];
  }
}
export const fetchDocuments1 = async (page: number, pageSize: number, createdBy: string) => {
  if (!checkPermission(PermissionApplication.SMEKIT, permission, PermissionAction.READ)) {
    console.warn('Permission denied on read ' + permission)

    return
  }
  try {
    if (!createdBy?.trim()) {
      console.warn("Aucun utilisateur connecté, impossible de récupérer les documents");
      return [];
    }

    const url = `${apiUrls.apiUrl_smekit_Document_Endpoint}/by-user?page=${page}&size=${pageSize}&createdBy=${encodeURIComponent(createdBy)}`;

    console.log("📥 Appel API documents utilisateur :", url);

    const response = await AppQuery(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API documents :", errorText);
      throw new Error('Erreur lors du chargement des documents');
    }

    const data = await response.json();

    console.log("✅ Documents reçus :", data);

    if (!Array.isArray(data)) {
      console.error("⚠️ Format inattendu :", data);

      return [];
    }

    return data.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      description: doc.description,
      createDate: doc.createDate,
      createdBy: doc.createdBy,
      extension: doc.extension,
      originalFileName: doc.originalFileName,
      version: doc.version || 1,
      ...doc
    }));
  } catch (error) {
    console.error("❌ Erreur lors du chargement des documents :", error);

    return [];
  }
};


export const getDocumentsByPage = async (page: number, size: number): Promise<{
  content: DocumentType[];
  totalElements: number;
}> => {
  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_Document_Endpoint}/${page}/${size}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch documents by page');
    }

    const data = await response.json();

    return {
      content: data.content.map((doc: any) => ({
        ...doc,
        type: doc.type || IEnumDocTempStatus.EDITING,
        shared: doc.shared || false,
        sharedWithUsers: doc.sharedWithUsers || [],
        comments: doc.comments || []
      })),
      totalElements: data.totalElements
    };
  } catch (error) {
    console.error('Error fetching documents by page:', error);

    return {
      content: [],
      totalElements: 0
    };
  }
};
export const createDocumentFromTemplate = async (

  templateId: number,
  name: string,
  content: string
): Promise<DocumentType> => {
  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_Document_Endpoint}/from-template/${templateId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, content })
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur ${response.status} : ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};




export const updateDocument = async (id: number, data: { html: string }): Promise<DocumentType> => {
  if (!checkPermission(PermissionApplication.SMEKIT, permission, PermissionAction.WRITE)) {
    console.warn('Permission denied on read ' + permission)

    return
  }
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/${id}/save`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new HttpError(error);
  }

  return response.json();
};

export const deleteDocument = async (id: number) => {
  if (!checkPermission(PermissionApplication.SMEKIT, permission, PermissionAction.DELETE)) {
    console.warn('Permission denied on read ' + permission)

    return
  }

  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Document_Endpoint}?id=${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to delete document (Status ${response.status})`);
  }
};


export const getDocumentById = async (id: number): Promise<DocumentType | null> => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  if (!response.ok) return null;

  const document = await response.json();

  return {
    ...document,
    type: document.type || IEnumDocTempStatus.EDITING,
    shared: document.shared || false,
    sharedWithUsers: document.sharedWithUsers || [],
    comments: document.comments || []
  };
};

export const downloadDocument = async (data: { id: number; originalFileName: string }) => {

  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/file/download?id=${data.id}&version=1`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download file: ${errorText}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = data.originalFileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  toast.success('Document téléchargé avec succès');
};

export const getDocumentCount = async (): Promise<number> => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/count`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) return 0;

  return await response.json();
};
export const fetchDocumentHtmlContent = async (documentId: number, version: number) => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/${documentId}/html/?version=${version}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch document HTML content');
  }

  return await response.json();
};


export const getDocumentHtmlWithMetadata = async (
  documentId: number,
  version: number
): Promise<{ document: DocumentType; html: string }> => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Document_Endpoint}/${documentId}/html/details?version=${version}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Échec du chargement du contenu enrichi');
  }

  return await response.json();
};
