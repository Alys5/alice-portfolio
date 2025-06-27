// Importa gli stili globali SCSS (palette, reset, variabili)
import '@/assets/styles/global.scss'

// Importa core Vue e plugin principali
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

// Import translations
import it from './data/i18n.it'
import en from './data/i18n.en'
import es from './data/i18n.es'

// Crea istanza principale dell'app Vue
const app = createApp(App)
// Crea istanza Pinia (state management globale)
const pinia = createPinia()

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: ['en', 'it'],
  messages: { it, en, es },
  missing(locale, key) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Chiave mancante: "${key}" per la locale "${locale}"`)
    }
    return `Chiave mancante: ${key}`
  },
})

// Registra Pinia e router
app.use(pinia)
app.use(router)
app.use(i18n)

// Monta l'app sull'elemento #app
app.mount('#app')
