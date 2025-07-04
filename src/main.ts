import './styles/main.scss'
import './styles/animations.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

// Importa le traduzioni
import it from './i18n/locales/it.json'
import en from './i18n/locales/en.json'
import es from './i18n/locales/es.json'

// Configurazione i18n
const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'en',
  messages: {
    it,
    en,
    es
  }
})

// Configurazione Pinia
const pinia = createPinia()

// Crea l'app Vue
const app = createApp(App)

// Configurazione per la pagina di manutenzione
const isMaintenanceMode = import.meta.env.PROD && import.meta.env.VITE_MAINTENANCE_MODE === 'true'

// Configurazione error handler globale
const setupErrorHandler = (app: ReturnType<typeof createApp>) => {
  app.config.errorHandler = (err: unknown, instance: unknown, info: string) => {
    console.error('Errore Vue:', err)
    console.error('Componente:', instance)
    console.error('Info:', info)

    // Log per analytics se disponibile
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: err instanceof Error ? err.message : String(err),
        fatal: 'false'
      })
    }
  }
}

if (isMaintenanceMode) {
  // In modalità manutenzione, mostra solo la pagina di manutenzione
  import('./views/MaintenanceView.vue').then(({ default: MaintenanceView }) => {
    const maintenanceApp = createApp(MaintenanceView)
    setupErrorHandler(maintenanceApp)
    maintenanceApp.use(i18n)
    maintenanceApp.use(pinia)
    maintenanceApp.mount('#app')
  })
} else {
  // Modalità normale - app completa
  setupErrorHandler(app)
  app.use(router)
  app.use(i18n)
  app.use(pinia)
  app.mount('#app')
}

// Configurazione performance monitoring
if (import.meta.env.PROD) {
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log)
    onFCP(console.log)
    onLCP(console.log)
    onTTFB(console.log)
  })
}
