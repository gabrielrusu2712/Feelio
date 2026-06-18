import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { CustomDetector } from 'i18next-browser-languagedetector'

import en from '@/core/i18n/locales/en/translation.json'
import ro from '@/core/i18n/locales/ro/translation.json'
import { STORAGE_KEYS, getItem, setItem } from '@/shared/data-access/utils/local-storage'

// EN drives the generated resource types and is the fallback.
const DEFAULT_LOCALE = 'en'
const SUPPORTED_LOCALES = ['en', 'ro'] as const

// Persists/reads the chosen language through the typed localStorage wrapper,
// so all storage access goes through one place (key: STORAGE_KEYS.LANGUAGE).
const localStorageDetector: CustomDetector = {
  name: 'feelioLocalStorage',
  lookup: () => getItem<string>(STORAGE_KEYS.LANGUAGE) ?? undefined,
  cacheUserLanguage: (lng) => setItem(STORAGE_KEYS.LANGUAGE, lng),
}

const languageDetector = new LanguageDetector()
languageDetector.addDetector(localStorageDetector)

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    load: 'languageOnly', // collapse "en-US" → "en"
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    detection: {
      order: ['feelioLocalStorage', 'navigator'],
      caches: ['feelioLocalStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })
