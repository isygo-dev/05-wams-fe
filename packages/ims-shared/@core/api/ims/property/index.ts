import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import {PropertyTypes} from 'ims-shared/@core/types/ims/propertyTypes'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from "i18next";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import imsApiUrls from "../../../../configs/ims_apis"

const PropertyApis = (t: TFunction) => {
    const permission = PermissionPage.PROPERTY

    const getPropertyByAccountAndGuiAndName = async (accountCode: string, guiName: string, name: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }


        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Property_Account_Gui_Name_EndPoint}?accountCode=${accountCode}&guiName=${guiName}&name=${name}`, {
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

    const getPropertiesByAccountAndGui = async (accountCode: string, guiName: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Property_Account_Gui_All_EndPoint}?accountCode=${accountCode}&guiName=${guiName}`, {
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

    const updateProperty = async (data: PropertyTypes, accountCode: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }


        const response = await AppQuery(`${imsApiUrls.apiUrl_IMS_Property_Account_Gui_Name_EndPoint}?code=${accountCode}`, {
            method: 'PUT',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            return
        }

        return await response.json()
    }

    return {
        getPropertyByAccountAndGuiAndName,
        getPropertiesByAccountAndGui,
        updateProperty
    }
}

export default PropertyApis
