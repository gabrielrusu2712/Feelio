import type Resources from '@/core/i18n/types/resources'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources
  }
}
