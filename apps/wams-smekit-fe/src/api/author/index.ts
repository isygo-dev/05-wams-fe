import {AppQuery, HttpError} from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";
import {TemplateType} from "mms-shared/@core/types/mms/templateTypes";
import {AuthorType} from "../../types/author";
import toast from "react-hot-toast";

export const fetchAllAuthor = async () => {
  console.log("[fetchAllAuthor] Envoi de la requête GET vers :", apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint);

  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  console.log("[fetchAllAuthor] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error("[fetchAllAuthor] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const authors = await response.json();
  console.log("[fetchAllAuthor] Réponse reçue :", authors);

  return authors;
}
export const getAuthorByPage = async (page: number, size: number) => {
  // if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
  //   console.warn('Permission denied on read ' + t(permission))
  //
  //   return
  // }

  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}/${page}/${size}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  if (!response.ok) {
    return
  }

  return await response.json()
}


export const addAuthor = async (data: FormData) => {

  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_Image_Endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Access-Control-Allow-Origin': '*'
    },
    body: data,
  });

  console.log("[addAuthor] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error(" [addAuthor] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const res = await response.json();
  console.log("[addAuthor] Auteur ajouté avec succès :", res);

  return res;
}

export const getAuthorTemplates = async (authorId: number): Promise<TemplateType[]> => {
  console.log("[getAuthorTemplates] Fetching templates for author ID:", authorId);

  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/author/${authorId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch author templates');
    }

    const data = await response.json();
    console.log("[getAuthorTemplates] Received templates:", data);

    return data;
  } catch (error) {
    console.error('[getAuthorTemplates] Error:', error);
    throw error;
  }
}
export const updateAuthor = async (formData: AuthorType) => {

  if (!formData.id) {
    throw new Error("Author ID is required for update");
  }

  console.log("[updateAuthor] Envoi de la requête PUT pour l'ID:", formData.id);

  const endpoint = `${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}?id=${formData.id}`;
  console.log("[updateAuthor] URL utilisée:", endpoint);

  try {


    const response = await AppQuery(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(formData),
    });

    console.log("[updateAuthor] Statut de la réponse:", response.status);

    if (!response.ok) {
      console.error("[updateAuthor] Erreur HTTP:", response.status);
      const errorData = await response.json();
      throw new HttpError(errorData);
    }

    const res = await response.json();
    console.log("[updateAuthor] Auteur mis à jour:", res);

    return res;
  } catch (error) {
    console.error("[updateAuthor] Erreur complète:", error);
    throw error;
  }
}

export const updateAutherPicture = async (data: { id: number; file: Blob }) => {


  const formData = new FormData()
  formData.append('file', data.file as File)
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Author_ImageUpload_Endpoint}/${data.id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: formData
  })

  if (!response.ok) {
    return
  } else {
    toast.success('Employee.picture_updated_successfully')
  }

  return await response.json()
}
export const uploadAuthorFile = async (file: File, authorId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', authorId.toString());

  const response = await AppQuery(
    `${apiUrls.apiUrl_Author_File_Upload}?id=${authorId}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to upload author file' }));
    throw new HttpError(errorData);
  }

  return await response.json();
};

export const downloadAuthorFile = async (authorId: number, version: number = 1) => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Author_FileDownload_Endpoint}?id=${authorId}&version=${version}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download author file');
  }

  return await response.blob();
}

export const deleteAuthor = async (id: number) => {
  console.log(" [deleteAuthor] Envoi de la requête DELETE pour l'ID :", id)

  const response = await fetch(`${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}?id=${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  console.log(" [deleteAuthor] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error("[deleteAuthor] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  console.log(" [deleteAuthor] Auteur supprimé avec succès. ID :", id);

  return id;
}

export const getAuthorById = async (id: number) => {
  console.log(" [getAuthorById] Envoi de la requête GET pour l'ID :", id);

  const response = await fetch(`${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  console.log(" [getAuthorById] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error("[getAuthorById] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const author = await response.json();
  console.log(" [getAuthorById] Auteur récupéré :", author);

  return author;
}

