import {useCallback} from 'react'
import {useQuery} from 'react-query'
import {PropertyTypes} from 'ims-shared/@core/types/ims/propertyTypes'
import localStorageKeys from '../configs/localeStorage'
import PropertyApis from "ims-shared/@core/api/ims/property";
import {useTranslation} from "react-i18next";

interface PropsValue {
    key: string
    guiName: string
    name: string
}

function getAccountCode(): string {
    const storedUser = window.localStorage.getItem(localStorageKeys.userData)
    if (storedUser) {
        if (JSON.parse(storedUser)) {
            return JSON.parse(storedUser).userName
        }
    }

    return ''
}

const useFetchProperties = (props: PropsValue): { data: PropertyTypes | undefined; isLoading: boolean } => {
    const {t} = useTranslation()
    const onSuccessCallback = useCallback(() => {
    }, [])

    const fetchPropertyCallback = useCallback(() => {
        return PropertyApis(t).getPropertyByAccountAndGuiAndName(getAccountCode(), props.guiName, props.name)
    }, [props.guiName, props.name])

    const {data, isLoading} = useQuery(['properties-' + props.key, getAccountCode()], fetchPropertyCallback, {
        onSuccess: onSuccessCallback
    })

    return {data, isLoading}
}

const useFetchAllProperties = (props: any): { result: any; isLoading: boolean } => {
    const {t} = useTranslation()
    const onSuccessCallback = useCallback(() => {
        // Your callback logic here
    }, [])

    const fetchPropertyCallback = useCallback(() => {
        return PropertyApis(t).getPropertiesByAccountAndGui(getAccountCode(), props.guiName)
    }, [props.guiName])

    const {data: result, isLoading} = useQuery(['properties-' + props.key, getAccountCode()], fetchPropertyCallback, {
        onSuccess: onSuccessCallback
    })
    console.log('OnSucess Fetch', result)

    return {result, isLoading}
}

export {useFetchProperties, useFetchAllProperties}
