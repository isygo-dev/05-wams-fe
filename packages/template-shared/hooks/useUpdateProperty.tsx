import {useMutation} from 'react-query'
import {PropertyTypes} from 'ims-shared/@core/types/ims/propertyTypes'
import localStorageKeys from '../configs/localeStorage'
import PropertyApis from "ims-shared/@core/api/ims/property";
import {useTranslation} from "react-i18next";

interface UpdatePropertyProps {
    guiName: string
}

interface UpdatePropertyResult {
    handleSaveChangeWithName: (expanded: boolean, name: string) => void
}

const useUpdateProperty = (props: UpdatePropertyProps): UpdatePropertyResult => {
    const {t} = useTranslation()

    function handleSaveChangeWithName(expanded: boolean, name: string) {
        if (getAccountCode() !== null) {
            const dataProperty: PropertyTypes = {
                name: name,
                guiName: props.guiName,
                value: expanded.toString()
            }
            mutationProperty.mutate(dataProperty)
        } else {
            console.error('Account code not found in local storage')
        }
    }

    function getAccountCode(): string {
        const currentUser = window.localStorage.getItem(localStorageKeys.userData)

        if (currentUser) {
            if (JSON.parse(currentUser)) {
                return JSON.parse(currentUser).userName
            }
        }

        return ''
    }

    const mutationProperty = useMutation({
        mutationFn: (dataProperty: PropertyTypes) => PropertyApis(t).updateProperty(dataProperty, getAccountCode()),
        onSuccess: res => {
            console.log('onSuccess', res)
        },
        onError: err => {
            console.log(err)
        }
    })

    return {handleSaveChangeWithName}
}

export default useUpdateProperty
