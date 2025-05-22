import apiUrls from '../../config/apiUrl'
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import { CategoryType } from '../../types/category'

import toast from 'react-hot-toast'

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
export const getCategoryByPage = async (page: number, size: number) => {
  // if (!checkPermission(PermissionApplication.RPM, permission, PermissionAction.READ)) {
  //   console.warn('Permission denied on read ' + t(permission))
  //
  //   return
  // }

  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}/${page}/${size}`, {
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

export const addCategory = async (data: FormData): Promise<CategoryType> => {
  console.log('[addAuthor] Envoi de la requête POST avec les données :', data)

  const response = await AppQuery(apiUrls.apiUrl_smekit_Category_Image_Endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: data
  })

  console.log('[addAuthor] Statut de la réponse :', response.status)

  if (!response.ok) {
    console.error(' [addAuthor] Erreur HTTP :', response.status)
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const res = await response.json()
  console.log('[addAuthor] Auteur ajouté avec succès :', res)

  return res
}

export const updateCategory = async (data: CategoryType) => {
  const { id, ...rest } = data

  const cleanedPayload = {
    domain: rest.domain,
    name: rest.name,
    description: rest.description,
    type: rest.type,
    imagePath: rest.imagePath,
    tagName: rest.tagName && Array.isArray(rest.tagName) ? rest.tagName.map(tag => ({ tagName: tag.tagName })) : []
  }

  console.log('Cleaned Payload:', cleanedPayload)

  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}?id=${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(cleanedPayload)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return await response.json()
}

export const updateCategoryPicture = async (data: { id: number; file: Blob }) => {
  const formData = new FormData()
  formData.append('file', data.file as File)
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_ImageUpload_Endpoint}/${data.id}`, {
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

export const deleteCategory = async (id: number) => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}?id=${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  if (!response.ok) {
    console.error('[deleteCategory] Erreur HTTP :', response.status)
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  toast.success('Catégorie supprimée avec succès.')

  return id
}

export const getTemplateCountsByCategory = async () => {
  const response = await AppQuery(`${apiUrls.apiUrl_smekit_Category_StorageConfigEndpoint}/template-counts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch template counts by category')
  }

  return await response.json()
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
