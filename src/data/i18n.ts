import { createI18n } from 'vue-i18n'

// Oggetto messages: tutte le stringhe localizzate per IT/EN
export const messages = {
  it: {
    hero: {
      badge: '🏆 Nielsen Norman Award 2021',
      title: 'Alice Mandelli',
      typewriterPrefix: 'Hi! Mi occupo di ',
      desc1: 'Trasformo idee in esperienze digitali award-winning.',
      desc2: 'Specializzata in UI/UX, Frontend e AI.',
      cta: 'Esplora Portfolio',
    },
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'Chi sono',
      contact: 'Contatti',
    },
    footer: {
      bio: 'Portfolio di Alice Mandelli – UX/UI Designer & Frontend Developer',
      linkedin: 'LinkedIn',
      email: 'Email',
      website: 'Website',
      copyright: 'Tutti i diritti riservati.',
    },
  },
  en: {
    hero: {
      badge: '🏆 Nielsen Norman Award 2021',
      title: 'Alice Mandelli',
      typewriterPrefix: 'Hi! I specialize in ',
      desc1: 'I turn ideas into award-winning digital experiences.',
      desc2: 'Specialized in UI/UX, Frontend and AI.',
      cta: 'Explore Portfolio',
    },
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      bio: 'Portfolio of Alice Mandelli – UX/UI Designer & Frontend Developer',
      linkedin: 'LinkedIn',
      email: 'Email',
      website: 'Website',
      copyright: 'All rights reserved.',
    },
  },
}

/**
 * Setup e creazione istanza i18n per Vue 3
 * @param locale Lingua attiva ('it' | 'en')
 * @returns istanza i18n configurata
 */
export function setupI18n(locale: 'it' | 'en' = 'it') {
  return createI18n({
    legacy: false, // Modalità Composition API
    locale, // Lingua attiva
    fallbackLocale: 'it', // Fallback se chiave mancante
    messages, // Oggetto con tutte le stringhe
    globalInjection: true, // Permette l'uso diretto di $t
  })
}
