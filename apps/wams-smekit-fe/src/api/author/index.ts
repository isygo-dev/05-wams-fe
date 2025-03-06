import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";
import {AuthorType} from "../../types/author";

export const fetchAllAuthor = async () => {
  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  if (response.ok) {
    const oneAccount = await response.json()
    console.log('acount details', oneAccount)

    return oneAccount
  }
}

export const addAuthor = async (data: AuthorType) => {
  console.log("Données envoyées :", data);

  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });


  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }


  const res = await response.json();

  return res;
}

export const updateAuthor = async (data: AuthorType) => {
  const response = await AppQuery(apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint + `?id=${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data),

  })


  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const res = await response.json();

  return res;
}

export const deleteAuthor = async (id: number) => {
  const response = await fetch(`${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}?id=${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return id;
}

