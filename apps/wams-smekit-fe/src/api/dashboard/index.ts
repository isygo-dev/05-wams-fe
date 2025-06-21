import {AppQuery} from "template-shared/@core/utils/fetchWrapper";
import apiUrls from "../../config/apiUrl";
import localStorageKeys from "template-shared/configs/localeStorage";
import {DashboardStats} from "../../types/Dashboard";





function decodeJwtPayload(token: string): Record<string, any> {
  const payloadBase64 = token.split('.')[1];
  const payloadJson = atob(payloadBase64);

  return JSON.parse(payloadJson);
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const storedToken = localStorage.getItem(localStorageKeys.accessToken);
  if (!storedToken) {
    throw new Error('No token found');
  }

  const decodedToken = decodeJwtPayload(storedToken);
  const userIdentifier = decodedToken['sender-user'];

  console.log('Extracted userIdentifier:', userIdentifier);

  const url = `${apiUrls.apiUrl_smekit_Dashboard_Endpoint}/stats?userIdentifier=${encodeURIComponent(userIdentifier)}`;
  console.log('Request URL:', url);

  const response = await AppQuery(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storedToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }

  const data = await response.json();
  console.log('Full API response:', data);

  return data;
};
