import {DocCommentPayload, DocCommentType, IEnumDocCommentsStaus} from "../../types/DocComment";
import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";

export const getCommentsByDocumentId = async (
  documentId: number
): Promise<DocCommentType[]> => {
  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_DocComments_Endpoint}/by-document/${documentId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Échec du chargement des commentaires')
    }

    const data = await response.json()

    return data as DocCommentType[]
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires :', error)

    return []
  }
}


export const postComment = async (
  comment: DocCommentPayload
): Promise<DocCommentType> => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_DocComments_Endpoint}/custom`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error('Erreur backend:', message);
    throw new Error(`Erreur lors de l’envoi du commentaire : ${response.status}`);
  }

  return await response.json();
};


export async function updateCommentType(commentId: number, newType: IEnumDocCommentsStaus) {
  try {
    const response = await fetch(`${apiUrls.apiUrl_smekit_DocComments_Endpoint}/${commentId}/type`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newType,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du type du commentaire');
    }

    const updatedComment = await response.json();

    return updatedComment;
  } catch (error) {
    console.error('Erreur updateCommentType:', error);
    throw error;
  }
}
