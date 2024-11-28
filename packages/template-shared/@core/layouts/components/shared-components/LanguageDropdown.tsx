import React, {useEffect} from 'react'
import Icon from '../../../components/icon'
import {useTranslation} from 'react-i18next'
import OptionsMenu from '../../../components/option-menu'
import {Settings} from '../../../context/settingsContext'
import localStorageKeys from '../../../../configs/localeStorage'
import {useMutation} from 'react-query'
import {UserDataType} from '../../../../context/types'
import {AccountDto} from "ims-shared/@core/types/ims/accountTypes";
import jwt from 'jsonwebtoken'
import {SCUI_setLanguage} from "../../../api/scui";
import AccountApis from "ims-shared/@core/api/ims/account";

interface Props {
    settings: Settings
    saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({settings, saveSettings}: Props) => {
    const {t} = useTranslation()
    const {i18n} = useTranslation()
    const userDataString =
        window?.localStorage.getItem(localStorageKeys.userData) || window?.sessionStorage.getItem(localStorageKeys.userData)
    const userData = userDataString ? JSON.parse(userDataString) : null
    const accountId = userData ? userData.id : null

    const handleLangItemClick = (lang: 'en' | 'fr' | 'ar' | 'de' | 'it' | 'sp') => {
        i18n.changeLanguage(lang)
        settings.mode = 'light'
        saveSettings({...settings, direction: lang === 'ar' ? 'rtl' : 'ltr'})

        const dataEdit = {
            accountId,
            lang
        }

        const token = localStorage.getItem(localStorageKeys.authorityToken)
        const oldTokenDecoded = jwt.decode(token, {complete: true})

        console.log()
        if (oldTokenDecoded.payload['log-app'] == 'SmartCode-UI') {
            setLanguageFunct.mutate({
                language: lang
            })
        }
        updateLanguage.mutate(dataEdit)
    }

    const setLanguageFunct = useMutation({
        mutationFn: (data: any) => SCUI_setLanguage(data),
        onSuccess: (res: any) => {
            console.log(res)
        }
    })

    const updateLanguage = useMutation({
        mutationFn: (data: any) => AccountApis(t).updateAccountLanguage(data.accountId, data.lang),
        onSuccess: (res: AccountDto) => {
            const getLocalUserData: UserDataType = JSON.parse(localStorage.getItem(localStorageKeys.userData))
            getLocalUserData.language = res.language
            window.localStorage.removeItem('userData')
            window.localStorage.setItem(localStorageKeys.userData, JSON.stringify(getLocalUserData))
            window.localStorage.removeItem('i18nextLng')
            i18n.language = res.language
            window.localStorage.setItem('i18nextLng', res.language)
        }
    })

    // ** Change html `lang` attribute when changing locale
    useEffect(() => {
        document.documentElement.setAttribute('lang', userData?.language ? userData?.language : i18n.language)
    }, [i18n.language])

    return (
        <OptionsMenu
            iconButtonProps={{color: 'inherit'}}
            icon={<Icon fontSize='1.3rem' icon='tabler:language'/>}
            menuProps={{sx: {'& .MuiMenu-paper': {mt: 4.5, minWidth: 130}}}}
            options={[
                {
                    text: 'English',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'en',
                        onClick: () => {
                            handleLangItemClick('en')
                        }
                    }
                },
                {
                    text: 'French',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'fr',
                        onClick: () => {
                            handleLangItemClick('fr')
                        }
                    }
                },
                {
                    text: 'Arabic',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'ar',
                        onClick: () => {
                            handleLangItemClick('ar')
                        }
                    }
                },
                {
                    text: 'German',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'de',
                        onClick: () => {
                            handleLangItemClick('de')
                        }
                    }
                },
                {
                    text: 'Spanish ',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'sp',
                        onClick: () => {
                            handleLangItemClick('sp')
                        }
                    }
                },
                {
                    text: 'Italian',
                    menuItemProps: {
                        sx: {py: 2},
                        selected: i18n?.language.toLowerCase() === 'it',
                        onClick: () => {
                            handleLangItemClick('it')
                        }
                    }
                }
            ]}
        />
    )
}

export default LanguageDropdown
