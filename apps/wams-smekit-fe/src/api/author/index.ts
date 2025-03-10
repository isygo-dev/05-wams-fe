import { AppQuery } from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";
import { AuthorType } from "../../types/author";

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
};

export const addAuthor = async (data: AuthorType) => {
  console.log("[addAuthor] Envoi de la requête POST avec les données :", data);

  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("[addAuthor] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error(" [addAuthor] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const res = await response.json();
  console.log("[addAuthor] Auteur ajouté avec succès :", res);

  return res;
};

export const updateAuthor = async (data: AuthorType) => {
  console.log(" [updateAuthor] Envoi de la requête PUT pour l'ID :", data.id);
  console.log(" [updateAuthor] Données envoyées :", data);

  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint + `?id=${data.id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  });

  console.log(" [updateAuthor] Statut de la réponse :", response.status);

  if (!response.ok) {
    console.error(" [updateAuthor] Erreur HTTP :", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const res = await response.json();
  console.log(" [updateAuthor] Auteur mis à jour :", res);

  return res;
};

export const deleteAuthor = async (id: number) => {
  console.log(" [deleteAuthor] Envoi de la requête DELETE pour l'ID :", id);

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
};
