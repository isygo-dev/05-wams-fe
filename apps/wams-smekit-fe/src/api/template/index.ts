import apiUrls from "../../config/apiUrl";
import {AppQuery, HttpError} from "template-shared/@core/utils/fetchWrapper";
import imsApiUrls from "ims-shared/configs/ims_apis";
import toast from "react-hot-toast";
import {AuthorType} from "../../types/author";
import {CategoryType} from "../../types/category";



export const fetchAllTemplate = async () => {
  const response = await AppQuery(apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint, {
    method: 'GET'
  });

  if (!response.ok) throw new Error('Failed to fetch templates');

  const templates = await response.json();

  const enhancedTemplates = await Promise.all(
    templates.map(async template => {
      const [author, category] = await Promise.all([
        template.authorId ? fetchAuthorDetails(template.authorId) : null,
        template.categoryId ? fetchCategoryDetails(template.categoryId) : null
      ]);


      return { ...template, author, category };
    })
  );

  return enhancedTemplates;
}

export const getTemplatesByPage = async (page: number, size: number) => {
  try {
    const response = await AppQuery(
      `${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/${page}/${size}`,
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
      throw new Error('Failed to fetch templates by page');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching templates by page:', error);

    return null;
  }
}

export const fetchAuthorDetails = async (id: number): Promise<AuthorType> => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Author_StorageConfigEndpoint}/${id}`, {
    method: 'GET'
  });

  return response.json();
};

export const fetchCategoryDetails = async (id: number): Promise<CategoryType> => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}/${id}`, {
    method: 'GET'
  })

  return response.json();
};

export const addTemplate = async (data: FormData) => {

  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*'
    },
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add template');
  }

  toast.success('Template added successfully');

return await response.json();
}

export const getTemplateCount = async (): Promise<number> => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_Count_Endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    return
  }

  return await response.json()
}


export const downloadTemplateFile = async (data: { id: number; originalFileName: string }) => {
  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_TemplateDownload_StorageConfigEndpoint}?id=${data.id}&version=1`,
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
export const updateTemplate = async (formData: FormData) => {
  const id = formData.get('id');
  if (!id) {
    throw new Error("Template ID is required for update");
  }

  const response = await AppQuery(
    `${apiUrls.apiUrl_smekit_Template_StorageConfigEndpoint}?id=${id}`,
    {
      method: 'PUT',
      headers: {

      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new HttpError(errorData);
  }

  return await response.json();
};

export const deleteTemplate = async (id: number) => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}?id=${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete template');
  }

  return id;
};
