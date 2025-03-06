
 import apiUrls from "../../config/apiUrl";
 import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
 import {CategoryType} from "../../types/category";

// ** Fetch Role


export const fetchAll = async () => {
  const response = await AppQuery(apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint, {
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
 export const addCategory = async (data: CategoryType) => {
   console.log("Données envoyées :", data);

   const response = await AppQuery(apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint, {
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




 export const updateCategory = async (data: CategoryType) => {
   const response = await AppQuery(apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint + `?id=${data.id}`, {
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


 export const deleteCategory = async (id: number) => {
   const response = await fetch(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}?id=${id}`, {
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

 //
//
// export const setLanguage = async (data: any) => {
//   const response = await myFetch(`${apiUrls.apiUrl_SCUI_SetLanguageEndPoint}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify(data)
//   })
//
//   const result = await response.json()
//
//   return result
// }
