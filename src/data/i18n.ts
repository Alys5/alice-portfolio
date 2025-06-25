import { createI18n } from 'vue-i18n'
import it from './i18n.it'
import en from './i18n.en'
import es from './i18n.es'

// Oggetto messages: tutte le stringhe localizzate per IT/EN/ES
export const messages = {
  it,
  en,
  es,
}

/**
 * Setup e creazione istanza i18n per Vue 3
 * @param locale Lingua attiva ('it' | 'en' | 'es')
 * @returns istanza i18n configurata
 */
export function setupI18n(locale: 'it' | 'en' | 'es' = 'it') {
  return createI18n({
    legacy: false, // Modalità Composition API
    locale, // Lingua attiva
    fallbackLocale: 'it', // Fallback se chiave mancante
    messages, // Oggetto con tutte le stringhe
    globalInjection: true, // Permette l'uso diretto di $t
  })
}
