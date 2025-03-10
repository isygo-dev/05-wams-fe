import apiUrls from "../../config/apiUrl";
import { AppQuery } from "template-shared/@core/utils/fetchWrapper";
import { CategoryTemplateType } from "../../types/categoryTemplateType";
import imsApiUrls from "ims-shared/configs/ims_apis";
import toast from "react-hot-toast";

export const fetchAllTemplate = async () => {
  const response = await AppQuery(apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
  if (response.ok) {
    const oneAccount = await response.json();
    console.log('Account details', oneAccount);

    return oneAccount;
  }
}



export const addTemplate = async (data: CategoryTemplateType) => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    return
  } else {
    toast.success('Account.added_successfully')
  }

  return await response.json()
};


export const getUserConnect = async () => {
  const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_MyProfile_EndPoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  if (!response.ok) {
    console.error("Error fetching user profile");

    return null;
  }

  const user = await response.json();
  console.log("User connected data:", user);

  return user;
};
export const updateTemplate = async (data: CategoryTemplateType) => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint}/update/${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const res = await response.json();

  return res;
};

export const deleteTemplate = async (id: number) => {
  const response = await fetch(`${apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint}?id=${id}`, {
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
};
