
import apiUrls from "../../config/apiUrl";
import { AppQuery } from "template-shared/@core/utils/fetchWrapper";

export const fetchAlltags = async () => {
  console.log("[fetchAlltags] Envoi de la requête GET vers :", apiUrls.apiUrl_smekit_tag_Endpoint);

  try {
    const response = await AppQuery(apiUrls.apiUrl_smekit_tag_Endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    console.log("[fetchAlltags] Statut de la réponse :", response.status);

    if (!response.ok) {
      console.error("[fetchAlltags] Erreur HTTP :", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const tags = await response.json();
    console.log("[fetchAlltags] Réponse reçue :", tags);
    return tags;
  } catch (error) {
    console.error("[fetchAlltags] Erreur lors de la récupération des tags:", error);
    throw error;
  }
};

export const addTag = async (tagName: string) => {
  console.log("[addTag] Envoi de la requête POST avec le nom du tag :", tagName);

  try {
    const response = await AppQuery(apiUrls.apiUrl_smekit_tag_Endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ tagName: tagName }),
    });

    console.log("[addTag] Statut de la réponse :", response.status);

    if (!response.ok) {
      console.error("[addTag] Erreur HTTP :", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const tag = await response.json();
    console.log("[addTag] Tag ajouté avec succès :", tag);
    return tag;
  } catch (error) {
    console.error("[addTag] Erreur lors de l'ajout du tag:", error);
    throw error;
  }
}
