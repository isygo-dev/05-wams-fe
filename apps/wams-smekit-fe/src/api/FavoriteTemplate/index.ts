import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";
import {fetchAuthorDetails, fetchCategoryDetails} from "../template";
import { getUserDomainFromToken } from "template-shared/@core/api/helper/permission";

export const toggleTemplatePin = async (templateId: number): Promise<boolean> => {
  const userIdentifier = getUserDomainFromToken();
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/${templateId}/pin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userIdentifier
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle pin status');
  }

  return await response.json();
};

export const getPinnedTemplates = async (): Promise<any[]> => {
  const userIdentifier = getUserDomainFromToken();
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/pinned?userIdentifier=${userIdentifier}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pinned templates');
  }

  const templates = await response.json();

  return await Promise.all(
    templates.map(async template => {
      const [author, category] = await Promise.all([
        template.authorId ? fetchAuthorDetails(template.authorId) : null,
        template.categoryId ? fetchCategoryDetails(template.categoryId) : null
      ]);

      return { ...template, author, category };
    })
  );
};

export const checkPinStatus = async (templateId: number): Promise<boolean> => {
  try {
    const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/${templateId}/pinned-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check pin status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking pin status:', error);
    throw error;
  }
};
export const fetchPinnedCount = async (): Promise<number> => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Template_FetchAll_Endpoint}/pinned/coun`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pinned count');
  }

  return await response.json();
};
