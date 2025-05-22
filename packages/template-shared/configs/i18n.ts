import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from 'template-shared/public/locales/en.json'
import arTranslation from 'template-shared/public/locales/ar.json'
import frTranslation from 'template-shared/public/locales/fr.json'
import deTranslation from 'template-shared/public/locales/de.json'
import itTranslation from 'template-shared/public/locales/it.json'
import espTranslation from 'template-shared/public/locales/es.json'

import localStorageKeys from './localeStorage'

const initializeI18n = async () => {
  try {
    let userLanguage: string
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem(localStorageKeys.userData)) {
        const userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
        if (userData?.language) {
          userLanguage = userData.language?.toLowerCase()
        }
      }
    }
    const initialLanguage = userLanguage ? userLanguage : 'en'

    i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        lng: initialLanguage,
        resources: {
          en: { translation: enTranslation },
          ar: { translation: arTranslation },
          fr: { translation: frTranslation },
          de: { translation: deTranslation },
          sp: { translation: espTranslation },
          it: { translation: itTranslation }
        },
        fallbackLng: initialLanguage,
        debug: false,
        react: {
          useSuspense: false
        },
        interpolation: {
          escapeValue: false,
          formatSeparator: '.'
        }
      })
  } catch (error) {
    console.error('Failed to initialize i18n:', error)
  }
}

// Call the initialization function
initializeI18n()

export default i18n
