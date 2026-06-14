import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/core/i18n/locales/en/translation.json'
import ro from '@/core/i18n/locales/ro/translation.json'

const DEFAULT_LOCALE = 'en'

void i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LOCALE,
  resources: {
    en: { translation: en },
    ro: { translation: ro },
  },
  interpolation: {
    escapeValue: false,
  },
})
