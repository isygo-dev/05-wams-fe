import apiUrls from 'template-shared/configs/apiUrl'
import {AppQuery} from '../../utils/fetchWrapper'

export const SCUI_setLanguage = async (data: any) => {
    const response = await AppQuery(`${apiUrls.apiUrl_SCUI_SetLanguage_EndPoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    })

    return await response.json()
}