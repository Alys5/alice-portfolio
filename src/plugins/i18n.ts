// Plugin Vue I18n di esempio
import { createI18n } from 'vue-i18n'
import * as messages from '@/data/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'en',
  messages,
})
